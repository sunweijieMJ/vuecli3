<template>
  <div class="report-detail">
    <div class="header">
      <div class="from-user">
        <el-popover
          placement="bottom-start"
          trigger="hover">
          <img slot="reference" :src="(form.user_info || self_info).header_photo" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${(form.user_info || self_info).user_id}`)">
          <user-popover :userinfo="(form.user_info || self_info)"></user-popover>
        </el-popover>
        <div class="info">
          <h4>周报-{{(form.user_info || self_info).real_name}}</h4>
          <weekly-date :key="key" v-model="form.daterange" @chooseDate="chooseDate"></weekly-date>
        </div>
      </div>
      <div class="to-user">
        <h4>收件人：</h4>
        <member :key="key" v-model="form.recipient">
          <span class="add">
            <i class="iconfont icon-btn_add"></i>
          </span>
        </member>
      </div>
    </div>
    <div class="main">
      <div class="last-week week">
        <h3 class="title">
          <i></i>
          <span>上周工作</span>
        </h3>
        <ul class="list" v-if="form.curr_week_list && form.curr_week_list.length">
          <li v-for="(item, index) in form.curr_week_list" :key="index">
            <single-follow :item="item"></single-follow>
          </li>
        </ul>
        <div class="other">
          <h4>其他工作</h4>
          <textarea :class="{null: !form.curr_week_other}" placeholder="添加工作内容…" maxlength="1000" v-model="form.curr_week_other"
            @propertychange="autoTextarea($event.target, 0)" @input="autoTextarea($event.target, 0)"></textarea>
        </div>
      </div>
      <div class="next-week week">
        <h3 class="title">
          <i></i>
          <span>下周工作</span>
        </h3>
        <ul class="list" v-if="form.next_week_list && form.next_week_list.length">
          <li v-for="(item, index) in form.next_week_list" :key="index">
            <single-follow :item="item" :hideFollow="true"></single-follow>
          </li>
        </ul>
        <div class="other">
          <h4>其他工作</h4>
          <textarea :class="{null: !form.next_week_other}" placeholder="添加工作内容…" maxlength="1000" v-model="form.next_week_other"
            @propertychange="autoTextarea($event.target, 0)" @input="autoTextarea($event.target, 0)"></textarea>
        </div>
      </div>
      <div class="summary week">
        <h3 class="title">
          <i></i>
          <span>想法及其他：</span>
        </h3>
        <div class="other">
          <textarea :class="{null: !form.summary}" placeholder="添加想法或其他内容" maxlength="1000" v-model="form.summary"
            @propertychange="autoTextarea($event.target, 0)" @input="autoTextarea($event.target, 0)"></textarea>
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
        report_id: '',
        form: {
          user_info: '',
          recipient: [],
          curr_week_list: [],
          next_week_list: [],
          obj_infos: {},
          curr_week_other: '',
          next_week_other: '',
          summary: '',
          daterange: ''
        }
      };
    },
    created() {
      let that = this;
      if(that.$route.params.id) {
        that.report_id = +that.$route.params.id;
        that.getReportDetail({report_id: that.report_id}).then(() => {
          that.calcText();
        });
      } else {
        that.getDefaultUsers();
        let date;
        if(new Date().getDay() === 1) {
          date = [new Date().setDate(new Date().getDate() - 7), new Date().setDate(new Date().getDate() - 1)];
        } else {
          const start = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1 - new Date().getDay() || 7);
          date = [start, Date.now()];
        }
        that.getReportDetail({start_day: Moment().format(date[0]), end_day: Moment().format(date[1])}).then(() => {
          that.getWeeklyKtList({start_day: Moment().format(date[0]), end_day: Moment().format(date[1])});
          that.calcText();
        });
      }
    },
    methods: {
      calcText() {
        let that = this;
        that.$nextTick(() => {
          const textarea = that.$el.querySelectorAll('textarea');
          for(let i = 0, LEN = textarea.length; i < LEN; i++) {
            if(textarea[i].classList.contains('null')) continue;
            autoTextarea(textarea[i], 0);
          }
        });
      },
      // 保存|发布 周报
      publish(action) {
        let that = this;
        ReportApi().publish({action, ...that.report_info}).then(res => {
          if(res.status) {
            if(action === 'save') {
              that.$message({message: '保存成功，再次写周报会打开保存的内容~', type: 'success'});
            } else {
              that.$router.push({name: 'ReportList'});
              that.$message({message: '发布成功', type: 'success'});
            }
          } else {
            that.$message({message: res.message, type: 'warning'});
          }
        });
      },
      // 选择时间回调
      chooseDate(date) {
        let that = this;
        that.getReportDetail({start_day: date.start_time, end_day: date.end_time}).then(() => {
          that.getWeeklyKtList({start_day: date.start_time, end_day: date.end_time});
        });
      },
      // 跟进成功
      handleTaskCheck(data) {
        this.checkList(data);
      },
      // check跟进KT
      checkList(check) {
        let that = this;
        for(let i = 0, LEN = that.form.curr_week_list.length; i < LEN; i++) {
          if(that.form.curr_week_list[i].task_id === check.task_id) {
            that.form.curr_week_list[i].check_info = check;
            that.form.curr_week_list[i].status = check.status;
          }
        }
        for(let i = 0, LEN = that.form.next_week_list.length; i < LEN; i++) {
          if(that.form.next_week_list[i].task_id === check.task_id) {
            that.form.next_week_list[i].check_info = check;
            that.form.next_week_list[i].status = check.status;
          }
        }
      },
      // 获取默认接收人
      getDefaultUsers() {
        let that = this;
        ReportApi().getDefaultUsers({}).then(res => {
          if(!(res.data.list && res.data.list.length)) return;
          const recipient = res.data.list;

          for(let i = 0, LEN = recipient.length; i < LEN; i++) {
            recipient[i].isNew = true;
          }
          that.form.recipient = recipient;
          that.key++;
        });
      },
      // 周工作列表
      getWeeklyKtList({start_day, end_day}) {
        let that = this;
        ReportApi().getWeeklyKtList({start_day, end_day}).then(res => {
          if(!res.status) return;
          // 数据整理
          const obj_infos = res.data.obj_infos;
          const users_info = res.data.users_info;
          const curr_week_list = res.data.curr_week_list;
          const next_week_list = res.data.next_week_list;
          if(curr_week_list) {
            for(let i = 0, ILEN = curr_week_list.length; i < ILEN; i++) {
              curr_week_list[i].creator_info = users_info[curr_week_list[i].creator_id];
              if(curr_week_list[i].obj_id) {
                curr_week_list[i].obj_info = [];
                for(let j = 0, JLEN = curr_week_list[i].obj_id.length; j < JLEN; j++) {
                  curr_week_list[i].obj_info.push(obj_infos[curr_week_list[i].obj_id[j]]);
                }
              }
            }
          }
          if(next_week_list) {
            for(let i = 0, ILEN = next_week_list.length; i < ILEN; i++) {
              next_week_list[i].creator_info = users_info[next_week_list[i].creator_id];
              if(next_week_list[i].obj_id) {
                next_week_list[i].obj_info = [];
                for(let j = 0, JLEN = next_week_list[i].obj_id.length; j < JLEN; j++) {
                  next_week_list[i].obj_info.push(obj_infos[next_week_list[i].obj_id[j]]);
                }
              }
            }
          }

          that.form.curr_week_list = curr_week_list;
          that.form.next_week_list = next_week_list;
          that.form.obj_infos = obj_infos;
        });
      },
      // 周报草稿
      async getReportDetail({report_id, start_day, end_day}) {
        let that = this;
        await ReportApi().getReportDetail({report_id, start_day, end_day}).then(res => {
          if(!res.data.basic) return;
          if(res.data.basic.status === 2) {
            that.$message({message: '本周周报已发布，请选择非本周的时间', type: 'warning'});
          }
          const report_info = res.data;
          const user_info = report_info.user_info;

          report_info.basic.recipient_info = [];
          for(let i = 0, LEN = report_info.basic.recipient.length; i < LEN; i++) {
            report_info.basic.recipient_info.push(user_info[report_info.basic.recipient[i]]);
            report_info.basic.recipient_info[i].isNew = true;
          }

          // 选择查询的日期，则已查询日期为准
          if(start_day && end_day) {
            report_info.basic.report_start_day = start_day;
            report_info.basic.report_end_day = end_day;
          }

          Object.assign(that.$data.form, that.$options.data().form);

          that.form = {
            user_info: user_info[report_info.basic.user_id],
            recipient: report_info.basic.recipient_info,
            curr_week_list: report_info.curr_week_list,
            next_week_list: report_info.next_week_list,
            obj_infos: report_info.obj_infos,
            curr_week_other: report_info.basic.curr_week_other,
            next_week_other: report_info.basic.next_week_other,
            summary: report_info.basic.summary,
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
          curr_week_other: that.form.curr_week_other,
          next_week_other: that.form.next_week_other,
          summary: that.form.summary,
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
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
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
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 48px;
          padding: 1px 0;
          margin-left: 18px;
          h4 {
            margin-bottom: 4px;
            font-size: $h2Font;
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
          margin-left: 6px;
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
      >.week {
        padding: $up-down 0;
        border-bottom: 2px solid $lineColor;
        &.summary {
          border-bottom: 0;
          .other {
            margin-top: 5px;
          }
        }
        >.title {
          display: flex;
          align-items: center;
          i {
            display: inline-flex;
            width: 5px;
            height: 17px;
            background-color: $themeColor;
          }
          span {
            margin-left: 5px;
            font-size: $h2Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
        }
        >.list {
          margin-top: $up-down;
          padding: 0 $up-down 0 10px;
          >li {
            margin-bottom: $up-down;
            &:last-of-type {
              margin-bottom: 0;
            }
          }
        }
        >.other {
          padding: 0 $up-down 0 32px;
          margin-top: $up-down;
          h4 {
            margin-left: 20px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
          textarea {
            margin-top: 8px;
            width: calc(100% - 40px);
            padding: 0 20px;
            border-radius: 2px;
            font-size: $h3Font;
            line-height: 25px;
            resize: none;
            border: none;
            cursor: pointer;
            &:focus {
              padding: 10px 20px;
              background-color: $backColor;
              cursor: initial;
              &::placeholder {
                color: $h3Color;
              }
            }
            &:hover {
              background-color: $backColor;
            }
            &:not(:focus).null {
              height: 25px !important;
            }
            &::placeholder {
              font-size: $h3Font;
              line-height: 25px;
              color: $linkBlue;
            }
          }
        }
      }
    }
    >.footer {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      .btn-box {
        box-sizing: border-box;
        width: 200px;
        height: 40px;
        margin: 0 40px;
        &.save {
          position: relative;
          padding: 1px;
          border-radius: 20px;
          background-image: linear-gradient(90deg, rgba(251,136,81,1), rgba(226,82,108,1));
        }
        .save, .submit {
          width: 100%;
          height: 100%;
          border: none;
          font-size: $h2Font;
          font-weight: normal;
          border-radius: 20px;
          @extend %imglight;
          &.save {
            color: $themeColor;
            &:hover {
              background-color: #fff;
            }
          }
          &.submit {
            color: #fff;
            background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          }
        }
      }
    }
  }
</style>

