var redis = require('redis');
var betturl = require('betturl');
var Promise = require('bluebird');
var createConnections = require('@mattinsler/app-context-create-connections');

function parseURL(url) {
  var parsed = betturl.parse(url);

  var config = {
    host: parsed.host || 'localhost',
    port: parsed.port || 6379,
  };

  if (parsed.auth) { config.password = parsed.auth.password; }

  var database = parsed.path.slice(1);
  if (database) {
    if (parseInt(database).toString() !== database.toString()) {
      throw new Error('Database must be an integer');
    }
    config.database = parseInt(database);
  }

  return config;
}

module.exports = createConnections('redis', function(url, opts) {
  if (opts == null) { opts = {}; }

  var parsed;
  try {
    parsed = parseURL(url);
  } catch (err) {
    return Promise.reject(err);
  }

  if (parsed.password) { opts.auth_pass = parsed.password; }

  return new Promise(function(resolve, reject) {
    var client = redis.createClient(parsed.port, parsed.host, opts);

    function onerror(err) {
      reject(err);
    }

    client.on('connect', function() {
      client.removeListener('error', onerror);

      if (parsed.database) {
        client.select(parsed.database, function(err) {
          if (err) { return reject(err); }
          resolve(client);
        });
      } else {
        resolve(client);
      }
    });
    client.on('error', onerror);
  });
});
