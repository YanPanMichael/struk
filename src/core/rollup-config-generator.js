/**
 * rollup 配置生成器
 */
const path = require("path");
const toString = require('lodash/toString')
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const url = require('rollup-plugin-url');
const babel = require('@rollup/plugin-babel').babel;
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const vue = require('rollup-plugin-vue');
const alias = require('@rollup/plugin-alias');
const autoprefixer = require('autoprefixer');
const presetEnv = require('@babel/preset-env');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
// const syntaxDynamicImportPlugins = require('@babel/plugin-syntax-dynamic-import');
// const proposalDecoratorsPlugins = require('@babel/plugin-proposal-decorators');
// const proposalClassPropertiesPlugins = require('@babel/plugin-proposal-class-properties');
const runtimePlugins = require('@babel/plugin-transform-runtime');

const rootDir = path.resolve(__dirname, './src')
// const EXTERNAL = [Object.keys(pkg.devDependencies)].concat(Object.keys(pkg.peerDependencies))

module.exports = (bbuilderConfig, pkg, formatMapping) => {
  const commonPlugins = [
    peerDepsExternal(),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.vue', '.ts'],
    }),
    commonjs(),
    json(),
    url({ limit: 10 * 1024 }),
    typescript({
      exclude: ["node_modules/*"],
      allowJs: true, /* Allow javascript files to be compiled. */
      strict: true, /* Enable all strict type-checking options. */
      importHelpers: true, // 通过tslib引入helper函数，文件必须是模块
      moduleResolution: "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
      allowSyntheticDefaultImports: true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
      typeRoots: [
        "node_modules/@types"
      ],
      // declarationDir: path.dirname(pkg.types || pkg.typings || (bbuilderConfig.output.directory+"/*")),
      // declaration: true,
      // sourceMap: true,
      // declarationMap: true,
      // lib: [
      //   "dom",
      //   "es5",
      //   "es2015",
      //   "es2016",
      //   "es2017",
      //   "esnext"
      // ],
      // module: "esnext",
      // target: "ES5",
      // downlevelIteration: true,
      // resolveJsonModule: true,
      // esModuleInterop: true,
      // // baseUrl: ".",
      // paths: {
      //   "@/*":["src/*"]
      // },
    }),
    vue({
      defaultLang: {
        style: 'stylus',
      },
      template: {
        // 强制生产模式
        isProduction: true,
      },
      style: {
        postcssPlugins: [autoprefixer],
      },
    }),
    postcss({
      extensions: ['.css', '.styl', '.sass', '.scss'],
    }),
    alias({
      resolve: ['.ts'],
      entries: [
        {
          find: '@',
          replacement: rootDir
        }
      ]
    }),
    babel({
      extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
      babelHelpers: 'runtime',
      presets: [
        [presetEnv, {
          'targets': {
            'browsers': ['last 3 versions', '> 2%', 'ie >= 9', 'Firefox >= 30', 'Chrome >= 30']
          },
          'modules': false,
          "useBuiltIns": "usage",
          'loose': true,
          'shippedProposals': true
        }],
        // ["@babel/preset-typescript"]
      ],
      plugins: [
        // syntaxDynamicImportPlugins,
        // [proposalDecoratorsPlugins, {"legacy": true}],
        // [proposalClassPropertiesPlugins, {"loose": true}],
        runtimePlugins
      ],
      exclude: 'node_modules/**',
    }),
  ];

  const baseConfig = {
    ...bbuilderConfig,
    plugins: commonPlugins,
  }

  const pkgDeps = !!pkg.dependencies ? Object.keys(pkg.dependencies).map(d => toString(d)) : [];

  const rollupConfigRes = bbuilderConfig.output.format.reduce((acc, format) => {
    const { external = [], isolateDep } = bbuilderConfig.formatConfig?.[format] ?? {};
    const externals = !!isolateDep ? pkgDeps.concat(external) : external;

    const config = {
      ...baseConfig,
      output: {
        ...bbuilderConfig.output,
        file: `${bbuilderConfig.output.directory}/${bbuilderConfig.output.name}${formatMapping[format] ? `${formatMapping[format]}` : ''}`,
        format,
      },
      external: [...new Set(externals)],
    }

    if (config.formatConfig) {
      delete config.formatConfig
    }

    return [...acc, config]
  }, []);

  return rollupConfigRes;
}
