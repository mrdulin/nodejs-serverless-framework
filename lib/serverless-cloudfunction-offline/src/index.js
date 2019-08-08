const ServerlessCloudFunctionOffline = require('./serverlessOffline');
class CloudFunctionOfflineIndex {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.serverless.pluginManager.addPlugin(ServerlessCloudFunctionOffline);
  }
}

module.exports = CloudFunctionOfflineIndex;
