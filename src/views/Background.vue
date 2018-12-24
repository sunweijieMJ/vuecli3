<template>
  <el-container>
    <el-aside width="200px">
      <h2 class="header">
        <i class="iconfont icon-54"></i>
        <img src="https://pic.lanehub.cn/production/204b0985a2e861350e50f8608507510f.jpg?x-oss-process=style/app-10001" alt=""/>
      </h2>
      <ul class="nav">
        <li v-for="(item, index) in nav" :key="index">
          <i class="iconfont icon-qianming"></i>
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
  export default {
    data() {
      return {
        nav: [
          {
            text: '组织架构'
          },
          {
            text: '管理想法'
          }
        ]
      };
    }
  };
</script>
<style lang="scss" scoped>
  .el-container {
    height: 100%;
    .el-aside {
      .header {
        display: flex;
        align-items: center;
        height: 64px;
        padding-left: 15px;
        cursor: pointer;
        i {
          font-size: 30px;
        }
        img {
          width: 40px;
          margin-left: 8px;
        }
      }
      .nav {
        padding: 25px 18px;
        li {
          height: 48px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
      background-color: #D3DCE6;
    }
    .el-main {

    }
  }
</style>
<style lang="scss">
  html, body, #app {
    height: 100%;
  }
</style>


