
<template>
  <div class="idea-detail">
    <public-detail :detail="ieda_detail"></public-detail>
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
  import IdeaApi from '../../../api/Idea.js';
  import {PublicDetail, CommentList} from '../../../components/business';

  export default {
    components: {PublicDetail, CommentList},
    data() {
      return {
        idea_id: +this.$route.params.id, // ETC 详情id
        ieda_detail: {}, // ETC 详情
        splendid_list: [], // ETC 精彩评论
        common_list: [] // ETC 普通评论
      };
    },
    created() {
      let that = this;
      that.getIdeaDetail(that.idea_id);
      that.getCommentList(that.idea_id);
    },
    methods: {
      getIdeaDetail(id) {
        IdeaApi().getIdeaDetail({tId: id}).then(res => {
          this.ieda_detail = res.data;
        });
      },
      getCommentList(id) {
        IdeaApi().getCommentList({tId: id}).then(res => {
          console.log(res)
          this.common_list = res.data;
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_base.scss';

  .idea-detail {
    width: 800px;
    margin: 12px auto 0;
    background-color: #fff;
    .detail-common, .detail-splendid {
      padding: 15px 66px;
      .common-title, .splendid-title {
        display: flex;
        align-items: center;
        padding: 15px 0 10px;
        border-bottom: 1px solid #F6F6F6;
        h4 {
          font-size: 18px;
          font-weight: 500;
          line-height: 25px;
          color: $h1Color;
        }
      }
    }
  }
</style>

