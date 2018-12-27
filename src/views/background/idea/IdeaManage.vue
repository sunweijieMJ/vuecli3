<template>
  <div class="idea-manage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane disabled>
        <h3 class="manage-name" slot="label">管理想法</h3>
      </el-tab-pane>
      <el-tab-pane label="管理" name="first">
        管理
      </el-tab-pane>
      <el-tab-pane label="置顶" name="second">
        置顶
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first' // ETC 当前选中tab
      };
    },
    methods: {
      handleClick() {

      }
    }
  };
</script>
<style lang="scss">
  @import '../../../assets/scss/_base.scss';

  .idea-manage {
    .el-tabs {
      .el-tabs__header {
        margin: 0;
        box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
        .el-tabs__nav-wrap {
          height: 56px;
          padding-left: 80px;
          &:after {
            position: static;
          }
          .el-tabs__active-bar {
            bottom: 8px;
            background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
          }
          .el-tabs__item {
            font-size: 18px;
            line-height: 56px;
            color: $h3Color;
            &.is-active {
              color: $h1Color;
            }
          }
        }
      }

      .manage-name {
        font-size: 24px;
        line-height: 32px;
        color: $themeColor;
      }
    }
  }
</style>

