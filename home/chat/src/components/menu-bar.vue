<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-13 16:18:49
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-07-14 15:56:01
--> 
<template>
  <div class="hello">
    <router-link  :to="{ path: '/home' }">home</router-link>
    <router-link  :to="{ path: '/center' }">center</router-link>
  </div>
</template>

<script>
export default {
  name: 'menu-bar',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a{
  margin: 10px;
}
</style>
