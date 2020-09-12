<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 23:48:23
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
        <div class="login_continer" ref="tabCon">
          <div class="login_login login_tab">
            <img src="../../assets/mylogo.png" width="150px" />
            <div class="label">即时通信</div>
            <input id="account" placeholder="请输入账号" v-model="account" />
            <input type="password" placeholder="请输入密码" id="password" v-model="password" />
            <button class="primary" @click="login()">登录</button>
            <button @click="changeTab(1)">新用户注册</button>
            <button @click="changeTab(2)">第三方登录</button>
          </div>
          <div class="login_register login_tab">
            <div class="label">新用户注册</div>
            <input id="raccount" v-model="raccount" placeholder="请输入账号" />
            <input type="password" id="rpassword" v-model="rpassword" placeholder="请输入密码" />
            <input id="rusername" v-model="rusername" placeholder="请输入昵称" />
            <button class="primary" @click="register()">注册</button>
            <button @click="changeTab(0)">返回登录</button>
          </div>
          <div class="login_register login_tab">
            <div class="label">第三方登录</div>
            <div class="label">暂时无法登录</div>
            <button @click="tpto()" class="primary">访问官网</button>
            <button @click="changeTab(0)">返回登录</button>
          </div>
          <div class="login_login login_tab">
            <img src="../../assets/mylogo.png" width="150px" />
            <div class="label">即时通信</div>
            <div class="label">{{tishi}}</div>
            <button @click="changeTab(0)">返回登录</button>
            <button @click="changeTab(1)">新用户注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function checks(t) {
  var szMsg = `# _%&'/",;:=!^+-*!(){}[].@$|_`;
  var alertStr = false;
  for (let i = 0; i < szMsg.length; i++) {
    if (t.includes(szMsg[i])) {
      alertStr = true;
      break;
    }
  }
  return alertStr;
}
export default {
  name: "home",
  components: {},
  mounted: function () {
    var $this = this;
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
      tishi: "",
    };
  },
  methods: {
    tpto:function(){
      this.$router.push('/page')
    },
    changeTab: function (num) {
      this.$refs.tabCon.style.left = "-" + 450 * num + "px";
    },
    login: function () {
      var $this = this;
      if (checks($this.raccount)){
        $this.tishi = "登录失败，账号或密码错误";
        $this.changeTab(3);
        return
      }
      if (checks($this.password)){
        $this.tishi = "登录失败，账号或密码错误";
        $this.changeTab(3);
        return
      }
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/login",
          {
            account: this.account,
            password: this.password,
          }
        )
        .then(function (response) {
          if (response.data.iflogin == "yes") {
            $this.$store.dispatch("setToken", response.data.token);
            $this.$store.dispatch("setAccount", response.data.account);

            localStorage.setItem("myimToken", response.data.token);
            localStorage.setItem("myimAccount", response.data.account);
            localStorage.setItem("myimUsername", response.data.username);
            localStorage.setItem("myimLogo", response.data.logo);

            $this.$router.push("/chat");
          } else {
            $this.tishi = "登录失败，账号或密码错误";
            $this.changeTab(3);
          }
        })
        .catch(function () {
          $this.tishi = "登录失败，账号或密码错误";
          $this.changeTab(3);
        });
    },
    register: function () {
      var $this = this;
      if (checks($this.raccount)){
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount="";
        $this.rpassword="";
        $this.rusername="";
        return
      }
      if (checks($this.rpassword)){
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount="";
        $this.rpassword="";
        $this.rusername="";
        return
      }
      if (checks($this.rusername)){
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount="";
        $this.rpassword="";
        $this.rusername="";
        return
      }
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
              
              $this.tishi = "注册成功，点击下方按钮返回登录";
              $this.changeTab(3);
            } else {
              $this.tishi = "注册失败，账号已被注册";
              $this.changeTab(3);
            }
          })
          .catch(function () {
            $this.tishi = "注册失败，账号已被注册";
            $this.changeTab(3);
          });
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/login.css";
</style>