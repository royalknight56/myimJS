<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-20 14:09:27
--> 
<template>
  <div class="chat" :class="ifhidden?'chat_hidden':'chat_show'">
    <div class="power_on" @click="ifhidden=false">
      <i title="显示界面" class="fa fa-send" style="font-size:24px;color:#FFF"></i>
    </div>
    <div class="bg"></div>
    <!-- 对话框 -->
    <dialogi
      v-on="{
      ialerte:ialert,
      close:idialogClose
      }"
      v-if="dialogShow!='none'"
      :title="dialogShow"
      :dialogShow="dialogShow"
      :systemAlert="systemAlert"
      :friendReq="friendReq"
      :account="account"
      :friend_info="friend_info"
    ></dialogi>
    <modeldialog v-if="modelShow" :next="modelnext"></modeldialog>
    <div class="idialog" v-if="alertShow">
      <div class="dialog_h1">消息</div>
      <div class="dialog_txt">{{tishi}}</div>
      <div class="idialog_button_group">
        <button class="confirm" @click="alertShow=false">确认</button>
      </div>
    </div>

    <div class="idialog" v-if="alertShow">
      <div class="dialog_h1">消息</div>
      <div class="dialog_txt">{{tishi}}</div>
      <div class="idialog_button_group">
        <button class="confirm" @click="alertShow=false">确认</button>
      </div>
    </div>

    <!-- 左边列表 -->
    <div class="friend_list">
      <!-- 左边菜单条 -->
      <div class="menu_bar">
        <button @click="logout()">
          <i title="退出登录" class="fa fa-window-close" style="font-size:24px;color:#f35f5f"></i>
        </button>
        <button @click="ifhidden=true">
          <i title="隐藏界面" class="fa fa-eye-slash" style="font-size:24px"></i>
        </button>
        <button @click="dialogShow='addFriend'">
          <i title="添加好友" class="fa fa-user-plus" style="font-size:24px"></i>
        </button>
        <button @click="dialogShow='addCrowd'">
          <i title="加入群组" class="fa fa-group" style="font-size:24px"></i>
        </button>
        <button @click="dialogShow='createCrowd'">
          <i title="创建群组" class="fa fa-plus" style="font-size:24px"></i>
        </button>
        <!-- <button @click="dialogShow='deleteFriend'">
          <i title="删除好友" class="fa fa-user-times" style="font-size:24px"></i>
        </button>-->
        <button @click="getFriendRequest();dialogShow='friendReq'">
          <i
            :class="ifHaveReq>0?'have_req':'not_have_req'"
            title="好友请求"
            class="fa fa-address-book"
            style="font-size:24px"
          ></i>
        </button>
        <button @click="getSystemAlert();dialogShow='systemalert'">
          <i title="系统通知" class="fa fa-bell" style="font-size:24px"></i>
        </button>
      </div>
      <!-- 我的信息 -->
      <div class="left_head">
        <img class="my_logo" @click="dialogShow='setLogo'" :src="userlogo||'img/defult.png'" />
        <span class="username_text">{{username}}</span>
        <br />
        <span class="account_text">
          <span style="font-size:10px;">账号:</span>
          {{account}}
        </span>
      </div>
      <div class="left_tab">
        <div
          class="left_tab_item"
          :class="chosenLeftTab==0?'chosen_left_tab':''"
          @click="chosenLeftTab=0;changeLeftTab(0)"
        >好友
        <i title="好友" class="	fa fa-comment" style="font-size:20px"></i>
        </div>
        <div
          class="left_tab_item"
          :class="chosenLeftTab==1?'chosen_left_tab':''"
          @click="chosenLeftTab=1;changeLeftTab(1)"
        >群组
        <i title="群组" class="	fa fa-comments" style="font-size:20px"></i>
        </div>
      </div>
      <!-- 好友下面的列表 -->
      <div class="left_tab_under_outer">
        <div class="left_tab_under" ref="lefttab">
          <!-- 好友列表 -->
          <div class="friend_list_outer myscrollbar">
            <div
              v-for="item in friendList"
              v-bind:key="item.account"
              @click="getMessageWith(item);chosen_type='person'"
              class="friend_item"
              :class="item.account==chosenFriend?'chosen_friend_item':''"
            >
              <img class="friend_logo" :src="item.logo||'img/defult.png'" />
              <div class="friend_info">
                <div class="friend_username">
                  {{item.username}}
                  <span v-if="item.unread>0" class="friend_unread">{{item.unread}}</span>
                </div>
                <div class="friend_account">{{item.account}}</div>
              </div>
            </div>
          </div>
          <!-- 群组列表 -->
          <div class="friend_list_outer myscrollbar">
            <div
              v-for="item in crowdList"
              v-bind:key="item.beowned"
              @click="chosenFriend=item.beowned;chosen_type='group';groupMessageList=[]"
              class="friend_item"
              :class="item.beowned==chosenFriend?'chosen_friend_item':''"
            >
              <img class="friend_logo" :src="'img/defult.png'" />
              <div class="friend_info">
                <div class="friend_username">
                  {{item.beowned}}
                  <span v-if="item.unread>0" class="friend_unread">{{item.unread}}</span>
                </div>
                <!-- <div class="friend_account">{{item.account}}</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右边聊天窗口 -->
    <div class="right">
      <!-- 右边头部信息 -->
      <div class="right_head">
        <div class="title_h1" v-if="chosen_type=='person'">{{chosenFriendInfo.username}}&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div class="title_h2" v-if="chosenFriend">账号: {{chosenFriend}}</div>
        <div class="friend_opt_but" v-if="chosenFriend" @click="changeFriendTab(0);">
          <i class="fa fa-angle-double-left" style="font-size:24px"></i>
        </div>
        <div class="friend_opt" v-if="chosenFriend">
          <div class="friend_tab" ref="if_friend_opt">
            <div class="friend_menu">
              <div class="friend_tab_close" @click="changeFriendTab(1)">
                <i class="fa fa-angle-double-right" style="font-size:24px"></i>
              </div>
              <div
                v-if="chosen_type=='person'"
                @click="deletefun(chosenFriend)"
                class="friend_tab_item"
              >删除好友</div>
              <div
                v-if="chosen_type=='group'"
                @click="deletefun(chosenFriend)"
                class="friend_tab_item"
              >退出群组</div>
              <div
                v-if="chosen_type=='person'"
                @click="getFriendInfo(chosenFriend);"
                class="friend_tab_item"
              >好友信息</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 消息列表 -->
      <!-- 个人聊天 -->
      <div v-if="chosen_type=='person'" class="myscrollbar right_message" ref="messlist">
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
              <div v-else-if="item.message.type=='link'" class="message_item_txt">
                这是一个链接,请确保安全后打开<br><a target="_blank" :title="item.message.link" :href="item.message.link">{{item.message.link | linkForm}}</a>
              </div>
              <div
                v-else-if="item.message.type=='txt'"
                class="message_item_txt"
              >{{item.message.txt | emoji}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 群组会话 -->
      <div v-if="chosen_type=='group'" class="myscrollbar right_message" ref="messlist">
        <div v-for="(item,index) in groupMessageList" :key="index">
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
              <div v-else-if="item.message.type=='link'" class="message_item_txt">
                这是一个链接,请确保安全后打开<a target="_blank" :title="item.message.link" :href="item.message.link">{{item.message.link | linkForm}}</a>
              </div>
              <div v-else-if="item.message.type=='txt'" class="message_item_txt">{{item.message.txt}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right_typing">
        <!-- 右边聊天操作按钮 -->
        <div v-if='chosenFriend' class="right_typing_menu">
          <div class="right_menu_button" v-if="chosen_type=='person'">
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
          <div @click="dialogShow='sendLink'" class="right_menu_button">
            <i title="发送链接" class="	fa fa-share-alt" style="font-size:24px"></i>
          </div>
        </div>
        <textarea class="myscrollbar right_text" v-model="typing"></textarea>
        <button class="right_text_send" @click="sendMessage()">
          <i class="fa fa-send" style="font-size:24px"></i>
        </button>
      </div>
    </div>
    <!-- <div class="friend_req">
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
    </div>-->
  </div>
</template>

<script>
import moth_mixin from "./chat_moth";
import dialogi from "./idialog";
import modeldialog from "./modeldialog";
var ws;
export default {
  name: "chat",
  mixins: [moth_mixin],
  components: {
    dialogi,
    modeldialog,
  },
  data: function () {
    return {
      friendList: [],
      crowdList: [],
      messageList: [],
      groupMessageList: [],
      friendReq: [],
      systemAlert: [],
      chosenFileName: "未选择文件",
      chosenFriend: "",
      chosenFriendInfo: {},
      chosenLeftTab: 0,
      friend_tab_left: 100,
      typing: "",
      account: "",
      username: "",
      userlogo: "",
      modelnext: "",
      chosen_type: "person",
      friend_info: {},
      addFriendAccount: "",
      // delFriendAccount: "",
      dialogShow: "none",
      tishi: "无通知",
      ifHaveReq: 0,
      ifhidden: false,
      alertShow: false,
      modelShow: false,
    };
  },
  filters: {
    emoji:function(str){
      return str
    },
    linkForm:function(value){
      if(value.length>100){
        return value.slice(0,100)+'...'
      }else{
        return value
      }
    },
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
    groupMessageList: function () {
      var $this = this;
      this.$nextTick(() => {
        $this.$refs.messlist.scrollTop = $this.$refs.messlist.scrollHeight;
      });
    },
  },
  mounted: function () {
    //被嵌入时执行
    if (window.self !== window.top) {
      document.getElementsByClassName("bg")[0].style.display = "none";
      this.ialert("欢迎使用MYIM，第三方登录中，当前无添加好友权限");
    }

    this.account = this.$store.state.account;
    this.username = localStorage.getItem("myimUsername");
    this.userlogo = localStorage.getItem("myimLogo");
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
      $this.ialert("无法连接");
    };
    ws.onmessage = function (e) {
      var rec = JSON.parse(e.data);
      if (rec.type == "message" || rec.type == "group") {
        if (rec.from == $this.chosenFriend || rec.to == $this.chosenFriend) {
          var chlist;
          if (rec.type == "message") {
            chlist = $this.messageList;
          } else if (rec.type == "group") {
            chlist = $this.groupMessageList;
          }
          if (rec.message.type == "txt") {
            chlist.push({
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
            chlist.push({
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
          } else if (rec.message.type == "link") {
            chlist.push({
              message: {
                type: "link",
                link: rec.message.link,
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
          $this.getCrowd();
        }
      }
    };
    this.getFriend();
    this.getFriendRequest();
    this.getCrowd();
  },

  methods: {
    sendMessage: function () {
      var $this = this;
      this.typing=this.typing.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
      
      if (
        $this.chosenFriend &&
        $this.chosenFriend != $this.account &&
        this.typing
      ) {
        var send_type = "message";
        if ($this.chosen_type == "person") {
          send_type = "message";
        } else if ($this.chosen_type == "group") {
          send_type = "group";
        }
        ws.send(
          JSON.stringify({
            type: send_type,
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
        if (this.chosen_type == "person") {
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
        }
        this.typing = "";
      }
    },
    sendLink: function (link) {
      var $this = this;
      if (
        $this.chosenFriend &&
        $this.chosenFriend != $this.account &&
        link
      ) {
        var send_type = "message";
        if ($this.chosen_type == "person") {
          send_type = "message";
        } else if ($this.chosen_type == "group") {
          send_type = "group";
        }
        ws.send(
          JSON.stringify({
            type: send_type,
            token: $this.$store.state.token,
            account: $this.$store.state.account,
            message: {
              type: "link",
              link: link,
            },
            to: $this.chosenFriend,
            from: $this.$store.state.account,
          })
        );
        if (this.chosen_type == "person") {
          $this.messageList.push({
            message: {
              type: "link",
              link:link,
            },
            from: $this.$store.state.account,
            to: $this.chosenFriend,
            time: new Date(),
            own: $this.$store.state.account,
            id: 0,
          });
        }
      }
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