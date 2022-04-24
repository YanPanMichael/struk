/**
 * struk 默认配置
 */
const moment = require('moment')
const path = require('path')
const isProd = require('../utils/index').isProd()

module.exports = ({ pkg, cwd } = {}) => {
  return {
    // 输入
    // input: 'src/index.js',
    input: 'examples/index.ts',

    // 输出
    output: {
      // 目录
      // directory: 'dist',
      directory: 'examples/dist',
      // 包名
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      // 格式
      format: ['cjs', 'es', 'umd', 'iife', 'amd'],
      // 顶部注释
      banner: `/*!
* ${pkg.name} with v${pkg.version}
* Author: ${pkg.author}
* Built on ${moment().format('YYYY-MM-DD, HH:mm:ss')}
* Released under the ${
        pkg.license
      } License Copyright (c) ${new Date().getFullYear()}
*/`
    },
    formatConfig: {
      cjs: {
        // 打包屏蔽的外部模块
        external: ['lodash', 'moment'],
        // 外部pkg.dependences依赖不屏蔽
        isolateDep: false
      },
      es: {
        external: ['lodash', 'monent'],
        // 自动屏蔽全部pkg.dependences依赖
        isolateDep: true
      },
      umd: {
        external: []
      },
      iife: {
        isolateDep: false
      },
      amd: {
        external: [],
        isolateDep: false
      }
    },
    skipAlert: true,
    templateBase: 'examples/',
    stylusAlias: {
      '@': path.join(cwd, './node_modules/@')
    },
    styleExtract: false,
    replaceMaps: {
      // 'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      'process.env.DEBUG': JSON.stringify(isProd ? 'false' : 'true'),
      'process.argv': JSON.stringify(process.argv)
    }
  }
}
