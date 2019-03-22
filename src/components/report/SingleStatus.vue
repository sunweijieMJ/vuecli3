<template>
  <div class="single-status" :style="[{backgroundColor: back}, {color: color}, {borderColor: color}]">{{text}}</div>
</template>
<script>
  export default {
    props: ['text', 'color', 'back']
  };
</script>
<style lang="scss" scoped>
  .single-status{
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 18px;
    border-radius: 9px;
    font-size: $h4Font;
    font-weight: $h1Weight;
  }
</style>
