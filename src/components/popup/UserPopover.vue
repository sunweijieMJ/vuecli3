<template>
  <div class="user-popover" @click.stop="paramsSkip('Profile', {id: userinfo.user_id})">
    <div class="user" v-if="userinfo">
      <img :src="userinfo.header_photo" alt="">
      <div class="user-info">
        <h4>
          <span>{{userinfo.user_name}}</span>
          <i class="iconfont icon-icon_male1" v-if="userinfo.gender === 1"></i>
          <i class="iconfont icon-icon_male" v-if="userinfo.gender === 2"></i>
        </h4>
        <p>
          <span>{{userinfo.real_name}}</span>
          <span>{{userinfo.department_name}}</span>
        </p>
      </div>
    </div>
    <div class="num" v-if="userinfo">
      <li>
        <p>
          <i class="iconfont icon-icon_like"></i>
          <span>收到的赞</span>
        </p>
        <span>{{userinfo.zan}}</span>
      </li>
      <li>
        <p>
          <i class="iconfont icon-icon_saw"></i>
          <span>创造的阅读量</span>
        </p>
        <span>{{userinfo.thinks_view_nums}}</span>
      </li>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  export default {
    mixins: [frequent],
    props: ['userinfo']
  };
</script>
<style lang="scss" scoped>
  .user-popover {
    width: 360px;
    height: 210px;
    cursor: pointer;
    .user {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 98px;
      border-top: 3px solid $themeColor;
      background-color: rgba(0,0,0,0.64);
      img {
        box-sizing: border-box;
        width: 56px;
        height: 56px;
        margin: 0 23px;
        border-radius: 50%;
        border: 1px solid $lineColor;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        h4 {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          font-weight: normal;
          span {
            font-size: $h3Font;
            line-height: 22px;
            color: #fff;
          }
          i {
            margin-left: 5px;
            font-size: $h4Font;
            &.icon-icon_male1 {
              color: $linkBlue;
            }
            &.icon-icon_male {
              color: $themeColor;
            }
          }
        }
        p {
          span {
            font-size: $h4Font;
            line-height: 20px;
            color: #fff;
            &:last-child {
              margin-left: 9px;
            }
          }
        }
      }
    }
    .num {
      padding: 22px 30px;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:first-child {
          margin-bottom: 9px;
          i {
            font-size: 15px;
          }
          span {
            margin-left: 7px;
          }
        }
        p {
          i {
            font-size: 17px;
          }
          >span {
            margin-left: 5px;
            font-size: $h3Font;
            line-height: 22px;
            color: $h2Color;
          }
        }
        >span {
          font-size: $h1Font;
          line-height: 30px;
          color: $themeColor;
        }
      }
    }
  }
</style>
<style lang="scss">
  .el-popover {
    padding: 1px 0 0;
    border: none;
  }
</style>
