const path = require('path')
const fs = require('fs')
const resolvePath = (dir) => {
  return path.join(process.cwd(), dir)
}
// https://www.npmjs.com/package/dotenv
const dotenv = require('dotenv').config({
  debug: process.env.DEBUG,
  path: resolvePath('.env.local')
})

// https://www.npmjs.com/package/ssh2-sftp-client#sec-1
let Client = require('ssh2-sftp-client')
let sftp = new Client()

const config = {
  host: process.env.SFTP_SERVER,
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD,
  port: process.env.SFTP_PORT || 22
}

let srcDir = resolvePath(process.env.BUILD_DIR)
let dstDir = process.env.DESTINE_DIR

const isDirectory = str => {
  return str === 'd'
}

async function isExistDist() {
  return new Promise((resolve, reject) => {
    fs.access(srcDir, fs.constants.F_OK, err => {
      if (err) {
        console.error('本地打包文件不存在', err)
        process.exit(1)
      }
      resolve()
    })
  })
}

export function run() {
  isExistDist().then(() => {
    sftp
      .connect(config)
      .then(() => {
        return sftp.list(dstDir)
      })
      .then(files => {
        // 获得远程部署目录文件信息
        // 遍历删除目录下的文件
        let promise = files.map(file => {
          let filepath = path.join(dstDir, file.name).replace(/\\/gi, '/')
          if (isDirectory(file.type)) {
            return sftp.rmdir(filepath, true)
          } else {
            return sftp.delete(filepath)
          }
        })
        return Promise.all(promise)
      })
      .then(data => {
        sftp.on('upload', info => {
          console.log(`Listener: Uploaded ${info.source}`)
        })
      })
      .then(() => {
        return sftp.uploadDir(srcDir, dstDir)
      })
      .then(data => {
        console.log('上传完成', data)
      })
      .catch(err => {
        console.log(err, 'catch error')
      })
      .finally(() => {
        // 断开连接
        sftp.end()
      })
  })
}
