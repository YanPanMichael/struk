/**
 * bbuilder 默认配置
 */
const moment = require('moment')

module.exports = ({ pkg } = {}) => {
  return {
    // 输入
    input: 'examples/index.js',

    // 输出
    output: {
      // 目录
      directory: 'dist',
      // 包名
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      // 格式
      format: ['umd', 'es', 'cjs'],
      // 顶部注释
      banner: `/*!
        * ${pkg.name} v${pkg.version}
        * Author: ${pkg.author}
        * Built on ${moment().format('YYYY-MM-DD, HH:mm:ss')}
        * Released under the ${pkg.license} License Copyright (c) 2021-${new Date().getFullYear()}
        */`,
    },
    // 外部模块
    external: [],
  }
}
