'use strict';

const express      = require('express');
const bodyParser   = require('body-parser');
const compression  = require('compression');
const app          = express();
const router       = express.Router();
const httpServer   = require('http').createServer(app);
const env          = require('node-env-file');
const shimoService = require('./services/shimo');

env(`${__dirname}/../.env`);

app.use(bodyParser.json());
app.use(express.query());
app.use(compression());

require(`${__dirname}/apis`)(app, router);

app.get('/', async (req, res) => {
  res.render('index.ejs', { navData: await shimoService.getNavData() });
});

app.use('/', express.static(`${__dirname}/../`));

const port = process.env.PORT_HTTP || 8080;
const portHttps = process.env.PORT_HTTPS;

httpServer.listen(port, () => {
  console.log(`[${new Date()}] HTTP server listening port: ${port}`);
});

if (process.env.PORT_HTTPS) {
  const ca          = fs.readFileSync(process.env.CA_PATH, 'utf8');
  const privateKey  = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
  const credentials = {ca: ca, key: privateKey, cert: certificate};
  const httpsServer = require('https').createServer(credentials, app);
  httpsServer.listen(portHttps, function() {
    console.log('[' + new Date() + '] HTTPS server listening port:', portHttps);
  });
}
