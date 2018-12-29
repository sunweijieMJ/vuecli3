<template>
  <div class="single-comment">
    <div class="comment-icon">
      <img :src="item.user_info.header_photo" alt="" @click="paramsSkip('Profile', {id: item.user_info.user_id})">
    </div>
    <div class="comment-info">
      <div class="info-name">
        <p>
          <span @click="paramsSkip('Profile', {id: item.user_info.user_id})">{{item.user_info.user_name}}</span>
          <span v-if="root.user_info">&nbsp;(回复)&nbsp;</span>
        </p>
        <p v-if="root.user_info">
          <span @click="paramsSkip('Profile', {id: root.user_info.user_id})">{{root.user_info.user_name}}</span>
        </p>
      </div>
      <div class="info-paragraph">
        <paragraph :text="item.comment_content"></paragraph>
      </div>
      <div class="info-num">
        <div class="num-left">
          <p class="praise" @click="thumpComment(item.comment_id)" :class="{self_zan: item.self_zan}">
            <i class="iconfont icon-ai45"></i>
            <span>{{item.zan}}</span>
          </p>
          <p class="reply">
            <i class="iconfont icon-pinglun"></i>
            <span @click="textEnabled.status = true">回复</span>
          </p>
        </div>
        <div class="num-right">
          <span>{{item.publish_time}}</span>
        </div>
      </div>
      <div class="comment-publish" v-if="textEnabled.status">
        <textarea ref="textarea" :placeholder="`回复${item.user_info.user_name}:`" v-model="textEnabled.text"
          @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)"></textarea>
        <div class="publish-btn">
          <span @click="textEnabled.status = false">取消</span>
          <button @click="sendComment(item.comment_id, textEnabled.text)">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Paragraph from './Paragraph.js';
  import IdeaApi from '../../api/Idea.js';
  import frequent from '../..//mixins/frequent.js';
  import {autoTextarea} from '../../utils/business/tools.js';

  export default {
    props: ['item', 'root'],
    components: {Paragraph},
    mixins: [frequent],
    data() {
      return {
        autoTextarea,
        textEnabled: { // ETC textarea激活
          status: false,
          text: ''
        }
      };
    },
    methods: {
      // 发送评论
      sendComment(commentId, commentContent) {
        let that = this;
        const thinksId = +that.$route.params.id;
        IdeaApi().PubishComment({thinksId, commentId, commentContent}).then(res => {
          if(res.status) {
            that.textEnabled.status = false;
            if(that.root.hasOwnProperty('index')) {
              that.$emit('commentSuccess', {data: res.data, id: that.root.comment_id, index: that.root.index});
            } else {
              that.$emit('commentSuccess', {data: res.data, id: that.root.comment_id});
            }
          }
        });
      },
      // 评论点赞
      thumpComment(commentId) {
        let that = this;
        IdeaApi().thumpComment({commentId}).then(res => {
          if(res.status) {
            that.item.self_zan = !that.item.self_zan;
            that.item.self_zan ? that.item.zan++ : that.item.zan--;
          }
        });
      }
    },
    watch: {
      'textEnabled.status'(cur) {
        let that = this;
        if(cur) {
          that.$nextTick(() => {
            that.$refs.textarea.focus();
          });
        } else {
          const textarea = that.$el.querySelector('.comment-publish textarea');
          that.textEnabled = {
            status: false,
            text: ''
          };
          autoTextarea(textarea);
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
        cursor: pointer;
      }
    }
    .comment-info {
      flex: 1;
      margin-left: 12px;
      padding: 27px 0 20px;
      border-bottom: 1px solid $lineColor;
      .info-name {
        display: flex;
        align-items: center;
        p {
          display: flex;
          align-items: center;
          span {
            font-size:16px;
            line-height:22px;
            color: $h3Color;
            cursor: pointer;
            &:first-child {
              color: $linkBlue;
            }
          }
        }
      }
      .info-paragraph {
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
            cursor: pointer;
            &:first-child {
              width: 70px;
            }
            &.self_zan {
              color: $themeColor;
            }
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
<style lang="scss">
  @import '../../assets/scss/_base.scss';

  .single-comment .info-paragraph {
    p {
      font-size: 16px;
      line-height: 25px;
      color: $h2Color;
      a {
        font-size: 16px;
        color: $linkBlue;
      }
    }
  }
</style>
