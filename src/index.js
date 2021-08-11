const yargs = require('yargs')
  .alias({
    h: 'help',
    v: 'version',
    d: 'debug',
  }).describe({
    's': '帮助',
    'v': '版本',
    'd': '调试',
  })
  .help('h');

const cliConfig = {
  debug: !!yargs.argv.debug, // 调试模式
}

const command = yargs.argv._[0];

console.log('💡✨Command:', command || 'runnding default');

if (command === undefined || command === 'build') {
  require('./core/build')(cliConfig)
}
