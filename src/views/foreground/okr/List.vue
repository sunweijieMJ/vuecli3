<template>
  <div class="okr-task-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Task" name="TaskList"></el-tab-pane>
      <el-tab-pane label="OKR" name="OKRList"></el-tab-pane>
      <router-view></router-view>
    </el-tabs>
  </div>
</template>
<script>
  import frequent from '../../../mixins/frequent.js';

  export default {
    mixins: [frequent],
    data() {
      return {
        activeName: this.$route.name
      };
    },
    methods: {
      handleClick(tab) {
        let that = this;
        switch (tab.label) {
          case 'Task':
            that.querySkip('TaskList');
            break;
          case 'OKR':
            that.querySkip('OKRList', {okr_type: 0});
            break;
          default:
            break;
        }
      }
    }
  };
</script>
<style lang="scss">
  .okr-task-list {
    .el-tabs {
      .el-tabs__header {
        display: flex;
        align-items: center;
        height: 95px;
        margin: 0;
        background-color: $h2Color;
        box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
        .el-tabs__nav-wrap {
          width: 964px;
          margin: auto;
          &:after {
            position: static;
          }
          .el-tabs__active-bar {
            height: 3px;
            border-radius: 1.5px;
            background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
          }
          .el-tabs__item {
            height: 30px;
            font-size: $h2Font;
            font-weight: $h1Weight;
            line-height: 30px;
            color: $h3Color;
            &.is-active {
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>

