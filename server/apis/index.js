module.exports = (app, router, io) => {
  // register routes
  router = require('./shimo.js')(router);
  app.use('/api', router);
};
