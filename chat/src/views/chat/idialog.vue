<!--
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-09-04 19:39:57
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-06 10:35:47
-->
<template>
  <div>
    <!-- 对话框 -->
    <div class="idialog">
      <div class="dialogi_continer">
        <div class="dialogi_outer">
          <!-- <div class="dialogi_h1">{{title}}</div> -->
          <div v-if="dialogShow=='addFriend'">
            <div class="dialog_h1">添加好友</div>
            <div class="dialog_label">输入要添加的账号</div>
            <input v-model="addFriendAccount" placeholder="在此输入账号" />
            <div class="idialog_button_group">
              <button class="confirm" @click="addFriend();">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-if="dialogShow=='sendLink'">
            <div class="dialog_h1">发送链接</div>
            <div class="dialog_label">输入要发送的链接</div>
            <input v-model="sendLinkInput" placeholder="在此输入链接" />
            <div class="idialog_button_group">
              <button class="confirm" @click="sendLink();">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-else-if="dialogShow=='addCrowd'">
            <div class="dialog_h1">加入群组</div>
            <div class="dialog_label">输入要添加的群组</div>
            <input v-model="addCrowdAccount" placeholder="在此输入群组账号" />
            <div class="idialog_button_group">
              <button class="confirm" @click="addCrowd();">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-else-if="dialogShow=='createCrowd'">
            <div class="dialog_h1">创建群组</div>
            <div class="dialog_label">输入群组的信息</div>
            <input v-model="createCrowdAccount" placeholder="在此输入群组账号" />
            <input v-model="createCrowdName" placeholder="在此输入群组名称" />
            <div class="idialog_button_group">
              <button class="confirm" @click="createCrowd();">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-else-if="dialogShow=='setLogo'">
            <div class="dialog_h1">上传头像</div>
            <div class="dialog_label">选择本地图片上传</div>
            <div class="idialog_chose">
              <input
                class="img_input"
                @change="logoReady()"
                accept="image/jpeg, image/jpg, image/png"
                id="filelogo"
                type="file"
                title="选择图片"
                ref="file_logo"
              />
              <div class="img_send">
                <i title="发送图片" class="fa fa-picture-o" style="font-size:24px"></i>
                {{chosenFileName}}
              </div>
            </div>
            <div class="idialog_button_group">
              <button class="confirm" @click="logoSet();">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
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
            <div class="idialog_button_group">
              <button class="confirm" @click="closeDialog()">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-else-if="dialogShow=='systemalert'">
            <div class="dialog_h1">系统通知</div>
            <div class="myscrollbar dialog_list">
              <div class="dialog_list_item" v-for="(item,index) in systemAlert" :key="index">
                {{item.systemdate | timeform}}
                <br />
                来自管理员:
                {{item.systemuser}}
                <div class="dialog_label">{{item.systemmessage}}</div>
              </div>
            </div>
            <div class="idialog_button_group">
              <button class="confirm" @click="closeDialog()">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          <div v-else-if="dialogShow=='friendinfo'">
            <div class="dialog_h1">好友信息</div>
            <div class="dialog_label"> 用户账号:{{friend_info.account}}</div>
            <div class="dialog_label">用户昵称:{{friend_info.username}}</div>
            <div class="dialog_label">用户类型:{{friend_info.type | filterinfo}}</div>
            <div class="idialog_button_group">
              <button class="confirm" @click="closeDialog()">确认</button>
              <button class="cancel" @click="closeDialog()">取消</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import idialog_mixin from "./idialog_mix";
export default {
  name: "dialogi",
  mixins: [idialog_mixin],
  props: ["dialogShow", "title", "type", "friendReq", "systemAlert", "account","friend_info"],
  data: function () {
    return {
      dialogi_input: "",
      state_input: false,
      addFriendAccount: "",
      addCrowdAccount:"",
      createCrowdAccount:"",
      createCrowdName:"",
      chosenFileName: "",
      sendLinkInput:"",
    };
  },
  filters: {
    filterinfo:function(value){
      var map={
        'com':'普通用户',
        'sys':'管理员',
      }
      return map[value]

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
  monted: function () {
    if (this.type == "input") {
      this.state_input = true;
    } else if (this.type == "list") {
      this.state_input = false;
    }
  },
  watch: {
    dialogShow: function (stat) {
      if (stat == "none") {
        this.$emit("");
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/idialog.css";
</style>