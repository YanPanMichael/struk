const fs = require('fs')
const path = require('path')
const ts = require('typescript');

function writeToFile(dest, code) {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(dest, code)
            resolve()
        } catch (err) {
            if (err) {
                logError(blue(dest + ' ' + (extra || '')))
                reject(err)
            }
        }
    })
}

function logError(e) {
    console.log(e)
}

function blue(str) {
    return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function isProd() {
    return process.env.NODE_ENV === 'production';
}

function getTsConfigOption() {
    const tsconfigPath = path.resolve(__dirname, '../../tsconfig.json');
    // borrowed from https://github.com/facebook/create-react-app/pull/7248
    // const tsconfigJSON = ts.readConfigFile(tsconfigPath, ts.sys.readFile).config;
    const tsconfigJSON = ts.parseConfigFileTextToJson(
        tsconfigPath,
        ts.sys.readFile(tsconfigPath),
        true
    );
    // borrowed from https://github.com/ezolenko/rollup-plugin-typescript2/blob/42173460541b0c444326bf14f2c8c27269c4cb11/src/parse-tsconfig.ts#L48
    const { options: tsCompilerOptions } = ts.parseJsonConfigFileContent(
        tsconfigJSON.config,
        ts.sys,
        path.dirname(tsconfigPath)
    );
    return tsCompilerOptions;
}

module.exports = {
    isProd,
    writeToFile
}