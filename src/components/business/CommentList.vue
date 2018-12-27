<template>
  <ul class="comment-list">
    <li v-for="(vitem, vindex) in list" :key="vindex">
      <single-comment :item="vitem" @thumpSuccess="$emit('thumpSuccess')" @commentSuccess="$emit('commentSuccess')"></single-comment>
      <ul class="second-list">
        <li v-for="(witem, windex) in (show_more ? vitem.replys : vitem.replys.slice(0, 2))" :key="windex">
          <single-comment :item="witem" @thumpSuccess="$emit('thumpSuccess')" @commentSuccess="$emit('commentSuccess')"></single-comment>
        </li>
        <div class="more-comment" v-if="vitem.replys.length > 2 && !show_more">
          <p @click="show_more = true">全部{{vitem.replys.length}}条回复</p>
        </div>
      </ul>
    </li>
  </ul>
</template>
<script>
  import {SingleComment} from './index.js';

  export default {
    components: {SingleComment},
    props: ['list'],
    data() {
      return {
        show_more: false
      };
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .comment-list {
    >li {
      border-bottom: 1px solid $lineColor;
      &:last-child {
        border-bottom: 0;
      }
      .second-list {
        padding-left: 60px;
        .more-comment {
          padding: 12px 0 12px 60px;
          p {
            font-size: 16px;
            line-height: 22px;
            color: $linkBlue;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>

