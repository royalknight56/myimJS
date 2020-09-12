<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-16 14:51:24
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-07 16:11:32
--> 
<template>
<div>
  <div class="bgm">
    <img src="../../assets/bg2.png">
  </div>


  
  <div class="m_h1">
    
    MYIM 即时通信
  </div>
  <div class="m_logo">
  <img src="../../assets/mylogo.png">
</div>
  <div class="m_txt">
    集成单群聊、聊天室、系统通知等通信能力，安全可靠、全球互通，
    单聊
实现私信单聊，具备图片、语音、位置、动态表情、小视频、红包、通话等各种通信能力，消息历史记录支持漫游。
群聊
实现群组聊天，灵活的群组成员和权限管理，消息历史记录支持漫游，支持 3000 人大群且可进一步提升。

 </div>
  <div @click="tpto()" class="m_button">
    进入应用
  </div>

  <div @click="tpto2()" class="m_button">
    体验咨询
  </div>

</div>
</template>

<script>
export default {
  name: 'center2',
  methods:{
    tpto:function(){
      this.$router.push('/home')
    },
    tpto2:function(){
      this.$router.push('/home2')
    }
  }
}
</script>
<style scoped>
@import "../../assets/css/mainpage.css";
</style>