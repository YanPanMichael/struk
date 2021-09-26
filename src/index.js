module.exports = (custumConfig) => {
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

    const sourceFormat = yargs.argv.source?.toLowerCase();
    const command = yargs.argv._[0];

    console.log('🚀 Command:', command || 'runnding default', '📌 Format:', sourceFormat);

    if (!['js', 'ts', 'vue'].includes(sourceFormat)) {
        return console.log('😑 Please input source format which includes js ts vue');
    }

    const cliConfig = {
        debug: !!yargs.argv.debug, // 调试模式
        sourceFormat: sourceFormat, // 编译源文件格式
    }

    if (command === undefined || command === 'build') {
        require('./core/build')(cliConfig, custumConfig)
    }
}