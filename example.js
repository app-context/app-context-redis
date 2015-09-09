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
