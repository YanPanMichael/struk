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
const isProd = require('../utils/index').isProd();

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

    for (const config of rollupConfigs) {
      const spinner = ora(`📦 [${config.output.format}] ${bbuilderConfig.input} → ${config.output.file}.js \n`).start()

      try {
        const bundle = await rollup.rollup(config)
        const { output: [{ code, map }] } = await bundle.generate(config.output)
        // await bundle.write(config.output)
        fs.writeFileSync(`${config.output.file}.js`, code)

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
