import { run } from './upload-dist'
// import arg from 'arg'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg({
    '--config': String,
    // alias
    '-c': '--config',
  })
  return args
}

export function cli(args) {
  // let argv = process.argv.slice(2)
  // let options = parseArgumentsIntoOptions(args)
  // todo: 考虑参数传入配置文件
  run()
}
