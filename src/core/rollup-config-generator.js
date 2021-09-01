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
// const livereload = require('rollup-plugin-livereload');
const vue = require('rollup-plugin-vue');
const alias = require('@rollup/plugin-alias');
const replace = require('@rollup/plugin-replace');
const autoprefixer = require('autoprefixer');
const presetEnv = require('@babel/preset-env');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
// const syntaxDynamicImportPlugins = require('@babel/plugin-syntax-dynamic-import');
// const proposalDecoratorsPlugins = require('@babel/plugin-proposal-decorators');
const runtimePlugins = require('@babel/plugin-transform-runtime');
const filesize = require('rollup-plugin-filesize');

// const EXTERNAL = [Object.keys(pkg.devDependencies)].concat(Object.keys(pkg.peerDependencies))

module.exports = (bbuilderConfig, pkg, formatMapping, cliConfig) => {
  const version = process.env.VERSION || pkg.version;
  const commonPlugins = [
    peerDepsExternal(),
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.vue', '.ts'],
    }),
    commonjs(),
    json(),
    url({ limit: 10 * 1024 }),
    replace({
      '__VERSION__': version,
      '__ENV__': JSON.stringify('production'),
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.BUILD': JSON.stringify('production'),
    }),
    typescript({
      exclude: ["node_modules/*"],
      allowJs: true, /* Allow javascript files to be compiled. */
      strict: true, /* Enable all strict type-checking options. */
      // importHelpers: true, // 通过tsli÷b引入helper函数，文件必须是模块
      moduleResolution: "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
      allowSyntheticDefaultImports: true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
      typeRoots: [
        "node_modules/@types"
      ],
      // declarationDir: path.dirname(pkg.types || pkg.typings || (bbuilderConfig.output.directory+"/*")), // 如果 tsconfig 中的 declarationDir 没有定义，则优先使用 package.json 中的 types 或 typings 定义的目录， 默认值：outputDir
      // declaration: true,
      // sourceMap: true,
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
      resolve: ['.js', '.jsx', '.vue', '.ts'],
      entries: [
        {
          find: '@',
          replacement: path.resolve(process.cwd(), './src'),
        },
        {
          find: '~',
          replacement: path.resolve(process.cwd(), './src/utils/'),
        }
      ]
    }),
    babel({
      extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
      babelHelpers: 'runtime',
      // babelrc: false,
      presets: [
        [presetEnv, {
          'targets': {
            'browsers': ['last 3 versions', '> 2%', 'ie >= 9', 'Firefox >= 30', 'Chrome >= 30']
          },
          'modules': false,
          'loose': true,
          'shippedProposals': true
        }],
        // ["@babel/preset-typescript"]
      ],
      plugins: [
        // syntaxDynamicImportPlugins,
        // [proposalDecoratorsPlugins, {"legacy": true}],
        runtimePlugins
      ],
      exclude: 'node_modules/**',
    }),
    filesize(),
  ];

  if(process.env.NODE_ENV !== 'production' && cliConfig.debug) {
    const serve = require('rollup-plugin-serve');
    commonPlugins.push(
      serve({
        open: true, // 是否打开浏览器
        contentBase: path.resolve(process.cwd(), bbuilderConfig.templateBase??''), // 入口html文件位置
        historyApiFallback: true, // return index.html instead of 404
        host: 'localhost',
        port: 3003,
        verbose: true, // 打印输出serve路径
      }),
      // livereload({
      //   watch: bbuilderConfig.output.directory,
      //   port: 35729
      // })
    )
  }

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
      // sourceMap: true,
    }

    if (config.formatConfig) {
      delete config.formatConfig
    }

    return [...acc, config]
  }, []);

  return rollupConfigRes;
}
