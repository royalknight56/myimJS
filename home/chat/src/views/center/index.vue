<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: RoyalKnight
 * @Date: 2020-07-14 10:36:46
 * @LastEditors: RoyalKnight
 * @LastEditTime: 2020-08-28 19:25:50
--> 
<template>
  <div>
    center-Route
    
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "center",
  data: function () {
    return {
      account: "",
      password: "",
    };
  },
  methods: {
    
  },
  mounted: function () {
    if (process.env.VUE_APP_IFDEV == "true") {
      console.log("处于开发环境中");
    }
  },
};
</script>
