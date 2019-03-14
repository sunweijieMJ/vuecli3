<template>
  <div class="report-detail">
    <div class="header">
      <div class="from-user">
        <el-popover
          placement="bottom-start"
          trigger="hover">
          <img slot="reference" :src="form.user_info.header_photo" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${form.user_info.user_id}`)">
          <user-popover :userinfo="form.user_info"></user-popover>
        </el-popover>
        <div class="info">
          <h4>周报-{{form.user_info.real_name}}</h4>
          <weekly-date :key="key" v-model="form.daterange"></weekly-date>
        </div>
      </div>
      <div class="to-user">
        <h4>发周报给：</h4>
        <member :key="key" v-model="form.recipient">
          <span class="add">
            <i class="iconfont icon-icon_add1"></i>
          </span>
        </member>
      </div>
    </div>
    <div class="main">
      <div class="last-week week">
        <h3 class="title">
          <i class="iconfont icon-icon_link"></i>
          <span>上周工作</span>
        </h3>
        <ul class="list">
          <li v-for="(item, index) in form.curr_week_list.slice(0, 2)" :key="index">
            <single-follow :item="item"></single-follow>
          </li>
        </ul>
        <div class="other">
          <h4>其他工作</h4>
          <p v-if="!form.curr_week_other.status" :class="{null: !form.curr_week_other.text}" @click="lastFocus" v-html="textFilter(form.curr_week_other.text || '添加工作内容…')"></p>
          <textarea v-else class="last-text" placeholder="添加工作内容…" v-model="form.curr_week_other.text"
            @propertychange="autoTextarea($event, 0)" @input="autoTextarea($event.target, 0)" @blur="lastBlur"></textarea>
        </div>
      </div>
      <div class="next-week week">
        <h3 class="title">
          <i class="iconfont icon-icon_link"></i>
          <span>下周工作</span>
        </h3>
        <ul class="list">
          <li v-for="(item, index) in form.next_week_list.slice(0, 2)" :key="index">
            <single-follow :item="item"></single-follow>
          </li>
        </ul>
        <div class="other">
          <h4>其他工作</h4>
          <p v-if="!form.next_week_other.status" :class="{null: !form.next_week_other.text}" @click="nextFocus" v-html="textFilter(form.next_week_other.text || '添加工作内容…')"></p>
          <textarea v-else class="next-text" placeholder="添加工作内容…" v-model="form.next_week_other.text"
            @propertychange="autoTextarea($event, 0)" @input="autoTextarea($event.target, 0)" @blur="nextBlur"></textarea>
        </div>
      </div>
      <div class="summary week">
        <h3 class="title">
          <i class="iconfont icon-icon_link"></i>
          <span>心得</span>
        </h3>
        <div class="other">
          <h4>其他工作</h4>
          <p v-if="!form.summary.status" :class="{null: !form.summary.text}" @click="summaryFocus" v-html="textFilter(form.summary.text || '添加工作内容…')"></p>
          <textarea v-else class="summary-text" placeholder="添加工作内容…" v-model="form.summary.text"
            @propertychange="autoTextarea($event, 0)" @input="autoTextarea($event.target, 0)" @blur="summaryBlur"></textarea>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="btn-box save">
        <el-button class="save" @click="publish('save')">保存</el-button>
      </div>
      <div class="btn-box submit">
        <el-button class="submit" @click="publish('publish')">提交</el-button>
      </div>
    </div>
    <task-follow @handleTaskCheck="handleTaskCheck"></task-follow>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import ReportApi from '../../../api/Report.js';
  import frequent from '../../../mixins/frequent.js';
  import textFilter from '../../../utils/filters/textFilter.js';
  import Moment from '../../../utils/business/moment.js';
  import {autoTextarea} from '../../../utils/business/tools.js';
  import {TaskFollow} from '../../../components/okr';
  import {UserPopover, Member} from '../../../components/popup';
  import {WeeklyDate, SingleFollow} from '../../../components/report';

  export default {
    components: {
      UserPopover, WeeklyDate, Member, SingleFollow, TaskFollow
    },
    mixins: [frequent],
    data() {
      return {
        key: 0,
        textFilter,
        autoTextarea,
        report_id: +this.$route.params.id,
        form: {
          user_info: '',
          recipient: [],
          curr_week_list: [],
          next_week_list: [],
          obj_infos: {},
          curr_week_other: {
            text: '',
            status: false
          },
          next_week_other: {
            text: '',
            status: false
          },
          summary: {
            text: '',
            status: false
          },
          daterange: ''
        }
      };
    },
    created() {
      let that = this;
      if(that.report_id) {
        this.getReportDetail(that.report_id).then(() => {
          that.getWeeklyKtList();
        });
      }else {
        that.getWeeklyKtList();
        that.form.user_info = that.self_info;
      }
    },
    methods: {
      publish(action) {
        let that = this;
        ReportApi().publish({action, ...that.report_info}).then(res => {
          console.log(res)
        });
      },
      handleTaskCheck(data) {
        this.checkList(data);
      },
      checkList(check) {
        let that = this;
        for(let i = 0, LEN = that.form.curr_week_list.length; i < LEN; i++) {
          if(that.form.curr_week_list[i].task_id === check.task_id) {
            that.form.curr_week_list[i].check_info = check;
          }
        }
        for(let i = 0, LEN = that.form.next_week_list.length; i < LEN; i++) {
          if(that.form.next_week_list[i].task_id === check.task_id) {
            that.form.next_week_list[i].check_info = check;
          }
        }
      },
      lastFocus() {
        let that = this;
        that.form.curr_week_other.status = true;
        that.$nextTick(() => {
          that.$el.querySelector('.last-text').focus();
        });
      },
      lastBlur() {
        let that = this;
        that.form.curr_week_other.status = false;
      },
      nextFocus() {
        let that = this;
        that.form.next_week_other.status = true;
        that.$nextTick(() => {
          that.$el.querySelector('.next-text').focus();
        });
      },
      nextBlur() {
        let that = this;
        that.form.next_week_other.status = false;
      },
      summaryFocus() {
        let that = this;
        that.form.summary.status = true;
        that.$nextTick(() => {
          that.$el.querySelector('.summary-text').focus();
        });
      },
      summaryBlur() {
        let that = this;
        that.form.summary.status = false;
      },
      getWeeklyKtList() {
        let that = this;
        ReportApi().getWeeklyKtList({start_day: '2019-03-01', end_day: '2019-03-08'}).then(res => {
          if(!res.status) return;
          // 数据整理
          const obj_infos = res.data.obj_infos;
          const users_info = res.data.users_info;
          const curr_week_list = res.data.curr_week_list;
          const next_week_list = res.data.next_week_list;
          for(let i = 0, ILEN = curr_week_list.length; i < ILEN; i++) {
            curr_week_list[i].creator_info = users_info[curr_week_list[i].creator_id];
            if(curr_week_list[i].obj_id) {
              curr_week_list[i].obj_info = [];
              for(let j = 0, JLEN = curr_week_list[i].obj_id.length; j < JLEN; j++) {
                curr_week_list[i].obj_info.push(obj_infos[curr_week_list[i].obj_id[j]]);
              }
            }
          }
          for(let i = 0, ILEN = next_week_list.length; i < ILEN; i++) {
            next_week_list[i].creator_info = users_info[next_week_list[i].creator_id];
            if(next_week_list[i].obj_id) {
              next_week_list[i].obj_info = [];
              for(let j = 0, JLEN = next_week_list[i].obj_id.length; j < JLEN; j++) {
                next_week_list[i].obj_info.push(obj_infos[next_week_list[i].obj_id[j]]);
              }
            }
          }

          that.form.curr_week_list = curr_week_list;
          that.form.next_week_list = next_week_list;
          that.form.obj_infos = obj_infos;
        });
      },
      async getReportDetail(report_id) {
        let that = this;
        await ReportApi().getReportDetail({report_id}).then(res => {
          const report_info = res.data;
          const user_info = report_info.user_info;

          report_info.basic.recipient_info = [];
          for(let i = 0, LEN = report_info.basic.recipient.length; i < LEN; i++) {
            report_info.basic.recipient_info.push(user_info[report_info.basic.recipient[i]]);
            report_info.basic.recipient_info[i].isNew = true;
          }

          that.form = {
            user_info: user_info[report_info.basic.user_id],
            recipient: report_info.basic.recipient_info,
            curr_week_list: report_info.curr_week_list,
            next_week_list: report_info.next_week_list,
            obj_infos: report_info.obj_infos,
            curr_week_other: {
              text: report_info.basic.curr_week_other,
              status: false
            },
            next_week_other: {
              text: report_info.basic.next_week_other,
              status: false
            },
            summary: {
              text: report_info.basic.summary,
              status: false
            },
            daterange: {
              start_time: Moment().format(report_info.basic.report_start_day, 'YYYY-MM-DD'),
              end_time: Moment().format(report_info.basic.report_end_day, 'YYYY-MM-DD')
            }
          };
          that.key++;
        });
      }
    },
    computed: {
      report_info() {
        let that = this;
        const recipient = [];
        for(let i = 0, LEN = that.form.recipient.length; i < LEN; i++) {
          recipient.push(that.form.recipient[i].user_id);
        }
        return {
          report_id: that.report_id,
          recipient,
          curr_week_list: that.form.curr_week_list,
          next_week_list: that.form.next_week_list,
          obj_infos: that.form.obj_infos,
          curr_week_other: that.form.curr_week_other.text,
          next_week_other: that.form.next_week_other.text,
          summary: that.form.summary.text,
          start_day: Moment().format(that.form.daterange.start_time, 'YYYY-MM-DD'),
          end_day: Moment().format(that.form.daterange.end_time, 'YYYY-MM-DD')
        };
      },
      ...mapState({
        self_info: store => store.self_info
      })
    }
  };
</script>
<style lang="scss">
  $left-right: 38px;
  $up-down: 30px;

  .report-detail {
    width: 800px;
    padding: $left-right 0;
    margin: 12px auto 0;
    background-color: #fff;
    >.header {
      padding: 0 $left-right;
      .from-user {
        display: flex;
        align-items: center;
        img {
          box-sizing: border-box;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border-bottom: 1px solid $lineColor;
          cursor: pointer;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 48px;
          margin-left: 18px;
          h4 {
            margin-bottom: 4px;
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
        padding: $up-down 0 20px;
        border-bottom: 1px solid $lineColor;
        h4 {
          align-self: flex-start;
          font-size: $h3Font;
          font-weight: normal;
          line-height: 27px;
          color: $h1Color;
        }
        .okr-member {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          margin-left: 20px;
          .el-tag {
            height: 27px;
            padding: 0 15px;
            margin: 0 10px 10px 0;
            border-radius: 14px;
          }
          .add {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            border: 1px solid $linkBlue;
            cursor: pointer;
            i {
              color: $linkBlue;
            }
          }
        }
      }
    }
    >.main {
      padding: 0 $left-right;
      .week {
        border-bottom: 1px solid $lineColor;
        &.summary {
          border-bottom: 0;
        }
        >.title {
          margin: $up-down 0;
          i {
            font-size: $h2Font;
          }
          span {
            margin-left: 3px;
            font-size: $h2Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
        }
        >.list {
          padding: 0 $up-down 0 10px;
          li {
            margin-bottom: $up-down;
          }
        }
        >.other {
          padding: 0 $up-down $up-down 52px;
          h4 {
            margin-bottom: 10px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
          p {
            font-size: $h3Font;
            line-height: 25px;
            color: $h1Color;
            cursor: pointer;
            &.null {
              color: $linkBlue;
              @extend %textlight;
            }
          }
          textarea {
            width: calc(100% - 40px);
            padding: 10px 20px;
            border-radius: 2px;
            background-color: $backColor;
            font-size: $h3Font;
            line-height: 28px;
            resize: none;
            border: none;
            &::placeholder {
              font-size: $h3Font;
              line-height: 28px;
              color: $h3Color;
            }
          }
        }
      }
    }
    >.footer {
      display: flex;
      justify-content: center;
      .btn-box {
        box-sizing: border-box;
        width: 200px;
        height: 40px;
        margin: 0 40px;
        &.save {
          padding: 1px;
          border-radius: 20px;
          background-image: linear-gradient(90deg, rgba(251,136,81,1), rgba(226,82,108,1));
        }
        .save, .submit {
          width: 100%;
          height: 100%;
          border: none;
          font-weight: normal;
          border-radius: 20px;
          &.save {
            &:hover {
              background-color: #fff;
            }
            @extend %textlight;
          }
          &.submit {
            &:hover {
              color: #fff;
            }
            @extend %imglight;
            background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          }
        }
      }
    }
  }
</style>

