## Introduction

nodejs 脚本实现上传前端打包目录 `dist`。用到 `ssh2-sftp-client` 这个包实现上传功能。
在项目根目录运行 `upload-dist` 把打包后的 `dist` 目录上传到服务器
> 服务器上的 `dist` 目录内容会被清空后，再上传


## Installation

```sh
npm install -D @hotsuitor/upload-dist
# or
yarn add -D @hotsuitor/upload-dist
```

## Example

在项目根目录下新建 `.env.local` 文件，示例配置：
```
DEBUG=false
SFTP_SERVER=127.0.0.1
SFTP_USER=username
SFTP_PASSWORD=password
SFTP_PORT=22
BUILD_DIR=../dist
DESTINE_DIR=/var/www/test/
```

- **SFTP_SERVER** 服务器ip
- **SFTP_USER** 服务器登录用户
- **SFTP_PASSWORD** 服务器登录密码
- **BUILD_DIR** 打包文件目录，相对路径
- **DESTINE_DIR** 远程服务器存放路径，绝对路径

默认读取的配置文件是根目录下的 `.env.local` 配置文件

## Run

上传命令
```
npx upload-dist
```

TODO:
- [ ] 增加参数读取指定配置文件
