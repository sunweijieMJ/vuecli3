<template>
  <el-container>
    <el-header>
      <nav>
        <ul class="nav-left">
          <h1>
            <img src="https://pic.lanehub.cn/production/204b0985a2e861350e50f8608507510f.jpg?x-oss-process=style/app-10001" alt=""/>
          </h1>
          <li v-for="(item, index) in router.slice(0, 2)" :key="index" :class="{active: index === current}">
            <a href="javascript:;" @click="select(item)">{{item.text}}</a>
          </li>
        </ul>
        <ul class="nav-right">
          <li v-for="(item, index) in router.slice(2, 4)" :key="index" :class="{active: index === current}">
            <i class="iconfont" :class="item.icon" @click="select(item)"></i>
          </li>
        </ul>
      </nav>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
  export default {
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
        ]
      };
    },
    methods: {
      select(item) {
        this.current = item.index;
        this.$router.push({name: item.name});
      }
    }
  };
</script>
<style lang="scss" scoped>
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
  html, body, #app {
    height: 100%;
  }
</style>

