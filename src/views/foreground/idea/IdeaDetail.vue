
<template>
  <div class="idea-detail">
    <public-detail></public-detail>
    <!-- 精彩评论 -->
    <div class="detail-splendid">
      <div class="splendid-title">
        <h4>精彩评论 (123)</h4>
      </div>
      <comment-list :list="1"></comment-list>
    </div>
    <!-- 普通评论 -->
    <div class="detail-common">
      <div class="common-title">
        <h4>评论 (123)</h4>
      </div>
      <comment-list :list="3"></comment-list>
    </div>
  </div>
</template>
<script>
  import {PublicDetail, CommentList} from '../../../components/business';

  export default {
    components: {PublicDetail, CommentList}
  };
</script>
<style lang="scss" scoped>
  .idea-detail {
    width: 800px;
    margin: 12px auto 0;
    background-color: #fff;
    .detail-common, .detail-splendid {
      padding: 20px 66px;
      .common-title, .splendid-title {
        display: flex;
        align-items: center;
        height: 45px;
        border-bottom: 1px solid #F6F6F6;
        h4 {
          font-size:18px;
          font-weight:500;
          line-height: 25px;
          color: #303133;
        }
      }
    }
  }
</style>

