<template>
  <div class="single-comment" v-if="show_comment">
    <div class="comment-icon">
      <img :src="item.user_info.header_photo" alt="" @click="paramsSkip('Profile', {id: item.user_info.user_id})">
    </div>
    <div class="comment-info">
      <div class="info-name">
        <p>
          <span @click="paramsSkip('Profile', {id: item.user_info.user_id})">{{item.user_info.user_name}}</span>
          <span v-if="parent_user">&nbsp;(回复)&nbsp;</span>
        </p>
        <p v-if="parent_user">
          <span @click="paramsSkip('Profile', {id: parent_user.user_id})">{{parent_user.user_name}}</span>
        </p>
      </div>
      <div class="info-paragraph">
        <paragraph :text="item.comment_content"></paragraph>
      </div>
      <div class="info-num">
        <div class="num-left">
          <p class="praise" :class="{self_zan: item.self_zan}">
            <i class="iconfont icon-icon_like" @click="thumpComment(item.comment_id)"></i>
            <span>{{item.zan}}</span>
          </p>
          <p class="reply" @click="textEnabled.status = true">
            <i class="iconfont icon-icon_comment"></i>
            <span>回复</span>
          </p>
          <p v-if="item.user_id === self_info.user_id" class="delete" @click="deleteComment(item.comment_id)">
            <i class="iconfont icon-icon_delete1"></i>
            <span>删除</span>
          </p>
        </div>
        <div class="num-right">
          <p>{{item.publish_time | timeFilter}}</p>
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
  import {mapState} from 'vuex';
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
        },
        show_comment: true
      };
    },
    methods: {
      // 发送评论
      sendComment(commentId, commentContent) {
        let that = this;
        const thinksId = +that.$route.params.id;
        if(commentContent.trim()) {
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
        } else {
          that.$message({message: '评论不能为空', type: 'warning'});
        }
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
      },
      // 删除评论
      deleteComment(commentId) {
        let that = this;
        that.$confirm('确定删除该评论?', '删除', {type: 'warning'}).then(() => {
          IdeaApi().deleteSelfComment({commentId}).then(res => {
            if(res.status) that.show_comment = false;
          });
        });
      }
    },
    computed: {
      ...mapState({
        self_info: store => store.self_info
      }),
      parent_user() {
        let that = this;
        if(!(that.root.list && that.root.list.length)) return;
        for(let i = 0, ILEN = that.root.list.length; i < ILEN; i++) {
          if(that.root.list.replys && that.root.list.replys.length) break;
          if(that.item.parent_id === that.root.list[i].comment_id) {
            return that.root.list[i].user_info;
          }
          for(let j = 0, JLEN = that.root.list[i].replys.length; j < JLEN; j++) {
            if(that.item.parent_id === that.root.list[i].replys[j].comment_id) {
              return that.root.list[i].replys[j].user_info;
            }
          }
        }
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
  .single-comment {
    display: flex;
    .comment-icon {
      padding: 14px 0 20px;
      width: 48px;
      img {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid $lineColor;
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
            font-size: $h3Color;
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
            &:first-child {
              width: 70px;
            }
            &:not(first-child) {
              cursor: pointer;
            }
            &.self_zan i{
              color: $themeColor;
            }
            &.delete {
              margin-left: 34px;
            }
            i {
              font-size: 14px;
              color: $h3Color;
              cursor: pointer;
            }
            span {
              margin-left: 4px;
              font-size: $h4Font;
              line-height:20px;
              color: $h3Color;
            }
          }
        }
        .num-right {
          p {
            font-size: 12px;
            line-height: 18px;
            color: $h3Color;
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
          font-size: $h3Font;
          line-height: 28px;
          resize: none;
          border: none;
          &::placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &::-webkit-input-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &:-moz-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &::-moz-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &:-ms-input-placeholder {
            font-size: $h3Font;
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
            font-size: $h3Font;
            font-weight: 500;
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
            font-size: $h3Font;
            font-weight: 500;
            color: #fff;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .single-comment .info-paragraph {
    p {
      font-size: $h3Font;
      line-height: 25px;
      color: $h1Color;
      a {
        font-size: $h3Font;
        color: $linkBlue;
      }
    }
  }
</style>
