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
<style lang="scss">
  @import '../../../../assets/scss/_base.scss';

  .idea-list-manage {
    .header {
      display: flex;
      align-items: center;
      height: 86px;
      padding-left: 100px;
      .el-input, input {
        width: 377px;
        height: 40px;
        background-color: $backColor;
        border-radius: 20px;
      }
      .el-button {
        width: 85px;
        height: 40px;
        padding: 0;
        border: none;
        margin-left: 22px;
        background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
        border-radius: 20px;
        font-size: 18px;
        line-height: 40px;
        color: #fff;
      }
    }
  }
</style>
