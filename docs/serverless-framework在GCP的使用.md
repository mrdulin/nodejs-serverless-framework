# serverless-framework 在 GCP 的使用（一）

### 问题

有没有一种工具或者脚手架可以实现一次配置，即可在多个云平台实现无服务器应用程序的自动化部署及配置。

[serverless-framework](https://serverless.com/)就是这样一款脚手架工具，支持热门的云平台无服务器应用，例如AWS lambda, Google Cloud Function, Azure functions。

通俗说，可以让我们在`serverless.yaml`文件中配置要部署的Cloud Function，不管是HTTP Cloud Function，或者是基于事件触发的Background Cloud Function，还可以在全局或者更细粒度的单个Cloud Function上指定Cloud Function的stage, runtime, region, memory, timeout, environment variables等配置项。

### 版本和环境

serverless-framework及serverless-framwork Google Cloud Function插件的版本

```json
"serverless": "^1.46.0",
"serverless-google-cloudfunctions": "^2.3.2"
```

service account的角色权限

![service-account](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190627-124202.png)

详细的前期准备工作和service account的角色权限配置，见官方[文档](https://serverless.com/framework/docs/providers/google/guide/credentials/)，这里不再多说。

### 使用说明

TODO 

### FAQ

1. 部署通过Cloud Storage事件触发的Cloud Function，出现错误`Failed to configure trigger GCS Bucket: xxx`

详细错误如下：

```bash
Error --------------------------------------------------
 
  Deployment failed: RESOURCE_ERROR

     {"ResourceType":"cloudfunctions.v1beta2.function","ResourceErrorCode":"500","ResourceErrorMessage":"Failed to configure trigger GCS Bucket: slideshowp2"}
 
     For debugging logs, run again after setting the "SLS_DEBUG=*" environment variable.
```

原因`serverless.yaml`文件中`resource`中指定的Cloud Storage的`bucket`不存在，`serverless-framework`不会自动创建Cloud Storage的`bucket`，可以在GCP的console上手动创建一个`bucket`，创建好的`bucket`如下:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190627-120655.png)

当然也可以通过`@google_cloud/storage` 客户端库，或者`gcloud` SDK去检查`bucket`是否存在，已经创建操作。

2. 部署通过Cloud Pub/Sub消息触发的Cloud Function，`serverless-framework`会自动创建`serverless.yaml`文件中`resource`中指定的Pub/Sub `Topic`和`Subscription`。因此在CI/CD流程中，不需要加入`Topic`和`Subscription`的存在性检测和创建流程。比如不需要在`package.json`中加入`predeploy`这个`npm script`，`scripts/initialize.ts`这个脚本用来检查和创建Cloud Pub/Sub的`Topic`和`Subscription`

```json
"predeploy": "ts-node ./scripts/initialize.ts",
"deploy": "SLS_DEBUG=* serverless deploy --verbose",
```

部署输出日志如下：

![deploying-cloud-function-logs](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/WX20190627-125743.png)

**预检查和创建Cloud Pub/Sub的Topic和Subscription是没必要的**

