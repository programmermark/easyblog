const path = require('path')
const BundleAanlyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {
  outputDir: 'vuespa',
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return {
        resolve: {
          alias: {
            "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/plugins/icons.js")
          }
        },
        module: {
          rules: []
        },
        plugins: [
          new ImageminPlugin({
            test: /\.(gif|png|jpe?g|svg)$/i,
            disable: false, // Disable during development
            pngquant: {
              quality: '80-90'
            }
          })
        ],
        externals: {
          'vue': 'Vue',
          'axios': 'axios',
          'marked': 'marked',
          'vue-router': 'VueRouter',
          'ant-design-vue': 'antd',
          'moment': 'moment',
          'highlight.js': 'hljs'
        }
      }
    } else {
      return {
        resolve: {
          alias: {
            "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/plugins/icons.js")
          }
        },
        module: {
          rules: []
        },
        plugins: [
          new BundleAanlyzerPlugin()
        ],
        externals: {
          'vue': 'Vue',
          'axios': 'axios',
          'marked': 'marked',
          'vue-router': 'VueRouter',
          'ant-design-vue': 'antd',
          'moment': 'moment',
          'highlight.js': 'hljs'
        }
      }
    }
  },
  productionSourceMap: false, // 关闭生产环境sourcemap
  devServer: {
    proxy: {
      '/api': { // 以/api开头的接口都代理到target指定的域名下
        target: 'https://immortalboy.cn'
      }
    }
  }
}
