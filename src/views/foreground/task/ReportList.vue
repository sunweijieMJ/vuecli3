<template>
  <div class="report-list">
    <div class="report-main" :style="{height: loading.noresult ? 'initial' : '100%'}">
      <div class="main-nav">
        <el-cascader
          v-if="active_report === 'all'"
          v-model="active_part"
          placeholder="全部用户"
          expand-trigger="hover"
          class="report-cascader"
          popper-class="custom-cascader"
          :options="part_list"
          :clearable="true"
          :show-all-levels="false"
          @active-item-change="handleItemChange"
          @change="resetList()"
        ></el-cascader>
        <ul class="container" v-show="!loading.noresult" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
          <li v-for="(item, index) in report_list" :key="index" :class="{active: current_report === index}" @click="getReportDetail(index)">
            <single-report :item="item"></single-report>
          </li>
        </ul>
      </div>
      <div class="main-info" v-show="!loading.noresult">
        <template v-if="report_detail">
          <single-info :info="report_detail"></single-info>
          <div class="feedback" v-if="report_list[current_report].is_leader && !report_list[current_report].is_feedback" :class="{focus: feedback.focus}">
            <img :src="self_info.header_photo" alt="">
            <div class="input">
              <textarea :placeholder="`点评下${report_detail.basic.user_info.real_name}的周报吧`" maxlength="1000"
                v-model="feedback.text" @focus="feedback.focus = true"></textarea>
              <div class="control" v-if="feedback.focus">
                <el-checkbox v-model="feedback.checked">仅本人可见</el-checkbox>
                <div class="btn">
                  <span @click="feedback.focus = false">取消</span>
                  <el-button class="confirm" @click="publishFeedBack">提交</el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="report_list.length && current_report === -1" class="null">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-icon_daily"></use>
          </svg>
          <span>请先选择周报</span>
        </div>
      </div>
    </div>
    <no-result v-show="loading.noresult"></no-result>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import UserApi from '../../../api/User.js';
  import ReportApi from '../../../api/Report.js';
  import {Loading, NoResult} from '../../../components/public';
  import {SingleReport, SingleInfo} from '../../../components/report';

  export default {
    components: {SingleReport, SingleInfo, Loading, NoResult},
    data() {
      return {
        active_report: 'self', // ETC 当前类型
        part_list: [], // ETC 部门列表
        active_part: [], // ETC 当前作者
        current_report: -1, // ETC 当前周报
        report_list: [], // ETC 周报列表
        report_detail: '', // ETC 周报详情
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: { // ETC 加载状态
          nomore: false, // ETC 触底
          noresult: false, // ETC 空列表
          last_id: 0
        },
        feedback: { // ETC 反馈信息
          focus: false,
          text: '',
          checked: false
        }
      };
    },
    created() {
      let that = this;
      that.getPartList();
      that.active_report = that.$route.query.type || 'self';
    },
    methods: {
      // 周报反馈
      publishFeedBack() {
        let that = this;
        ReportApi().publishFeedBack({report_id: that.report_detail.basic.report_id, feedback: that.feedback.text, only_self: Number(that.feedback.checked)}).then(res => {
          if(res.status) {
            that.report_list[that.current_report].is_feedback = 1;
            that.getReportDetail(that.current_report);
            that.$message({message: '反馈成功', type: 'success'});
            Object.assign(that.$data.feedback, that.$options.data().feedback);
            that.$el.querySelector('.main-info .single-info .detail').scrollIntoView({block: 'start', behavior: 'smooth'});
          } else {
            that.$message({message: res.message, type: 'warning'});
          }
        });
      },
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getReportList(that.loading.last_id, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.report_list.length) {
            that.disabled = true;
            that.loading = {
              nomore: true,
              noresult: true
            };
          } else if(that.pageInfo.current_page >= that.pageInfo.page_total){
            that.disabled = true;
            that.loading.nomore = true;
          }
        });
      },
      // 角色改变
      handleItemChange(item) {
        let that = this;
        UserApi().getStaffsByDep({depId: item[0]}).then(res => {
          if(!res.status) return;
          const user_list = Object.values(res.data.list);
          for(let i = 0, ILEN = that.part_list.length; i < ILEN; i++) {
            if(that.part_list[i].dep_id === item[0]) {
              that.part_list[i].children = [
                {
                  label: `${that.part_list[i].department_name}(all)`
                }
              ];
              for(let j = 0, JLEN = user_list.length; j < JLEN; j++) {
                that.part_list[i].children.push({
                  label: `${user_list[j].user_name}(${user_list[j].real_name})`,
                  value: user_list[j].user_id
                });
              }
              that.$set(that.part_list, i, that.part_list[i]);
            }
          }
        });
      },
      // 角色列表
      getPartList() {
        let that = this;
        UserApi().getPartList({}).then(res => {
          if(!res.status) return;
          that.part_list = res.data.list;
          for(let i = 0, LEN = that.part_list.length; i < LEN; i++) {
            that.part_list[i].label = that.part_list[i].department_name;
            that.part_list[i].value = that.part_list[i].dep_id;
            that.part_list[i].children = [];
          }
        });
      },
      // 获取周报列表
      async getReportList(lastId, currPage, type = this.active_report, qdep_id = this.active_part[0], quser_id = this.active_part[1]) {
        let that = this;
        await ReportApi().getReportList({lastId, currPage, type, qdep_id, quser_id}).then(res => {
          const user_info = res.data.user_info;
          const report_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);

          for(let i = 0, LEN = report_list.length; i < LEN; i++) {
            report_list[i].user_info = user_info[report_list[i].user_id];
          }

          that.report_list = that.report_list.concat(report_list);
        });
      },
      // 重置Task列表
      resetList() {
        let that = this;
        that.report_list = [];
        that.current_report = -1;
        that.report_detail = '';
        Object.assign(that.$data.pageInfo, that.$options.data().pageInfo);
        Object.assign(that.$data.loading, that.$options.data().loading);
        Object.assign(that.$data.disabled, that.$options.data().disabled);
        that.infinite();
      },
      // 周报详情
      getReportDetail(index) {
        let that = this;
        that.current_report = index;
        that.report_list[index].is_read = 1;
        const report_id = that.report_list[index].report_id;
        ReportApi().getReportDetail({report_id}).then(res => {
          const report_detail = res.data;

          const user_info = report_detail.user_info;

          report_detail.basic.recipient_info = [];
          for(let i = 0, LEN = report_detail.basic.recipient.length; i < LEN; i++) {
            report_detail.basic.recipient_info.push(user_info[report_detail.basic.recipient[i]]);
          }
          report_detail.basic.user_info = user_info[report_detail.basic.user_id];
          report_detail.basic.feedbacker_info = user_info[report_detail.basic.feedbacker];
          that.report_detail = report_detail;
        });
      }
    },
    watch: {
      // 刷新当前页面
      $route(to, from) {
        let that = this;
        if(to.name === that.$route.name && from.name === that.$route.name) {
          that.active_report = that.$route.query.type || 'self';
          that.resetList();
        }
      }
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss">
  .report-list {
    box-sizing: border-box;
    height: calc(100vh - 152px);
    padding-top: 12px;
    .report-main {
      display: flex;
      justify-content: space-between;
      width: 1040px;
      height: 100%;
      margin: auto;
      .main-nav {
        display: flex;
        flex-direction: column;
        .report-cascader {
          width:328px;
          height:46px;
          margin-bottom: 4px;
          border-radius: 2px;
          background-color: #fff;
          box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
          input {
            height:46px;
            border: none;
            &::placeholder {
              font-size: $h3Font;
              color: $h1Color;
            }
          }
        }
        .container {
          flex: 1;
          overflow-y: auto;
          border-radius: 2px;
          box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
          background-color: #fff;
          li.active .single-report{
            background-color: $backColor;
            border-image: -webkit-linear-gradient(top, rgba(251, 136, 81, 1) 0%, rgba(226, 82, 108, 1) 100%) 1;
          }
        }
      }
      .main-info {
        display: flex;
        flex-direction: column;
        width: 700px;
        height: 100%;
        .single-info {
          flex: 1;
          overflow-y: auto;
        }
        >.feedback {
          box-sizing: border-box;
          display: flex;
          height: 70px;
          padding: 12px 72px 12px 15px;
          background-color: #fff;
          border:1px solid rgba(222,222,222,1);
          transition: height 0.3s;
          &.focus {
            height: 170px;
            .input {
              height: initial;
              textarea::placeholder {
                line-height: 25px;
              }
            }
          }
          img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid $lineColor;
          }
          .input {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            height: 48px;
            margin-left: 10px;
            background-color: $backColor;
            textarea {
              box-sizing: border-box;
              width: 100%;
              flex: 1;
              padding: 16px;
              border-radius: 2px;
              font-size: $h3Font;
              line-height: 25px;
              resize: none;
              border: none;
              background-color: $backColor;
              &::placeholder {
                font-size: $h3Font;
                line-height: 1;
                color: $h3Color;
              }
            }
            .control {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 7px 16px;
              .el-checkbox {
                .el-checkbox__input {
                  .el-checkbox__inner {
                    box-sizing: border-box;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    &::after {
                      top: 3px;
                      left: 6px;
                    }
                  }
                  &.is-focus .el-checkbox__inner{
                    border-color: #dcdfe6;
                  }
                }
                &.is-checked .el-checkbox__inner {
                  border-color: $linkBlue;
                  background-color: $linkBlue;
                }
                 &.is-checked .el-checkbox__label {
                   color: $linkBlue;
                 }
              }
              .btn {
                >span {
                  margin-right: 22px;
                  font-size: $h3Font;
                  line-height: 1;
                  color: $h1Color;
                  @extend %textlight;
                }
              }
            }
          }
        }
        .null {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #fff;
          svg {
            width: 69px;
            height: 59px;
          }
          span {
            margin-top: 20px;
            font-size: 19px;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h3Color;
          }
        }
      }
    }
  }
</style>


