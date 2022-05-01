<!-- <img src="icon.png" align="right" /> -->

# Struk [![Struk](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/yanppanmichael/struk#readme)

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-4-0]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

> 📦 基于 rollup 的 JS、TS、Vue、React 包基础核心构建工具
> One common construction and package tool for JS/TS/Vue/React components based on Rollup 📦

## ✨ 特性

- 基于 rollup 的基础核心构建工具
- 支持 javascript、typescript、vue、react

## 🚀 快速开始

### 安装

```bash
npm i -D struk # 或 yarn add -D struk
```

### 使用

**第一步**：package.json 中新增 scripts：

```js
  "scripts": {
    "build": "NODE_ENV=production struk build --source=js"
  },
```

需要通过参数`source`指定构建打包源文件格式，其取值为`'js', 'ts', 'vue', 'react'`四种格式之一。

**第二步**：命令行进入项目目录，运行：

```bash
npm run build # 或 yarn build
```

struk 默认以 `src/index.js` 为入口，在 `dist` 目录输出 `'umd', 'es', 'cjs', 'iife', 'amd'` 五种格式的构建包（包含未压缩和已压缩版本）。

### 自定义配置

可在项目根目录新建 `struk.config.js` 自定义 struk 构建配置（或在 `package.json` 中使用 `strukConfig` 对象配置）。

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

<br>
<br>
😉😘 如果感觉它对你有帮助，请点一下 <b>⭐️<a href="">Star</a></b> 感谢支持~

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2022-present, YanPan

[ts-badge]: https://img.shields.io/badge/TypeScript-4.0-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=8.0-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v8.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-0]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/sponsors/jsynowiec
[jest]: https://facebook.github.io/jest/
[eslint]: https://github.com/eslint/eslint
[wiki-js-tests]: https://github.com/jsynowiec/node-typescript-boilerplate/wiki/Unit-tests-in-plain-JavaScript
[prettier]: https://prettier.io
[volta]: https://volta.sh
[volta-getting-started]: https://docs.volta.sh/guide/getting-started
[volta-tomdale]: https://twitter.com/tomdale/status/1162017336699838467?s=20
[gh-actions]: https://github.com/features/actions
[repo-template-action]: https://github.com/jsynowiec/node-typescript-boilerplate/generate
[esm]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[sindresorhus-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
[dynamic-import]: https://v8.dev/features/dynamic-import