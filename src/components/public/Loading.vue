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
    background-color: $backColor;
    p {
      font-size: $h3Font;
      line-height: 56px;
      text-align: center;
      color: $h3Color;
      &:last-child {
        visibility: hidden;
        opacity: 0;
      }
    }
  }
</style>
