<template>
  <div class="single-report">
    <div class="info">
      <el-badge is-dot class="item" :hidden="item.is_read === 0 ? false : true">W{{item.report_week}}周报-{{item.user_info.real_name}}</el-badge>
      <single-status v-if="$route.query.active === 'recipient' && !item.is_feedback" :text="'待反馈'" :color="'#FF7676'" :back="'#FEEDED'"></single-status>
    </div>
    <div class="time">
      <h5>{{Moment().format(item.report_start_day, 'MM-DD')}}-{{Moment().format(item.report_end_day, 'MM-DD')}}</h5>
      <p>{{item.publish_time | timeFilter}}</p>
    </div>
  </div>
</template>
<script>
  import Moment from '../../utils/business/moment.js';
  import SingleStatus from '../../components/report/SingleStatus';

  export default {
    components: {SingleStatus},
    props: ['item'],
    data() {
      return {
        Moment
      };
    }
  };
</script>
<style lang="scss">
  .single-report {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 328px;
    height: 90px;
    cursor: pointer;
    border-left: 5px solid;
    border-image: -webkit-linear-gradient(top, #fff 0% , #fff 100%) 1;
    .info {
      display: flex;
      justify-content: space-between;
      padding: 26px 30px 0;
      .el-badge {
        font-size: $h3Font;
        font-weight: $h1Weight;
        line-height: 1;
        color: $h1Color;
        .is-dot {
          left: -20px;
          right: initial;
          transform: translateY(3.5px);
        }
      }
    }
    .time {
      display: flex;
      justify-content: space-between;
      padding: 0 30px 26px 0;
      margin-left: 30px;
      border-bottom: 1px solid $lineColor;
      h5 {
        font-size: $h3Font;
        font-weight: normal;
        line-height: 1;
        color: $h1Color;
      }
      p {
        font-size: $h4Font;
        line-height: 1;
        color: $h3Color;
      }
    }
  }
</style>

