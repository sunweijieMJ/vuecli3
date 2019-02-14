<template>
  <div class="public-detail">
    <!-- 用户信息 -->
    <div class="detail-author" v-if="detail.user_info">
      <el-popover
        placement="bottom"
        trigger="hover">
        <img slot="reference" @click.stop="paramsSkip('Profile', {id: detail.user_id})" :src="detail.user_info.header_photo" alt="">
        <user-popover :userinfo="detail.user_info"></user-popover>
      </el-popover>
      <div class="author-name">
        <h4>
          <span class="name" @click.stop="paramsSkip('Profile', {id: detail.user_id})">{{detail.user_info.user_name}}</span>
          <span class="stick" v-if="detail.is_top">置顶</span>
        </h4>
        <p>
          <span>{{detail.user_info.department_name}}</span>
          <span>{{detail.create_time | timeFilter}}</span>
        </p>
      </div>
    </div>
    <!-- 详情内容 -->
    <div class="detail-main">
      <div class="main-paragraph" v-if="detail.content">
        <paragraph :text="detail.content"></paragraph>
      </div>
      <div class="main-images" v-if="detail.photos && detail.photos.length">
        <div class="image-box" v-for="(item, index) in detail.photos" :key="index">
          <img v-calcImg="detail.photos.length" :src="detail.photos.length === 1 ? imageSize(item, 'origin') : item" alt="" @click.stop="showImage(detail.photos, index)">
        </div>
      </div>
      <div class="main-num">
        <div class="num-left">
          <p :class="{self_zan: detail.self_zan}">
            <i class="iconfont " @click.stop="thumpIdea(detail.thinks_id)" :class="detail.self_zan ? 'icon-icon_liked_m' : 'icon-icon_like_m'"></i>
            <span>{{detail.zan}}</span>
          </p>
          <p>
            <i class="iconfont icon-icon_comment_m" @click.stop="activeComment"></i>
            <span>{{commentNums}}</span>
          </p>
        </div>
        <div class="num-right">
          <p>
            <i class="iconfont icon-icon_comment_mcopy"></i>
            <span>{{detail.thinks_view_nums}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../api/Idea.js';
  import frequent from '../../mixins/frequent.js';
  import imageSize from '../../utils/filters/imageSize.js';
  import {UserPopover} from '../../components/popup';
  import {Paragraph} from '../../components/business';

  export default {
    components: {Paragraph, UserPopover},
    mixins: [frequent],
    props: ['detail', 'commentNums'],
    data() {
      return {
        imageSize
      };
    },
    methods: {
      // 想法点赞
      thumpIdea(thinksId) {
        let that = this;
        IdeaApi().thumpIdea({thinksId}).then(res => {
          if(res.status) {
            that.detail.self_zan = !that.detail.self_zan;
            that.detail.self_zan ? that.detail.zan++ : that.detail.zan--;
          }
        });
      },
      // 评论回调
      activeComment() {
        this.$emit('activeComment');
      }
    },
    directives: {
      calcImg: {
        bind(el, binding) {
          el.onload = () => {
            if(binding.value > 1) return;
            if(el.naturalWidth > el.naturalHeight) {
              el.parentNode.style.width = '400px';
              el.parentNode.style.height = 'initial';
              el.style.height = 'initial';
            } else {
              el.parentNode.style.height = '400px';
              el.parentNode.style.width = 'initial';
              el.style.width = 'initial';
            }
          };
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .public-detail {
    .detail-author {
      display: flex;
      padding: 20px 66px;
      border-bottom: 1px solid $lineColor;
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
            border:1px solid $themeColor;
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
    .detail-main {
      padding: 0 66px;
      border-bottom: 1px solid $lineColor;
      .main-paragraph {
        margin: 20px 0 8px;
      }
      .main-images {
        width: 668px;
        overflow: hidden;
        .image-box {
          overflow: hidden;
          float: left;
          box-sizing: border-box;
          width: 220px;
          height: 220px;
          margin: 4px 4px 0 0;
          border: 1px solid $lineColor;
          cursor: pointer;
          &:nth-child(3n) {
            margin-right: 0;
          }
          img {
            width: 100%;
            height: 100%;
            transition: all .5s ease-out 0.1s;
            &:hover {
              transform: scale(1.1);
            }
          }
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
              width: 100px;
            }
            span {
              margin-left: 10px;
              font-size: $h2Font;
              line-height: 25px;
              color: $themeColor;
            }
            i {
              font-size: 21px;
              color: $themeColor;
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
              margin-left: 7px;
              font-size: $h2Font;
              line-height: 25px;
              color: $themeColor;
            }
            i {
              font-size: 27px;
              color: $themeColor;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .public-detail .main-paragraph {
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
