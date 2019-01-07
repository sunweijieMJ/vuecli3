<template>
  <el-container>
    <el-header>
      <nav>
        <ul class="nav-left">
          <h1 @click="querySkip('IdeaList')">
            <img src="../../static/svg/icon_PGS.svg" alt=""/>
          </h1>
          <li v-for="(vitem, vindex) in router.slice(0, 2)" :key="vindex" :class="{active: vindex === current}">
            <a href="javascript:;" @click="select(vitem, vindex)">{{vitem.text}}</a>
          </li>
        </ul>
        <div class="nav-right">
          <el-badge :value="unread_msg.num ? unread_msg.num : ''">
            <el-popover placement="bottom" trigger="hover" v-model="unread_msg.show" :disabled="!unread_msg.num">
              <i slot="reference" class="iconfont icon-icon_inbox" @click="querySkip('NewsList')" @mouseenter="message.read || getMessageList()"></i>
              <div class="message">
                <ul>
                  <li v-for="(witem, windex) in message.list" :key="windex" @click="querySkip('NewsList')">
                    <p>
                      <span @click.stop="unread_msg.show = false || paramsSkip('Profile', {id: witem.user_info.user_id})">{{witem.user_info.user_name}}</span>在
                      <span @click.stop="unread_msg.show = false || paramsSkip('IdeaDetail', {id: witem.business_id})">{{readMore(witem.origin_msg.content, 30, '...')}}</span>中评论了你的想法
                    </p>
                  </li>
                </ul>
                <a v-if="message.list.length" href="javascript:;" @click="unread_msg.show = false || querySkip('NewsList')">全部提醒</a>
              </div>
            </el-popover>
          </el-badge>
          <el-dropdown @command="handleCommand" trigger="hover">
            <img :src="self_info.header_photo" alt="" @click="paramsSkip('Profile', {id: self_info.user_id})">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="homepage">我的主页</el-dropdown-item>
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="admin" @click="querySkip('IdeaManage')" v-if="self_info.is_manage">
            <i class="iconfont icon-icon_manage"></i>
            <span>管理员</span>
          </div>
        </div>
      </nav>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
  import {mapState} from 'vuex';
  import storage from '../utils/storage';
  import UserApi from '../api/User.js';
  import NoticeApi from '../api/Notice.js';
  import frequent from '../mixins/frequent.js';
  import readMore from '../utils/filters/readMore.js';

  export default {
    mixins: [frequent],
    data() {
      return {
        current: 0,
        router: [
          {
            text: '瓴里圈',
            name: 'IdeaList'
          },
          // {
          //   text: 'OKR',
          //   name: 'OKRList'
          // }
        ],
        readMore,
        message: { // ETC 未读消息列表
          read: false,
          list: []
        }
      };
    },
    created() {
      let that = this;
      that.getUserDetail();
      that.$store.dispatch('getMessageUnread');
    },
    methods: {
      // 用户个人信息
      getUserDetail() {
        UserApi().getUserDetail({}).then(res => {
          if(res.status) this.$store.dispatch('getSelfInfo', res.data);
        });
      },
      // 切换tab
      select(item, index) {
        this.current = index;
        this.$router.push({name: item.name});
      },
      // 消息列表
      getMessageList() {
        let that = this;
        NoticeApi().getMessageList({waitRead: 1, pages: 4}).then(res => {
          const origin_msg = res.data.origin_msg;
          const users_info = res.data.users_info;
          that.message.list = res.data.list;
          that.message.read = true;
          // 数据整理
          for(let i = 0, LEN = that.message.list.length; i < LEN; i++) {
            that.message.list[i].user_info = users_info[that.message.list[i].push_user_id];
            that.message.list[i].origin_msg = origin_msg[that.message.list[i].business_type][that.message.list[i].business_id];
          }
        });
      },
      // 个人主页/退出登录
      handleCommand(command) {
        let that = this;
        switch (command) {
          case 'homepage':
            that.$router.push({name: 'Profile', params: {id: that.self_info.user_id}});
            break;
          case 'exit':
            that.$confirm('确定注销用户?', '注销', {type: 'warning'}).then(() => {
              storage('cookie').remove('pgs_authinfo');
              that.$router.push({name: 'Login'});
            }).catch(() => {});
            break;
          default:
            break;
        }
      }
    },
    computed: mapState({
      self_info: store => store.self_info,
      unread_msg: store => store.unread_msg
    })
  };
</script>
<style lang="scss" scoped>
  @import '../assets/scss/_base.scss';

  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      height: 60px;
      background-color: #fff;
      nav {
        display: flex;
        justify-content: space-between;
        width: 1040px;
        min-width: 1040px;
        margin: auto;
        h1 {
          cursor: pointer;
          img {
            width: 62px;
          }
        }
        .nav-left {
          display: flex;
          align-items: center;
          li {
            margin-left: 36px;
            &.active a{
              color:rgba(48,49,51,1);
            }
            a {
              font-size:18px;
              font-weight:500;
              color:rgba(144,147,153,1);
            }
            img {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              cursor: pointer;
            }
            i {
              font-size: 36px;
              cursor: pointer;
            }
          }
        }
        .nav-right {
          display: flex;
          align-items: center;
          .el-badge {
            i {
              font-size: 26px;
              color: $h1Color;
              cursor: pointer;
            }
          }
          .el-dropdown {
            margin-left: 36px;
            img {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              cursor: pointer;
            }
          }
          .admin {
            display: flex;
            align-items: center;
            margin-left: 40px;
            padding-left: 40px;
            border-left: 1px solid #DEDEDE;
            cursor: pointer;
            i {
              font-size: 25px;
            }
            span {
              margin-left: 8px;
              font-size: 18px;
              line-height: 25px;
              color: $h1Color;
            }
          }
        }
      }
    }
    .el-main {
      min-height: calc(100% - 60px);
      padding: 0;
      background-color: #F6F6F6;
    }
  }
</style>
<style lang="scss">
  @import '../assets/scss/_base.scss';

  html, body, #app {
    height: 100%;
  }
  .el-header {
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05) inset;
  }
  .el-popover {
    padding: 1px 0 0;
    border: none;
    .message {
      width: 340px;
      ul {
        li {
          padding: 14px 22px;
          border-bottom: 1px solid $lineColor;
          font-size: 16px;
          line-height: 25px;
          p {
            color: $h1Color;
            span {
              color: $linkBlue;
              cursor: pointer;
            }
          }
        }
      }
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 55px;
        font-size: 16px;
        color: $linkBlue;
      }
    }
  }
  .el-dropdown-menu {
    padding: 20px 0;
    .el-dropdown-menu__item {
      padding: 0 40px;
      font-size: 16px;
      line-height: 30px;
      color: $h1Color;
      &:first-child {
        margin-bottom: 20px;
      }
      &:hover {
        color: $h1Color;
        background-color: #ccc;
      }
    }
  }
</style>

