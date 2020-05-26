const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  outputDir: 'vuespa',
  chainWebpack: config => {
    // config.module
    //   .rule('scss')
    //   .test('/\.scss$/')
    //   .use('MiniCssExtractPlugin.loader')
    //   .loader(MiniCssExtractPlugin.loader)

    // config
    //   .plugin('')
    //     .use(
    //       new MiniCssExtractPlugin({
    //         filename: '[name]_[contenthash:8].css'
    //       })
    //     )
    //     .end()
  },
  devServer: {
    proxy: {
      '/api': { // 以/api开头的接口都代理到target指定的域名下
        target: 'https://immortalboy.cn'
      }
    }
  }
}
