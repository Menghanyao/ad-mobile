import Vue from 'vue'
import App from './App'
import store from './pages/store/index'

Vue.config.productionTip = false

Vue.prototype.$serverUrl = 'https://unidemo.dcloud.net.cn';
Vue.prototype.$store = store;

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()