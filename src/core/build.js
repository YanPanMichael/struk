const fs = require('fs')
const ora = require('ora')
const shell = require('shelljs')
const rollup = require('rollup')
const terser = require('terser')
const rimraf = require('rimraf');

const pkgLoader = require('../loader/pkg-loader')
const configLoader = require('../loader/config-loader')
const formatMapping = require('../core/format-mapping')
const rollupConfigGenerator = require('../core/rollup-config-generator')

module.exports = async (cliConfig) => {
  const pkg = pkgLoader()
  const bbuilderConfig = configLoader(process.cwd(), pkg, cliConfig)
  const rollupConfigs = rollupConfigGenerator(bbuilderConfig, pkg, formatMapping, cliConfig)

  rimraf(bbuilderConfig.output.directory, async (rimErr) => {
    if (rimErr) {
      console.error(`\n` + 'rimraf error: ' + rimErr)
      shell.exit(1)
      return;
    }

    if (cliConfig.debug) {
      console.log('\npkg: ', pkg)
      console.log('\nbbuilderConfig: ', bbuilderConfig)
      console.log('\nrollupConfigs: ', rollupConfigs)
    }

    if (!fs.existsSync(bbuilderConfig.output.directory)) fs.mkdirSync(bbuilderConfig.output.directory)

    const isProd = process.env.NODE_ENV === 'production';

    for (const config of rollupConfigs) {
      const spinner = ora(`📦 [${config.output.format}] ${bbuilderConfig.input} → ${config.output.file}.js \n`).start()

      try {
        const bundle = await rollup.rollup(config)
        const { output: [{ code }] } = await bundle.generate(config.output)
        try {
          fs.writeFileSync(`${config.output.file}.js`, code)
        } catch (err) {
          console.error('\n', err)
        }

        // minimize
        if (isProd) {
          const minimizeRes = await terser.minify(code, {
            // sourceMap: true,
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

          try {
            fs.writeFileSync(`${config.output.file}.min.js`, minimizeCode)
          } catch (err) {
            console.error('\n', err)
          }
        }
      } catch (e) {
        console.error(`\n` + e)
        spinner.fail()
        shell.exit(1)
      }

      spinner.succeed()
    }
  })
}
