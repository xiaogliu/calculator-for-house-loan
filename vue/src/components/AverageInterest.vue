<template>
  <div class="average-interest">
    <SideMenu></SideMenu>
    <div main-info>
      <p>我是等额本息</p>
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
  .average-interest {
    display: flex;
  }
</style>
