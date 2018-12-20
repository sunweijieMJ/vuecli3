<template>
  <div class="profile">
    <div class="profile-user">
      <div class="user">
        <div class="user-photo"></div>
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
        <div class="achieve-title">
          <h4>个人成就</h4>
        </div>
        <div class="achieve-detail">

        </div>
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
          background: rgba(136,135,136,1);
          border: 2px solid rgba(136,135,136,1);
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
        .el-tabs {
          width: 750px;
          height: 56px;
          box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
          background-color: #fff;
          li {

          }
        }
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
          h4 {
            text-align: center;
          }
        }
      }
    }
  }
</style>

