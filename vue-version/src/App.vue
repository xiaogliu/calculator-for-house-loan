<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
body {
	background-color: #F1F5F8;
}
#app {
  width: 1000px;
  margin: 30px auto;
}
</style>
