'use strict';

const { createServer } = require('./apiGateway');
const eventTypeEnum = require('./eventType');

class ServerlessCloudFunctionOffline {
  constructor(serverless, options) {
    this.serverless = serverless;
    console.log(`serverless: `, serverless);
    this.options = options;
    console.log(`options: `, options);

    this.serverless.cli.log('serverless cloudfunction offline plugin is on the way...');

    this.commands = {
      offline: {
        lifecycleEvents: ['createAPIGateway'],
        options: {
          host: {
            usage: 'Host name to listen on. Default: localhost',
            shortcut: 'o',
            default: 'localhost'
          },
          port: {
            usage: 'Port to listen on. Default: 3000',
            shortcut: 'P',
            default: 3000
          },
          prefix: {
            usage:
              'Adds a prefix to every path, to send your requests to http://localhost:3000/[prefix]/[your_path] instead. E.g. -p dev',
            shortcut: 'p',
            default: ''
          }
        }
      }
    };

    this.hooks = {
      // 'before:offline:offline': this.beforeOffline.bind(this),
      'offline:createAPIGateway': this.createAPIGateway.bind(this)
    };
  }

  createAPIGateway() {
    const options = this.serverless.processedInput.options;
    const functions = this.attachFunctionModule();
    return createServer(functions, options);
  }

  attachFunctionModule() {
    const { servicePath } = this.serverless.config;
    console.log(`servicePath: ${servicePath}`);
    const functionNames = this.serverless.service.getAllFunctions();
    const funcObjects = functionNames.map(name => this.serverless.service.getFunction(name));
    const functionsModules = require(servicePath);

    const functions = [];
    for (const funcObj of funcObjects) {
      let func;
      if (this.isHTTPfunction(funcObj)) {
        func = {
          url: funcObj.events[0].http,
          module: functionsModules[funcObj.handler],
          eventType: eventTypeEnum.http,
          ...funcObj
        };
      } else {
        // TODO: handle event, gcs function
        func = {
          url: funcObj.handler,
          module: functionsModules[funcObj.handler],
          eventType: eventTypeEnum.event,
          ...funcObj
        };
      }
      functions.push(func);
    }

    return functions;
  }

  isHTTPfunction(funcObj) {
    const eventType = Object.keys(funcObj.events[0])[0];
    return eventType === eventTypeEnum.http;
  }
}

module.exports = ServerlessCloudFunctionOffline;
