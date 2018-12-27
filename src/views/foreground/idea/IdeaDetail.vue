
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
        <textarea ref="textarea" placeholder="回复PADDY:" v-model="textEnabled.text"
          @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)" @focus="textEnabled.status = true"
          ></textarea>
        <div class="publish-btn" v-if="textEnabled.status">
          <span @click="textEnabled.status = false">取消</span>
          <button @click="sendComment(idea_id, textEnabled.text)">发送</button>
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
      <comment-list :list="common_list" @thumpSuccess="thumpSuccess" @commentSuccess="commentSuccess"></comment-list>
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
        textEnabled: { // ETC textarea 状态
          status: false,
          text: ''
        },
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
      that.sendIdeaView(that.idea_id);
    },
    methods: {
      // 详情信息
      getIdeaDetail(thinksId) {
        let that = this;
        IdeaApi().getIdeaDetail({thinksId}).then(res => {
          that.ieda_detail = res.data;
          const user_infos = res.data.info;
          that.ieda_detail.user_info = user_infos[that.ieda_detail.user_id];
        });
      },
      // 点赞用户列表
      getThumpList(thinksId) {
        IdeaApi().getThumpList({thinksId}).then(res => {
          this.thump_list = Object.values(res.data.list);
        });
      },
      // 评论列表
      getCommentList(thinksId) {
        let that = this;
        IdeaApi().getCommentList({thinksId}).then(res => {
          that.splendid_list = res.data.hot_comments;
          that.common_list = res.data.list;
          const user_infos = res.data.user_infos;
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
      // 单页浏览数增加
      sendIdeaView(thinksId) {
        IdeaApi().sendIdeaView({thinksId});
      },
      // 发送评论
      sendComment(thinksId, commentContent) {
        let that = this;
        IdeaApi().PubishComment({thinksId, commentContent}).then(res => {
          if(res.status) {
            that.textEnabled = {
              status: false,
              text: ''
            };
            that.getCommentList(that.idea_id);
          }
        });
      },
      // 点赞成功
      thumpSuccess() {
        let that = this;
        that.getCommentList(that.idea_id);
      },
      // 评论成功
      commentSuccess() {
        let that = this;
        that.getCommentList(that.idea_id);
      }
    },
    watch: {
      'textEnabled.status'(cur) {
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

