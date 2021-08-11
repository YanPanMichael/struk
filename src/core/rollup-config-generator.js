/**
 * rollup 配置生成器
 */
const path = require('path')
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const url = require('rollup-plugin-url');
const babel = require('@rollup/plugin-babel').babel;
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const vue = require('rollup-plugin-vue');
const autoprefixer = require('autoprefixer');
const runtimePlugins = require('@babel/plugin-transform-runtime');

module.exports = (bbuilderConfig, pkg, formatMapping) => {
  const commonPlugins = [
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json', '.vue', '.ts'],
    }),
    commonjs(),
    json(),
    url({ limit: 10 * 1024 }),
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
    babel({
      extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
      babelHelpers: 'runtime',
      plugins: [runtimePlugins],
      exclude: 'node_modules/**',
    }),
  ];

  const inputExtension = bbuilderConfig.input.split('.').pop()
  if (inputExtension === 'ts') {
    commonPlugins.push(
      typescript(Object.assign({
        inlineSources: true,
        exclude: ["node_modules/*", "dist/*"],
        allowJs: true, /* Allow javascript files to be compiled. */
        strict: true, /* Enable all strict type-checking options. */
        importHelpers: true,
        moduleResolution: "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
        allowSyntheticDefaultImports: true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
        // esModuleInterop: true, /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
        // target: "es5", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
        // module: "es2015", /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
        // lib: [
        //   "es2018",
        //   "dom"
        // ], /* Specify library files to be included in the compilation. */
        // checkJs: true,                             /* Report errors in .js files. */
        // "jsx": "preserve",                           /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */
        // declaration: true, /* Generates corresponding '.d.ts' file. */
        // sourceMap: true, /* Generates corresponding '.map' file. */
        // isolatedModules: true, /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
        // declarationDir: 'src/types',
        // typeRoots: [
        //   "node_modules/@types"
        // ], /* List of folders to include type definitions from. */
        // baseUrl: ".", /* Base directory to resolve non-absolute module names. */
        // paths: {
        //   "@": [
        //     "./src"
        //   ],
        //   "tslib" : ["path/to/node_modules/tslib/tslib.d.ts"]
        // }, /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
      }, {}))
    )
  }

  const baseConfig = {
    ...bbuilderConfig,
    plugins: commonPlugins,
  }

  return bbuilderConfig.output.format.reduce((acc, format) => {
    const config = {
      ...baseConfig,
      output: {
        ...bbuilderConfig.output,
        file: `${bbuilderConfig.output.directory}/${bbuilderConfig.output.name}${formatMapping[format] ? `${formatMapping[format]}` : ''}`,
        format,
      },
    }

    return [
      ...acc,
      config,
    ]
  }, [])
}
