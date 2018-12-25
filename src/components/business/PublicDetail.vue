<template>
  <div class="public-detail">
    <!-- 用户信息 -->
    <div class="detail-author" v-if="detail.info && detail.info[0]">
      <el-popover
        placement="bottom"
        trigger="hover">
        <img slot="reference" :src="detail.info[0].header_photo" alt="">
        <user-popover :userinfo="detail.info[0]"></user-popover>
      </el-popover>
      <div class="author-name">
        <h4>
          <span class="name">{{detail.info[0].user_name}}</span>
          <span class="stick" v-if="detail.is_top">置顶</span>
        </h4>
        <p>
          <span>{{detail.info[0].department_name}}</span>
          <span>{{detail.create_time}}</span>
        </p>
      </div>
    </div>
    <!-- 详情内容 -->
    <div class="detail-main">
      <div class="main-paragraph">
        <paragraph v-if="detail.content" :text="detail.content"></paragraph>
      </div>
      <div class="main-images">
        <img v-for="(item, index) in detail.photos" :key="index" :src="item" alt="">
      </div>
      <div class="main-num">
        <div class="num-left">
          <p>
            <i class="iconfont icon-ai45"></i>
            <span>{{detail.zan}}</span>
          </p>
          <p>
            <i class="iconfont icon-tubiaozhizuo-"></i>
            <span>{{detail.zan}}</span>
          </p>
        </div>
        <div class="num-right">
          <p>
            <i class="iconfont icon-ai-eye"></i>
            <span>{{detail.thinks_view_nums}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 赞和评论 -->
    <div class="detail-thump">
      <div class="thump-title">
        他们都觉得很赞
      </div>
      <div class="thump-icon">
        <img v-for="(val, i) in 30" :key="i" src="https://pic2.lanehub.cn/production/bf7aa8df072875322842df4ff220f1d7.jpg?x-oss-process=style/m-00004" alt="">
      </div>
    </div>
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
  </div>
</template>
<script>
  import {Paragraph} from '../../components/business';
  import {autoTextarea} from '../../utils/business/tools.js';
  import {UserPopover} from '../../components/popup';

  export default {
    components: {Paragraph, UserPopover},
    props: ['detail'],
    data() {
      return {
        autoTextarea,
        textEnabled: false
      };
    },
    methods: {
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
  @import '../../assets/scss/_base.scss';

  .public-detail {
    .detail-author {
      display: flex;
      padding: 20px 66px;
      border-bottom: 1px solid $lineColor;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
      .author-name {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 18px;
        h4 {
          display: flex;
          align-items: center;
          font-weight: 400;
          .name {
            margin-right: 15px;
            font-size: 16px;
            line-height: 22px;
            color: $h1Color;
          }
          .stick {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 20px;
            border-radius: 2px;
            border:1px solid $themeColor;
            font-size: 14px;
            line-height: 20px;
            color: $themeColor;
          }
        }
        p {
          display: flex;
          align-items: center;
          span {
            margin-right: 14px;
            font-size:14px;
            line-height: 20px;
            color: $h3Color;
          }
        }
      }
    }
    .detail-main {
      padding: 0 66px;
      border-bottom: 1px solid $lineColor;
      .main-paragraph {
        margin: 20px 0 8px;
      }
      .main-images {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        width: 668px;
        img {
          display: flex;
          width: 220px;
          height: 220px;
          margin-top: 4px;
        }
      }
      .main-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px;
        .num-left {
          display: flex;
          align-items: center;
          p {
            display: flex;
            align-items: center;
            &:first-child {
              margin-right: 50px;
            }
            span {
              margin-left: 10px;
              font-size: 18px;
              line-height: 25px;
              color: $themeColor;
            }
            i {
              font-size: 20px;
              color: $themeColor;
            }
          }
        }
        .num-right {
          display: flex;
          align-items: center;
          p {
            display: flex;
            align-items: center;
            span {
              margin-left: 7px;
              font-size: 18px;
              line-height: 25px;
              color: $themeColor;
            }
            i {
              font-size: 20px;
              color: $themeColor;
            }
          }
        }
      }
    }
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
  }
</style>
<style lang="scss">
  @import '../../assets/scss/_base.scss';

  .public-detail .main-paragraph {
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
