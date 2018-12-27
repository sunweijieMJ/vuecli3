<template>
  <div class="single-list" @click="paramsSkip('IdeaDetail', {id: vitem.thinks_id})">
    <!-- 列表头部用户信息 -->
    <div class="list-header">
      <div class="header-author">
        <el-popover
          placement="bottom"
          trigger="hover">
          <img slot="reference" :src="vitem.user_info.header_photo" alt="" @click.stop="paramsSkip('Profile', {id: vitem.user_info.user_id})">
          <user-popover :userinfo="vitem.user_info"></user-popover>
        </el-popover>
        <div class="author-name">
          <h4>
            <span class="name">{{vitem.user_info.user_name}}</span>
            <span class="stick" v-if="vitem.is_top">置顶</span>
          </h4>
          <p>
            <span>{{vitem.user_info.department_name}}</span>
            <span>{{vitem.publish_time}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 文本内容 -->
    <div class="list-main">
      <div class="main-paragraph" v-if="vitem.content">
        <paragraph :text="vitem.content"></paragraph>
      </div>
      <div class="main-images" v-if="vitem.photos.length">
        <img v-for="(witem, windex) in vitem.photos.slice(0, 5)" :key="windex" :src="witem" alt="" @click.stop="showImage(vitem.photos, windex)">
      </div>
    </div>
    <!-- 时间 | 点赞 | 评论 -->
    <div class="list-num">
      <div class="num-left">
        <p @click.stop="thumpIdea(vitem.thinks_id)">
          <i class="iconfont icon-ai45" :class="{self_zan: vitem.self_zan}"></i>
          <span>{{vitem.zan}}</span>
        </p>
        <p @click.stop="pathSkip(`IdeaDetail/${vitem.thinks_id}`, {active: true})">
          <i class="iconfont icon-tubiaozhizuo-"></i>
          <span>{{vitem.total_comments}}</span>
        </p>
      </div>
      <div class="num-right">
        <p>
          <i class="iconfont icon-ai-eye"></i>
          <span>{{vitem.thinks_view_nums}}</span>
        </p>
      </div>
    </div>
    <!-- 评论区 -->
    <div class="list-comment" v-if="vitem.replys.length">
      <h4>精彩评论</h4>
      <ul class="comment">
        <li v-for="(witem, windex) in vitem.replys" :key="windex">
          <h5 @click.stop="paramsSkip('Profile', {id: witem.user_info.user_id})">{{witem.user_info.user_name}}：</h5>
          <p>{{witem.comment_content}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {Paragraph} from './index.js';
  import {UserPopover} from '../popup';
  import IdeaApi from '../../api/Idea.js';
  import frequent from '../../mixins/frequent.js';

  export default {
    props: ['vitem'],
    components: {Paragraph, UserPopover},
    mixins: [frequent],
    methods: {
      // 想法点赞
      thumpIdea(thinksId) {
        IdeaApi().thumpIdea({thinksId}).then(res => {
          if(res.status) this.$emit('thumpIdeaSuccess');
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .single-list {
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
            border: 1px solid $themeColor;
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
            font-size: 14px;
            line-height: 20px;
            color: $h3Color;
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
        overflow-x: auto;
        img {
          width: 149px;
          height: 149px;
          margin-right: 3px;
          cursor: pointer;
        }
      }
    }
    .list-num {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      .num-left {
        display: flex;
        align-items: center;
        p {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:first-child {
            margin-right: 50px;
            i {
              color: $h2Color;
              &.self_zan {
                color: $themeColor;
              }
            }
          }
          span {
            margin-left: 7px;
            font-size: 16px;
            line-height: 22px;
            color: $h2Color;
          }
          i {
            font-size:18px;
            color: $h2Color;
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
            margin-left: 5px;
            font-size: 16px;
            line-height: 22px;
            color: $h2Color;
          }
          i {
            font-size: 18px;
            color: $h2Color;
          }
        }
      }
    }
    .list-comment {
      margin-top: 20px;
      padding: 15px 25px;
      background-color: $backColor;
      h4 {
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 500;
        color: $h1Color;
        line-height: 22px;
      }
      .comment {
        >li {
          display: flex;
          align-items: center;
          line-height: 25px;
          h5 {
            font-size: 16px;
            font-weight: 400;
            color: $linkBlue;
            cursor: pointer;
          }
          p {
            @include tofl(520px);
            font-size:16px;
            color: $h2Color;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  @import '../../assets/scss/_base.scss';

  .single-list .main-paragraph {
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

