/*
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:30:54
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 10:44:01
 */ 
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    count:0,
    account:'',
    token:''
  },
  mutations: {
    addCount(state){
      state.count++;
    },
    setAccountFun(state,account){
      state.account=account
    },
    setTokenFun(state,token){
      state.token=token
    }
  },
  actions: {
    add(){
      this.commit("addCount");
    },
    setAccount(state,account){
      this.commit("setAccountFun",account)
    },
    setToken(state,token){
      this.commit("setTokenFun",token)
    }
  },
  modules: {
  }
})
