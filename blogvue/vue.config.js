const path = require('path')
const BundleAanlyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
  outputDir: 'vuespa',
  configureWebpack: {
    resolve: {
      alias: {
        "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./src/plugins/icons.js")
      }
    },
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            },
          ]
        }
      ]
    },
    plugins: [
      new BundleAanlyzerPlugin(),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true
      })
    ]
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
