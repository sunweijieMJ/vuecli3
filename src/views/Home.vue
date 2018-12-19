<template>
  <el-container>
    <el-header>
      <nav>
        <ul class="nav-left">
          <h1>
            <img src="https://pic.lanehub.cn/production/204b0985a2e861350e50f8608507510f.jpg?x-oss-process=style/app-10001" alt=""/>
          </h1>
          <li>
            <a href="">想法</a>
          </li>
          <li>
            <a href="">OKR</a>
          </li>
        </ul>
        <ul class="nav-right">
          <li>
            <i class="iconfont icon-lingdang"></i>
          </li>
          <li>
             <i class="iconfont icon-touxiang"></i>
          </li>
        </ul>
      </nav>
    </el-header>
    <el-main>
      Main
    </el-main>
  </el-container>
</template>
<script>
  import systemApi from '../api/System';

  export default {
    created() {
      systemApi().getGlobalInfo().then(res => {
        console.log(res);
      });
    }
  };
</script>
<style lang="scss" scoped>
  .el-container {
    .el-header {
      display: flex;
      height: 60px;
      nav {
        display: flex;
        justify-content: space-between;
        width: 1200px;
        margin: auto;
        h1 {
          img {
            width: 30px;
          }
        }
        ul {
          display: flex;
          align-items: center;
          li {
            margin-left: 36px;
            a {
              font-size:18px;
              font-weight:500;
              color:rgba(144,147,153,1);
              &.active {
                color:rgba(48,49,51,1);
              }
            }
            i {
              font-size: 30px;
            }
          }
        }
      }
    }
    .el-main {
      height: 600px;
      background-color: #F6F6F6;
    }
  }
</style>

