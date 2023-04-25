import * as path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import SFTPClient from 'ssh2-sftp-client'

const resolvePath = (dir) => {
  return path.join(process.cwd(), dir)
}

// https://www.npmjs.com/package/ssh2-sftp-client#sec-1
// let SFTPClient = require('ssh2-sftp-client')
let sftp = new SFTPClient()

const isDirectory = (str) => {
  return str === 'd'
}

async function isExistDist(srcDir) {
  return new Promise((resolve, reject) => {
    fs.access(srcDir, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('本地打包文件不存在', err)
        process.exit(1)
      }
      resolve()
    })
  })
}

function initConfig(configFile = '.env.local') {
  // https://www.npmjs.com/package/dotenv
  dotenv.config({
    debug: process.env.DEBUG,
    path: resolvePath(configFile),
  })
  const config = {
    host: process.env.SFTP_SERVER,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
    port: process.env.SFTP_PORT || 22,
    ignore: '(.git|node_modules)',
    srcDir: process.env.BUILD_DIR,
    dstDir: process.env.DESTINE_DIR,
  }
  return config
}

export function run(options) {
  let config = initConfig(options.file)
  let { srcDir, dstDir } = config

  Object.keys(options).forEach((key) => {
    if (options[key]) {
      config[key] = options[key]
    }
  })
  if (config.dstDir) {
    dstDir = config.dstDir
  }
  if (config.srcDir) {
    srcDir = resolvePath(config.srcDir)
  }

  isExistDist(srcDir).then(() => {
    sftp
      .connect(config)
      .then(() => {
        return sftp.list(dstDir)
      })
      .then((files) => {
        if (config.isTest) {
          files.forEach((item) => {
            console.log(`Dirty delete file: ${item.longname}`)
          })
          console.log('Testing connect successed.')
          return
        }
        // 获得远程部署目录文件信息
        // 遍历删除目录下的文件
        let promise = files.map((file) => {
          let filepath = path.join(dstDir, file.name).replace(/\\/gi, '/')
          if (isDirectory(file.type)) {
            return sftp.rmdir(filepath, true)
          } else {
            return sftp.delete(filepath)
          }
        })
        return Promise.all(promise)
      })
      .then((data) => {
        sftp.on('upload', (info) => {
          console.log(`Listener: Uploaded ${info.source}`)
        })
      })
      .then(() => {
        if (config.isTest) {
          return srcDir + '  ' + dstDir
        }
        return sftp.uploadDir(srcDir, dstDir, {
          filter: (item) => {
            return !new RegExp(config.ignore, 'g').test(item)
          },
        })
      })
      .then((data) => {
        console.log('上传完成', data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        // 断开连接
        sftp.end()
      })
  })
}
