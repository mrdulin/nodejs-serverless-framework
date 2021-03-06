# exclude-development-dependencies

需求: `serverless-framework`部署`cloud functions`到`GCP`，只打包必要的文件

必要文件包含：

- `package.json`
- `package-lock.json`
- 包含`cloud functions`的`.js`文件

先来看下通过`serverless create -t google-nodejs`命令生成的默认`serverless.yml`配置下，打包出来的文件, 使用`serverless`命令行工具打包文件:

```bash
☁  exclude-development-dependencies [master] ⚡  CREDENTIALS=/Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json PROJECT_ID=just-aloe-212502 serverless package
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Compiling function "search"...
```

下图包含：项目目录结构 + `serverless.yml`配置 + 验证打包后的文件

![image](https://user-images.githubusercontent.com/17866683/47280099-4ffe9680-d607-11e8-9000-fa0fb4deefa0.png)

打包成功后，会在`serverless.yml`文件所在目录下生成`.serverless`目录，里面包含了打包的压缩文件。
可以看到包含了很多开发时的依赖文件，`.ts`, `.js.map`, `jest.config.js`等, `.zip`文件总大小为`23KB`。

查看`GCP` - 云端函数：

![image](https://user-images.githubusercontent.com/17866683/47280334-740ea780-d608-11e8-8f7e-a25460471145.png)

可以看到包含很多不必要的文件。

测试该云端函数：

![image](https://user-images.githubusercontent.com/17866683/47280499-3bbb9900-d609-11e8-8676-6ac9883ff829.png)

尽管可以正常工作，但如果项目很大，打包出来的文件很大，会导致上传很慢，浪费带宽和流量。

因此，需要去除不必要文件，修改`serverless.yml`的`package`字段的`exclude`和`include`配置，再来看下打包后的文件，可以看到，`.ts`,`.js.map`,`__tests__`等开发相关的文件都没有被打包进来。`.zip`包总大小为`3KB`。

![image](https://user-images.githubusercontent.com/17866683/47278325-a913fd80-d5fa-11e8-8fc1-c6e3424a479e.png)

部署后，在`GCP` - 云端函数查看：

![image](https://user-images.githubusercontent.com/17866683/47279810-e0d47280-d605-11e8-9f3e-4f2e444ea434.png)

这里的"下载 zip"，下载的就是之前`serverless package`打包的`.serverless`目录下的`.zip`文件。

手动测试一下`cloud function`:

![image](https://user-images.githubusercontent.com/17866683/47280035-fbf3b200-d606-11e8-9197-c2727c0d1884.png)

返回结果正确，运行正常。

## docker

build an image:

```bash
☁  exclude-development-dependencies [master] ⚡  docker build -t nodejs-sls .
Sending build context to Docker daemon  185.9kB
Step 1/6 : FROM mhart/alpine-node:8.7.0
 ---> 3f4dca7b43ba
Step 2/6 : WORKDIR /app
Removing intermediate container d26be32d5312
 ---> 2765a4b50696
Step 3/6 : COPY package.json package-lock.json /app/
 ---> feb7b1a1cd15
Step 4/6 : RUN npm install
 ---> Running in a1cf717e0647

> spawn-sync@1.0.15 postinstall /app/node_modules/spawn-sync
> node postinstall


> serverless@1.32.0 postinstall /app/node_modules/serverless
> node ./scripts/postinstall.js

npm WARN exclude-development-dependencies@0.1.0 No description
npm WARN exclude-development-dependencies@0.1.0 No repository field.

added 441 packages in 16.839s
Removing intermediate container a1cf717e0647
 ---> 293707d67a63
Step 5/6 : ADD . /app
 ---> 435e70ffc4a2
Step 6/6 : CMD ["npm", "run", "print"]
 ---> Running in 643384e17ecf
Removing intermediate container 643384e17ecf
 ---> ccea471f51a4
Successfully built ccea471f51a4
Successfully tagged nodejs-sls:latest
```

deploy:

```bash
docker run -e PROJECT_ID=just-aloe-212502 -e CREDENTIALS=/tmp/nodejs-starter-7e52b0f6fe39.json -v ~/workspace/nodejs-serverless-framework/.gcp/:/tmp nodejs-sls npm run deploy
```
