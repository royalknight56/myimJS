<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 22:21:33
--> 
<template>
<div>
    home
    <input id="account" v-model="account" />
    <input id="password" v-model="password" />
    <button @click="login()">Login</button>

    <home-tool></home-tool>
</div>
</template>

<script>
import homeTool from './components/tool';
export default {
  name: 'home',
  components:{
    homeTool
  },
  mounted:function(){
    var $this=this;
      this.axios
        .post("http://"+process.env.VUE_APP_API+":"+process.env.VUE_APP_API_REQ+"/autoLogin", {
          account: localStorage.getItem("myimAccount"),
          token: localStorage.getItem("myimToken")
        })
        .then(function (response) {
          if(response.data.state){
            $this.$store.dispatch("setAccount",response.data.account)
            $this.$store.dispatch("setToken",response.data.token)
            $this.$router.push(
              "/chat"
            );
          }else{
            console.log('自动登录失败')
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
  },
  data: function () {
    return {
      account: "admin",
      password: "admin",
    };
  },
  methods:{
    login: function () {
      var $this=this;
      this.axios
        .post("http://"+process.env.VUE_APP_API+":"+process.env.VUE_APP_API_REQ+"/login", {
          account: this.account,
          password: this.password,
        })
        .then(function (response) {
          if(response.data.iflogin=='yes'){
            $this.$store.dispatch("setAccount",response.data.account)
            $this.$store.dispatch("setToken",response.data.token)
            localStorage.setItem("myimToken", response.data.token);
            localStorage.setItem("myimAccount", response.data.account);
            $this.$router.push(
              "/chat"
            );
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  }
}
</script>
