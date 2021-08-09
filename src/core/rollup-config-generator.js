/**
 * rollup 配置生成器
 */
const resolve = require('@rollup/plugin-node-resolve').nodeResolve;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const url = require('rollup-plugin-url');
const babel = require('@rollup/plugin-babel').babel;
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const vue = require('rollup-plugin-vue');
const autoprefixer = require('autoprefixer');

module.exports = (bbuilderConfig, pkg, formatMapping) => {
  const baseConfig = {
    ...bbuilderConfig,
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.jsx', '.json', '.vue', '.ts'],
      }),
      commonjs(),
      json(),
      url({ limit: 10 * 1024 }),
      typescript(),
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
        plugins: ["@babel/plugin-transform-runtime"],
        exclude: 'node_modules/**',
      }),
    ],
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
