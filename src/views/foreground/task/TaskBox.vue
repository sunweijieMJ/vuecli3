<template>
  <div class="task-box">
    <div class="header">
      <div class="menu-box">
        <el-tabs v-model="active_menu" @tab-click="handleClick">
          <el-tab-pane v-for="(witem, windex) in menu_list" :key="witem.type + self_info.level + unread.report + unread.feedback"  :label="witem.label" :name="witem.name" :type="witem.type">
            <el-dropdown v-if="witem.name === active_menu" slot="label" @command="handleCommand" trigger="click">
              <li>
                <span>{{witem.label}}</span>
                <i class="iconfont icon-icon_more1"></i>
              </li>
              <el-dropdown-menu  class="task-report" slot="dropdown">
                <el-dropdown-item v-for="(vitem, vindex) in (active_menu === 'TaskList' ? (self_info.is_leader === 1 ? task_menu : task_menu.slice(0, 3).concat(task_menu[4])) : (self_info.level !== 1 ? report_menu.slice(0, 2) : report_menu))" :key="vindex" :command="vitem">
                  <el-badge v-if="vitem.type === 'feedbacking'" :isDot="unread.feedback">{{vitem.label}}</el-badge>
                  <span v-else>{{vitem.label}}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-badge v-if="unread.report && active_menu === 'TaskList' && windex === 'ReportList'" slot="label" :isDot="unread.report">
              <li>
                <span>{{witem.label}}</span>
              </li>
            </el-badge>
          </el-tab-pane>
        </el-tabs>
        <div class="write-report" @click="querySkip('ReportRedact')">
          <i class="iconfont icon-icon_add3"></i>
          <span>写周报</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import NoticeApi from '../../../api/Notice.js';
  import frequent from '../../../mixins/frequent.js';

  export default {
    mixins: [frequent],
    data() {
      return {
        active_menu: this.$route.name,
        unread: {
          report: false,
          feedback: false
        },
        menu_list: {
          TaskList: {
            label: '我的KT',
            name: 'TaskList',
            type: 'create'
          },
          ReportList: {
            label: '收到周报',
            name: 'ReportList',
            type: 'recipient'
          }
        },
        task_menu: [
          {
            label: '我的KT',
            name: 'TaskList',
            type: 'create'
          },
          {
            label: '我参与的',
            name: 'TaskList',
            type: 'take'
          },
          {
            label: '我团队的',
            name: 'TaskList',
            type: 'team'
          },
          {
            label: '待反馈KT',
            name: 'TaskList',
            type: 'feedbacking'
          },
          {
            label: '全部KT',
            name: 'TaskList',
            type: 'all'
          }
        ],
        report_menu: [
          {
            label: '收到周报',
            name: 'ReportList',
            type: 'recipient'
          },
          {
            label: '我的周报',
            name: 'ReportList',
            type: 'self'
          },
          {
            label: '全部周报',
            name: 'ReportList',
            type: 'all'
          }
        ]
      };
    },
    created() {
      let that = this;
      that.getTodoList();
      // that.self_info.level === 3 ? that.task_menu.splice(3, 1) : that.task_menu;
      const query = that.$route.query;
      if(query.label) {
        that.menu_list[that.$route.name] = {
          label: query.label,
          name: that.$route.name,
          type: query.type
        };
      }
    },
    methods: {
      // tab切换
      handleClick(e) {
        let that = this;
        if(e.name === that.$route.name) return;
        that.$router.push({name: e.name, query: {label: that.menu_list[e.name].label, type: that.menu_list[e.name].type}});
        that.getTodoList();
      },
      // select筛选
      handleCommand(command) {
        let that = this;
        that.menu_list[that.$route.name] = command;
        that.$router.push({name: that.$route.name, query: {label: command.label, type: command.type}});
      },
      // 获取未读消息
      getTodoList() {
        let that = this;
        NoticeApi().getTodoList({}).then(res => {
          that.unread.report = Boolean(res.data.wait_read);
          that.unread.feedback = Boolean(res.data.need_feedback);
        });
      }
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss">
  .task-box {
    >.header {
      box-sizing: border-box;
      display: flex;
      align-items: flex-end;
      padding: 12px 0;
      height: 96px;
      background-color: #45474B;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      .menu-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 1040px;
        margin: 0 auto;
        height: 38px;
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            .el-tabs__nav-wrap {
              &:after {
                position: static;
              }
              #tab-TaskList {
                width: 90px;
              }
              #tab-ReportList {
                width: 105px;
              }
              .el-tabs__active-bar {
                height: 3px;
                border-radius: 1.5px;
                background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
              }
              .el-tabs__item {
                height: 30px;
                line-height: 30px;
                font-size: $h2Font;
                font-weight: $h1Weight;
                color: #C0C4CC;
                .el-badge {
                  vertical-align: initial;
                  .is-dot {
                    border: none;
                    top: 6px;
                    right: -3px;
                  }
                }
                li {
                  display: flex;
                  align-items: center;
                  height: 30px;
                  span {
                    font-size: $h2Font;
                    font-weight: $h1Weight;
                    line-height: 1;
                    color: #C0C4CC;
                  }
                  i {
                    font-size: 12px;
                    color: #fff;
                  }
                }
                &.is-active {
                  li span {
                    color: #fff;
                  }
                }
              }
            }
          }
        }
        .write-report {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 126px;
          height: 40px;
          border-radius: 20px;
          background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          color: #fff;
          cursor: pointer;
          @extend %imglight;
          i {
            font-size: 22px;
          }
          span {
            margin-left: 8px;
            font-size: $h2Font;
            font-weight: $h1Weight;
            line-height: 1;
          }
        }
      }
    }
  }
  .task-report {
    padding: 0;
    border-radius: 2px;
    .el-dropdown-menu__item {
      padding: 16px;
      font-size: $h3Font;
      line-height: 1;
      color: $h1Color;
      border-bottom: 1px solid $lineColor;
      &:last-of-type {
        border-bottom: 0;
      }
      &:hover {
        color: $h1Color;
        background-color: $backColor;
      }
      .el-badge {
        .is-dot {
          right: 0;
        }
      }
    }
    .popper__arrow {
      display: none;
    }
    .popper__arrow {
      display: none;
    }
    .popper__arrow {
      display: none;
    }
    .popper__arrow {
      display: none;
    }
  }
</style>

