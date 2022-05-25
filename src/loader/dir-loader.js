const fs = require('fs')
const path = require('path')

module.exports = (dir = __dirname) => {
  const pkgPath = path.resolve(`${dir}`, '../../package.json')
  if (fs.existsSync(pkgPath)) {
    return require(pkgPath)
  } else {
    console.warn('未找到 package.json 文件...')
    return {}
  }
}
