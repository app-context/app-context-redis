var path = require('path');
var Promise = require('bluebird');
var redisBuilder = require('redis-builder');
var createConnections = require('@mattinsler/app-context-create-connections');

var redis;

try {
  redis = require(path.join(process.cwd(), 'node_modules', 'redis'));
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND') {
    throw new Error('In order to use app-context-redis you must npm install ' +
                    'redis (and optionally hiredis) as well.');
  }
  throw err;
}

var builder = redisBuilder(redis);

module.exports = createConnections('redis', function(url, opts) {
  return new Promise(function(resolve, reject) {
    if (opts && typeof(opts) === 'object') {
      opts.url = url;
      url = opts;
    }
    var client = builder(url);

    client.on('error', reject);
    client.on('ready', function() {
      client.removeListener('error', reject);
      resolve(client);
    });
  });
});
