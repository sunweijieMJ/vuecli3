<template>
  <ul class="public-list">
    <li v-for="(vitem, vindex) in list" :key="vindex" @click="skipDetail(1, vitem.iThinksId)">
      <!-- 列表头部用户信息 -->
      <div class="list-header">
        <div class="header-author">
          <img :src="vitem.userinfo.sheaderPhoto" alt="" @click="skipDetail(2, vitem.userinfo.iUserId)">
          <div class="author-name">
            <h4>
              <span class="name">{{vitem.userinfo.sRealName}}</span>
              <span class="stick" v-if="vitem.iIsTop">置顶</span>
            </h4>
            <p>
              <span>{{vitem.userinfo.sDepartmentName}}</span>
              <span>{{vitem.sPublishTime}}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 文本内容 -->
      <div class="list-main">
        <div class="main-paragraph">
          <paragraph :text="vitem.sContent"></paragraph>
        </div>
        <div class="main-images">
          <img v-for="(witem, windex) in vitem.photos.slice(0, 5)" :key="windex" :src="witem.img" alt="" @click.stop="showImage(vitem.photos, windex)">
        </div>
      </div>
      <!-- 时间 | 点赞 | 评论 -->
      <div class="list-num">
        <div class="num-left">
          <p>
            <i class="iconfont icon-ai45"></i>
            <span>{{vitem.iZan}}</span>
          </p>
          <p>
            <i class="iconfont icon-tubiaozhizuo-"></i>
            <span>{{vitem.iCommentNum}}</span>
          </p>
        </div>
        <div class="num-right">
          <p>
            <i class="iconfont icon-ai-eye"></i>
            <span>{{vitem.iViews}}</span>
          </p>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="list-comment">
        <h4>精彩评论</h4>
        <ul class="comment">
          <li v-for="(witem, windex) in vitem.comments" :key="windex">
            <h5>{{witem.sUserName}}：</h5>
            <p>{{witem.sCommentContent}}</p>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>
<script>
  import Paragraph from './Paragraph.js';
  import frequent from '../../mixins/frequent.js';

  export default {
    props: ['list'],
    components: {Paragraph},
    mixins: [frequent],
    methods: {
      skipDetail(type, id) {
        this.$router.push({name: 'IdeaDetail', params: {id}});
      }
    }
  };
</script>
<style lang="scss" scoped>
  .public-list {
    >li {
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
          cursor: pointer;
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
          height: 149px;
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
        .num-left {
          display: flex;
          align-items: center;
          p {
            display: flex;
            align-items: center;
            &:first-child {
              margin-right: 50px;
              cursor: pointer;
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
      .list-comment {
        padding: 15px 25px;
        height: 102px;
        background: rgba(246,246,246,1);
        h4 {
          margin-bottom: 4px;
          font-size:16px;
          font-weight: 400;
          color: #303133;
          line-height: 22px;
        }
        .comment {
          >li {
            display: flex;
            align-items: center;
            line-height: 25px;
            h5 {
              font-size:16px;
              color: #5581C7;
              cursor: pointer;
            }
            p {
              font-size:16px;
              color: #606266;
            }
          }
        }
      }
    }
  }
</style>
