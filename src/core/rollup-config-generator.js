/**
 * rollup 配置生成器
 */
const path = require('path')
const toString = require('lodash/toString')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
const resolve = require('@rollup/plugin-node-resolve').nodeResolve
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
// const url = require('rollup-plugin-url')
// const livereload = require('rollup-plugin-livereload')
const alias = require('@rollup/plugin-alias')
// const stylus = require('rollup-plugin-stylus-compiler')
// const css = require('rollup-plugin-css-porter')
const vue = require('rollup-plugin-vue')
// const stylus = require('rollup-plugin-stylus')
// const vuePugPlugin = require('vue-pug-plugin')
const postcss = require('rollup-plugin-postcss')
const ttypescript = require('ttypescript')
const typescript = require('rollup-plugin-typescript2')
const presetEnv = require('@babel/preset-env')
const babel = require('@rollup/plugin-babel').babel
const proposalDecoratorsPlugins = require('@babel/plugin-proposal-decorators')
const proposalClassPlugins = require('@babel/plugin-proposal-class-properties')
const runtimePlugins = require('@babel/plugin-transform-runtime')
const replace = require('@rollup/plugin-replace')
const autoprefixer = require('autoprefixer')
// const syntaxDynamicImportPlugins = require('@babel/plugin-syntax-dynamic-import');
const filesize = require('rollup-plugin-filesize')

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  jquery: '$',
  vue: 'Vue',
  react: 'React',
  'react-dom': 'ReactDOM'
}
// const sourcemaps = require('rollup-plugin-sourcemaps');
// const terser = require('rollup-plugin-terser').terser;
const tempProperty = [
  'skipAlert',
  'formatConfig',
  'templateBase',
  'stylusAlias',
  'replaceMaps',
  'styleExtract'
]
// const EXTERNAL = [Object.keys(pkg.devDependencies)].concat(Object.keys(pkg.peerDependencies))
const isProd = require('../utils/index').isProd()
const cssModulesConfig = isProd
  ? {
    generateScopedName: '[hash:base64:5]'
  }
  : true

