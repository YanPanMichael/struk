const fs = require('fs')

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

module.exports = {
    isProd,
    writeToFile
}