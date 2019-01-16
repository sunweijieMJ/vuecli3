<template>
  <div class="loading" v-if="(loading && !nomore) || nomore && !noresult">
    <p v-if="loading && !nomore">加载中...</p>
    <p v-if="nomore">到底啦</p>
  </div>
</template>
<script>
  export default {
    props: ['loading', 'nomore', 'noresult']
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .loading {
    p {
      font-size: 20px;
      line-height: 50px;
      text-align: center;
      color: $h1Color;
    }
  }
</style>
