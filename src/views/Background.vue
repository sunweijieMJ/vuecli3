<template>
  <el-container>
    <el-aside width="200px">
      <h2 class="header">
        <i class="iconfont icon-54" @click="querySkip('IdeaList')"></i>
        <img src="https://pic.lanehub.cn/production/204b0985a2e861350e50f8608507510f.jpg?x-oss-process=style/app-10001" alt=""/>
      </h2>
      <ul class="nav">
        <li v-for="(item, index) in nav" :key="index" @click="querySkip(item.name)">
          <i class="iconfont" :class="item.icon"></i>
          <span>{{item.text}}</span>
        </li>
      </ul>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>
<script>
  import frequent from '../mixins/frequent.js';
  export default {
    mixins: [frequent],
    data() {
      return {
        nav: [
          {
            text: '组织架构',
            icon: 'icon-zuzhijiagou-',
            name: 'FrameManage'
          },
          {
            text: '管理想法',
            icon: 'icon-wenbenicon',
            name: 'IdeaManage'
          }
        ]
      };
    }
  };
</script>
<style lang="scss" scoped>
  @import '../assets/scss/_base.scss';

  .el-container {
    height: 100%;
    .el-aside {
      background-color: $h1Color;
      .header {
        display: flex;
        align-items: center;
        height: 64px;
        padding-left: 15px;
        cursor: pointer;
        i {
          font-size: 30px;
          color: #fff;
        }
        img {
          width: 40px;
          margin-left: 8px;
        }
      }
      .nav {
        padding: 25px 0;
        li {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 18px;
          cursor: pointer;
          i {
            font-size: 20px;
            color: #fff;
          }
          span {
            margin-left: 10px;
            font-size: 18px;
            line-height: 25px;
            color: #fff;
          }
          &:hover {
            background-color: $h2Color;
          }
        }
      }
    }
    .el-main {
      padding: 0;
    }
  }
</style>
<style lang="scss">
  html, body, #app {
    height: 100%;
  }
</style>


