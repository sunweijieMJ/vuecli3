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
  </div>
</template>
<script>
  import {Paragraph} from '../../components/business';
  import {UserPopover} from '../../components/popup';

  export default {
    components: {Paragraph, UserPopover},
    props: ['detail']
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
