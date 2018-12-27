<template>
  <div class="idea-list-manage">
    <div class="header">
      <el-input class="inp" v-model="idea_id" placeholder="输入想法ID"></el-input>
      <el-button>搜索</el-button>
    </div>
    <div class="list"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        idea_id: ''
      };
    }
  };
</script>

<style lang="scss" scoped>
  @import '../../../../assets/scss/_base.scss';

  .idea-list-manage {
    .header {
      display: flex;
      align-items: center;
      .el-input {
        width:3 77px;
        height: 40px;
        background-color: $backColor;
        border-radius: 20px;
      }
      .el-button {

      }
    }
  }
</style>
