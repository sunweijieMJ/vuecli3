<template>
  <div class="single-task">
    <div class="task-info">
      <div class="info-title">
        <h4>
          <span>KT</span>
          <p>{{item.task_name}}</p>
        </h4>
        <p v-if="item.obj_info.length" v-for="(witem, windex) in item.obj_info" :key="windex">
          <i class="el-icon-info"></i>
          <span>{{witem.okr_name}}</span>
        </p>
      </div>
      <div class="info-num">
        <p class="time">{{`${Moment().format(item.start_time)}-${Moment().format(item.end_time)}`}}</p>
        <el-progress :percentage="item.progress" :stroke-width="9" v-if="item.status !== 3"></el-progress>
        <p class="progress" v-else>
          <span>完成度</span>
          <i>{{item.progress}}%</i>
        </p>
      </div>
    </div>
    <div class="check-info" v-if="item.check_info">
      <img :src="item.check_info.creator_info.header_photo" alt="">
      <div class="info">
        <h4>
          <el-rate v-model="item.check_info.feel_status" show-score disabled :allow-half="true" show-text></el-rate>
          <p>{{item.check_info.publish_time | timeFilter}}</p>
        </h4>
        <p>{{item.check_info.remarks}}</p>
      </div>
    </div>
    <task-check :item="item"></task-check>
  </div>
</template>
<script>
  import Moment from '../../utils/business/moment.js';
  import TaskCheck from '../../components/popup/TaskCheck.vue';

  export default {
    components: {TaskCheck},
    props: ['item'],
    data() {
      return {
        Moment
      };
    }
  };
</script>
<style lang="scss">
  $left-right: 50px;
  $up-down: 24px;

  .single-task {
    position: relative;
    width: 100%;
    padding: $up-down $left-right;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
    .task-info {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .info-title {
        h4 {
          display: flex;
          align-items: center;
          margin-bottom: 13px;
          >span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 16px;
            border-radius: 8px;
            background-color: $purple;
            font-size: $h4Font;
            color: #fff;
          }
          >p {
            margin-left: 10px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            color: $h1Color;
          }
        }
        >p {
          display: flex;
          align-items: center;
          >i {
            font-size: $h4Font;
            color: #000;
          }
          >span {
            margin-left: 7px;
            font-size: $h4Font;
            color: $h2Color;
          }
        }
      }
      .info-num {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 372px;
        .time {
          font-size: $h4Font;
          color: $h2Color;
        }
        .el-progress {
          display: flex;
          align-items: center;
          width: 190px;
          margin-left: 35px;
          .el-progress-bar {
            padding: 0;
            margin: 0;
          }
          .el-progress-bar__outer {
            width: 145px;
            .el-progress-bar__inner {
              background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
            }
          }
        }
        .progress {
          display: flex;
          align-items: center;
          span {
            font-size: $h4Font;
            color: $h2Color;
          }
          i {
            margin-left: 10px;
            font-size: $h1Font;
            font-style: normal;
            font-weight: $h1Weight;
            color: $themeColor;
          }
        }
      }
    }
    .check-info {
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid $lineColor;
      }
      .info {
        margin-left: 22px;
        h4 {
          display: flex;
          align-items: center;
          .el-rate {
            display: flex;
            align-items: center;
          }
          >p {
            margin-left: 25px;
            font-size: 12px;
            font-weight: normal;
            color: $h3Color;
          }
        }
        >p {
          font-size: $h4Font;
          color: $h2Color;
        }
      }
    }
  }
</style>

