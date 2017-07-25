<template>
  <div class="compare">
    <SideMenu></SideMenu>
    <div main-info>
      <p>我是对比</p>
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
  .compare {
    display: flex;
  }
</style>
