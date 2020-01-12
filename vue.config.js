/* eslint-disable no-template-curly-in-string */
module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.example.app',
        win: {
          icon: 'build/icons/icon.ico'
        },
        asar: false,
        nsis: {
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true
        }
      }
    }
  },
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        prependData: `@import "~@/styles/global-variables.scss"`
      },
      // for scss files
      scss: {
        prependData: `@import "~@/styles/global-variables.scss";`
      }
    }
  }
}
