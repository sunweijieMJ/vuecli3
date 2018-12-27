<template>
  <div class="single-comment">
    <div class="comment-icon">
      <img :src="item.user_info.header_photo" alt="">
    </div>
    <div class="comment-info">
      <h4>
        <span>{{item.user_info.user_name}}</span>
        <span>{{item.user_info.real_name}}</span>
      </h4>
      <paragraph :text="item.comment_content"></paragraph>
      <div class="info-num">
        <div class="num-left">
          <p class="praise" @click="thumpComment(item.comment_id)">
            <i class="iconfont icon-ai45"></i>
            <span>{{item.zan}}</span>
          </p>
          <p class="reply">
            <i class="iconfont icon-tubiaozhizuo-"></i>
            <span @click="textEnabled = true">回复</span>
          </p>
        </div>
        <div class="num-right">
          <span>{{item.publish_time}}</span>
        </div>
      </div>
      <div class="comment-publish" v-if="textEnabled">
        <textarea ref="textarea" :placeholder="`回复${item.user_info.user_name}:`" v-model="comment_content"
          @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)"></textarea>
        <div class="publish-btn">
          <span @click="textEnabled = false">取消</span>
          <button @click="sendComment(item.comment_id, comment_content)">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Paragraph from './Paragraph.js';
  import IdeaApi from '../../api/Idea.js';
  import {autoTextarea} from '../../utils/business/tools.js';

  export default {
    props: ['item'],
    components: {Paragraph},
    data() {
      return {
        autoTextarea,
        textEnabled: false, // ETC textarea激活
        comment_content: '' // ETC 评论内容
      };
    },
    methods: {
      sendComment(commentId, commentContent) {
        let that = this;
        const thinksId = +that.$route.params.id;
        IdeaApi().PubishComment({thinksId, commentId, commentContent}).then(res => {
          if(res.status) {
            that.textEnabled = false;
            that.$emit('commentSuccess');
          }
        });
      },
      // 评论点赞
      thumpComment(commentId) {
        IdeaApi().thumpComment({commentId}).then(res => {
          if(res.status) this.$emit('thumpSuccess');
        });
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
  @import '../../assets/scss/_base.scss';

  .single-comment {
    display: flex;
    .comment-icon {
      padding: 14px 0 20px;
      width: 48px;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
    }
    .comment-info {
      flex: 1;
      margin-left: 12px;
      padding: 27px 0 20px;
      border-bottom: 1px solid $lineColor;
      h4 {
        span {
          font-size:16px;
          line-height:22px;
          color: #5581C7;
          &:last-child {
            color: #909399;
          }
        }
      }
      >p {
        margin: 6px 0 9px;
      }
      .info-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .num-left {
          display: flex;
          align-items: center;
          p {
            display: flex;
            align-items: center;
            margin-right: 33px;
            cursor: pointer;
            i {
              font-size: 16px;
            }
            span {
              margin-left: 4px;
              font-size:14px;
              line-height:20px;
              color: #909399;
            }
          }
        }
        .num-right {
          p {
            font-size: 12px;
            line-height: 18px;
            color: #909399;
          }
        }
      }
      .comment-publish {
        margin-top: 20px;
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          padding: 10px 20px;
          background: $backColor;
          border-radius: 2px;
          font-size: 16px;
          line-height: 28px;
          resize: none;
          border: none;
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
          margin-top: 16px;
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
  }
</style>
