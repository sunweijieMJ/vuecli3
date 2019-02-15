<template>
  <div class="single-list" v-if="show_idea">
    <!-- 列表头部用户信息 -->
    <div class="list-header">
      <div class="header-author">
        <el-popover
          placement="bottom-start"
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
      <el-popover placement="bottom" trigger="click" v-if="vitem.user_id === self_info.user_id">
        <i class="iconfont icon-icon_more" slot="reference"></i>
        <ul class="idea-delete">
          <li @click="deleteIdea(vitem.thinks_id)">删除</li>
        </ul>
      </el-popover>
    </div>
    <!-- 文本内容 -->
    <div class="list-main">
      <div class="main-paragraph" v-if="vitem.content" @click="pathSkip(`/foreground/fore_idea/idea_detail/${vitem.thinks_id}`)">
        <paragraph :text="vitem.content"></paragraph>
        <span v-calcText>全文</span>
      </div>
      <div class="main-images" v-if="vitem.photos && vitem.photos.length">
        <div class="image-box" v-for="(witem, windex) in vitem.photos.slice(0, 4)" :key="windex">
          <img v-calcImg="vitem.photos.length" :src="vitem.photos.length === 1 ? imageSize(witem, 'origin') : witem" alt="" @click="pathSkip(`/foreground/fore_idea/idea_detail/${vitem.thinks_id}`)">
        </div>
        <span v-if="vitem.photos.length > 4">{{vitem.photos.length}}</span>
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
          <i class="iconfont icon-icon_comment" @click.stop="pathSkip(`/foreground/fore_idea/idea_detail/${vitem.thinks_id}`)"></i>
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
    <div class="list-comment" v-if="vitem.replys && vitem.replys.length" @click="pathSkip(`/foreground/fore_idea/idea_detail/${vitem.thinks_id}`)">
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
  import {mapState} from 'vuex';
  import {Paragraph} from './index.js';
  import {UserPopover} from '../popup';
  import IdeaApi from '../../api/Idea.js';
  import frequent from '../../mixins/frequent.js';
  import imageSize from '../../utils/filters/imageSize.js';

  export default {
    props: ['vitem'],
    components: {Paragraph, UserPopover},
    mixins: [frequent],
    data() {
      return {
        imageSize,
        show_idea: true
      };
    },
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
      },
      // 删除想法
      deleteIdea(thinksId) {
        let that = this;
        that.$confirm('确定删除该想法?', '删除', {type: 'warning'}).then(() => {
          IdeaApi().deleteSelfIdea({thinksId, doDel: 1}).then(res => {
            if(res.status) that.show_idea = false;
          });
        });
      }
    },
    directives: {
      calcText: {
        inserted(el) {
          if(el.previousSibling.offsetHeight > 100) {
            el.previousSibling.style.maxHeight = '100px';
          } else {
            el.style.display = 'none';
          }
        }
      },
      calcImg: {
        bind(el, binding) {
          el.onload = () => {
            if(binding.value > 1) return;
            if(el.naturalWidth > el.naturalHeight) {
              el.parentNode.style.width = '360px';
              el.parentNode.style.height = 'initial';
              el.style.height = 'initial';
            } else {
              el.parentNode.style.height = '360px';
              el.parentNode.style.width = 'initial';
              el.style.width = 'initial';
            }
          };
        }
      }
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss" scoped>
  .single-list {
    box-sizing: border-box;
    width: 750px;
    padding: 32px 58px;
    margin-bottom: 4px;
    background-color: #fff;
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      .header-author {
        display: flex;
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
              @extend %textlight;
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
      .iconfont {
        font-size: 20px;
        color: $h1Color;
        cursor: pointer;
        @extend %textlight;
      }
    }
    .list-main {
      overflow: hidden;
      .main-paragraph {
        margin-bottom: 7px;
      }
      .main-images {
        position: relative;
        overflow: hidden;
        .image-box {
          overflow: hidden;
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
          img {
            width: 100%;
            height: 100%;
          }
        }
        span {
          position: absolute;
          right: 10px; bottom: 2px;
          font-size: $h1Font;
          font-weight: 400;
          line-height: 30px;
          color: #fff;
          text-shadow: 0px 0px 4px rgba(0,0,0,0.5);
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
            @extend %imglight;
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
      padding: 15px 20px;
      background-color: $backColor;
      cursor: pointer;
      .comment {
        >li {
          display: flex;
          align-items: center;
          line-height: 1;
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
          h5 {
            white-space: nowrap;
            font-size: $h4Font;
            font-weight: normal;
            color: $linkBlue;
            cursor: pointer;
          }
          p {
            @include tofl(100%);
            font-size: $h4Font;
            color: $h2Color;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .single-list .main-paragraph {
    cursor: pointer;
    p {
      overflow: hidden;
      font-size: $h3Font;
      line-height: 25px;
      color: $h1Color;
      @extend %textlight;
      a {
        font-size: $h3Font;
        color: $linkBlue;
      }
    }
    >span {
      font-size: $h3Font;
      line-height: 25px;
      color: $linkBlue;
    }
  }
  .el-popover {
    .idea-delete {
      li {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        font-size: $h3Color;
        color: $h1Color;
        cursor: pointer;
      }
    }
  }
</style>

