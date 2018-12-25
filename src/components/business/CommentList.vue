<template>
  <ul class="comment-list">
    <li v-for="(vitem, vindex) in list" :key="vindex">
      <single-comment></single-comment>
      <ul class="second-list">
        <li v-for="(vitem, vindex) in 2" :key="vindex">
          <single-comment></single-comment>
        </li>
      </ul>
    </li>
  </ul>
</template>
<script>
  import {SingleComment} from './index.js';

  export default {
    components: {SingleComment},
    props: ['list']
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .comment-list {
    >li {
      .second-list {
        padding-left: 60px;
      }
    }
  }
</style>

