const pkgActLoader = require('./loader/dir-loader')
const { bannerPrint } = require('./utils/index')

module.exports = (custumConfig) => {
  const runtime = new Date().toLocaleString('en-us', {
    timeZoneName: 'short'
  })
  const { version = '--' } = pkgActLoader()
  const { __cusBannerString__ } = pkgActLoader(process.cwd(), './package.json')
  bannerPrint(version, runtime, __cusBannerString__)

  const yargs = require('yargs')
    .alias({
      h: 'help',
      v: 'version',
      d: 'debug'
    })
    .describe({
      s: '帮助',
      v: '版本',
      d: '调试'
    })
    .help('h')

  const sourceFormat = yargs.argv.source?.toLowerCase()
  const command = yargs.argv._[0]

  console.log(
    '🚀 Command:',
    command || 'runnding default',
    '📌 Format:',
    sourceFormat
  )

  if (!['js', 'ts', 'vue', 'react'].includes(sourceFormat)) {
    return console.log(
      '😑 Please input source format which includes js | ts | vue | react \n'
    )
  }

  const cliConfig = {
    debug: !!yargs.argv.debug, // 调试模式
    sourceFormat: sourceFormat // 编译源文件格式
  }

  if (command === undefined || command === 'build') {
    require('./core/build')(cliConfig, custumConfig)
  }
}
