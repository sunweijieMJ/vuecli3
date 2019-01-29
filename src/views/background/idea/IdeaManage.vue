<template>
  <div class="idea-manage">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane disabled>
        <h3 class="manage-name" slot="label">管理瓴里圈</h3>
      </el-tab-pane>
      <el-tab-pane label="管理" name="1">
        <idea-list></idea-list>
      </el-tab-pane>
      <el-tab-pane label="置顶" name="2">
        <idea-stick></idea-stick>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import IdeaList from './ideamanage/IdeaList.vue';
  import IdeaStick from './ideamanage/IdeaStick.vue';
  export default {
    components: {IdeaList, IdeaStick},
    data() {
      return {
        activeName: '1' // ETC 当前选中tab
      };
    },
    created() {
      let that = this;
      if(that.$route.query.idea_type) {
        that.activeName = that.$route.query.idea_type;
      }
    },
    methods: {
      handleClick(tab) {
        this.$router.push({name: 'IdeaManage', query: {idea_type: tab.name}});
      }
    }
  };
</script>
<style lang="scss">
  .idea-manage {
    height: 100%;
    background-color: #fff;
    .el-tabs {
      height: inherit;
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
            font-size: $h2Font;
            line-height: 56px;
            color: $h3Color;
            &.is-active {
              color: $h1Color;
            }
          }
        }
      }
      .el-tabs__content {
        height: calc(100% - 56px);
        overflow: auto;
        .el-tab-pane {
          height: 100%;
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
