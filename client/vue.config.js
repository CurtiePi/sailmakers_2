require('dotenv').config()
const { defineConfig } = require('@vue/cli-service')

const inferno_source = `inferno/dist/index.${process.env.NODE_ENV === 'dev' ? 'dev.' : ''}esm.js`

module.exports = defineConfig({       
    transpileDependencies: true,
})

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'inferno': inferno_source,
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: tag => tag.startsWith('picker-')
        }
      }))
  }
}
