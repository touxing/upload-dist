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

配置参数
```
A cli to upload file to service.
一个用来上传文件的cli工具。

  The cli can upload file to service by command. It does not need a sftp
  client. It is configurable.
  一个用命令上传文件的工具，可以方便前端开发打包后上传dist文件到服务器，
  支持参数配置。

Options

  -v, --version Boolean        Print current version
  -h, --help Boolean           Print this usage guide.
  -c, --config String          The file of configuration. It is consist of
                               dotenv file. Default profile is ".env.local"
  -host, --host String         The host of service
  -u, --username String        The username of service
  -pwd, --password String      The password of service
  -p, --port Number            The port of service ssh. Default is 22
  -s, --sourceFile String      The file wanted to upload service. Using
                               relative path.
  -d, --destFile String        The file is want to save on service. Using
                               absolute path.
  -t, --test Boolean           Test connect.
  -i, --ignore String|RegExp   Ignore file in source file. Default ignore file
                               include these "(.git, node_modules)"
```

## Run

查看帮助
```bash
npx upload-dist -h
```

上传命令
```
npx upload-dist
```

- [x] 增加参数读取指定配置文件 <-- 2023-4-25
