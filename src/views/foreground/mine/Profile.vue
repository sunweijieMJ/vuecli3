<template>
  <div class="profile">
    <div class="profile-user">
      <div class="user">
        <div class="user-photo">
          <img src="https://pic2.lanehub.cn/production/bf7aa8df072875322842df4ff220f1d7.jpg?x-oss-process=style/m-00004" alt="">
          <div class="photo-change" @click="chooseIcon">
            <i class="iconfont icon-xiangji"></i>
            <span>修改头像</span>
            <input type="file" name="icon" accept="image/*">
          </div>
        </div>
        <div class="user-msg">
          <div class="msg-name">
            <h4>
              <span>PADDY</span>
              <i class="iconfont icon-personal_ic_man"></i>
            </h4>
            <a href="javascript:;">修改个人资料</a>
          </div>
          <div class="msg-detail">
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>刘沛</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>数字产品部</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>13973330236</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>paddyliu@lanehub.inc</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-msg">
      <div class="list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="想法" name="first">想法</el-tab-pane>
          <el-tab-pane label="OKR" name="second">OKR</el-tab-pane>
        </el-tabs>
      </div>
      <div class="achieve">
        <h4 class="achieve-title">个人成就</h4>
        <ul class="achieve-detail">
          <li>
            <p>
              <i class="iconfont icon-ai45"></i>
              <span>收到的赞</span>
            </p>
            <span>5000</span>
          </li>
          <li>
            <p>
              <i class="iconfont icon-ai45"></i>
              <span>收到的赞</span>
            </p>
            <span>5000</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      chooseIcon() {
        this.$el.querySelector('[type=file]').click();
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .profile {
    background-color: #F6F6F6;
    .profile-user {
      position: relative;
      height: 245px;
      background-image: url('http://static06.lanehub.cn/static/img/cooperate_img_banner.214d771.jpg');
      .user {
        box-sizing: border-box;
        position: absolute;
        left: 0;right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        padding: 0 38px 0 196px;
        width: 1038px;
        height: 107px;
        background: rgba(0, 0, 0, 0.8);
        .user-photo {
          position: absolute;
          left: 58px; top: -28px;
          width: 112px;
          height: 112px;
          border-radius: 50%;
          img {
            width: inherit;
            height: inherit;
            border-radius: inherit;
          }
          &:hover .photo-change{
            display: flex;
            background: rgba(136,135,136,0.8);
          }
          .photo-change {
            position: absolute;
            left: 0;top: 0;
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: inherit;
            height: inherit;
            border-radius: inherit;
            cursor: pointer;
            color: #fff;
            i {
              font-size: 27px;
            }
            span {
              font-size:16px;
            }
            input {
              display: none;
            }
          }
        }
        .user-msg {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          .msg-name {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            h4 {
              display: flex;
              align-items: center;
              span {
                font-size: 24px;
                font-weight: 500;
                color: #fff;
              }
              i {
                margin-left: 8px;
                font-size: 18px;
                color: #5581C7;
              }
            }
            a {
              font-size: 16px;
              font-weight: 400;
              color: #5581C7;
            }
          }
          .msg-detail {
            display: flex;
            align-items: center;
            p {
              display: flex;
              align-items: center;
              margin-right: 57px;
              &:last-child {
                margin-right: 0;
              }
              i {
                font-size: 16px;
                color: #C0C4CC
              }
              span {
                margin-left: 4px;
                font-size: 16px;
                font-weight: 400;
                color:rgba(246,246,246,1);
              }
            }
          }
        }
      }
    }
    .profile-msg {
      display: flex;
      justify-content: space-between;
      width: 1040px;
      height: 300px;
      padding-top: 12px;
      margin: auto;
      .list {

      }
      .achieve {
        width: 275px;
        height: 197px;
        background-color: #fff;
        .achieve-title {
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 56px;
          border:1px solid rgba(246,246,246,1);
        }
        .achieve-detail {
          padding: 30px;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 26px;
            p {
              display: flex;
              align-items: center;
              i {
                font-size: 16px;
              }
              span {
                font-size: 16px;
                font-weight: 400;
                color: #606266;
              }
            }
            >span {
              font-size: 22px;
              font-weight: 400;
              color: #FF7678;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .profile {
    .el-tabs {
      box-sizing: border-box;
      width: 750px;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      background-color: #fff;
      .el-tabs__nav-wrap {
        padding: 0 60px;
        .el-tabs__active-bar {
          bottom: 15px;
          background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
        }
        .el-tabs__item {
          height: 56px;
          line-height: 56px;
          color: #909399;
          &.is-active {
            color: #303133;
          }
        }
      }
    }
  }
</style>
