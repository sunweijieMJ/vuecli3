<template>
  <div class="loading" v-show="loading">
    <p>加载中...</p>
  </div>
</template>
<script>
  export default {
    props: ['loading']
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .loading {
    height: 50px;
    p {
      font-size: 20px;
      line-height: 50px;
      text-align: center;
      color: $h1Color;
    }
  }
</style>
