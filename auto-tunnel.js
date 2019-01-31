/**
 * script to use tunnel to ai-speaker and auto reconnect
 * use: node auto-tunnel.js subdomain=aisdom
 * node -r esm bin/server --port 3000
 *
 */
const assert = require('assert');
const localtunnel = require('localtunnel');

var argv = process.argv.reduce(function(accumulator, str) {
  if (str.indexOf('=') > -1) {
    var split = str.split('=');
    var val = split[1].match(/^\d+$/) ? Number(split[1]) : split[1];
    accumulator[split[0]] = val;
  }
  return accumulator;
}, {});

const port = 8180;
const host = 'http://paczka.pro';

const subdomain = argv.subdomain;
const reconnectionTimeout = argv.timeout || 1000;

// TODO - take the MAC address
assert(subdomain, 'No subdomain provided');

function openLocalTunnel() {
  try {
    var tunnel = localtunnel(port, { subdomain: subdomain, host: host }, function(error, tunnel) {
      if (error) {
        return setTimeout(openLocalTunnel, reconnectionTimeout);
      }
      console.log('Tunnel opened', { port: port, url: tunnel.url });
    });

    tunnel.on('error', function() {
      setTimeout(openLocalTunnel, reconnectionTimeout);
    });

    tunnel.on('close', function() {
      setTimeout(openLocalTunnel, reconnectionTimeout);
    });
  } catch(error) {
    setTimeout(openLocalTunnel, reconnectionTimeout);
  }
}

openLocalTunnel();