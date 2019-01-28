<template>
  <div class="foreground">
    <div class="header-box">
      <div class="header">
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
                        <span @click.stop="unread_msg.show = false || paramsSkip('IdeaDetail', {id: witem.origin_msg.thinks_id})">{{readMore(witem.origin_msg.content, 30, '...')}}</span>中{{witem.message_title}}
                      </p>
                    </li>
                  </ul>
                  <a v-if="message.list.length" href="javascript:;" @click="unread_msg.show = false || querySkip('NewsList')">全部提醒</a>
                </div>
              </el-popover>
            </el-badge>
            <el-dropdown @command="handleCommand" trigger="hover">
              <img :src="self_info.header_photo" alt="" @click="paramsSkip('Profile', {id: self_info.user_id})">
              <el-dropdown-menu slot="dropdown" class="nav-user">
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
      </div>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import storage from '../utils/storage';
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
          {
            text: 'OKR',
            name: 'OKRList'
          }
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
      // 暂时
      if(that.$route.matched[1].path === '/foreground/fore_okr') {
        that.current = 1;
      }
      that.$store.dispatch('getSelfInfo');
      that.$store.dispatch('getMessageUnread');
    },
    methods: {
      // 切换tab
      select(item, index) {
        this.current = index;
        if(index === 1) {
          this.$router.push({name: 'OKRList', query: {okr_type: 0}});
        } else {
          this.$router.push({name: item.name});
        }
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
            });
            break;
          default:
            break;
        }
      },
      listenScroll() {
        let that = this;
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
        switch (that.$route.name) {
          case 'IdeaList':
            storage('localstorage').set('IdeaList', scrollTop);
            break;
          case 'TopicList':
            storage('localstorage').set('TopicList', scrollTop);
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
  .foreground {
    .header-box {
      position: relative;
      height: 60px;
      .header {
        display: flex;
        align-items: center;
        height: 60px;
        position: fixed;
        left: 0; right: 0;
        z-index: 2000;
        background-color: #fff;
        box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 1040px;
          min-width: 1040px;
          margin: auto;
          .nav-left {
            display: flex;
            align-items: center;
            h1 {
              cursor: pointer;
              img {
                width: 62px;
              }
            }
            li {
              margin-left: 36px;
              &.active a{
                color:rgba(48,49,51,1);
              }
              a {
                font-size: $h2Font;
                font-weight: 500;
                color:rgba(144,147,153,1);
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
                border: 1px solid $lineColor;
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
                color: $h1Color;
              }
              span {
                margin-left: 8px;
                font-size: $h2Font;
                font-weight: 500;
                line-height: 25px;
                color: $h1Color;
              }
            }
          }
        }
      }
    }
    .main {
      min-height: calc(100% - 60px);
      background-color: #f6f6f6;
    }
  }
</style>
<style lang="scss">
  .el-popover {
    padding: 1px 0 0;
    border: none;
    .message {
      width: 340px;
      ul {
        li {
          padding: 14px 22px;
          border-bottom: 1px solid $lineColor;
          font-size: $h3Font;
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
        font-size: $h3Font;
        color: $linkBlue;
      }
    }
  }
  .nav-user {
    padding: 20px 0;
    .el-dropdown-menu__item {
      padding: 0 40px;
      font-size: $h3Font;
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

