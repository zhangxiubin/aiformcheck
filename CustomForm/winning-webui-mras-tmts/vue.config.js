const TerserPlugin = require('terser-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // config.resolve.alias
    //   .set('@', resolve('./src'))
    //   .set('@demo', resolve('./demo'))
    //   .set('@pkg', resolve('./packages'))

    config.externals({
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT',
      echarts: 'echarts'
    })

    config
      .optimization
      .minimizer('terser')
      .use(
        TerserPlugin,
        [
          {
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log']
              }
            }
          }
        ]
      )
  },
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PUBLIC_PATH,
        changeOrigin: true
      }
    },
    client: {
      overlay: false
    }
  }
})
