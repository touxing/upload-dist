import * as upload from './upload-dist.js'
const { run } = upload
import arg from 'arg'
import commandLineUsage from 'command-line-usage'
import { readFile, readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

let pkg = { version: '0.0.1' }
const __dirname = dirname(fileURLToPath(import.meta.url))
let pkgPath = resolve(__dirname, '..', 'package.json')
try {
  const data = readFileSync(pkgPath, { encoding: 'utf-8' })
  pkg = JSON.parse(data)
} catch (error) {
  console.error(error)
}

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg({
    // Types
    '--help': Boolean,
    '--version': Boolean,
    '--config': String,
    '--host': String,
    '--username': String,
    '--password': String,
    '--port': Number,
    '--sourceFile': String,
    '--destFile': String,
    '--test': Boolean,
    '--ignore': String,
    // alias
    '-h': '--help',
    '-v': '--version',
    '-c': '--config',
    '-host': '--host',
    '-u': '--username',
    '-pwd': '--password',
    '-p': '--port',
    '-s': '--sourceFile',
    '-d': '--destFile',
    '-t': '--test',
    '-i': '--ignore',
  })
  return args
}

const optionDefinitions = [
  {
    name: 'version',
    typeLabel: '{underline Boolean}',
    description: 'Print current version',
    alias: 'v',
    type: Boolean,
  },
  {
    name: 'help',
    typeLabel: '{underline Boolean}',
    description: 'Print this usage guide.',
    alias: 'h',
    type: Boolean,
  },
  {
    name: 'config',
    typeLabel: '{underline String}',
    description:
      'The file of configuration. It is consist of dotenv file. Default profile is ".env.local"',
    alias: 'c',
    type: String,
  },
  {
    name: 'host',
    typeLabel: '{underline String}',
    description: 'The host of service',
    alias: 'host',
    type: String,
  },
  {
    name: 'username',
    typeLabel: '{underline String}',
    description: 'The username of service',
    alias: 'u',
    type: String,
  },
  {
    name: 'password',
    typeLabel: '{underline String}',
    description: 'The password of service',
    alias: 'pwd',
    type: String,
  },
  {
    name: 'port',
    typeLabel: '{underline Number}',
    description: 'The port of service ssh. Default is 22',
    alias: 'p',
    type: Number,
  },
  {
    name: 'sourceFile',
    typeLabel: '{underline String}',
    description: 'The file wanted to upload service. Using relative path.',
    alias: 's',
    type: String,
  },
  {
    name: 'destFile',
    typeLabel: '{underline String}',
    description: 'The file is want to save on service. Using absolute path.',
    alias: 'd',
    type: String,
  },
  {
    name: 'test',
    typeLabel: '{underline Boolean}',
    description: 'Test connect.',
    alias: 't',
    type: Boolean,
  },
  {
    name: 'ignore',
    typeLabel: '{underline String|RegExp}',
    description:
      'Ignore file in source file. Default ignore file include these "(.git, node_modules)"',
    alias: 'i',
    type: String,
  },
]
const sections = [
  {
    header: [
      'A cli to upload file to service.',
      '一个用来上传文件的cli工具。',
    ].join('\n'),
    content:
      'The cli can upload file to service by command. It does not need a sftp client. It is configurable.\n' +
      '一个用命令上传文件的工具，可以方便前端开发打包后上传dist文件到服务器，\n' +
      '支持参数配置。',
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]
const usage = commandLineUsage(sections)

export function cli(args) {
  let argv = process.argv.slice(2)
  let options = parseArgumentsIntoOptions(args)
  if ('--help' in options) {
    console.log(usage)
  } else if ('--version' in options) {
    console.log(pkg.version)
  } else {
    let config = {
      file: options['--config'],
      host: options['--host'],
      username: options['--username'],
      password: options['--password'],
      port: options['--port'] || 22,
      srcDir: options['--sourceFile'],
      dstDir: options['--destFile'],
      isTest: options['--test'],
      ignore: options['--ignore'],
    }
    run(config)
  }
}
