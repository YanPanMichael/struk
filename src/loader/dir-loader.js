const fs = require('fs')
const path = require('path')

module.exports = (dir = __dirname, pkgUrl = '../../package.json') => {
  const pkgPath = path.resolve(`${dir}`, pkgUrl)
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath)
  } else {
    console.warn('未找到 package.json 文件...')
    return {}
  }
}
