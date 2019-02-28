<template>
  <div class="okr-logs">
    <div class="container">
      <div class="header">
        <h3>日志</h3>
        <span>共2条</span>
      </div>
      <log-list :loglist="loglist"></log-list>
    </div>
  </div>
</template>
<script>
  import {LogList} from '../../../components/business';

  export default {
    components: {LogList},
    data() {
      return {
        loglist: 3
      };
    }
  };
</script>
<style lang="scss" scoped>
  .okr-logs {
    background-color: #fff;
    .container {
      width: 1040px;
      margin: auto;
      .header {
        display: flex;
        align-items: center;
        width: 750px;
        padding: 30px 0;
        border-bottom: 1px solid $lineColor;
        h3 {
          font-size: 30px;
          font-weight: $h1Weight;
          color: $themeColor;
        }
        span {
          margin-left: 10px;
          font-size: $h3Font;
          color: $h1Color;
        }
      }
    }
  }
</style>

