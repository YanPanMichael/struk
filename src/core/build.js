const fs = require('fs')
const ora = require('ora')
const shell = require('shelljs')
const rollup = require('rollup')
const terser = require('terser')
const rimraf = require('rimraf');
const path = require("path");

const pkgLoader = require('../loader/pkg-loader')
const configLoader = require('../loader/config-loader')
const formatMapping = require('../core/format-mapping')
const rollupConfigGenerator = require('../core/rollup-config-generator')
const isProd = require('../utils/index').isProd();

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

module.exports = async (cliConfig, custumConfig) => {
  const pkg = pkgLoader()
  const bbuilderConfig = configLoader(process.cwd(), pkg, cliConfig, custumConfig)
  const rollupConfigs = rollupConfigGenerator(bbuilderConfig, pkg, formatMapping, cliConfig)

  rimraf(bbuilderConfig.output.directory, async (rimErr) => {
    if (rimErr) {
      console.error(`\n` + 'rimraf error: ' + rimErr)
      shell.exit(1)
    }

    if (cliConfig.debug) {
      console.log('\npkg: ', pkg)
      console.log('\nbbuilderConfig: ', bbuilderConfig)
      console.log('\nrollupConfigs: ', rollupConfigs)
    }

    if (!fs.existsSync(bbuilderConfig.output.directory)) fs.mkdirSync(bbuilderConfig.output.directory)

    let firstMark = false;
    for (const config of rollupConfigs) {
      const spinner = ora(`📦 [${config.output.format}] ${bbuilderConfig.input} → ${config.output.file}.js \n`).start()

      try {
        const bundle = await rollup.rollup(config)
        const { output: [{ code, map }, ...extendMapI]} = await bundle.generate(config.output)
        // await bundle.write(config.output) // 默认写入方法
        fs.writeFileSync(`${config.output.file}.js`, code)
        if (!firstMark && bbuilderConfig.styleExtract && extendMapI && extendMapI.length) {
          const [{ fileName: styleDir, source: styleSource }] = extendMapI
          firstMark = true
          ensureDirectoryExistence(styleDir)
          fs.writeFileSync(path.resolve(styleDir), styleSource)
        }

        // minimize
        if (isProd) {
          const minimizeRes = await terser.minify(code, {
            toplevel: true,
            output: {
              ascii_only: true,
              comments: RegExp(`${pkg.name}`) // 排除所有不含 pkg.name 的 banner
            },
            compress: {
              drop_console: true,
              pure_funcs: ['Math.floor']
            },
          });
          const minimizeCode = minimizeRes?.code || '';

          fs.writeFileSync(`${config.output.file}.min.js`, minimizeCode)
          if (!!config.output.sourcemap && !!map) {
            fs.writeFileSync(`${config.output.file}.min.js.map`, JSON.stringify(map))
          }
        }
      } catch (e) {
        spinner.fail('Oops, Packing error!!')
        console.error(`\n` + e.stack)
        shell.exit(1)
      }
      spinner.succeed('Construction complete!!')
    }
    shell.exit(0)
  })
}
