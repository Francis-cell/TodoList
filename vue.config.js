const { defineConfig } = require('@vue/cli-service')

const path = require('path')

function resolve (dir) {
    return path.join(__dirname, './', dir)
}

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
  chainWebpack: config => {
      // svg rule loader
      const svgRule = config.module.rule('svg') // 找到svg-loader
      svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
      svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
      svgRule // 添加svg新的loader处理
          .test(/\.svg$/)
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
              symbolId: 'icon-[name]',
          })

      // 修改images loader 添加svg处理
      const imagesRule = config.module.rule('images')
      imagesRule.exclude.add(resolve('src/assets/images'))
      config.module
          .rule('images')
          .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
})
