<template>
  <div id="app">
    <router-view/>
    <show-image></show-image>
  </div>
</template>
<script>
  import ShowImage from './components/popup/ShowImage.vue';

  export default {
    name: 'APP',
    components: {ShowImage}
  };
</script>
<style lang="scss">
  @import '../src/assets/scss/_reset.scss';
  @import '../src/assets/scss/component/_element.scss';

  html, body, #app {
    background-color: $backColor;
  }
</style>
