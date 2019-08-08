const express = require('express');
const morgan = require('morgan');
const uuidv1 = require('uuid/v1');
const bodyParser = require('body-parser');
const eventTypeEnum = require('./eventType');

function createServer(functions, options) {
  console.log(`command options = ${JSON.stringify(options)}`);
  console.log(`functions: ${JSON.stringify(functions, null, 2)}`);
  if (!Array.isArray(functions)) {
    return Promise.reject('functions is not array');
  }
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(morgan('combined'));
  app.get('/.health-check', (_, res) => {
    res.sendStatus(200);
  });

  const prefix = (options.prefix || '').toLowerCase();
  if (prefix) {
    app.use(`/${prefix}`);
  }
  const { router, tabularData } = createRoutes(functions, options);
  app.use(router);

  app.use((_, res) => res.sendStatus(404));
  app.use((err, _, res) => {
    console.error(err);
    res.sendStatus(500);
  });

  return new Promise(resolve => {
    const server = app.listen(options.port, options.host, () => {
      console.log(`HTTP server is listening on http://localhost:${options.port}`);
      console.table(tabularData);
      resolve(server);
    });
  });
}

function createRoutes(functions, options) {
  const { Router } = require('express');
  const router = new Router();
  const tabularData = [];
  const eventHandlerPrefix = '/push-handlers/pubsub';
  functions.forEach(func => {
    const path = `/${func.url}`;
    let row;
    if (func.eventType === eventTypeEnum.event) {
      router.post(path, (req, res, next) => makeEventHandler(req, res, next, func.module));
      row = {
        handler: func.handler,
        endpoint: `http://localhost:${options.port}${eventHandlerPrefix}${path}`,
        method: 'POST',
        trigger: 
      };
    } else {
      router.all(path, func.module);
      row = {
        handler: func.handler,
        endpoint: `http://localhost:${options.port}${path}`,
        method: 'ALL'
      };
    }
    tabularData.push(row);
  });
  return { router, tabularData };
}

function makeEventHandler(req, res, next, func) {
  const data = {
    data: req.body.data,
    attributes: req.body.attributes,
    messageId: uuidv1(),
    publishTime: new Date().getTime()
  };
  const context = {
    eventId: uuidv1(),
    timestamp: new Date().getTime(),
    eventType: func.eventType
  };
  const callback = (error, message) => {
    if (error) {
      next(error);
      return;
    }
    if (message) {
      console.log(message);
    }
    res.sendStatus(200);
  };

  func.call(this, data, context, callback);
}

module.exports = { createServer };
