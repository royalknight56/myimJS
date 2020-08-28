<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 17:30:56
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-16 15:04:48
--> 
<template>
<div>
    home-Route
    <home-tool></home-tool>
</div>
</template>

<script>
import homeTool from './components/tool';
export default {
  name: 'home',
  components:{
    homeTool
  },
  mounted:function(){
    this.$store.dispatch("add")
  },
}
</script>
