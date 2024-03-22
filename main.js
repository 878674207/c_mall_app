import Vue from 'vue'
import App from './App'
import store from './store' // store
import plugins from './plugins' // plugins
import './permission' // permission
import uView from '@/uni_modules/uview-ui'
// 全局混入  使用时需要注意命名 不能太过简单 否者会和页面其他字段重名
import { commonMixins } from './mixins/index.js'
Vue.use(uView)
Vue.mixin(commonMixins)
Vue.use(plugins)

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()
