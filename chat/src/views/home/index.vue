<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-24 19:04:40
--> 
<template>
  <div class="login">
    <div class="bg"></div>
    <div class="login_outer">
      <div class="row-div" style="width: 100%; height: 10px">
        <div
          style="width: 190px; height: 100%; background-color: rgb(0, 110, 255)"
        ></div>
        <div
          style="width: 160px; height: 100%; background-color: rgb(0, 164, 255)"
        ></div>
        <div
          style="
            width: 100px;
            height: 100%;
            background-color: rgb(90, 213, 224);
          "
        ></div>
      </div>
      <div class="login_inner_width">
        <div class="login_continer" ref="tabCon">
          <div class="login_login login_tab">
            <img src="../../assets/mylogo.png" width="150px" />
            <div class="label">即时通信</div>
            <input id="account" placeholder="请输入账号" v-model="account" />
            <input
              type="password"
              placeholder="请输入密码"
              id="password"
              v-model="password"
            />
            <div v-if="!ifLocked">
              <div id="slider-box" onselectstart="return false;">
                <div class="slider-bgColor"></div>
                <div class="slider-txt">滑动解锁</div>
                <!--给i标签添加上相应字体图标的类名即可-->
                <div class="slider-slider">
                  <i class="iconfont icon-double-right"></i>
                </div>
              </div>
            </div>

            <button v-if="ifLocked" class="primary" @click="login()">登录</button>

            <button @click="changeTab(1)">新用户注册</button>
            <button @click="changeTab(2)">第三方登录</button>
          </div>
          <div class="login_register login_tab">
            <div class="label">新用户注册</div>
            <input id="raccount" v-model="raccount" placeholder="请输入账号" />
            <input
              type="password"
              id="rpassword"
              v-model="rpassword"
              placeholder="请输入密码"
            />
            <input
              id="rusername"
              v-model="rusername"
              placeholder="请输入昵称"
            />
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
            <div class="label">{{ tishi }}</div>
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
    /*
     * @Descripttion:
     * @version:
     * @Author: sueRimn
     * @Date: 2020-05-10 21:57:47
     * @LastEditors: sueRimn
     * @LastEditTime: 2020-05-10 21:58:29
     */
    //一、定义了一个获取元素的方法
    function getEle(selector) {
      return document.querySelector(selector);
    }
    //二、获取到需要用到的DOM元素
    var box = getEle("#slider-box"), //容器
      bgColor = getEle(".slider-bgColor"), //背景色
      txt = getEle(".slider-txt"), //文本
      slider = getEle(".slider-slider"), //滑块
      icon = getEle(".slider-slider>i"),
      successMoveDistance = box.offsetWidth - slider.offsetWidth, //解锁需要滑动的距离
      downX, //用于存放鼠标按下时的位置
      isSuccess = false; //是否解锁成功的标志，默认不成功

    //三、给滑块添加鼠标按下事件
    slider.onmousedown = mousedownHandler;

    //3.1鼠标按下事件的方法实现
    function mousedownHandler(e) {
      bgColor.style.transition = "";
      slider.style.transition = "";
      e = e || window.event || e.which;
      downX = e.clientX;
      //在鼠标按下时，分别给鼠标添加移动和松开事件
      document.onmousemove = mousemoveHandler;
      document.onmouseup = mouseupHandler;
    }

    //四、定义一个获取鼠标当前需要移动多少距离的方法
    function getOffsetX(offset, min, max) {
      if (offset < min) {
        offset = min;
      } else if (offset > max) {
        offset = max;
      }
      return offset;
    }

    //3.1.1鼠标移动事件的方法实现
    function mousemoveHandler(e) {
      e = e || window.event || e.which;
      var moveX = e.clientX;
      var offsetX = getOffsetX(moveX - downX, 0, successMoveDistance);
      bgColor.style.width = offsetX + "px";
      slider.style.left = offsetX + "px";

      if (offsetX == successMoveDistance) {
        success();
      }
      //如果不设置滑块滑动时会出现问题（目前还不知道为什么）
      e.preventDefault();
    }

    //3.1.2鼠标松开事件的方法实现
    function mouseupHandler() {
      if (!isSuccess) {
        bgColor.style.width = 0 + "px";
        slider.style.left = 0 + "px";
        bgColor.style.transition = "width 0.8s linear";
        slider.style.transition = "left 0.8s linear";
      }
      document.onmousemove = null;
      document.onmouseup = null;
    }

    //五、定义一个滑块解锁成功的方法
    function success() {
      isSuccess = true;
      txt.innerHTML = "解锁成功";
      bgColor.style.backgroundColor = "lightgreen";
      slider.className = "slider active";
      icon.className = "iconfont icon-xuanzhong";
      //滑动成功时，移除鼠标按下事件和鼠标移动事件
      $this.ifLocked=true
      slider.onmousedown = null;
      document.onmousemove = null;
    }
  },
  data: function () {
    return {
      account: "",
      password: "",
      raccount: "",
      rpassword: "",
      rusername: "",
      tishi: "",
      ifLocked:false
    };
  },
  methods: {
    tpto: function () {
      this.$router.push("/page");
    },
    changeTab: function (num) {
      this.$refs.tabCon.style.left = "-" + 450 * num + "px";
    },
    login: function () {
      var $this = this;
      if (checks($this.raccount)) {
        $this.tishi = "登录失败，账号或密码错误";
        $this.changeTab(3);
        return;
      }
      if (checks($this.password)) {
        $this.tishi = "登录失败，账号或密码错误";
        $this.changeTab(3);
        return;
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
      if (checks($this.raccount)) {
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount = "";
        $this.rpassword = "";
        $this.rusername = "";
        return;
      }
      if (checks($this.rpassword)) {
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount = "";
        $this.rpassword = "";
        $this.rusername = "";
        return;
      }
      if (checks($this.rusername)) {
        $this.tishi = "注册失败，请不要包含非法字符";
        $this.changeTab(3);
        $this.raccount = "";
        $this.rpassword = "";
        $this.rusername = "";
        return;
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