module.exports = (strukConfig, pkg, formatMapping, cliConfig) => {
  const version = process.env.VERSION || pkg.version

  const { sourceFormat } = cliConfig

  const stylusAlias = strukConfig.stylusAlias
  const replaceMaps = strukConfig.replaceMaps || {}
  const Evaluator = require('stylus').Evaluator

  if (stylusAlias) {
    const visitImport = Evaluator.prototype.visitImport
    Evaluator.prototype.visitImport = function (imported) {
      const path = imported.path.first
      if (path.string.startsWith('~')) {
        const alias = Object.keys(stylusAlias).find((entry) =>
          path.string.startsWith(`~${entry}`)
        )
        if (alias) {
          path.string = path.string.substr(1).replace(alias, stylusAlias[alias])
        }
      }
      return visitImport.call(this, imported)
    }
  }

  const baseConfig = {
    ...strukConfig,
    plugins: []
  }

  const basePlugins = {
    preBase: [
      json(),
      // url({ limit: 10 * 1024 }),
      replace({
        preventAssignment: true,
        __VERSION__: version,
        __ENV__: JSON.stringify('production'),
        ...replaceMaps
      })
    ],
    preConfig: [
      alias({
        entries: [
          {
            find: '@',
            replacement: path.resolve(process.cwd(), './src')
          },
          {
            find: '-',
            replacement: path.join(__dirname, '../../node_modules')
          }
        ]
      }),
      // stylus(),
      postcss({
        extensions: ['.css', '.styl', '.sass', '.scss'],
        modules: cssModulesConfig,
        plugins: [autoprefixer()],
        sourceMap: false,
        extract: strukConfig?.styleExtract
          ? `${strukConfig.output.directory}/style/style.css`
          : false,
        minimize: true,
        inject: true
      })
      // css(),
    ],
    vue: {
      defaultLang: {
        style: 'stylus'
      },
      css: true,
      template: {
        isProduction: true
        // optimizeSSR: true,
        // preprocessOptions: { // 'preprocessOptions' is passed through to the pug compiler
        //     plugins: [{
        //         preCodeGen: vuePugPlugin
        //     }]
        // }
      },
      style: {
        // trim: false,
        postcssPlugins: [autoprefixer],
        preprocessOptions: {
          stylus: { Evaluator }
        }
      }
    },
    postConfig: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        mainFields: ['jsnext:main', 'preferBuiltins', 'browser']
      }),
      commonjs()
    ],
    babel: {
      exclude: ['node_modules/**', 'struk.config.js'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      babelHelpers: 'bundled',
      plugins: [
        // syntaxDynamicImportPlugins,
        [proposalDecoratorsPlugins, { legacy: true }],
        [proposalClassPlugins, { loose: true }]
        // runtimePlugins,
      ]
    },
    babelPreset: [
      presetEnv,
      {
        targets: {
          browsers: [
            'last 3 versions',
            '> 2%',
            'ie >= 9',
            'Firefox >= 30',
            'Chrome >= 30'
          ]
        },
        modules: false,
        loose: true,
        shippedProposals: true
      }
    ],
    tsConfig: {
      check: false,
      // tsconfig: path.resolve(__dirname, '../../tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: path.resolve(
            process.cwd(),
            `./${strukConfig.output.directory}/types`
          )
        }
      },
      useTsconfigDeclarationDir: true,
      // emitDeclarationOnly: true,
      typescript: ttypescript
    },
    postBase: [
      filesize(),
      process.env.NODE_ENV !== 'production' &&
        cliConfig.debug &&
        require('rollup-plugin-serve')({
          open: true, // 是否打开浏览器
          contentBase: path.resolve(
            process.cwd(),
            strukConfig.templateBase ?? ''
          ), // 入口html文件位置
          historyApiFallback: true, // return index.html instead of 404
          host: 'localhost',
          port: 3003,
          verbose: true // 打印输出serve路径
        })
      // livereload({
      //   watch: strukConfig.output.directory,
      //   port: 35729
      // }
    ]
  }

  function mapFormatToConfig (format, sourceFormat) {
    // esm格式配置
    if (format === 'es') {
      const esPluginMap = {
        js: [
          ...basePlugins.preConfig,
          babel({
            exclude: ['node_modules/**', 'struk.config.js'],
            extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
            babelHelpers: 'runtime',
            // babelrc: false,
            presets: [
              basePlugins.babelPreset
              // ["@babel/preset-typescript"]
            ],
            plugins: [
              // syntaxDynamicImportPlugins,
              [proposalDecoratorsPlugins, { legacy: true }],
              [proposalClassPlugins, { loose: true }],
              [runtimePlugins, { useESModules: true }]
            ]
          }),
          ...basePlugins.postConfig
        ],
        ts: [
          ...basePlugins.preConfig,
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig)
        ],
        vue: [
          ...basePlugins.preConfig,
          vue(basePlugins.vue),
          ...basePlugins.postConfig,
          // Only use typescript for declarations - babel will
          // do actual js transformations
          typescript(basePlugins.tsConfig),
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset]
          })
        ],
        react: [
          ...basePlugins.preConfig,
          // Only use typescript for declarations - babel will
          // do actual js transformations
          typescript(basePlugins.tsConfig),
          ...basePlugins.postConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset, ['@babel/preset-react']]
          })
        ]
      }

      const esPlugins = esPluginMap[sourceFormat] || []
      const esConfig = {
        ...baseConfig,
        plugins: [
          peerDepsExternal(),
          ...basePlugins.preBase,
          ...esPlugins,
          ...basePlugins.postBase
        ]
      }
      return esConfig
    }

    // commonjs格式配置
    if (format === 'cjs') {
      const cjsPluginMap = {
        js: [
          ...basePlugins.preConfig,
          babel({
            exclude: ['node_modules/**', 'struk.config.js'],
            extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
            babelHelpers: 'runtime',
            // babelrc: false,
            presets: [
              basePlugins.babelPreset
              // ["@babel/preset-typescript"]
            ],
            plugins: [
              // syntaxDynamicImportPlugins,
              [proposalDecoratorsPlugins, { legacy: true }],
              [proposalClassPlugins, { loose: true }],
              [runtimePlugins, { useESModules: false }]
            ]
          }),
          ...basePlugins.postConfig
        ],
        ts: [
          ...basePlugins.preConfig,
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig)
        ],
        vue: [
          ...basePlugins.preConfig,
          vue({
            ...basePlugins.vue,
            template: {
              ...basePlugins.vue.template,
              optimizeSSR: true
            }
          }),
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig),
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset]
          })
        ],
        react: [
          ...basePlugins.preConfig,
          // Only use typescript for declarations - babel will
          // do actual js transformations
          typescript(basePlugins.tsConfig),
          ...basePlugins.postConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset, ['@babel/preset-react']]
          })
        ]
      }

      const cjsPlugins = cjsPluginMap[sourceFormat] || []
      const cjsConfig = {
        ...baseConfig,
        plugins: [
          peerDepsExternal(),
          ...basePlugins.preBase,
          ...cjsPlugins,
          ...basePlugins.postBase
        ]
      }
      return cjsConfig
    }

    // umd格式配置
    if (format === 'umd') {
      const umdPluginMap = {
        js: [
          ...basePlugins.preConfig,
          babel({
            exclude: ['node_modules/**', 'struk.config.js'],
            extensions: ['.mjs', '.js', '.jsx', '.vue', '.ts'],
            babelHelpers: 'runtime',
            // babelrc: false,
            presets: [
              basePlugins.babelPreset
              // ["@babel/preset-typescript"]
            ],
            plugins: [
              // syntaxDynamicImportPlugins,
              [proposalDecoratorsPlugins, { legacy: true }],
              [proposalClassPlugins, { loose: true }],
              [runtimePlugins, { useESModules: false }]
            ]
          }),
          ...basePlugins.postConfig
        ],
        ts: [
          ...basePlugins.preConfig,
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig)
        ],
        vue: [
          ...basePlugins.preConfig,
          vue({
            ...basePlugins.vue,
            template: {
              ...basePlugins.vue.template,
              optimizeSSR: true
            }
          }),
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig),
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset]
          })
        ],
        react: [
          ...basePlugins.preConfig,
          typescript(basePlugins.tsConfig),
          ...basePlugins.postConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset, ['@babel/preset-react']]
          })
        ]
      }

      const umdPlugins = umdPluginMap[sourceFormat] || []
      const umdConfig = {
        ...baseConfig,
        plugins: [
          ...basePlugins.preBase,
          ...umdPlugins,
          ...basePlugins.postBase
        ]
      }
      return umdConfig
    }

    // iife和amd格式配置
    if (format === 'iife' || format === 'amd') {
      const unpkgPluginsMap = {
        js: [
          ...basePlugins.preConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset],
            plugins: [
              // syntaxDynamicImportPlugins,
              [proposalDecoratorsPlugins, { legacy: true }],
              [proposalClassPlugins, { loose: true }]
            ]
          }),
          ...basePlugins.postConfig
        ],
        ts: [
          ...basePlugins.preConfig,
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig)
        ],
        vue: [
          ...basePlugins.preConfig,
          vue(basePlugins.vue),
          ...basePlugins.postConfig,
          typescript(basePlugins.tsConfig),
          babel(basePlugins.babel)
          // // !!isProd && terser({
          //   toplevel: true,
          //   output: {
          //     ascii_only: true,
          //     comments: RegExp(`${pkg.name}`) // 排除所有不含 pkg.name 的 banner
          //   },
          //   compress: {
          //     drop_console: true,
          //     pure_funcs: ['Math.floor']
          //   },
          // })
        ],
        react: [
          ...basePlugins.preConfig,
          typescript(basePlugins.tsConfig),
          ...basePlugins.postConfig,
          babel({
            ...basePlugins.babel,
            presets: [basePlugins.babelPreset, ['@babel/preset-react']]
          })
        ]
      }
      const unpkgPlugins = unpkgPluginsMap[sourceFormat] || []
      const unpkgConfig = {
        ...baseConfig,
        plugins: [
          ...basePlugins.preBase,
          ...unpkgPlugins,
          ...basePlugins.postBase
        ]
      }
      return unpkgConfig
    }
  }

  const pkgDeps = pkg.dependencies
    ? Object.keys(pkg.dependencies).map((d) => toString(d))
    : []

  const rollupConfigRes = strukConfig.output.format.reduce((acc, format) => {
    const { external = [], isolateDep } =
      strukConfig.formatConfig?.[format] ?? {}
    const externals = isolateDep ? pkgDeps.concat(external) : external
    const configRes = mapFormatToConfig(format, sourceFormat)
    const config = {
      ...configRes,
      output: {
        ...strukConfig.output,
        file: `${strukConfig.output.directory}/${strukConfig.output.name}${
          formatMapping[format] ? `${formatMapping[format]}` : ''
        }`,
        format,
        sourcemap: isProd,
        compact: format !== 'es',
        exports: format === 'es' ? 'named' : 'auto',
        globals
      },
      external: [...new Set(externals)]
    }

    tempProperty.forEach((property) => {
      if (Object.prototype.hasOwnProperty.call(config, property)) {
        delete config[property]
      }
      if (Object.prototype.hasOwnProperty.call(config.output, 'directory')) {
        delete config.output.directory
      }
    })

    return [...acc, config]
  }, [])

  return rollupConfigRes
}
