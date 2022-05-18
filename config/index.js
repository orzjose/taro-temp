/* eslint-disable import/no-commonjs */
const path = require('path')
const fs = require('fs-extra')

const { version } = fs.readJSONSync('./package.json')

const config = {
  projectName: '<%= projectName %>',
  date: '<%= date %>',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    VERSION: JSON.stringify(version),
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src')
  },
  copy: {
    patterns: [
      {
        from: 'node_modules/@lx-frontend/wxapp-lui/dist/',
        to: 'src/assets/wxapp-lui/'
      }
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    // miniCssExtractPluginOption: {
    //   ignoreOrder: true
    // },
    imageUrlLoaderOption: {
      limit: 20000
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          overrideBrowserslist: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/^.weui-.*?$/]
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    compile: {
      include: [
        path.resolve(__dirname, '..', 'node_modules/lodash/'),
      ],
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.RUN_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
