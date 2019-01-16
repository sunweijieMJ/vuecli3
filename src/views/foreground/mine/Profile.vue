<template>
  <div class="profile">
    <div class="profile-user">
      <div class="user">
        <el-upload
          :disabled="!user_info.self"
          :class="{'isSelf': !user_info.self}"
          :accept="'.jpg,.jpeg,.png,.JPEG'"
          class="user-photo"
          :action="upload_url"
          :show-file-list="false"
          :on-success="handleSuccess">
          <img :src="user_info.header_photo" alt="">
          <div class="photo-change" v-if="user_info.self">
            <i class="iconfont icon-icon_camera"></i>
            <span>修改头像</span>
          </div>
        </el-upload>
        <div class="user-msg">
          <div class="msg-name" v-if="nameEnabled.status">
            <span>{{user_info.user_name}}</span>
            <i class="iconfont icon-icon_male1" v-if="user_info.gender === 1"></i>
            <i class="iconfont icon-icon_male" v-if="user_info.gender === 2"></i>
            <a href="javascript:;" @click="nameEnabled.status = false" v-if="user_info.self">修改昵称</a>
          </div>
          <div class="name-modify" v-else>
            <input type="text" maxlength="12" placeholder="昵称每月仅可修改一次" v-model="nameEnabled.name">
            <span @click="nameEnabled.status = true">取消</span>
            <button @click="changeName(user_id, nameEnabled.name)">确认</button>
          </div>
          <div class="msg-detail">
            <p>
              <i class="iconfont icon-icon_user"></i>
              <span>{{user_info.real_name}}</span>
            </p>
            <p>
              <i class="iconfont icon-icon_apartment"></i>
              <span>{{user_info.department_name}}</span>
            </p>
            <p>
              <i class="iconfont icon-icon_phone"></i>
              <span>{{user_info.mobile}}</span>
            </p>
            <p>
              <i class="iconfont icon-icon_mail"></i>
              <span>{{user_info.email}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-msg">
      <div class="list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="瓴里圈" name="first">
            <div class="idea-content" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
              <public-list :list="idea_list"></public-list>
              <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane label="OKR" name="second">
            <public-list :list="[]"></public-list>
          </el-tab-pane> -->
        </el-tabs>
      </div>
      <div class="achieve">
        <h4 class="achieve-title">个人成就</h4>
        <ul class="achieve-detail">
          <li>
            <p>
              <i class="iconfont icon-icon_like"></i>
              <span>收到的赞</span>
            </p>
            <span>{{user_info.zan}}</span>
          </li>
          <li>
            <p>
              <i class="iconfont icon-icon_saw"></i>
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
  import {Loading} from '../../../components/public';
  import {PublicList} from '../../../components/business';

  export default {
    components: {PublicList, Loading},
    data() {
      return {
        upload_url: `${process.env.VUE_APP_UploadURL}upload_image?sign=80448712a43f26ee2485ae58dca29d11`,
        user_id: 0, // ETC 用户ID
        user_info: {}, // ETC 用户信息
        idea_list: [], // ETC 用户想法列表
        activeName: 'first', // ETC 当前选中tab
        nameEnabled: { // ETC 昵称修改状态
          status: true,
          name: ''
        },
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false // ETC 空列表
        }
      };
    },
    created() {
      let that = this;
      that.user_id = +that.$route.params.id;
      that.getUserDetail([that.user_id]);
    },
    methods: {
      // 触底刷新
      infinite() {
        let that = this;
        that.user_id = +that.$route.params.id;

        that.disabled = true;
        that.getIdeaList(that.user_id, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.idea_list.length) {
            that.disabled = true;
            that.loading = {
              nomore: true,
              noresult: true
            };
          } else if(that.pageInfo.current_page >= that.pageInfo.page_total){
            that.disabled = true;
            that.loading.nomore = true;
          }
        });
      },
      // 用户个人信息
      async getUserDetail(userIds) {
        return await UserApi().getUserDetail({userIds}).then(res => {
          this.user_info = res.data;
        });
      },
      // 用户想法列表
      async getIdeaList(userId, curPage) {
        let that = this;
        await IdeaApi().getIdeaList({userId, curPage}).then(res => {
          const idea_list = res.data.list;
          const user_infos = res.data.user_infos;
          that.pageInfo.page_total = Math.ceil(res.data.total / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = idea_list.length; i < ILEN; i++) {
            idea_list[i].user_info = user_infos[idea_list[i].user_id];
            if(!idea_list[i].replys) continue;
            for(let j = 0, JLEN = idea_list[i].replys.length; j < JLEN; j++) {
              idea_list[i].replys[j].user_info = user_infos[idea_list[i].replys[j].user_id];
            }
          }

          that.idea_list = that.idea_list.concat(idea_list);
        });
      },
      // 更新用户信息
      async updateUserMsg({userId, headerPhoto, userName}) {
        return await UserApi().updateUserMsg({userId, headerPhoto, userName}).then(res => {
          if(res.status) this.$store.dispatch('getSelfInfo');
        });
      },
      // 用户icon上传
      handleSuccess(response) {
        let that = this;
        that.updateUserMsg({userId: that.user_id, headerPhoto: response.result.file.image_hash}).then(() => {
          that.getUserDetail([that.user_id]);
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
              that.getUserDetail([that.user_id]).then(() => {
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
    },
    watch: {
      $route(to) {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.getUserDetail([to.params.id]);
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
      background-image: url('../../../../static/img/img_lighter.png'), url('../../../../static/img/img_bg_color.png');
      background-repeat: no-repeat, repeat-x;
      background-position: 77% 10px, 0, 0;
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
        background: rgba(0, 0, 0, 0.6);
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
              font-size: $h2Font;
              &.icon-icon_male1 {
                color: $linkBlue;
              }
              &.icon-icon_male {
                color: $themeColor;
              }
            }
            a {
              margin-left: 10px;
              font-size: $h3Font;
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
              font-size: $h2Font;
              color: #fff;
              &::placeholder{
                font-size: $h2Font;
                color: $h2Color;
              }
              &::-webkit-input-placeholder {
                font-size: $h2Font;
                color: $h2Color;
              }
              &:-moz-placeholder{
                font-size: $h2Font;
                color: $h2Color;
              }
              &::-moz-placeholder{
                font-size: $h2Font;
                color: $h2Color;
              }
              &:-ms-input-placeholder{
                font-size: $h2Font;
                color: $h2Color;
              }
            }
            span {
              margin: 0 27px;
              font-size: $h2Font;
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
              font-size: $h2Font;
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
                font-size: $h2Font;
                color: $h4Color;
              }
              span {
                margin-left: 4px;
                font-size: $h3Font;
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
        height: 213px;
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
        .achieve-title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 56px;
          border-bottom:1px solid $lineColor;
          font-size: $h2Font;
          font-weight: normal;
          color: $h3Color;
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
                margin-right: 7px;
                font-size: $h2Font;
                &.icon-icon_saw {
                  margin-right: 5px;
                  font-size: 20px;
                }
              }
              span {
                font-size: $h3Font;
                color: $h2Color;
              }
            }
            >span {
              font-size: $h1Font;
              color: $themeColor;
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
      .el-tabs__header {
        margin-bottom: 0;
        background-color: #fff;
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
        .el-tabs__nav-wrap {
          padding: 0 60px;
          box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
          margin-bottom: 4px;
          &:after {
            position: static;
          }
          .el-tabs__active-bar {
            height: 3px;
            bottom: 15px;
            background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
          }
          .el-tabs__item {
            height: 56px;
            font-size: $h2Font;
            font-weight: 500;
            line-height: 56px;
            color: $h3Color;
            &.is-active {
              color: $h1Color;
            }
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
      &.isSelf .el-upload{
        cursor: auto;
      }
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
          color: #fff;
          i {
            font-size: 27px;
          }
          span {
            font-size: $h3Color;
          }
        }
      }
    }
  }
</style>
