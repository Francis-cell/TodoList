const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 配置禁止对大部分不是很重要规则的校验，避免代码无法运行
  lintOnSave: false,
  // 配置对本地node.js访问的权限，避免fs错误
  pluginOptions:{
    electronBuilder:{
      nodeIntegration:true
    }
  },
  // 配置对ico图片文件的支持
  module: {
    rules: [
      {
        test: /\.ico$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      }
    ]
  }
})
