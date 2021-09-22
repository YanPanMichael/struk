# @bilibili-live/bbuilder

> 📦 基于rollup的JS、TS、Vue包基础核心构建工具 📦

## ✨ 特性

- 基于rollup的Blive的核心基础构建工具
- 支持 javascript、typescript、vue

## 🚀 快速开始

### 安装

```bash
npm i -D @bilibili-live/bbuilder # 或 yarn add -D @bilibili-live/bbuilder
```

### 使用

**第一步**：package.json 中新增 scripts：

```js
  "scripts": {
    "build": "NODE_ENV=production bbuilder build --source=js"
  },
```

需要通过参数`source`指定构建打包源文件格式，其取值为`'js', 'ts', 'vue'`三种格式之一。

**第二步**：命令行进入项目目录，运行：

```bash
npm run build # 或 yarn build
```

bbuilder 默认以 `src/index.js` 为入口，在 `dist` 目录输出 `'umd', 'es', 'cjs', 'iife', 'amd'` 五种格式的构建包（包含未压缩和已压缩版本）。

<img src="https://git.bilibili.co/blive-core/bbuilder/-/blob/master/docs/assets/cli.png?raw=true">

### 自定义配置

可在项目根目录新建 `blive.config.js` 自定义 bbuilder 构建配置（或在 `package.json` 中使用 `bbuilderConfig` 对象配置）。

如需指定打包需要隔离的依赖包，则可配置formatConfig属性对象
```js
  "formatConfig": {
    [format]: {
      external: ['xxx']
    }
  },
```
如需整体隔离dependences全体依赖包，可指定isolateDep: true
```js
  "formatConfig": {
    [format]: {
      isolateDep: true,
    }
  },
```
debug状态会自动开启rollup-serve，可配置templateBase属性指定模版index.html所在路径
```js
  "formatConfig": {
    templateBase: 'examples/',
  },
```

[bbuilder 默认配置/配置示例](https://git.bilibili.co/blive-core/bbuilder/blob/master/src/config/bbuilder.config.js)
```js
/**
 * bbuilder 默认配置
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
* Released under the ${pkg.license} License Copyright (c) 2021-${new Date().getFullYear()}
*/`,
    },
    formatConfig: {
      umd: {
        // 打包屏蔽的外部模块
        external: ['lodash', 'moment'],
        // 外部pkg.dependences依赖不屏蔽
        isolateDep: false,
      },
      es: {
        external: ['lodash', 'moment'],
        // 自动屏蔽全部pkg.dependences依赖
        isolateDep: true,
      },
      cjs: {
        external: [],
        isolateDep: false,
      },
      iife: {
        external: [],
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
```

<br>
<br>
😉😘 如果感觉它对你有帮助，请点一下 <b>⭐️<a href="https://git.bilibili.co/blive-core/bbuilder">Star</a></b> 感谢支持~

## License

[ISC](http://opensource.org/licenses/ISC)

Copyright (c) 2021-present, bilibili
