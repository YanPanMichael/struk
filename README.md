# @bilibili-live/bbuilder

> 📦 Blive基于rollup的JS、TS、Vue包基础核心构建工具 📦

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
    "build": "bbuilder"
  },
```

**第二步**：命令行进入项目目录，运行：

```bash
npm run build # 或 yarn build
```

bbuilder 默认以 `src/index.js` 为入口，在 `dist` 目录输出 `'umd', 'es', 'cjs'` 三种格式的构建包（包含未压缩和已压缩版本）。

<img src="https://git.bilibili.co/blive-core/bbuilder/-/blob/master/docs/assets/cli.png?raw=true">

### 自定义配置

可在项目根目录新建 `blive.config.js` 自定义 bbuilder 构建配置（或在 `package.json` 中使用 `bbuilderConfig` 对象配置）。

如需指定打包需要隔离的依赖包，则可配置formatConfig: {[format]: {external: []}}属性对象，如需隔离整体依赖包，可指定{[format]: {isolateDep: true}}。

[bbuilder 默认配置/配置示例](https://git.bilibili.co/blive-core/bbuilder/blob/master/src/config/bbuilder.config.js)

<br>
<br>
😉😘 如果它对你有所帮助，可以点一下 <b>⭐️<a href="#">Star</a></b> ~

## License

[ISC](http://opensource.org/licenses/ISC)

Copyright (c) 2021-present, bilibili
