<template>
  <el-container>
    <el-header>
      <nav>
        <ul class="nav-left">
          <h1>
            <img src="https://pic.lanehub.cn/production/204b0985a2e861350e50f8608507510f.jpg?x-oss-process=style/app-10001" alt=""/>
          </h1>
          <li v-for="(vitem, vindex) in router.slice(0, 2)" :key="vindex" :class="{active: vindex === current}">
            <a href="javascript:;" @click="select(vitem, vindex)">{{vitem.text}}</a>
          </li>
        </ul>
        <ul class="nav-right">
          <li v-for="(vitem, vindex) in router.slice(2, 4)" :key="vindex" :class="{active: vindex === current}">
            <el-popover
              v-if="!vindex"
              placement="bottom"
              trigger="click">
              <i slot="reference" class="iconfont" :class="vitem.icon" v-if="!vindex"></i>
              <div class="message">
                <ul>
                  <li v-for="(witem, windex) in message_list" :key="windex" @click="querySkip('NewsList')">
                    <p>{{witem.user_info.user_name}}<span>在</span>{{readMore(witem.origin_msg.content, 30, '...')}}<span>中评论了你的想法</span></p>
                  </li>
                </ul>
                <a href="javascript:;" @click="querySkip('NewsList')">全部提醒</a>
              </div>
            </el-popover>
            <el-dropdown @command="handleCommand" trigger="click" v-else>
              <i class="iconfont" :class="vitem.icon"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="homepage">我的主页</el-dropdown-item>
                <el-dropdown-item command="exit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </li>
          <div class="admin" @click="querySkip('IdeaManage')">
            <i class="iconfont icon-icon-test"></i>
            <span>管理员</span>
          </div>
        </ul>
      </nav>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
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
            text: '想法',
            name: 'IdeaList'
          },
          {
            text: 'OKR',
            name: 'OKRList'
          },
          {
            icon: 'icon-lingdang',
            name: 'NewsList'
          },
          {
            icon: 'icon-touxiang',
            name: 'Profile'
          }
        ],
        readMore,
        message_list: []
      };
    },
    created() {
      this.getMessageList();
    },
    methods: {
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
          that.message_list = res.data.list;
          // 数据整理
          for(let i = 0, LEN = that.message_list.length; i < LEN; i++) {
            that.message_list[i].user_info = users_info[that.message_list[i].push_user_id];
            that.message_list[i].origin_msg = origin_msg[that.message_list[i].business_type][that.message_list[i].business_id];
          }
        });
      },
      // 个人主页/退出登录
      handleCommand(command) {
        let that = this;
        switch (command) {
          case 'homepage':
            that.$router.push({name: 'Profile', params: {id: 1}});
            break;
          case 'exit':
            storage('cookie').remove('pgs_authinfo');
            that.$router.push({name: 'InitPage'});
            break;
          default:
            break;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../assets/scss/_base.scss';

  .el-container {
    height: 100%;
    .el-header {
      display: flex;
      height: 60px;
      nav {
        display: flex;
        justify-content: space-between;
        width: 1160px;
        margin: auto;
        h1 {
          cursor: pointer;
          img {
            width: 40px;
          }
        }
        ul {
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
            i {
              font-size: 36px;
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
            color: $linkBlue;
            cursor: pointer;
            span {
              color: $h1Color;
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

