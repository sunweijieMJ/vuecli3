<template>
  <div class="weekly-date">
    <div class="date" v-show="!date_popup">
      <p class="time">{{`${Moment().format(daterange[0], 'MM-DD')}-${Moment().format(daterange[1], 'MM-DD')}`}}</p>
      <span class="active" @click="date_popup = true">
        <i class="iconfont icon-xiangxia"></i>
      </span>
    </div>
    <el-date-picker
      v-if="date_popup"
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
            const week = 8.64e7 * 7;
            if(that.timeOptionRange) {
              return time.getTime() > that.timeOptionRange.getTime() + week || time.getTime() < that.timeOptionRange.getTime() - week;
            }
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
        that.daterange = [new Date().setDate(new Date().getDate() - 7), new Date()];
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
      .active {
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid $linkBlue;
        i {
          color: $linkBlue;
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
        background-color: $backColor;
      }
      i {
        display: none;
      }
    }
  }
</style>
