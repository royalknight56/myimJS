<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 13:49:53
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-29 22:21:15
--> 
<template>
<div class="layout">
  <!-- <menu-bar></menu-bar> -->
  <div class="layout-body">
    <div class="layout-main">
      <router-view />
    </div>
  </div>
</div>
</template>

<script>
// import menuBar from '@/components/menu-bar'
export default {
  name: 'layout',

  components: {
    // menuBar,
  },

  computed: {

  },

  beforeCreate () {
  }
}
</script>

<style  scoped>
.test{
  background-color: rgb(83, 81, 76);
}
</style>
