<!-- <img src="icon.png" align="right" /> -->

# Struk [![Struk](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/yanppanmichael/struk#readme)

[![Sponsor][sponsor-badge]][sponsor]
[![TypeScript version][ts-badge]][typescript-4-0]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][license]
[![Build Status - GitHub Actions][gha-badge]][gha-ci]

> 📦 基于 rollup 的 JS、TS、Vue、React 包基础核心构建工具
> One common construction and package tool for JS/TS/Vue/React components based on Rollup 📦

## ✨ Features

- 基于 rollup 的基础核心构建工具
- 支持 javascript、typescript、vue、react
- 支持自定义banner，可通过指定package中__cusBannerString__字段值修改本工具品牌名称

- Basic core build tools based on rollup
- Supports mutiple frameworks such as JavaScript, TypeScript, Vue, React
- Support custom banner, you can modify the brand name of this tool by specifying the value of the __cusBannerString__ field in the package

## 🚀 Quick Start

### Installion

```bash
npm i -D struk@latest # OR yarn add -D struk@latest
```

### Usage

**First Step**：Add the scripts in package.json：

```js
  "scripts": {
    "build": "NODE_ENV=production struk build --source=js"
  },
```

需要通过参数`source`指定构建打包源文件格式，其取值为`'js', 'ts', 'vue', 'react'`四种格式之一。

You need to specify the build and packaging source file format through the parameter 'source', and its values are one of the four formats of 'js', 'ts', 'vue', 'react''.

**Second Step**：Goes to the project directory and runs:

```bash
npm run build # OR yarn build
```

struk 默认以 `src/index.js` 为入口，在 `dist` 目录输出 `'umd', 'es', 'cjs', 'iife', 'amd'` 五种格式的构建包（包含未压缩和已压缩版本）。

struk defaults to 'src/index.js' as the entry, and outputs 'umd', 'es', 'cjs', 'iife', 'amd'' build packages (including uncompressed and compressed versions) in the 'dist' directory.

### Custom Config

可在项目根目录新建 `struk.config.js` 自定义 struk 构建配置（或在 `package.json` 中使用 `strukConfig` 对象配置）。

You can create a new 'struk.config.js' custom struk build configuration at the project root (or use the 'strukConfig' object configuration in 'package.json')

支持自定义banner，可通过指定package.json文件中__cusBannerString__字段值修改本工具品牌名称。

Custom banners are supported, and you can modify the brand name of the tool by specifying the value of the __cusBannerString__ field in the package.json file

如需指定打包需要隔离的依赖包，则可配置 formatConfig 属性对象

If you need to specify that packaging depends on packages that need to be isolated, you can configure the formatConfig property object

```js
  "formatConfig": {
    [format]: {
      external: ['xxx']
    }
  },
```

如需整体隔离 dependences 全体依赖包，可指定 isolateDep: true

To isolate all dependent packages of dependences as a whole, specify isolateDep: true

```js
  "formatConfig": {
    [format]: {
      isolateDep: true,
    }
  },
```

debug 并且非production环境状态会自动开启 rollup-serve，可配置 templateBase 属性指定模版 index.html 所在路径

The debug and development states automatically turns on rollup-serve, and you can configure the templateBase property to specify the path where the template index.html is located.

```js
  "formatConfig": {
    templateBase: 'examples/',
  },
```

[struk 默认配置/配置示例 Default Config]()

```js
/**
 * struk 默认配置 Default Config
 */
module.exports = ({ pkg } = {}) => {
  return {
    // 输入 Input
    input: 'src/index.js',

    // 输出 Output
    output: {
      // 目录 directory
      directory: 'dist',
      // 包名 name
      name: /\//.test(pkg.name) ? pkg.name.match(/\/(.+)/)[1] : pkg.name,
      // 格式 format
      format: ['umd', 'es', 'cjs', 'iife', 'amd'],
      // 顶部注释 banner
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
        // 打包屏蔽的外部模块 Shielded external modules
        external: ['lodash', 'moment'],
        // 外部pkg.dependences依赖不屏蔽 Isolate dependences not blocking
        isolateDep: false
      },
      es: {
        external: ['lodash', 'moment'],
        // 自动屏蔽全部pkg.dependences依赖 Blocking isolate dependences
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
    skipAlert: true, // 重复路径是否提示覆盖并继续构建，默认不提示 Whether the duplicate path prompts to override and continue building, it is not prompted by default
    templateBase: 'examples/',
    replaceMaps: {}
  }
}
```

<br>
<br>
😉😘 If you feel it is helpful, please click <b>⭐️<a href="https://github.com/YanPanMichael/struk.git">Star</a></b> Thank you for you support~

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2022-present, YanPan

[ts-badge]: https://img.shields.io/badge/TypeScript-4.0-blue.svg
[nodejs-badge]: https://img.shields.io/badge/Node.js->=12.0-blue.svg
[nodejs]: https://nodejs.org/dist/latest-v8.x/docs/api/
[gha-badge]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml/badge.svg
[gha-ci]: https://github.com/jsynowiec/node-typescript-boilerplate/actions/workflows/nodejs.yml
[typescript]: https://www.typescriptlang.org/
[typescript-4-0]: https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE
[sponsor-badge]: https://img.shields.io/badge/♥-Sponsor-fc0fb5.svg
[sponsor]: https://github.com/YanPanMichael/struk
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