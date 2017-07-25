<template>
  <div class="average-capital">
    <SideMenu></SideMenu>
    <div main-info>
      <p>我是等额本金</p>
    </div>
  </div>
</template>
<script>
  import SideMenu from './SideMenu';

  export default {
    name: 'averageCapital',
    components: {
      SideMenu,
    },
  };
</script>
<style lang="scss" scoped>
  .average-capital {
    display: flex;
  }
</style>
