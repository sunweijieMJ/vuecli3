<template>
  <div class="weekly-date">
    <div class="date" v-show="!date_popup">
      <p class="time">{{`${Moment().format(daterange[0], 'MM-DD')}-${Moment().format(daterange[1], 'MM-DD')}`}}</p>
      <i class="iconfont icon-btn_more" @click="date_popup = true"></i>
    </div>
    <el-date-picker
      v-if="date_popup"
      class="custom-daterange"
      v-model="daterange"
      @blur="date_popup = false"
      @change="changeDate"
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
  let that;

  export default {
    props: ['value'],
    data() {
      return {
        Moment,
        date_popup: false,
        daterange: '',
        timeOptionRange: null,
        pickerOptions: {
          disabledDate(time) {
            // 初始化最大值|最小值|最大时间范围
            let max_time = Date.now();
            let min_time = new Date().setDate(new Date().getDate() - 14);
            const week = 8.64e7 * 7;
            if(that.timeOptionRange) {
              const pick_time = that.timeOptionRange.getTime();
              if(pick_time + week < Date.now()) max_time = pick_time + week;
              if(pick_time - week > min_time) min_time = pick_time - week;
            }
            return time.getTime() > max_time || time.getTime() < min_time;
          },
          onPick(time) {
            if(time.minDate && !time.maxDate){
              that.timeOptionRange = time.minDate;
            }
            if(time.maxDate){
              that.timeOptionRange = null;
            }
          }
        }
      };
    },
    created() {
      that = this;
      if(that.value.start_time || that.value.end_time) {
        that.daterange = [that.value.start_time, that.value.end_time];
      } else {
        if(new Date().getDay() === 1) {
          that.daterange = [new Date().setDate(new Date().getDate() - 7), new Date().setDate(new Date().getDate() - 1)];
        } else {
          const start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1 - new Date().getDay() || 7);
          that.daterange = [start, Date.now()];
        }
      }
    },
    methods: {
      changeDate(date) {
        this.date_popup = false;
        this.$emit('chooseDate', {
          start_time: Moment().format(date[0]),
          end_time: Moment().format(date[1])
        });
      }
    },
    watch: {
      daterange(cur) {
        const date = {
          start_time: Moment().format(cur[0]),
          end_time: Moment().format(cur[1])
        };
        this.$emit('input', date);
      },
      date_popup(cur) {
        if(cur) {
          setTimer(() => {
            const daterange = document.querySelector('.weekly-date .el-date-editor input');
            daterange.focus();
          });
        }
      }
    }
  };
</script>
<style lang="scss">
  .weekly-date {
    .date {
      display: flex;
      align-items: center;
      .time {
        font-size: $h3Font;
        line-height: 1;
        color: $h1Color;
      }
      .iconfont {
        margin-left: 10px;
        font-size: 26px;
        color: $linkBlue;
        cursor: pointer;
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
        background-color: $backColor;
      }
      i {
        display: none;
      }
    }
  }
</style>
