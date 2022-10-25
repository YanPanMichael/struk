### 自定义配置

可在项目根目录新建 `struk.config.js` 自定义 struk 构建配置（或在 `package.json` 中使用 `strukConfig` 对象配置）。

支持自定义banner，可通过指定package.json文件中__cusBannerString__字段值修改本工具品牌名称。

如需指定打包需要隔离的依赖包，则可配置 formatConfig 属性对象

```js
  "formatConfig": {
    [format]: {
      external: ['xxx']
    }
  },
```

如需整体隔离 dependences 全体依赖包，可指定 isolateDep: true

```js
  "formatConfig": {
    [format]: {
      isolateDep: true,
    }
  },
```

debug 状态会自动开启 rollup-serve，可配置 templateBase 属性指定模版 index.html 所在路径

```js
  "formatConfig": {
    templateBase: 'examples/',
  },
```

[struk 默认配置/配置示例]()

```js
/**
 * struk 默认配置
 */
module.exports = ({ pkg } = {}) => {
  return {
    // 输入
    input: 'src/index.js',

    // 输出
    output: {
      // 目录
      directory: 'dist',
      // 包名
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      // 格式
      format: ['umd', 'es', 'cjs', 'iife', 'amd'],
      // 顶部注释
      banner: `/*!
* ${pkg.name} with v${pkg.version}
* Author: ${pkg.author}
* Built on ${new Date().toLocaleDateString()}
* Released under the ${
        pkg.license
      } License Copyright (c) 2021-${new Date().getFullYear()}
*/`
    },
    formatConfig: {
      umd: {
        // 打包屏蔽的外部模块
        external: ['lodash', 'moment'],
        // 外部pkg.dependences依赖不屏蔽
        isolateDep: false
      },
      es: {
        external: ['lodash', 'moment'],
        // 自动屏蔽全部pkg.dependences依赖
        isolateDep: true
      },
      cjs: {
        external: [],
        isolateDep: false
      },
      iife: {
        external: [],
        isolateDep: false
      },
      amd: {
        external: [],
        isolateDep: false
      }
    },
    skipAlert: true, // 重复路径是否提示覆盖并继续构建，默认不提示
    templateBase: 'examples/',
    replaceMaps: {}
  }
}
```