<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-30 18:24:38
--> 
<template>
<div>
    home<br>
    <input id="account" v-model="account" /><br>
    <input id="password" v-model="password" /><br>
    <button @click="login()">Login</button><br>
    register<br>
    <input id="raccount" v-model="raccount" placeholder="account" /><br>
    <input id="rpassword" v-model="rpassword" placeholder="password" /><br>
    <input id="rusername" v-model="rusername"  placeholder="username"/><br>
    <button @click="register()">register</button><br>

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
      raccount: "",
      rpassword: "",
      rusername:'',
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
    register: function () {
      this.axios
        .post("http://"+process.env.VUE_APP_API+":"+process.env.VUE_APP_API_REQ+"/register", {
          account: this.raccount,
          password: this.rpassword,
          username: this.rusername,
        })
        .then(function (response) {
          if(response.data.state){
            console.log('注册成功')
            localStorage.setItem("myimAccount", response.data.account);
            localStorage.setItem("myimToken", response.data.token);
          }else{
            console.log('注册失败')
          }
          
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>
