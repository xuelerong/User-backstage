<template>
  <div id="app">
<!--    路由占位符-->
    <router-view></router-view>

  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style lang="less">
  #nprogress .bar {
    background: red !important; //自定义颜色
  }
</style>
