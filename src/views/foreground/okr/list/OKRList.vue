<template>
  <div class="okr-list">
    <div class="header">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="全部">全部</el-radio-button>
        <el-radio-button label="项目">项目</el-radio-button>
        <el-radio-button label="部门">部门</el-radio-button>
        <el-radio-button label="公司">公司</el-radio-button>
      </el-radio-group>
      <div class="new-okr">
        <span>
          <i class="el-icon-plus"></i>
        </span>
        <p>新增OKR</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tabPosition: '全部'
      };
    }
  };
</script>
<style lang="scss">
  .okr-list {
    width: 967px;
    margin: auto;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-radio-group {
        width: 328px;
        height: 38px;
        margin-top: 15px;
        border-radius: 20px;
        background:rgba(222,222,222,1);
        .el-radio-button {
          &.is-active {
            .el-radio-button__inner {
              color: #fff;
              box-shadow: none;
              background-color: $themeColor;
            }
          }
          .el-radio-button__inner {
            width: 82px;
            border-radius: 20px;
            border: 0 none;
            background-color: transparent;
            font-size: $h3Font;
            color: $h2Color;
          }
        }
      }
      .new-okr {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          border-radius:30px;
          background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          i {
            font-size: 16px;
            color: #fff;
          }
        }
        p {
          margin-left: 8px;
          font-size: $h2Font;
          font-weight: $h1Weight;
          color: $themeColor;
        }
      }
    }
  }
</style>

