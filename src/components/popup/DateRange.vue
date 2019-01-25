<template>
  <el-popover
    v-model="date_popover"
    placement="bottom"
    width="400"
    trigger="click">
    <slot slot="reference"></slot>
    <div class="popover-daterange">
      <h3>选择时间</h3>
      <div class="date">
        <el-date-picker
          v-model="daterange.start_time"
          type="date"
          :clearable="false"
          :picker-options="pickerOptionsStart"
          placeholder="选择日期">
        </el-date-picker>
        <i class="el-icon-minus"></i>
        <el-date-picker
          v-model="daterange.end_time"
          type="date"
          :clearable="false"
          :picker-options="pickerOptionsEnd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="btn">
        <el-button class="cancel" @click="date_popover = false">取消</el-button>
        <el-button class="confirm" @click="confirmEmit">确定</el-button>
      </div>
    </div>
  </el-popover>
</template>
<script>
  import {setTimer} from '../../utils/business/tools.js';
  import Moment from '../../utils/business/moment.js';

  export default {
    props: ['range'],
    data() {
      return {
        date_popover: false,
        // 开始禁用时间
        pickerOptionsStart: {
          disabledDate: (time) => {
            let that = this;
            const start_time = that.daterange.start_time;
            if (start_time) {
              return time.getTime() < Date.now() - 8.64e7 || time.getTime() > start_time;
            } else {
              return time.getTime() < Date.now() - 8.64e7;
            }
          }
        },
        // 截止禁用时间
        pickerOptionsEnd: {
          disabledDate: (time) => {
            let that = this;
            let start_time = Date.now();
            if (that.daterange.start_time) start_time = that.daterange.start_time;
            return time.getTime() < start_time;
          }
        }
      };
    },
    methods: {
      // 格式化时间
      formatDate(daterange) {
        let that = this;
        daterange.start_time = Moment().format(daterange.start_time);
        daterange.end_time = Moment().format(daterange.end_time);
        that.$emit('formatDate', daterange);
      },
      // 确认
      confirmEmit() {
        let that = this;
        that.formatDate(that.daterange);
        that.date_popover = false;
      }
    },
    computed: {
      daterange() {
        let that = this;
        if(that.range.start_time !== '') {
          const daterange = that.range;
          daterange.start_time = Moment().format(daterange.start_time);
          daterange.end_time = Moment().format(daterange.end_time);
          return daterange;
        } else {
          const daterange = {
            start_time: new Date(),
            end_time: new Date().setMonth(new Date().getMonth() + 3)
          };
          that.formatDate(daterange);
          return daterange;
        }
      }
    },
    watch: {
      date_popover(cur) {
        if(cur) {
          setTimer(() => {
            const daterange = document.querySelector('.popover-daterange .el-date-editor input');
            daterange.focus();
          });
        }
      }
    }
  };
</script>
<style lang="scss">
  .el-popover {
    .popover-daterange {
      padding: 28px 37px;
      h3 {
        font-size: $h1Font;
        font-weight: $h1Weight;
        line-height: 30px;
        color: $themeColor;
      }
      .date {
        display: flex;
        align-items: center;
        margin-top: 12px;
        .el-date-editor {
          width: 143px;
          height: 40px;
          border-radius: 2px;
          background-color: $backColor;
          .el-input__inner {
            padding: 0 18px;
            border-radius: 2px;
            &:focus {
              border-color: $linkBlue;
            }
          }
          >span {
            display: none;
          }
        }
        >i {
          margin: 0 20px;
        }
      }
      .btn {
        margin-top: 20px;
        text-align: right;
      }
    }
  }
</style>


