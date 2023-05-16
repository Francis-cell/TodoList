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
  }
})
