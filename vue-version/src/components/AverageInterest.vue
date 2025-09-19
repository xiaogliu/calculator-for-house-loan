<template>
  <div class="average-interest">
    <SideMenu></SideMenu>
    <RawData></RawData>
    <div main-info>
      <p>我是等额本息</p>
    </div>
  </div>
</template>
<script>
  import SideMenu from './SideMenu';
  import RawData from './RawData';

  export default {
    name: 'averageCapital',
    components: {
      SideMenu,
      RawData,
    },
  };
</script>
<style lang="scss" scoped>
  .average-interest {
    display: flex;
  }
</style>
