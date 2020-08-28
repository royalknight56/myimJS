<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 20:10:40
--> 
<template>
<div>
    home-Route
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
    this.$store.dispatch("add")
  },
  data: function () {
    return {
      account: "",
      password: "",
    };
  },
  methods:{
    login: function () {
      var $this=this;
      this.axios
        .post("http://127.0.0.1:8080/login", {
          account: this.account,
          password: this.password,
        })
        .then(function (response) {
          if(response.data.iflogin=='yes'){
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
