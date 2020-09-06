<!--
 * @Descripttion: 
 * @version: 
 * @Author: RoyalKnight
 * @Date: 2020-09-05 20:56:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-09-05 21:06:58
-->
<template>
  <div>
    <div class="idialog">
      <div class="dialogi_continer">
        <div class="dialogi_outer">
            <div class="dialog_h1">操作确认</div>
            <div class="dialog_label">是否确认?</div>
          <div class="idialog_button_group">
            <button class="rejevt" @click="next();closeModel()">确认</button>
            <button class="confirm" @click="closeModel()">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "model",
  props:['next'],
  methods:{
      closeModel:function(){
          this.$parent.modelShow=false
      }
  }
};
</script>
<style scoped>
@import "../../assets/css/idialog.css";
</style>