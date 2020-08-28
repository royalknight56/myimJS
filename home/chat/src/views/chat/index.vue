<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 23:31:57
--> 
<template>
  <div>
    <button @click="testfun()">Test</button>
    <button @click="deletefun()">del</button>
    Chat
    ---------friendList
    <div
      v-for="(item,index) in friendList"
      v-bind:key="index"
      @click="getMessageWith(item.account)"
    >{{item.username}}-- {{item.account}}</div>---------message
    <div>
      <div v-for="(item,index) in messageList" :key="index">
        {{item.time}}
        <br />
        {{item.from}}
        <br />
        {{item.mess}}
        <br />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "chat",
  data: function () {
    return {
      friendList: [{ name: "" }],
      messageList: [{ name: "" }],
    };
  },
  mounted: function () {
    var $this = this;
    this.axios
      .get("http://127.0.0.1:8080/getFriend", {
        params: {
          token: localStorage.getItem("myimToken"),
          account: localStorage.getItem("myimAccount"),
        },
      })
      .then(function (response) {
        console.log(response);
        $this.friendList = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    deletefun: function () {
      this.axios
        .post("http://127.0.0.1:8080/deleteFriend", {
            token: localStorage.getItem("myimToken"),
            account: localStorage.getItem("myimAccount"),
            withWho: 'super',
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    testfun: function () {
      this.axios
        .post("http://127.0.0.1:8080/addFriend", {
            token: localStorage.getItem("myimToken"),
            account: localStorage.getItem("myimAccount"),
            withWho: 'super',
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getMessageWith: function (withWho) {
      var $this = this;
      this.axios
        .get("http://127.0.0.1:8080/getMessageWith", {
          params: {
            token: localStorage.getItem("myimToken"),
            account: localStorage.getItem("myimAccount"),
            withWho: withWho,
          },
        })
        .then(function (response) {
          console.log(response);
          $this.messageList = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
