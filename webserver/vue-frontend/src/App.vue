<template>
  <div id="app">
    <router-view> </router-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  components: {}
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500");
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");

body {
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
}
</style>
