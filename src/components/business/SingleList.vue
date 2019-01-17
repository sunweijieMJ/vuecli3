<template>
  <div class="single-list">
    <!-- 列表头部用户信息 -->
    <div class="list-header">
      <div class="header-author">
        <el-popover
          placement="bottom"
          trigger="hover">
          <img slot="reference" v-if="vitem.user_info" :src="vitem.user_info.header_photo" alt="" @click.stop="paramsSkip('Profile', {id: vitem.user_info.user_id})">
          <user-popover :userinfo="vitem.user_info"></user-popover>
        </el-popover>
        <div class="author-name">
          <h4>
            <span class="name" v-if="vitem.user_info" @click.stop="paramsSkip('Profile', {id: vitem.user_info.user_id})">{{vitem.user_info.user_name}}</span>
            <span class="stick" v-if="vitem.is_top">置顶</span>
          </h4>
          <p>
            <span v-if="vitem.user_info">{{vitem.user_info.department_name}}</span>
            <span>{{vitem.publish_time | timeFilter}}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 文本内容 -->
    <div class="list-main">
      <div class="main-paragraph" v-if="vitem.content" @click="paramsSkip('IdeaDetail', {id: vitem.thinks_id})">
        <paragraph :text="vitem.content"></paragraph>
      </div>
      <div class="main-images" v-if="vitem.photos && vitem.photos.length">
        <img v-for="(witem, windex) in vitem.photos.slice(0, 4)" :key="windex" :src="witem" alt="" @click="paramsSkip('IdeaDetail', {id: vitem.thinks_id})">
        <span v-if="vitem.photos.length > 4">共{{vitem.photos.length}}张</span>
      </div>
    </div>
    <!-- 时间 | 点赞 | 评论 -->
    <div class="list-num">
      <div class="num-left">
        <p>
          <i class="iconfont icon-icon_like" @click.stop="thumpIdea(vitem.thinks_id)" :class="{self_zan: vitem.self_zan}"></i>
          <span>{{vitem.zan}}</span>
        </p>
        <p>
          <i class="iconfont icon-icon_comment" @click.stop="paramsSkip('IdeaDetail', {id: vitem.thinks_id})"></i>
          <span>{{vitem.total_comments}}</span>
        </p>
      </div>
      <div class="num-right">
        <p>
          <i class="iconfont icon-icon_saw"></i>
          <span>{{vitem.thinks_view_nums}}</span>
        </p>
      </div>
    </div>
    <!-- 评论区 -->
    <div class="list-comment" v-if="vitem.replys && vitem.replys.length">
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
        let that = this;
        IdeaApi().thumpIdea({thinksId}).then(res => {
          if(res.status) {
            that.vitem.self_zan = !that.vitem.self_zan;
            that.vitem.self_zan ? that.vitem.zan++ : that.vitem.zan--;
          }
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
    margin-bottom: 4px;
    background-color: #fff;
    .list-header .header-author {
      display: flex;
      margin-bottom: 12px;
      img {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid $lineColor;
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
          font-weight: normal;
          .name {
            margin-right: 15px;
            font-size: $h3Font;
            line-height: 22px;
            color: $h1Color;
            cursor: pointer;
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
            font-size: $h4Font;
            line-height: 20px;
            color: $themeColor;
          }
        }
        p {
          display: flex;
          align-items: center;
          span {
            margin-right: 14px;
            font-size: $h4Font;
            line-height: 20px;
            color: $h3Color;
          }
        }
      }
    }
    .list-main {
      overflow: hidden;
      .main-paragraph {
        margin-bottom: 7px;
        cursor: pointer;
      }
      .main-images {
        position: relative;
        height: 149px;
        overflow: hidden;
        img {
          float: left;
          box-sizing: border-box;
          width: 156px;
          height: 156px;
          border: 1px solid $lineColor;
          margin-right: 3px;
          cursor: pointer;
          &:last-of-type {
            margin-right: 0;
          }
        }
        span {
          position: absolute;
          right: 8px; bottom: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 20px;
          border-radius: 12px;
          background-color: rgba(48,49,51,0.3);;
          font-size: 14px;
          font-weight: 400;
          color: #fff;
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
          &:first-child {
            width: 100px;
            i {
              &.self_zan {
                color: $themeColor;
              }
            }
          }
          span {
            margin-left: 7px;
            font-size: $h3Font;
            line-height: 22px;
            color: $h2Color;
          }
          i {
            font-size: 16px;
            color: $h2Color;
            cursor: pointer;
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
            font-size: $h3Font;
            line-height: 20px;
            color: $h2Color;
          }
          i {
            font-size: 20px;
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
        font-size: $h3Font;
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
            font-size: $h3Font;
            font-weight: normal;
            color: $linkBlue;
            cursor: pointer;
          }
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -ms-text-overflow: ellipsis;
            font-size: $h3Color;
            color: $h1Color;
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
      @include erow(4);
      max-height: 100px;
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

