
<template>
  <div class="idea-detail">
    <!-- 用户信息 -->
    <div class="detail-author">
      <img src="https://pic2.lanehub.cn/production/bf7aa8df072875322842df4ff220f1d7.jpg?x-oss-process=style/m-00004" alt="">
      <div class="author-name">
        <h4>
          <span class="name">PADDY</span>
          <span class="stick" v-if="1">置顶</span>
        </h4>
        <p>
          <span>数字产品部</span>
          <span>2018-12-31 10:30</span>
        </p>
      </div>
    </div>
    <!-- 详情内容 -->
    <div class="detail-main">
      <paragraph :text="'PGS今天正式上线啦，大家快去玩。PGS今天正式线啦，大家快去玩起来。PGS天正式上线啦，大家快去玩起来。PGS今天正式线啦，大家快去玩起来。'"></paragraph>
      <div class="main-images">
        <img v-for="(item, index) in 6" :key="index" src="https://pic2.lanehub.cn/production/37a84f42381015e1396997d28baa7608.jpg?x-oss-process=style/m-00001" alt="">
      </div>
      <div class="main-num">
        <div class="num-left">
          <p>
            <i class="iconfont icon-ai45"></i>
            <span>123</span>
          </p>
          <p>
            <i class="iconfont icon-tubiaozhizuo-"></i>
            <span>123</span>
          </p>
        </div>
        <div class="num-right">
          <p>
            <i class="iconfont icon-ai-eye"></i>
            <span>123</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 赞和评论 -->
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
  import {Paragraph, CommentList} from '../../../components/business';

  export default {
    components: {Paragraph, CommentList}
  };
</script>

<style lang="scss" scoped>
  .idea-detail {
    width: 800px;
    margin: 12px auto 0;
    background-color: #fff;
    .detail-author {
      display: flex;
      padding: 20px 66px;
      border-bottom: 1px solid #F6F6F6;
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
          .name {
            margin-right: 10px;
            font-size:16px;
            font-weight:400;
            color:rgba(48,49,51,1);
          }
          .stick {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            width:36px;
            height:19px;
            border-radius:2px;
            border:1px solid rgba(255,118,120,1);
            font-size:14px;
            color:rgba(255,118,120,1);
          }
        }
        p {
          display: flex;
          align-items: center;
          span {
            margin-right: 14px;
            font-size:14px;
            font-weight:400;
            color:rgba(144,147,153,1);
          }
        }
      }
    }
    .detail-main {
      padding: 20px 66px;
      border-bottom: 1px solid #F6F6F6;
      >p {
        margin-bottom: 4px;
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
        padding: 30px 0 10px;
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
              margin-left: 3px;
              font-size:16px;
              font-weight:400;
              color:rgba(96,98,102,1);
            }
            i {
              font-size:18px;
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
              margin-left: 3px;
              font-size:16px;
              font-weight:400;
              color:rgba(96,98,102,1);
            }
            i {
              font-size:18px;
            }
          }
        }
      }
    }
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

