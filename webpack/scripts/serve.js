#!/usr/bin/env node

const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  DIST_DIR,
  PORT,
  HOST,
  API_URL,
  SSL_KEY,
  SSL_CERT,
} = require('../constants');
const { createServer } = require('../utils/server');

(async () => {
  const indexHtml = path.join(DIST_DIR, 'index.html');
  const indexMiddleware = (app) => {
    app.get('*', (_, res) => {
      res.sendFile(indexHtml);
    });
  };
  const proxyMiddleware = (app) => {
    app.use('/api', createProxyMiddleware({
      target: API_URL,
      pathRewrite: {
        '^/api': '',
      },
    }));
  };
  const run = createServer({
    host: HOST,
    port: PORT,
    staticDir: DIST_DIR,
    sslCert: SSL_CERT,
    sslKey: SSL_KEY,
    middlewares: [
      proxyMiddleware,
      indexMiddleware,
    ],
  });
  await run();
})();
