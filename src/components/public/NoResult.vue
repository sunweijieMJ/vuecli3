<template>
  <div class="no-result">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-icon_nothing"></use>
    </svg>
    <p>当前没有内容</p>
  </div>
</template>
<style lang="scss" scoped>
  .no-result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    svg {
      margin: 170px 0 10px;
      width: 180px;
    }
    p {
      font-size: $h3Font;
      font-weight: $h1Weight;
      color: $h3Color;
    }
  }
</style>

