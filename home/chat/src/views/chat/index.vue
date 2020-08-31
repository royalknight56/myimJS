<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-31 19:50:06
--> 
<template>
  <div class="chat" :class="ifhidden?'chat_hidden':'chat_show'">
    <div class="power_on" @click="ifhidden=false"><i title="显示界面" class="fa fa-send" style="font-size:24px;color:#FFF"></i></div>
    <div class="bg"></div>
    <div class="idialog" v-if="dialogShow!='none'">
      <div v-if="dialogShow=='addFriend'">
        <div class="dialog_h1">添加好友</div>
        <input v-model="addFriendAccount" placeholder="在此输入账号" />
        <button class="confirm" @click="addFriend();dialogShow='none'">确认</button>
        <button class="cancel" @click="dialogShow='none'">取消</button>
      </div>
      <div v-else-if="dialogShow=='deleteFriend'">
        <div class="dialog_h1">删除好友</div>
        <input v-model="delFriendAccount" placeholder="在此输入账号" />
        <button class="confirm" @click="deletefun();dialogShow='none'">确认</button>
        <button class="cancel" @click="dialogShow='none'">取消</button>
      </div>
      <div v-else-if="dialogShow=='ialert'">
        <div class="dialog_h1">消息</div>
        <div class="dialog_txt">{{tishi}}</div>
        <button class="confirm" @click="dialogShow='none'">确认</button>
      </div>
      <div v-else-if="dialogShow=='friendReq'">
        <div class="dialog_h1">好友请求</div>
        <div class="myscrollbar dialog_list">
          <div class="dialog_list_item" v-for="(item,index) in friendReq" :key="index">
            <div v-if="item.from!=account">
              <div v-if="item.pendding!='reject'">
                来自：
                <span style="font-size:20px">{{item.from}}</span>
                <br />
                <!-- {{item.to}}
                <br />-->
                {{item.pendding | penddingState}}
                <br />
                <div v-if="item.pendding=='pendding'">
                  <button
                    style="width:50%"
                    class="accept"
                    @click="acceptFriend(item.from,item.to)"
                  >接受</button>
                  <button
                    style="width:50%"
                    class="reject"
                    @click="rejectFriend(item.from,item.to)"
                  >拒绝</button>
                </div>
              </div>
            </div>
            <div v-else>
              已发送给：
              <span style="font-size:20px">{{item.to}}</span>
              <br />
              {{item.pendding | penddingState}}
              <br />
              <div v-if="item.pendding=='pendding'">等待回应中。。。</div>
              <div v-else-if="item.pendding=='reject'">
                <button @click="confirmFriend(item.from,item.to)">确认</button>
              </div>
            </div>
          </div>
        </div>
        <button class="confirm" @click="dialogShow='none'">确认</button>
        <button class="cancel" @click="dialogShow='none'">取消</button>
      </div>
    </div>
    <div class="menu_bar">
      <button @click="logout()">
        <i title="退出登录" class="fa fa-window-close" style="font-size:24px;color:#f35f5f"></i>
      </button>
      <button @click="ifhidden=true">
        <i title="隐藏界面" class="	fa fa-eye-slash" style="font-size:24px"></i>
      </button>
      <!-- <input v-model="addFriendAccount" /> -->
      <button @click="dialogShow='addFriend'">
        <i title="添加好友" class="fa fa-user-plus" style="font-size:24px"></i>
      </button>
      <!-- <input v-model="delFriendAccount" /> -->
      <button @click="dialogShow='deleteFriend'">
        <i title="删除好友" class="fa fa-user-times" style="font-size:24px"></i>
      </button>
      
      <button @click="getFriendRequest();dialogShow='friendReq'">
        <i
          :class="ifHaveReq>0?'have_req':'not_have_req'"
          title="好友请求"
          class="fa fa-address-book"
          style="font-size:24px"
        ></i>
      </button>
    </div>
    <div class="friend_list">
      <div class="left_head">
        <span class="account_text">{{username}}</span>
      </div>
      <div class="friend_list_outer myscrollbar">
        <div
          v-for="item in friendList"
          v-bind:key="item.account"
          @click="getMessageWith(item.account)"
          class="friend_item"
        >
          <div class="friend_username">
            {{item.username}}
            <span v-if="item.unread>0" class="friend_unread">{{item.unread}}</span>
          </div>
          <div class="friend_account">{{item.account}}</div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="right_head">
        <div class="title_h1">{{chosenFriend}}</div>
      </div>
      <div class="myscrollbar right_message" ref="messlist">
        <div v-for="(item,index) in messageList" :key="index">
          <div class="message_item_outer">
            <div
              class="message_item_time"
              :class="item.from==account?'message_item_time_my':'message_item_time_other'"
            >{{item.time | timeform}}</div>
            <div
              class="message_item"
              :class="item.from==account?'message_item_my':'message_item_other'"
            >
              <div class="message_item_from">{{item.from}}</div>
              <div v-if="item.message.type=='img'" class="message_item_txt">
                <img :src="item.message.img" :onload="loadImage()" width="300px" />
              </div>
              <div v-if="item.message.type=='txt'" class="message_item_txt">{{item.message.txt}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_typing">
        <div class="right_typing_menu">
          <div class="right_menu_button">
            <input
              class="img_input"
              @change="sendImg()"
              accept="image/jpeg, image/jpg, image/png"
              id="filetest"
              type="file"
              title="发送图片"
            />
            <div class="img_send">
              <i title="发送图片" class="fa fa-picture-o" style="font-size:24px"></i>
            </div>
          </div>
        </div>
        <textarea class="myscrollbar right_text" v-model="typing"></textarea>
        <button class="right_text_send" @click="sendMessage()">
          <i class="fa fa-send" style="font-size:24px"></i>
        </button>
      </div>
    </div>
    <div class="friend_req">
      <div class="title_h1">好友请求</div>
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
    </div>
  </div>
</template>

<script>
var ws;
export default {
  name: "chat",
  data: function () {
    return {
      friendList: [],
      messageList: [],
      friendReq: [],
      chosenFriend: "",
      typing: "",
      account: "",
      username:"",
      addFriendAccount: "",
      delFriendAccount: "",
      dialogShow: "none",
      tishi: "无通知",
      ifHaveReq: 0,
      ifhidden:false,
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
    penddingState: function (value) {
      var ret = "";
      if (value == "pendding") {
        ret = "等待中";
      } else if (value == "accept") {
        ret = "已接受";
      } else if (value == "reject") {
        ret = "已拒绝";
      }
      return ret;
    },
  },
  watch: {
    messageList: function () {
      var $this = this;
      this.$nextTick(() => {
        $this.$refs.messlist.scrollTop = $this.$refs.messlist.scrollHeight;
      });
    },
  },
  mounted: function () {
    //被嵌入时执行
    if(window.self !== window.top){
      document.getElementsByClassName('bg')[0].style.display='none'
      this.ialert('欢迎使用MYIM，第三方登录中，当前无添加好友权限')
    }

    this.account = this.$store.state.account;
    this.username=localStorage.getItem("myimUsername");
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
    ws.onclose = function () {};
    ws.onmessage = function (e) {
      var rec = JSON.parse(e.data);
      if (rec.type == "message") {
        if (rec.from == $this.chosenFriend || rec.to == $this.chosenFriend) {
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
                img: rec.message.img,
              },
              from: rec.from,
              to: rec.to,
              time: rec.time,
              own: $this.$store.state.account,
              id: 0,
            });
          }

          $this.axios
            .post(
              "http://" +
                process.env.VUE_APP_API +
                ":" +
                process.env.VUE_APP_API_REQ +
                "/readMessageWith",
              {
                token: $this.$store.state.token,
                account: $this.$store.state.account,
                withWho: $this.chosenFriend,
              }
            )
            .catch(function () {});
        } else {
          var ind = $this.friendList.findIndex(function (e) {
            if (e.account == rec.from) return true;
          });
          $this.friendList[ind].unread++;
          // if (rec.message.type == "img") {
          //   $this.messageList.push({
          //     message: {
          //       type: "img",
          //       img: rec.message.img,
          //     },
          //     from: rec.from,
          //     to: rec.to,
          //     time: rec.time,
          //     own: $this.$store.state.account,
          //     id: 0,
          //   });
          // }
        }
      } else if (rec.type == "system") {
        if (rec.system.type == "friendRequest") {
          $this.friendReq.push({
            from: rec.system.from,
            to: rec.system.to,
          });
        } else if (rec.system.type == "friendUpdate") {
          $this.getFriend();
          $this.getFriendRequest();
        }
      }
    };
    this.getFriend();
    this.getFriendRequest();
  },
  methods: {
    loadImage: function () {
      var $this = this;
      this.$nextTick(() => {
        $this.$refs.messlist.scrollTop = $this.$refs.messlist.scrollHeight;
      });
    },
    ialert: function (message) {
      this.tishi = message;
      this.dialogShow = "ialert";
    },
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
          if (response.data.state != "false") {
            $this.friendList = response.data;
          }
        })
        .catch(function () {});
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
        .catch(function () {});
    },
    getFriendRequest: function () {
      var $this = this;
      $this.ifHaveReq = 0;
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
          for (let i = 0; i < response.data.length; i++) {
            if (
              response.data[i].from != $this.account &&
              response.data[i].pendding == "pendding"
            ) {
              $this.ifHaveReq++;
            }
          }
          $this.friendReq = response.data;
        })
        .catch(function () {});
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
        .then(function () {
          $this.getFriendRequest();
        })
        .catch(function () {});
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
        .then(function () {
          $this.getFriendRequest();
        })
        .catch(function () {});
    },
    sendMessage: function () {
      var $this = this;

      if (
        $this.chosenFriend &&
        $this.chosenFriend != $this.account &&
        this.typing
      ) {
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
      if (document.getElementById("filetest").files[0]) {
        var $this = this;
        var reader = new FileReader();
        reader.readAsBinaryString(document.getElementById("filetest").files[0]);
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
              .catch(function () {});
          }
        };
      }
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
        .then(function (e) {
          if (e.data.state) {
            $this.ialert("已经删除");
            $this.getFriend();
            $this.getFriendRequest();
          } else {
            $this.ialert("删除失败（没有此人或不是好友）");
          }
        })
        .catch(function () {});
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
        .then(function (e) {
          if (e.data.state) {
            $this.ialert("已经发送好友请求");
          } else {
            $this.ialert("添加失败（没有此人或已经是好友）");
          }
        })
        .catch(function () {});
    },
    getMessageWith: function (withWho) {
      var $this = this;
      var ind = $this.friendList.findIndex(function (e) {
        if (e.account == withWho) return true;
      });
      $this.friendList[ind].unread = 0;

      this.chosenFriend = withWho;
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
          $this.messageList = response.data;
        })
        .catch(function () {});
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
<style scoped>
@import "../../assets/css/chat.css";
</style>