<template>
  <ul class="comment-list">
    <li v-for="(vitem, vindex) in list" :key="vindex">
      <div class="comment-icon">
        <img src="https://pic2.lanehub.cn/production/bf7aa8df072875322842df4ff220f1d7.jpg?x-oss-process=style/m-00004" alt="">
      </div>
      <div class="comment-info">
        <h4>
          <span>PADDY</span>
          <span>(作者)</span>
        </h4>
        <paragraph :text="'PGS今天正式上线啦，大家快去玩。PGS今天正式线啦，大家快去玩起来。PGS天正式上线啦，大家快去玩起来。PGS今天正式线啦，大家快去玩起来。'"></paragraph>
        <div class="info-num">
          <div class="num-left">
            <p class="praise">
              <i class="iconfont icon-tubiaozhizuo-"></i>
              <span>12</span>
            </p>
            <p class="reply">
              <i class="iconfont icon-ai45"></i>
              <span @click="textEnabled = true">回复</span>
            </p>
          </div>
          <div class="num-right">
            <span>2018-12-12 10:30</span>
          </div>
        </div>
        <div class="comment-publish" v-if="textEnabled">
          <textarea placeholder="回复PADDY:"></textarea>
          <div class="publish-btn">
            <span @click="textEnabled = false">取消</span>
            <button @click="sendComment">发送</button>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
  import Paragraph from './Paragraph.js';

  export default {
    components: {Paragraph},
    props: ['list'],
    data() {
      return {
        textEnabled: false
      };
    },
    methods: {
      sendComment() {
        this.textEnabled = true;
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .comment-list {
    li {
      display: flex;
      padding: 14px 0 20px;
      border-bottom: 1px solid $lineColor;
      &:last-child {
        border-bottom: 0;
      }
      .comment-icon {
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
        padding-top: 13px;
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
              i {
                font-size: 16px;
              }
              span {
                margin-left: 4px;
                font-size:14px;
                line-height:20px;
                color: #909399;
              }
              &.reply {
                cursor: pointer;
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
            width: 100%;
            height: 28px;
            padding: 10px 20px;
            background: $backColor;
            border-radius: 2px;
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
  }
</style>

