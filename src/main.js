import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import 'default-passive-events'
import store from './store/store'
import axiosAPI from './api/index'
import VueCookies from "vue-cookies";

Vue.use(Element);
Vue.config.productionTip = false
Vue.config.$axios = Axios
Vue.prototype.commAPI=axiosAPI
Vue.use(VueCookies);
// Axios.defaults.baseURL = '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/json';

console.log(process.env)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
