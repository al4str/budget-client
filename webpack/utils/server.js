const fs = require('fs');
const path = require('path');
const spdy = require('spdy');
const express = require('express');
const compression = require('compression');
const serveStatic = require('serve-static');
const consola = require('consola');

const console = consola.withTag('server');

/**
 * @param {Object} params
 * @param {string} params.host
 * @param {number} params.port
 * @param {string} params.staticDir
 * @param {string} params.sslCert
 * @param {string} params.sslKey
 * @param {Array<Function>} [params.middlewares]
 * @return {function(): Promise<void>}
 * */
function createServer(params) {
  const {
    host,
    port,
    staticDir,
    sslCert,
    sslKey,
    middlewares,
  } = params;

  const app = express();

  app.use(compression({}));

  app.use(serveStatic(staticDir, {
    setHeaders(res, filePath) {
      const fileName = path.basename(filePath);
      const isIndexHTML = fileName === 'index.html';
      const isMetaJSON = fileName === 'meta.json';
      if (isIndexHTML || isMetaJSON) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      else {
        res.setHeader('Cache-Control', 'public');
        res.setHeader('Expires', '1y');
      }
    },
  }));

  if (middlewares) {
    middlewares.forEach((applyMiddleware) => {
      applyMiddleware(app);
    });
  }

  return async () => {
    const [
      certificate,
      privateKey,
    ] = await Promise.all([
      fs.promises.readFile(sslCert),
      fs.promises.readFile(sslKey),
    ]);
    const serverOptions = {
      key: privateKey,
      cert: certificate,
    };
    spdy
      .createServer(serverOptions, app)
      .listen(port, host, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
        else {
          console.info(`https://${host}:${port}`);
        }
      });
  };
}

module.exports = {
  createServer,
};
