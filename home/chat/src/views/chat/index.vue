<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-30 18:26:25
--> 
<template>
  <div>
    <input v-model="addFriendAccount" />
    <button @click="addFriend()">addfr</button>
    <br />
    <input v-model="delFriendAccount" />
    <button @click="deletefun()">del</button>
    <br />
    <button @click="logout()">logout</button>
    <br />
    Chat:::{{account}}
    <br />---------friendList
    <br />
    <div
      v-for="item in friendList"
      v-bind:key="item.account"
      @click="getMessageWith(item.account)"
    >{{item.username}}-- {{item.account}}</div>
    <br />---------message
    <div>
      <div v-for="(item,index) in messageList" :key="index">
        {{item.time | timeform}}
        <br />
        {{item.from}}
        <br />
        <div v-if="item.message.type=='img'">
          <img :src="item.message.img"/>
        </div>
        <div v-if="item.message.type=='txt'">{{item.message.txt}}</div>
        <br />
      </div>
    </div>---------requerst
    <div v-for="(item,index) in friendReq" :key="index">
      <div v-if="item.from!=account">
        <div v-if="item.pendding!='reject'">
          {{item.from}}
          <br />
          {{item.to}}
          <br />
          {{item.pendding}}
          <br />
          <div v-if="item.pendding=='pendding'">
            <button @click="acceptFriend(item.from,item.to)">accept</button>
            <button @click="rejectFriend(item.from,item.to)">reject</button>
          </div>
          <!-- <div v-else-if="item.pendding=='reject'">
          <button @click="confirmFriend(item.from,item.to)">confirm</button>
          </div>-->
        </div>
      </div>
      <div v-else>
        {{item.to}}
        <br />
        {{item.pendding}}
        <br />
        <div v-if="item.pendding=='pendding'">waiting</div>
        <div v-else-if="item.pendding=='reject'">
          <button @click="confirmFriend(item.from,item.to)">confirm</button>
        </div>
      </div>
    </div>
    <br />
    <input v-model="typing" />
    <button @click="sendMessage()">send</button>
    <input accept="image/jpeg, image/jpg, image/png" id="filetest" type="file" />
    <button @click="sendImg()">send</button>
  </div>
</template>

