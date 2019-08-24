# 使用 serverless-framework 在 GCP 上部署 Cloud Function - Part 1

### 问题

有没有一种工具或者脚手架可以实现一次配置，即可在多个云平台实现无服务器应用程序的自动化部署及配置，快速迁移我们的无服务器应用到不同的云平台。

### 解决方案

[serverless-framework](https://serverless.com/)就是这样一款脚手架工具，支持热门的云平台无服务器应用部署，它为开发，部署，测试，保护和监控无服务器应用程序提供了强大的统一体验，可以提升部署效率，节省部署和迁移成本。例如 AWS lambda, Google Cloud Function, Microsoft Azure functions, Kubeless, OpenWhisk, Cloudflare。通过 YAML 配置文件进行无服务器应用的资源配置，并使用其提供的命令行工具进行部署。

以下通过 GCP Cloud Function 进行说明，serverless-framework 可以让我们在`serverless.yaml`文件中配置要部署的 Cloud Function，配置项包括触发端点 URL，触发事件，基础设施资源，标签等。不管是 HTTP Cloud Function，或者是基于事件（Cloud Pub/Sub, Cloud Storage event）触发的 Background Cloud Function，可以在全局或者更细粒度的单个 Cloud Function 上指定 Cloud Function 的 stage（部署环境：开发，测试，预发，生产）, runtime（代码运行时环境，如 Go, Nodejs8, Nodejs10, Python 等）, region（部署区域，us-central1），运行时基础设施资源如 memory（内存）, timeout（超时时间，默认 60s）, environment variables(环境变量)等配置项。

使用 serverless-framework 一个很大的优势是部署技术方式平台无关化，不在局限于使用特定平台的特定工具和 API。serverless-framework 通过将不同的云平台 Cloud Function/Lambda 等部署流程封装为插件，让开发者可以更快速的部署。

比如，使用 GCP 的 Cloud Function 服务，有三种方式去部署一个 Cloud Function：

1. 使用 GCP [console](https://console.cloud.google.com/)（控制台）部署
2. 使用 gcloud 命令行工具部署
3. 通过 REST 或 RPC API 去部署，使用[Cloud Deployment Manager](https://cloud.google.com/deployment-manager/docs/deployments/)

其他云平台也有类似上述三种部署方式，serverless-framework 就是使用 REST/RPC API 的形式去创建云服务资源并部署。可以从[serverless-google-cloudfunctions](https://github.com/serverless/serverless-google-cloudfunctions)插件中看到如下代码：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190824220023.png)

serverless-google-cloudfunctions 是 serverless-framework 的一个 plugin，该插件为 serverless-framework 提供了部署 GCP Cloud Function 服务的能力，serverless-framework 默认是只支持 AWS 云服务提供商(provider)的 Lambda 服务的。如代码所示，该插件使用`googleapis`，一个封装了 google 很多服务 API 的库，可以更方便的调用服务。

实际上 serverless-google-cloudfunctions 其内部也是由多个插件构成，源码如下：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190824230101.png)

可以看到 serverless-google-cloudfunctions 由 GoogleProvider, GooglePackage, GoogleDeploy, GoogleRemove, GoogleInvoke, GoogleLogs 和 GoogleInfo 这几部分插件组成。每个插件都是一个 class，构造函数中注入了 serverless 对象和 options 对象，这块涉及到 serverless-framework 插件开发，不再本文叙述。

部署 Cloud Function 的流程我们可以从 GoogleDeploy 源码中看到：

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190824221518.png)

篇幅所限，不详细说明，大致分为

1. 部署之前：serverless.yaml 配置文件合法性验证
2. 部署：[创建部署资源](https://cloud.google.com/deployment-manager/docs/deployments/)，设置 Cloud Storage Bucket 名称，上传打包好的 Cloud Function 代码文件的 zip 压缩文件资源到 Cloud Storage Bucket 中，[更新部署](https://cloud.google.com/deployment-manager/docs/deployments/updating-deployments)
3. 部署之后：清理 Cloud Storage Bucket 中的资源

### 总结

serverless-framework 将部署无服务器应用的主要流程帮我们做了，并且是跨多个云平台，减少了 devOps 和开发团队的开发维护成本，不需要我们自己去设计和编写部署流程脚本，当然，结合公司自身业务和政策需要，少量的 CI/CD 脚本还是需要的。同时也减少了迁移成本，在因为云平台云服务不稳定或故障，服务使用成本太高（beta 版，文档不全，bug 太多等），收费策略等因素。

我们都知道 docker-compose 是用来进行容器编排的，举个例子，一个 docker-compose.yaml 文件如下：

```yaml
version: '3'

services:
  web:
    image: novaline/get-started:part2
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: '0.1'
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - 4000:80
    networks:
      - webnet

  visualizer:
    image: dockersamples/visualizer:stable
    ports:
      - '8080:8080'
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock'
    deploy:
      placement:
        constraints: [node.role == manager]
    networks:
      - webnet

  redis:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - '/home/docker/data:/data'
    deploy:
      placement:
        constraints: [node.role == manager]
    command: redis-server --appendonly yes
    networks:
      - webnet

networks: webnet:
```

我们在其中定义了 3 个 service，分别是 web, visualizer 和 redis，并为不同的服务进行配置，如 volumes 数据卷，image 镜像，networks 网络，ports 容器和宿主机的端口映射等。在执行完`docker-compose up`命令后，docker 会给每个 service 创建容器 container 进程。

我们再来看个简单的`serverless.yaml`配置文件:

```yaml
service: quick-start # NOTE: Don't put the word "google" in here

provider:
  name: google
  runtime: nodejs8
  region: us-central1
  project: shadowsocks-218808
  credentials: /Users/elsa/workspace/github.com/mrdulin/nodejs-serverless-framework/.gcp/shadowsocks-218808-9b73a2aa3179.json
  labels:

plugins:
  - serverless-google-cloudfunctions
  # - serverless-cloudfunction-offline

package:
  exclude:
    - node_modules/**
    - .gitignore
    - .git/**

functions:
  first:
    handler: http
    events:
      - http: path
  event:
    handler: event
    events:
      - event:
          eventType: google.pubsub.topic.publish
          resource: projects/shadowsocks-218808/topics/slideshowp2
  GCS:
    handler: GCS
    events:
      - event:
          eventType: google.storage.object.finalize
          resource: projects/shadowsocks-218808/buckets/slideshowp2
```

该配置文件中，我们定义了 3 个 function，一个 HTTP Cloud Function，一个通过 Cloud Pub/Sub 消息事件触发的 Background Cloud Function，还有一个通过 Cloud Storage Object 事件触发的 Background Cloud Function。当我们执行`serverless deploy`命令后，serverless-framework 将会给我们创建并部署 3 个 function 在对应的云平台上。所以在某种意义上也是一种编排，serverless-framework 编排的是 Cloud Function，而 docker-compose 编排的是容器。

使用 serverless-framework 之前:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190824232442.png)

使用 serverless-framework 之后:

![](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/20190824232618.png)

由于 serverless-framework 及其插件内部调用各个云服务提供商提供的 REST/RPC API，因此使用时需要保证你的网络环境能访问这些服务。

### 参考

- [The Serverless Application Framework powered by AWS Lambda, API Gateway, and more](https://serverless.com/)

---

<a href="https://info.flagcounter.com/ab0j"><img src="https://s11.flagcounter.com/count2/ab0j/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_12/viewers_0/labels_1/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a>
