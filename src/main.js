import { createApp } from 'vue'
import App from './App.vue'
import "./styles/styles.css"
import SvgIcon from './components/UtilsComponents/SvgIcon'


// 注册到全局
createApp().component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./assets/images/svg', false, /\.svg$/)
requireAll(req)

createApp(App).mount('#app')