<script>
var ws;
export default {
  name: "chat",
  data: function () {
    return {
      friendList: [{ name: "" }],
      messageList: [],
      friendReq: [],
      chosenFriend: "",
      typing: "typing",
      account: "",
      addFriendAccount: "super",
      delFriendAccount: "super",
    };
  },
  filters: {
    timeform: function (value) {
      var time = new Date(value);
      time =
        time.getFullYear() +
        "-" +
        (time.getMonth() + 1) +
        "-" +
        time.getDate() +
        " " +
        time.getHours() +
        ":" +
        time.getMinutes() +
        ":" +
        time.getSeconds();
      return time;
    },
  },
  mounted: function () {
    this.account = this.$store.state.account;
    var $this = this;

    ws = new WebSocket(
      "ws://" + process.env.VUE_APP_API + ":" + process.env.VUE_APP_API_WEBS
    );
    ws.onopen = function () {
      var sendBuffer = JSON.stringify({
        type: "auth",
        token: $this.$store.state.token,
        account: $this.$store.state.account,
      });
      ws.send(sendBuffer);
    };
    ws.onclose = function () {
      console.log("被关闭");
    };
    ws.onmessage = function (e) {
      var rec = JSON.parse(e.data);
      if (rec.type == "message") {
        if (rec.from == $this.chosenFriend) {
          if (rec.message.type == "txt") {
            $this.messageList.push({
              message: {
                type: "txt",
                txt: rec.message.txt,
              },
              from: rec.from,
              to: rec.to,
              time: rec.time,
              own: $this.$store.state.account,
              id: 0,
            });
          } else if (rec.message.type == "img") {
            $this.messageList.push({
              message: {
                type: "img",
                img:  rec.message.img,
              },
              from: $this.$store.state.account,
              to: $this.chosenFriend,
              time: new Date(),
              own: $this.$store.state.account,
              id: 0,
            });
          }
        } else {
          if (rec.message.type == "img") {
            console.log(rec)
            $this.messageList.push({
              message: {
                type: "img",
                img:  rec.message.img,
              },
              from: $this.$store.state.account,
              to: $this.chosenFriend,
              time: new Date(),
              own: $this.$store.state.account,
              id: 0,
            });
          }
          console.log("其他需提醒" + rec.from);
        }
      } else if (rec.type == "system") {
        if (rec.system.type == "friendRequest") {
          $this.friendReq.push({
            from: rec.system.from,
            to: rec.system.to,
          });
          console.log("好友请求");
        } else if (rec.system.type == "friendUpdate") {
          $this.getFriend();
          $this.getFriendRequest();
          console.log("好友列表更新");
        }
      }
    };
    this.getFriend();
    this.getFriendRequest();
  },
  methods: {
    getFriend: function () {
      var $this = this;
      this.axios
        .get(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/getFriend",
          {
            params: {
              token: $this.$store.state.token,
              account: $this.$store.state.account,
            },
          }
        )
        .then(function (response) {
          $this.friendList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    confirmFriend: function (from, to) {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/confirmFriend",
          {
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            from,
            to,
          }
        )
        .then(function (response) {
          $this.friendReq = response.data;
          $this.getFriendRequest();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getFriendRequest: function () {
      var $this = this;
      this.axios
        .get(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/getFriendRequest",
          {
            params: {
              token: $this.$store.state.token,
              account: $this.$store.state.account,
            },
          }
        )
        .then(function (response) {
          $this.friendReq = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    acceptFriend: function (from) {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/acceptFriend",
          {
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            from: from,
            to: $this.$store.state.account,
          }
        )
        .then(function () {})
        .catch(function (error) {
          console.log(error);
        });
    },
    rejectFriend: function (from) {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/rejectFriend",
          {
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            from: from,
            to: $this.$store.state.account,
          }
        )
        .then(function () {})
        .catch(function (error) {
          console.log(error);
        });
    },
    sendMessage: function () {
      var $this = this;
      if ($this.chosenFriend&&$this.chosenFriend!=$this.account) {
        ws.send(
          JSON.stringify({
            type: "message",
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            message: {
              type: "txt",
              txt: this.typing,
            },
            to: $this.chosenFriend,
            from: $this.$store.state.account,
          })
        );
        $this.messageList.push({
          message: {
            type: "txt",
            txt: this.typing,
          },
          from: $this.$store.state.account,
          to: $this.chosenFriend,
          time: new Date(),
          own: $this.$store.state.account,
          id: 0,
        });
        this.typing = "";
      }
    },
    sendImg: function () {
      var $this = this;
      console.log(document.getElementById("filetest").files[0]);
      // var imgFile = document.getElementById("filetest").files[0];
      var reader = new FileReader();
      reader.readAsBinaryString(document.getElementById("filetest").files[0]);
      // var imgUrlBase64 = reader.readAsDataURL(document.getElementById("filetest").files[0]);
      reader.onloadend = function () {
        if ($this.chosenFriend) {
          var postdata = {
            type: "message",
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            message: {
              type: "img",
              img: reader.result,
            },
            from: $this.$store.state.account,
            to: $this.chosenFriend,
          };
          $this.axios
            .post(
              "http://" +
                process.env.VUE_APP_API +
                ":" +
                process.env.VUE_APP_API_REQ +
                "/sendImg",
              postdata
            )
            .then(function () {})
            .catch(function (error) {
              console.log(error);
            });
        }
      };
    },
    deletefun: function () {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/deleteFriend",
          {
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            withWho: $this.delFriendAccount,
          }
        )
        .then(function () {})
        .catch(function (error) {
          console.log(error);
        });
    },
    addFriend: function () {
      var $this = this;
      this.axios
        .post(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/addFriend",
          {
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            withWho: $this.addFriendAccount,
          }
        )
        .then(function () {})
        .catch(function (error) {
          console.log(error);
        });
    },
    getMessageWith: function (withWho) {
      this.chosenFriend = withWho;
      var $this = this;
      this.axios
        .get(
          "http://" +
            process.env.VUE_APP_API +
            ":" +
            process.env.VUE_APP_API_REQ +
            "/getMessageWith",
          {
            params: {
              token: $this.$store.state.token,
              account: $this.$store.state.account,
              withWho: withWho,
            },
          }
        )
        .then(function (response) {
          console.log(response.data);
          $this.messageList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    logout: function () {
      localStorage.setItem("myimAccount", "0");
      localStorage.setItem("myimToken", "0");
      ws.close();
      this.$router.push("/home");
    },
  },
};
</script>
