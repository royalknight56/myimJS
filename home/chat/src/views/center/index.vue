<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-16 15:48:05
--> 
<template>
<div>
    center-Route
    <router-link to="/center/">center1</router-link>
    <router-link to="/center/center2">center2</router-link>
    <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'center',
  mounted:function(){
    if(process.env.VUE_APP_IFDEV=='true'){
        console.log('处于开发环境中')
    }
  }
}
</script>
