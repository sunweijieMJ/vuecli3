
<template>
  <div class="idea-detail">
    <public-detail :detail="ieda_detail"></public-detail>
    <!-- 点赞用户列表 -->
    <div class="detail-thump" v-if="thump_list.length">
      <div class="thump-title">
        他们都觉得很赞
      </div>
      <div class="thump-icon">
        <img v-for="(item, index) in thump_list" :key="index" :src="item.header_photo" alt="">
      </div>
    </div>
    <!-- 回复评论 -->
    <div class="detail-comment">
      <img src="https://pic2.lanehub.cn/production/bf7aa8df072875322842df4ff220f1d7.jpg?x-oss-process=style/m-00004" alt="">
      <div class="comment-publish">
        <textarea ref="textarea" placeholder="回复PADDY:"
          @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)" @focus="textEnabled = true"
          ></textarea>
        <div class="publish-btn" v-if="textEnabled">
          <span @click="textEnabled = false">取消</span>
          <button @click="sendComment">发送</button>
        </div>
      </div>
    </div>
    <!-- 精彩评论 -->
    <div class="detail-splendid" v-if="splendid_list.length">
      <div class="splendid-title">
        <h4>精彩评论 (123)</h4>
      </div>
      <comment-list :list="splendid_list"></comment-list>
    </div>
    <!-- 普通评论 -->
    <div class="detail-common" v-if="common_list.length">
      <div class="common-title">
        <h4>评论 (123)</h4>
      </div>
      <comment-list :list="common_list"></comment-list>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../../api/Idea.js';
  import {autoTextarea} from '../../../utils/business/tools.js';
  import {PublicDetail, CommentList} from '../../../components/business';

  export default {
    components: {PublicDetail, CommentList},
    data() {
      return {
        autoTextarea,
        textEnabled: false,
        idea_id: +this.$route.params.id, // ETC 详情id
        ieda_detail: {}, // ETC 详情
        thump_list: [], // ETC 点赞用户列表
        splendid_list: [], // ETC 精彩评论
        common_list: [] // ETC 普通评论
      };
    },
    created() {
      let that = this;
      that.getIdeaDetail(that.idea_id);
      that.getThumpList(that.idea_id);
      that.getCommentList(that.idea_id);
    },
    methods: {
      // 详情信息
      getIdeaDetail(tId) {
        IdeaApi().getIdeaDetail({tId}).then(res => {
          this.ieda_detail = res.data;
        });
      },
      // 点赞用户列表
      getThumpList(thinksId) {
        IdeaApi().getThumpList({thinksId}).then(res => {
          this.thump_list = res.data.lists;
        });
      },
      // 评论列表
      getCommentList(tId) {
        let that = this;
        IdeaApi().getCommentList({tId}).then(res => {
          that.splendid_list = res.data.lists.hot_comments;
          that.common_list = res.data.lists.comments_info;
          const user_infos = res.data.lists.user_infos;
          for(let i = 0, ILEN = that.splendid_list.length; i < ILEN; i++) {
            that.splendid_list[i].user_info = user_infos[that.splendid_list[i].user_id];
            for(let j = 0, JLEN = that.splendid_list[i].replys.length; j < JLEN; j++) {
              that.splendid_list[i].replys[j].user_info = user_infos[that.splendid_list[i].replys[j].user_id];
            }
          }
          for(let i = 0, ILEN = that.common_list.length; i < ILEN; i++) {
            that.common_list[i].user_info = user_infos[that.common_list[i].user_id];
            for(let j = 0, JLEN = that.common_list[i].replys.length; j < JLEN; j++) {
              that.common_list[i].replys[j].user_info = user_infos[that.common_list[i].replys[j].user_id];
            }
          }
        });
      },
      // 发送评论
      sendComment() {
        this.textEnabled = false;
      }
    },
    watch: {
      textEnabled(cur) {
        let that = this;
        if(cur) {
          that.$nextTick(() => {
            that.$refs.textarea.focus();
          });
        }
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
    .detail-thump {
      padding: 35px 66px;
      .thump-title {
        margin-bottom: 20px;
        font-size: 18px;
        font-weight: 500;
        line-height: 25px;
        color: $h1Color;
      }
      .thump-icon {
        display: flex;
        flex-wrap: wrap;
        img {
          width: 30px;
          height: 30px;
          margin: 0 10px 10px 0;
          border-radius: 50%;
        }
      }
    }
    .detail-comment {
      display: flex;
      padding: 25px 66px;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 30px;
      }
      .comment-publish {
        flex: 1;
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          padding: 10px 20px;
          border-radius: 2px;
          font-size: 16px;
          line-height: 25px;
          resize: none;
          border: none;
          background: $backColor;
          &::placeholder {
            font-size: 16px;
            line-height: 28px;
            color: $h3Color;
          }
          &::-webkit-input-placeholder {
            font-size: 16px;
            line-height: 28px;
            color: $h3Color;
          }
          &:-moz-placeholder {
            font-size: 16px;
            line-height: 28px;
            color: $h3Color;
          }
          &::-moz-placeholder {
            font-size: 16px;
            line-height: 28px;
            color: $h3Color;
          }
          &:-ms-input-placeholder {
            font-size: 16px;
            line-height: 28px;
            color: $h3Color;
          }
        }
        .publish-btn {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span {
            font-size: 16px;
            line-height: 22px;
            color: $h1Color;
            cursor: pointer;
          }
          button {
            margin-left: 20px;
            width: 74px;
            height: 36px;
            background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
            border-radius: 20px;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
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

