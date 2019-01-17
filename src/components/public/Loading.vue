<template>
  <div class="loading" v-if="(loading && !nomore) || nomore && !noresult">
    <p v-if="loading && !nomore">加载中...</p>
    <p v-if="nomore && !hide">到底啦</p>
  </div>
</template>
<script>
  export default {
    props: ['loading', 'nomore', 'noresult', 'hide']
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .loading {
    p {
      font-size: $h3Font;
      line-height: 80px;
      text-align: center;
      color: $h3Color;
    }
  }
</style>
