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
          <span>{{shortcut_date}}</span>
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
      end-placeholder="结束日期">
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
        shortcut_date: '请选择',
        daterange: '',
        shortcut: [
          {
            name: '第一季度Q1',
            range: [new Date('2019/1/1'), new Date('2019/3/31')]
          },
          {
            name: '第二季度Q2',
            range: [new Date('2019/4/1'), new Date('2019/6/30')]
          },
          {
            name: '第三季度Q3',
            range: [new Date('2019/7/1'), new Date('2019/9/30')]
          },
          {
            name: '第四季度Q4',
            range: [new Date('2019/10/1'), new Date('2019/12/31')]
          },
          {
            name: '上半年H1',
            range: [new Date('2019/1/1'), new Date('2019/6/30')]
          },
          {
            name: '下半年H2',
            range: [new Date('2019/7/1'), new Date('2019/12/31')]
          },
          {
            name: '全年',
            range: [new Date('2019/1/1'), new Date('2019/12/31')]
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
                const end = new Date('2019/3/31');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '第二季度Q2',
              onClick(picker) {
                const start = new Date('2019/4/1');
                const end = new Date('2019/6/30');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '第三季度Q3',
              onClick(picker) {
                const start = new Date('2019/7/1');
                const end = new Date('2019/9/30');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '第四季度Q4',
              onClick(picker) {
                const start = new Date('2019/10/1');
                const end = new Date('2019/12/31');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '上半年H1',
              onClick(picker) {
                const start = new Date('2019/1/1');
                const end = new Date('2019/6/30');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '下半年H2',
              onClick(picker) {
                const start = new Date('2019/7/1');
                const end = new Date('2019/12/31');
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '全年',
              onClick(picker) {
                const start = new Date('2019/1/1');
                const end = new Date('2019/12/31');
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      };
    },
    created() {
      that = this;
      if(that.value) {
        that.daterange = [that.value.start_time, that.value.end_time];
      }
    },
    methods: {
      // 快捷按钮
      chooseShort(item) {
        this.daterange = item.range;
        this.date_popover = false;
      },
      // 激活自定义弹框
      activeCustom() {
        this.date_popup = true;
        this.date_popover = false;
      }
    },
    watch: {
      daterange(cur) {
        let that = this;
        const start_time = Moment().format(cur[0]);
        const end_time = Moment().format(cur[1]);
        const range = JSON.stringify([new Date(start_time), new Date(end_time)]);
        const Q1 = JSON.stringify([new Date('2019/1/1'), new Date('2019/3/31')]);
        const Q2 = JSON.stringify([new Date('2019/4/1'), new Date('2019/6/30')]);
        const Q3 = JSON.stringify([new Date('2019/7/1'), new Date('2019/9/30')]);
        const Q4 = JSON.stringify([new Date('2019/10/1'), new Date('2019/12/31')]);
        const H1 = JSON.stringify([new Date('2019/1/1'), new Date('2019/6/30')]);
        const H2 = JSON.stringify([new Date('2019/7/1'), new Date('2019/12/31')]);
        const All = JSON.stringify([new Date('2019/1/1'), new Date('2019/12/31')]);

        switch (range) {
          case Q1:
            that.shortcut_date = '2019-Q1';
            break;
          case Q2:
            that.shortcut_date = '2019-Q2';
            break;
          case Q3:
            that.shortcut_date = '2019-Q3';
            break;
          case Q4:
            that.shortcut_date = '2019-Q4';
            break;
          case H1:
            that.shortcut_date = '2019-H1';
            break;
          case H2:
            that.shortcut_date = '2019-H2';
            break;
          case All:
            that.shortcut_date = '2019-All';
            break;
          default:
            that.shortcut_date = `${start_time}-${end_time}`;
            break;
        }

        that.$emit('input', {
          start_time,
          end_time
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

  .is-error .custom-date .current p span{
    color: #f56c6c;
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
