# app-context-redis

[Redis](https://www.npmjs.com/package/redis) initializer for [app-context](http://app-contextjs.com)

## Usage

This initializer can be auto-installed by using it in your context file.

This initializer will attach the configured connections to `APP.redis`.

```javascript
module.exports = function() {
  this.runlevel('connected')
    // attach a connection to APP.redis - use the value at APP.config.redis as the connection string
    .use('redis', '$redis')

    // attach a connection to APP.redis
    .use('redis', 'redis://localhost')

    // create 2 connections and attach them as an object to APP.redis
    // this will create APP.redis.cache and APP.redis.sessions
    .use('redis', {
      users: '$redis.cache',
      sessions: '$redis.sessions'
    })

    // you can also pass options to each connection
    .use('redis', {
      cache: {url: '$redis.cache', no_ready_check: true},
      data: {url: 'redis://localhost/1', connectTimeout: 3000}
    })
};
```

## Connection Configurations

Each connection can be configured with either a connection string (like `redis://localhost/2`) or
with an object. The object will be passed through to `redis.createClient` and can consist of any options
from [the redis client](https://www.npmjs.com/package/redis#redis-createclient). There is a special `url` option that this initializer requires.
