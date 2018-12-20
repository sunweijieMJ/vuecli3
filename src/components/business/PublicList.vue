<template>
  <ul class="public-list">
    <li>
      <!-- 列表头部用户信息 -->
      <div class="list-header">
        <div class="header-author">
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
      </div>
      <!-- 文本内容 -->
      <div class="list-main">
        <div class="main-paragraph">
          <paragraph :text="'PGS今天正式上线啦，大家快去玩。PGS今天正式线啦，大家快去玩起来。PGS天正式上线啦，大家快去玩起来。PGS今天正式线啦，大家快去玩起来。'"></paragraph>
        </div>
        <div class="main-images">
          <img v-for="(witem, windex) in 5" :key="windex" src="https://pic2.lanehub.cn/production/37a84f42381015e1396997d28baa7608.jpg?x-oss-process=style/m-00001" alt="">
        </div>
      </div>
      <!-- 时间 | 点赞 | 评论 -->
      <div class="list-num">
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
      <!-- 评论区 -->
      <div class="list-comment">

      </div>
    </li>
  </ul>
</template>
<script>
  import Paragraph from './Paragraph.js';

  export default {
    components: {Paragraph}
  };
</script>

<style lang="scss" scoped>
  .public-list {
    li {
      box-sizing: border-box;
      width: 750px;
      padding: 32px 58px;
      margin-top: 4px;
      background-color: #fff;
      .list-header .header-author {
        display: flex;
        margin-bottom: 12px;
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
      .list-main {
        .main-paragraph {
          margin-bottom: 7px;
        }
        .main-images {
          display: flex;
          overflow: hidden;
          img {
            width: 149px;
            height: 149px;
            margin-right: 3px;
          }
        }
      }
      .list-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 21px 0;
        border-bottom: 1px solid rgba(246,246,246,1);
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
  }
</style>
