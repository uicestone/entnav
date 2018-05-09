const shimoService = require ('../services/shimo');

module.exports = (router) => {

  router.route('/shimo/nav-data')
    .get(async (req, res) => {
      const navData = await shimoService.getNavData();      
      res.json(navData);
    });

  return router;
}
