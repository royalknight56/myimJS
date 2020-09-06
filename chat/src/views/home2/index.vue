<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-01 11:15:00
--> 
<template>
  <div class="login">
    <div class="bg"></div>
    <div class="login_outer">
      <div class="row-div" style="width: 100%;height: 10px;">
        <div style="width: 190px; height: 100%; background-color: rgb(0, 110, 255);"></div>
        <div style="width: 160px; height: 100%; background-color: rgb(0, 164, 255);"></div>
        <div style="width: 100px; height: 100%; background-color: rgb(90, 213, 224);"></div>
      </div>
      <div class="login_inner_width">
        <div class="login_continer" ref='tabCon'>
          <div class="login_login login_tab">
            <img src="../../assets/mylogo.png" width="150px">
            <div class="label">即时通信</div>
            <!-- <input id="account" placeholder="请输入账号" v-model="account" />
            <input type="password" placeholder="请输入密码" id="password" v-model="password" /> -->
            <button class="primary">访问官网</button>
            <!-- <button @click="changeTab(1)">新用户注册</button> -->
            <button @click="changeTab(2)">第三方登录</button>
          </div>
          <div class="login_register login_tab">
            <div class="label">新用户注册</div>
            <div class="label">暂时无法注册</div>
            <!-- <input id="raccount" v-model="raccount" placeholder="请输入账号" />
            <input type="password" id="rpassword" v-model="rpassword" placeholder="请输入密码" />
            <input id="rusername" v-model="rusername" placeholder="请输入昵称" />
            <button class="primary" @click="register()">注册</button> -->
            <button @click="changeTab(0)">返回登录</button>
          </div>
          <div class="login_register login_tab">
            <div class="label">第三方登录</div>
            <button @click="login()">咨询客服</button>
            <button @click="changeTab(0)">主页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home2",
  components: {},
  mounted: function () {
    //被嵌入时执行
    if(window.self !== window.top){
      document.getElementsByClassName('bg')[0].style.display='none'
    }
    
    var $this = this;
    this.changeTab(2)
    this.axios
      .post(
        "http://" +
          process.env.VUE_APP_API +
          ":" +
          process.env.VUE_APP_API_REQ +
          "/autoLogin",
        {
          account: localStorage.getItem("myimAccount"),
          token: localStorage.getItem("myimToken"),
        }
      )
      .then(function (response) {
        if (response.data.state) {
          $this.$store.dispatch("setAccount", response.data.account);
          $this.$store.dispatch("setToken", response.data.token);
          localStorage.setItem("myimUsername", response.data.username);
          localStorage.setItem("myimLogo", response.data.logo);
          $this.$router.push("/chat");
        }
      })
      .catch(function () {});
  },
  data: function () {
    return {
      account: "",
      password: "",
      raccount: "",
      rpassword: "",
      rusername: "",
    };
  },
  methods: {
    changeTab: function (num) {
      this.$refs.tabCon.style.left='-'+450*num+'px'
    },
    login: function () {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/phonelogin",
            {
            account:'te'
          }
        )
        .then(function (response) {
          if (response.data.iflogin == "yes") {
            $this.$store.dispatch("setAccount", response.data.account);
            $this.$store.dispatch("setToken", response.data.token);

            localStorage.setItem("myimToken", response.data.token);
            localStorage.setItem("myimAccount", response.data.account);
            localStorage.setItem("myimUsername", response.data.username);
            localStorage.setItem("myimLogo", response.data.logo);

            $this.$router.push("/chat");
          }
        })
        .catch(function () {});
    },
    register: function () {
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/register",
          {
            account: this.raccount,
            password: this.rpassword,
            username: this.rusername,
          }
        )
        .then(function (response) {
          if (response.data.state) {
            localStorage.setItem("myimAccount", response.data.account);
            localStorage.setItem("myimToken", response.data.token);
            localStorage.setItem("myimUsername", response.data.username);
            localStorage.setItem("myimLogo", response.data.logo);
          }
        })
        .catch(function () {});
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/login.css";
</style>