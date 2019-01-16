<template>
  <ul class="comment-list">
    <li v-for="(vitem, vindex) in list" :key="vindex" :class="{second: !vitem.replys.length}">
      <single-comment :item="vitem" :root="{comment_id: vitem.comment_id}" @commentSuccess="commentSuccess"></single-comment>
      <ul class="second-list" v-if="vitem.replys && vitem.replys.length">
        <li v-for="(witem, windex) in (show_more[vindex] ? vitem.replys : vitem.replys.slice(0, 2))" :key="windex">
          <single-comment :item="witem" :root="{list, comment_id: vitem.comment_id, index: windex}" @commentSuccess="commentSuccess"></single-comment>
        </li>
        <div class="more-comment" v-if="vitem.replys.length > 2 && !show_more[vindex]">
          <p @click="$set(show_more, vindex, true)">全部{{vitem.replys.length}}条回复</p>
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
        show_more: []
      };
    },
    mounted() {
      // 暂时
      let that = this;
      for(let i = 0, LEN = that.list.length; i < LEN; i++) {
        that.show_more.push(false);
      }
    },
    methods: {
      commentSuccess(data) {
        this.$emit('commentSuccess', data);
      }
    }
  };
</script>
<style lang="scss">
  @import '../../assets/scss/_base.scss';

  .comment-list {
    >li {
      border-bottom: 1px solid $lineColor;
      &:last-child{
        border-bottom: none 0 !important;
        >.single-comment .comment-info {
          border-bottom: none 0 !important;
        }
      }
      &.second >.single-comment .comment-info {
        border: none 0 !important;
      }
      &:last-child >.single-comment .comment-info{
        border-bottom: 1px solid $lineColor;
      }
      .second-list {
        padding-left: 60px;
        li:last-child .single-comment .comment-info{
          border-bottom: none 0 !important;
        }
        .more-comment {
          padding: 12px 0 12px 60px;
          p {
            font-size: $h3Font;
            line-height: 22px;
            color: $linkBlue;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>

