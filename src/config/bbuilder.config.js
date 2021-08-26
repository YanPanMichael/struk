/**
 * bbuilder 默认配置
 */
const moment = require('moment')

module.exports = ({ pkg } = {}) => {
  return {
    // 输入
    input: 'examples/index.js',
    // input: 'src/index.js',

    // 输出
    output: {
      // 目录
      directory: 'examples/dist',
      // 包名
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      // 格式
      format: ['umd', 'es', 'cjs', 'iife', 'amd'],
      // 顶部注释
      banner: `/*!
* ${pkg.name} with v${pkg.version}
* Author: ${pkg.author}
* Built on ${moment().format('YYYY-MM-DD, HH:mm:ss')}
* Released under the ${pkg.license} License Copyright (c) 2021-${new Date().getFullYear()}
*/`,
    },
    formatConfig: {
      umd: {
        // 打包屏蔽的外部模块
        external: ['lodash', 'moment'],
        // 外部dependences依赖不屏蔽
        isolateDep: false,
      },
      es: {
        external: ['lodash', 'monent'],
        isolateDep: true,
      },
      cjs: {
        external: [],
      },
      iife: {
        isolateDep: false,
      },
      amd: {
        external: [],
        isolateDep: false,
      }
    },
    templateBase: 'examples/'
  }
}
