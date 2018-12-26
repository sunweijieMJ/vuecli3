<template>
  <div class="profile">
    <div class="profile-user">
      <div class="user">
        <el-upload
          class="user-photo"
          action="http://manageapi.linzhongren.dev.weiheinc.com/upload_image?sign=80448712a43f26ee2485ae58dca29d11"
          :show-file-list="false"
          :on-success="handleSuccess">
          <img :src="user_info.header_photo" alt="">
          <div class="photo-change">
            <i class="iconfont icon-xiangji"></i>
            <span>修改头像</span>
          </div>
        </el-upload>
        <div class="user-msg">
          <div class="msg-name" v-if="nameEnabled.status">
            <span>{{user_info.user_name}}</span>
            <i class="iconfont icon-personal_ic_man"></i>
            <a href="javascript:;" @click="nameEnabled.status = false">修改昵称</a>
          </div>
          <div class="name-modify" v-else>
            <input type="text" placeholder="昵称每月仅可修改一次" v-model="nameEnabled.name">
            <span @click="nameEnabled.status = true">取消</span>
            <button @click="changeName(user_id, nameEnabled.name)">确认</button>
          </div>
          <div class="msg-detail">
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>{{user_info.real_name}}</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>{{user_info.department_name}}</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>{{user_info.mobile}}</span>
            </p>
            <p>
              <i class="iconfont icon-touxiang"></i>
              <span>{{user_info.email}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-msg">
      <div class="list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="想法" name="first">
            <public-list :list="idea_list"></public-list>
          </el-tab-pane>
          <el-tab-pane label="OKR" name="second">
            <public-list :list="[]"></public-list>
          </el-tab-pane>
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
            <span>{{user_info.zan}}</span>
          </li>
          <li>
            <p>
              <i class="iconfont icon-ai45"></i>
              <span>创造的阅读量</span>
            </p>
            <span>{{user_info.thinks_view_nums}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import UserApi from '../../../api/User.js';
  import IdeaApi from '../../../api/Idea.js';
  import {PublicList} from '../../../components/business';

  export default {
    components: {PublicList},
    data() {
      return {
        user_id: this.$route.params.id,
        user_info: {},
        idea_list: [],
        nameEnabled: {
          status: true,
          name: ''
        },
        activeName: 'first'
      };
    },
    created() {
      let that = this;
      that.getUserDetail();
      // that.getIdeaList();
    },
    methods: {
      // 用户个人信息
      async getUserDetail() {
        await UserApi().getUserDetail({userIds: [this.user_id]}).then(res => {
          this.user_info = res.data;
        });
      },
      // 用户想法列表
      getIdeaList() {
        let that = this;
        IdeaApi().getIdeaList({curPage: 1}).then(res => {
          that.idea_list = res.data.lists.thinks_info;
          const user_infos = res.data.lists.user_infos;
          for(let i = 0, ILEN = that.idea_list.length; i < ILEN; i++) {
            that.idea_list[i].user_info = user_infos[that.idea_list[i].user_id];
            if(!that.idea_list[i].replys) continue;
            for(let j = 0, JLEN = that.idea_list[i].replys.length; j < JLEN; j++) {
              that.idea_list[i].replys[j].user_info = user_infos[that.idea_list[i].replys[j].user_id];
            }
          }
        });
      },
      // 更新用户信息
      async updateUserMsg({userId, headerPhoto, userName}) {
        return await UserApi().updateUserMsg({userId, headerPhoto, userName});
      },
      // 用户icon上传
      handleSuccess(response) {
        let that = this;
        that.updateUserMsg({userId: that.user_id, headerPhoto: response.result.file.image_hash}).then(() => {
          that.getUserDetail();
        });
      },
      // 用户昵称修改
      changeName(userId, userName) {
        let that = this;
        if(!userName) {
          this.$message({message: '昵称不能为空', type: 'warning'});
        } else {
          that.updateUserMsg({userId, userName}).then((res) => {
            if(res.status) {
              that.getUserDetail().then(() => {
                that.nameEnabled.status = true;
              });
            }
          });
        }
      },
      // 切换tab
      handleClick(tab) {
        console.log(tab);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_base.scss';

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
        padding-left: 203px;
        width: 1038px;
        height: 107px;
        background: rgba(0, 0, 0, 0.8);
        .user-msg {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          .msg-name {
            display: flex;
            align-items: center;
            height: 40px;
            margin-bottom: 5px;
            span {
              font-size: 24px;
              font-weight: 500;
              line-height: 33px;
              color: #fff;
            }
            i {
              margin-left: 6px;
              font-size: 18px;
              color: #5581C7;
            }
            a {
              margin-left: 10px;
              font-size: 16px;
              color: $linkBlue;
            }
          }
          .name-modify {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            input {
              display: flex;
              align-items: center;
              padding: 0 20px;
              width:280px;
              height:40px;
              background:rgba(0,0,0,1);
              border-radius:20px;
              color: #fff;
              &::placeholder{
                font-size: 18px;
                color: $h2Color;
              }
              &::-webkit-input-placeholder {
                font-size: 18px;
                color: $h2Color;
              }
              &:-moz-placeholder{
                font-size: 18px;
                color: $h2Color;
              }
              &::-moz-placeholder{
                font-size: 18px;
                color: $h2Color;
              }
              &:-ms-input-placeholder{
                font-size: 18px;
                color: $h2Color;
              }
            }
            span {
              margin: 0 27px;
              font-size: 18px;
              font-weight: 500;
              line-height: 25px;
              color: #fff;
              cursor: pointer;
            }
            button {
              width: 90px;
              height: 40px;
              background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
              border-radius: 20px;
              font-size: 18px;
              font-weight: 500;
              line-height: 25px;
              color: #fff;
              cursor: pointer;
            }
          }
          .msg-detail {
            display: flex;
            align-items: center;
            p {
              display: flex;
              align-items: center;
              margin-right: 50px;
              &:last-child {
                margin-right: 0;
              }
              i {
                font-size: 16px;
                color: $h4Color;
              }
              span {
                margin-left: 4px;
                font-size: 16px;
                color: #f6f6f6;
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
  @import '../../../assets/scss/_base.scss';

  .profile {
    .list .el-tabs {
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
          font-size: 18px;
          line-height: 56px;
          color: $h3Color;
          &.is-active {
            color: $h1Color;
          }
        }
      }
    }
    .profile-user .user-photo {
      position: absolute;
      left: 58px; top: -28px;
      width: 112px;
      height: 112px;
      border-radius: 50%;
      .el-upload {
        width: inherit;
        height: inherit;
        border-radius: inherit;
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
        }
      }
    }
  }
</style>
