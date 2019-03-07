<template>
  <div class="report-detail">
    <div class="header">
      <div class="from-user">
        <img src="https://pic2.lanehub.cn/production/91fe3721fc63639e4270e5370e1b4609.jpg?x-oss-process=style/m-00005" alt="">
        <div class="info">
          <h4>周报-邵予帆</h4>
          <p>02/25-03/01</p>
        </div>
      </div>
      <div class="to-user">
        <h4>发周报给：</h4>
        <member v-model="form.to_user"></member>
      </div>
    </div>
    <div class="main">
      <div class="last-week"></div>
      <div class="next-week"></div>
      <div class="summary"></div>
    </div>
    <div class="footer">
      <el-button>提交</el-button>
    </div>
  </div>
</template>
<script>
  import {Member} from '../../../components/popup';

  export default {
    components: {Member},
    data() {
      return {
        form: {
          to_user: []
        }
      };
    }
  };
</script>

<style lang="scss" scoped>
  $left-right: 90px;
  $up-down: 90px;

  .report-detail {
    width: 1040px;
    margin: 20px auto 0;
    background-color: #fff;
    .header {
      padding: 58px $left-right 0;
      border-bottom: 1px solid $lineColor;
      .from-user {
        display: flex;
        align-items: center;
        img {
          box-sizing: border-box;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border-bottom: 1px solid $lineColor;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 54px;
          margin-left: 24px;
          h4 {
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
          p {
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
        }
      }
      .to-user {
        display: flex;
        align-items: center;
        padding: 40px 0 28px;
        h4 {
          align-self: flex-start;
          font-size: $h3Font;
          font-weight: normal;
          line-height: 36px;
          color: $h2Color;
        }

      }
    }
    .main {}
    .footer {
      text-align: center;
    }
  }
</style>

