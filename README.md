# 使用说明
在项目根目录下新建`.env.local`文件，示例配置：
```
DEBUG=false
SFTP_SERVER=127.0.0.1
SFTP_USER=username
SFTP_PASSWORD=password
SFTP_PORT=22
BUILD_DIR=../dist
DESTINE_DIR=/var/www/test/
```

在项目根目录运行 `upload-dist` 把打包后的 `dist` 目录上传到服务器
> 服务器上的 `dist` 目录内容会被清空后，再上传
