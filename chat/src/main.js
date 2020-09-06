/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:18:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 22:25:02
 */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
Vue.prototype.$store=store;
if (process.env.VUE_APP_IFDEV == "true") {
  // console.log=function(){};
}
