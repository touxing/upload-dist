import arg from 'arg'
import { run } from './upload-dist'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg({
    '--config': String,
    // alias
    '-c': '--config',
  })
  return args
}

export function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  // todo: 考虑参数传入配置文件
  run(options)
}
