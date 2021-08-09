const path = require('path')

function resolveNodeModules(module) {
  return path.join(__dirname, 'node_modules', module)
}

/**
 * Babel@7 配置
 */
module.exports = {
  presets: [
    [resolveNodeModules('@babel/preset-env'), {
      'targets': {
        'browsers': ['last 3 versions', '> 2%', 'ie >= 9', 'Firefox >= 30', 'Chrome >= 30']
      },
      'modules': false,
      'loose': true,
      'shippedProposals': true
    }]
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ],
    [
      "@babel/transform-runtime",
      {
        "corejs": 2,
        "helpers": true,
        "regenerator": true
      }
    ]
  ],
  exclude: 'node_modules/**'
}
