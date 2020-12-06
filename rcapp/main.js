import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import http from './components/untils/http.js'
Vue.prototype.$http=http
Vue.prototype.$imgUrl='https://humanresource.runfkj.com/'
// Vue.prototype.$imgUrl='http://192.168.0.105:3326/'

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
