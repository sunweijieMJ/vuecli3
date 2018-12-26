<template>
  <div class="user-popover">
    <div class="user">
      <img :src="userinfo.header_photo" alt="">
      <div class="user-info">
        <h4>
          <span>{{userinfo.user_name}}</span>
          <i class="iconfont icon-personal_ic_man"></i>
        </h4>
        <p>
          <span>{{userinfo.real_name}}</span>
          <span>{{userinfo.department_name}}</span>
        </p>
      </div>
    </div>
    <div class="num">
      <li>
        <p>
          <i class="iconfont icon-ai45"></i>
          <span>收到的赞</span>
        </p>
        <span>{{userinfo.zan}}</span>
      </li>
      <li>
        <p>
          <i class="iconfont icon-ai-eye"></i>
          <span>创造的阅读量</span>
        </p>
        <span>{{userinfo.thinks_view_nums}}</span>
      </li>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['userinfo']
  };
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .user-popover {
    width: 360px;
    height: 210px;
    .user {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 98px;
      border-top: 3px solid $themeColor;
      background-color: rgba(0,0,0,0.64);
      img {
        width: 56px;
        height: 56px;
        margin: 0 23px;
        border-radius: 50%;
      }
      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        h4 {
          display: flex;
          align-items: center;
          font-weight: 400;
          span {
            font-size: 16px;
            line-height: 22px;
            color: #fff;
          }
          i {
            margin-left: 5px;
            font-size: 14px;
            color: $linkBlue;
          }
        }
        p {
          span {
            font-size: 14px;
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
      padding: 28px 30px;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:first-child {
          margin-bottom: 9px;
        }
        p {
          i {
            font-size: 16px;
          }
          >span {
            margin-left: 7px;
            font-size: 16px;
            line-height: 22px;
            color: $h2Color;
          }
        }
        >span {
          font-size: 22px;
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
