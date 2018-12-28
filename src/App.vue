<template>
  <div id="app">
    <router-view/>
    <show-image></show-image>
  </div>
</template>
<script>
  import ShowImage from './components/popup/ShowImage.vue';
  import UserApi from './api/User.js';

  export default {
    name: 'APP',
    components: {ShowImage},
    created() {
      this.getUserDetail();
    },
    methods: {
      // 用户个人信息
      getUserDetail() {
        UserApi().getUserDetail({}).then(res => {
          if(res.status) this.$store.dispatch('getSelfInfo', res.data);
        });
      }
    }
  };
</script>
<style lang="scss">
  @import '../src/assets/scss/_reset.scss';
</style>
