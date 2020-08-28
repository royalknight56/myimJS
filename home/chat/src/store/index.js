/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:30:54
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-14 11:08:45
 */ 
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    count:0
  },
  mutations: {
    addCount(state){
      state.count++;
    }
  },
  actions: {
    add(){
      this.commit("addCount");
    }
  },
  modules: {
  }
})
