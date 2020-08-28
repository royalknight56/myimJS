/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:13:32
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-14 14:32:05
 */ 
// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  
  configureWebpack: {
    
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  chainWebpack: config => {
    // 删除懒加载模块的 prefetch preload，降低带宽压力
    config.plugins
      .delete('prefetch')
      .delete('preload')

    // 修复热更新
    config.resolve
      .symlinks(true)

    // 添加别名
    config.resolve.alias
      .set('@theme', resolve(`src/assets/styles/theme/${process.env.VUE_APP_THEME}`))

  },
  devServer: {
    open: true,  // npm run serve后自动打开页面
    host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
    port: 8080, // 开发服务器运行端口号
	},
}
