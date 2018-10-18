# reference-variables-in-javascript-files

create service in current directory

```bash
☁  env-vars [master] ⚡  serverless create -t google-nodejs -n gcf-env-vars
Serverless: Generating boilerplate...
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.32.0
 -------'

Serverless: Successfully generated boilerplate for template: "google-nodejs"
☁  env-vars [master] ⚡
```

## 需求

传递`process.env.XXX`环境变量到`serverless.yml`配置文件中

解决方案：在`serverless.yml`文件中引用`javascript`文件

指定环境变量并使用`serverless print`命令，测试最终的配置输出：

```bash
☁  reference-variables-in-javascript-files [master] ⚡  CREDENTIALS=/Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json PROJECT_ID=just-aloe-212502 serverless print
frameworkVersion: =1.32.0
service: reference-variables-in-javascript-files
custom:
  projectId: just-aloe-212502
  region: us-central1
  runtime: nodejs
  credentials: >-
    /Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json
provider:
  region: us-central1
  name: google
  runtime: nodejs
  project: just-aloe-212502
  credentials: >-
    /Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json
plugins:
  - serverless-google-cloudfunctions
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
```

## 部署

```bash
☁  reference-variables-in-javascript-files [master] ⚡  CREDENTIALS=/Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json PROJECT_ID=just-aloe-212502 serverless deploy
Serverless: WARNING: Missing "tenant" and "app" properties in serverless.yml. Without these properties, you can not publish the service to the Serverless Platform.
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Compiling function "first"...
Serverless: Creating deployment...
Serverless: Checking deployment create progress...
.
Serverless: Done...
Serverless: Uploading artifacts...
Serverless: Artifacts successfully uploaded...
Serverless: Updating deployment...
Serverless: Checking deployment update progress...
.................
Serverless: Done...
Service Information
service: reference-variables-in-javascript-files
project: just-aloe-212502
stage: dev
region: us-central1

Deployed functions
first
  https://us-central1-just-aloe-212502.cloudfunctions.net/http
```

## 测试

```bash
☁  reference-variables-in-javascript-files [master] ⚡  CREDENTIALS=/Users/ldu020/workspace/nodejs-serverless-framework/.gcp/nodejs-starter-7e52b0f6fe39.json PROJECT_ID=just-aloe-212502 serverless invoke -f first
Serverless: gcp7skbr0x2v Hello World!
```
