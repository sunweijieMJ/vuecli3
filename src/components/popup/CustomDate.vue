<template>
  <div class="custom-date">
    <el-popover
      v-if="!date_popup"
      v-model="date_popover"
      placement="bottom"
      trigger="click">
      <div slot="reference" class="current">
        <h4>起止时间</h4>
        <p>
          <span v-if="shortcut_date">{{shortcut_date}}</span>
          <span v-else>{{`${Moment().format(daterange[0])}-${Moment().format(daterange[1])}`}}</span>
          <i class="iconfont icon-btn_more_s"></i>
        </p>
      </div>
      <div class="shortcut">
        <ul>
          <h4>2019</h4>
          <li v-for="(item, index) in shortcut" :key="index" @click="chooseShort(item)">{{item.name}}</li>
        </ul>
        <ul>
          <h4>其他</h4>
          <li @click="activeCustom">自定义</li>
        </ul>
      </div>
    </el-popover>
    <el-date-picker
      v-else
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
  import Moment from '../../utils/business/moment.js';
  let that;

  export default {
    props: ['value'],
    data() {
      return {
        Moment,
        date_popover: false,
        date_popup: false,
        shortcut_date: '',
        daterange: '',
        shortcut: [
          {
            name: '第一季度Q1',
            time: '2019-Q1'
          },
          {
            name: '第二季度Q2',
            time: '2019-Q2'
          },
          {
            name: '第三季度Q3',
            time: '2019-Q3'
          },
          {
            name: '第四季度Q4',
            time: '2019-Q4'
          },
          {
            name: '上半年H1',
            time: '2019-H1'
          },
          {
            name: '下半年H2',
            time: '2019-H2'
          },
          {
            name: '全年',
            time: '2019-All'
          }
        ],
        pickerOptions: {
          shortcuts: [
            {
              text: '2019'
            },
            {
              text: '第一季度Q1',
              onClick(picker) {
                const start = new Date('2019/1/1');
                const end = new Date('2019/3/31 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-Q1';
              }
            },
            {
              text: '第二季度Q2',
              onClick(picker) {
                const start = new Date('2019/4/1');
                const end = new Date('2019/6/30 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-Q2';
              }
            },
            {
              text: '第三季度Q3',
              onClick(picker) {
                const start = new Date('2019/7/1');
                const end = new Date('2019/9/30 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-Q3';
              }
            },
            {
              text: '第四季度Q4',
              onClick(picker) {
                const start = new Date('2019/10/1');
                const end = new Date('2019/12/31 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-Q4';
              }
            },
            {
              text: '上半年H1',
              onClick(picker) {
                const start = new Date('2019/1/1');
                const end = new Date('2019/6/30 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-H1';
              }
            },
            {
              text: '下半年H2',
              onClick(picker) {
                const start = new Date('2019/7/1');
                const end = new Date('2019/12/31 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-H2';
              }
            },
            {
              text: '全年',
              onClick(picker) {
                const start = new Date('2019/1/1');
                const end = new Date('2019/12/31 23:59:59');
                picker.$emit('pick', [start, end]);
                that.shortcut_date = '2019-All';
              }
            }
          ]
        }
      };
    },
    created() {
      that = this;
      if(that.value.start_time || that.value.end_time) {
        that.daterange = [that.value.start_time, that.value.end_time];
      } else {
        that.daterange = [new Date(), new Date().setMonth(new Date().getMonth() + 3)];
      }
    },
    methods: {
      chooseShort(item) {
        this.shortcut_date = item.time;
        this.date_popover = false;
      },
      activeCustom() {
        this.date_popup = true;
        this.date_popover = false;
      }
    },
    watch: {
      daterange(cur) {
        let that = this;
        that.shortcut_date = '';

        that.$emit('input', {
          start_time: Moment().format(cur[0]),
          end_time: Moment().format(cur[1])
        });
      },
      date_popup(cur) {
        if(cur) {
          this.$nextTick(() => {
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
        background-image: none !important;
        background-color: $backColor;
      }
      i {
        display: none;
      }
    }
  }

  .el-popover {
    .shortcut {
      display: flex;
      padding: 25px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.08);
      ul {
        &:first-child {
          margin-right: 25px;
        }
        h4 {
          margin-bottom: 20px;
          font-size: $h3Font;
          font-weight: $h1Weight;
          line-height: 1;
          color: $themeColor;
        }
        li {
          margin-bottom: 18px;
          font-size: $h3Font;
          line-height: 1;
          color: $h2Color;
          cursor: pointer;
          @extend %textlight;
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }
</style>
