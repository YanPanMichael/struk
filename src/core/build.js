const fs = require('fs')
const ora = require('ora')
const shell = require('shelljs')
const rollup = require('rollup')
const terser = require('terser')

const pkgLoader = require('../loader/pkg-loader')
const configLoader = require('../loader/config-loader')
const formatMapping = require('../core/format-mapping')
const rollupConfigGenerator = require('../core/rollup-config-generator')

module.exports = async (cliConfig) => {
  const pkg = pkgLoader()
  const bbuilderConfig = configLoader(process.cwd(), pkg, cliConfig)
  const rollupConfigs = rollupConfigGenerator(bbuilderConfig, pkg, formatMapping)

  if (cliConfig.debug) {
    console.log('\npkg: ', pkg)
    console.log('\nbbuilderConfig: ', bbuilderConfig)
    console.log('\nrollupConfigs: ', rollupConfigs)
  }

  if (!fs.existsSync(bbuilderConfig.output.directory)) fs.mkdirSync(bbuilderConfig.output.directory)

  for (const config of rollupConfigs) {
    const spinner = ora(`📦 [${config.output.format}] ${bbuilderConfig.input} → ${config.output.file}.js`).start()

    try {
      const bundle = await rollup.rollup(config)
      const { output: [{ code }] } = await bundle.generate(config.output)
      fs.writeFile(`${config.output.file}.js`, code, (err) => {
        if (err) console.error(err)
      })

      // minimize
      const minimizeRes = await terser.minify(code, {
        // sourceMap: true,
        toplevel: true,
        output: {
          ascii_only: true,
        },
        compress: {
          drop_console: true,
          pure_funcs: [ 'Math.floor' ]
        },
      });
      const minimizeCode = (bbuilderConfig.output.banner ? bbuilderConfig.output.banner + '\n' : '') + minimizeRes.code;

      fs.writeFile(`${config.output.file}.min.js`, minimizeCode, (err) => {
        if (err) console.error(err)
      })
    } catch (e) {
      console.error(`\n` + e)
      shell.exit(1)
    }

    spinner.succeed()
  }
}
