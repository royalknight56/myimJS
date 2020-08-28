/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:18:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-16 15:45:49
 */ 
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
Vue.prototype.$store=store;
