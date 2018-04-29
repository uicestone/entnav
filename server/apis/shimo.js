const Shimo = require('shimo');
const shimo = new Shimo({ version: 'v2' });

module.exports = (router) => {

  router.route('/shimo/nav-data')
    .get(async (req, res) => {
      const navData = await shimo.get('files/GRj6F1carK04QOAv?html=true');
      res.json(JSON.parse(navData.content));
    });

  return router;
}
