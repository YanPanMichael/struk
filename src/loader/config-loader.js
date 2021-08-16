/**
 * bbuilder 配置文件加载器
 */

const fs = require('fs')
const mergeWith = require('lodash/mergeWith')
const isArray = require('lodash/isArray')

module.exports = (cwd = process.cwd(), pkg, cliConfig) => {
  const defaultConfig = require('../config/bbuilder.config.js')({ pkg })
  const configPath = `${cwd}/blive.config.js`

  if (fs.existsSync(configPath)) {
    let config = require(configPath)
    if (typeof config === 'function') config = config({ pkg, defaultConfig })
    return mergeWith(defaultConfig, config, function(objValue, srcValue) {
      if (isArray(objValue)) {
        return objValue = srcValue;
      }
    });
  } else if (pkg.bbuilderConfig) {
    console.log('💡使用package的bbuilder配置...');
    return mergeWith(defaultConfig, pkg.bbuilderConfig, function(objValue, srcValue) {
      if (isArray(objValue)) {
        return objValue = srcValue;
      }
    })
  } else {
    if (cliConfig.debug) console.warn('💡未找到 bbuilder 配置，将使用默认配置构建...')
    return defaultConfig
  }
}
