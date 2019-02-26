<template>
  <div class="custom-date">
    <div class="current" v-show="!date_popup">
      <h4>起止时间</h4>
      <p @click="date_popup = true">
        <span>{{`${Moment().format(daterange[0])}-${Moment().format(daterange[1])}`}}</span>
        <i class="iconfont icon-btn_more_s"></i>
      </p>
    </div>
    <el-date-picker
      v-show="date_popup"
      class="custom-daterange"
      v-model="daterange"
      @blur="date_popup = false"
      @change="date_popup = false"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>
<script>
  import {setTimer} from '../../utils/business/tools.js';
  import Moment from '../../utils/business/moment.js';

  export default {
    props: ['value'],
    data() {
      return {
        Moment,
        date_popup: false,
        daterange: '',
        pickerOptions: {
          shortcuts: [
            {
              text: '2019'
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      };
    },
    created() {
      let that = this;
      if(that.value.start_time || that.value.end_time) {
        that.daterange = [that.value.start_time, that.value.end_time];
      } else {
        that.daterange = [new Date(), new Date().setMonth(new Date().getMonth() + 3)];
      }
    },
    watch: {
      daterange(cur) {
        this.$emit('input', {
          start_time: Moment().format(cur[0]),
          end_time: Moment().format(cur[1])
        });
      },
      date_popup(cur) {
        if(cur) {
          setTimer(() => {
            const daterange = document.querySelector('.custom-date .el-date-editor input');
            daterange.focus();
          });
        }
      }
    }
  };
</script>
<style lang="scss">
  .custom-date {
    .current {
      h4 {
        font-size: $h4Font;
        font-weight: normal;
        line-height: 18px;
        color: $h3Color;
      }
      p {
        line-height: 20px;
        cursor: pointer;
        color: $h1Color;
        span {
          font-size: $h3Font;
        }
        i {
          font-size: 12px;
        }
      }
    }
    .el-date-editor--daterange {
      display: flex;
      justify-content: space-around;
      width: 280px;
      border-radius:2px;
      border:1px solid $linkBlue;
      background-color: $backColor;
      input {
        background-image: none;
        background-color: $backColor;
      }
      i {
        display: none;
      }
    }
  }
</style>
