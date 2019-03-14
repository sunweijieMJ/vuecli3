<template>
  <div class="task-box">
    <div class="header">
      <div class="menu-box">
        <el-tabs v-model="active_menu" @tab-click="handleClick">
          <el-tab-pane v-for="(witem, windex) in menu_list" :key="windex" :label="witem.label" :name="witem.name" :type="witem.type">
            <el-dropdown v-if="witem.name === active_menu" slot="label" @command="handleCommand" trigger="click">
              <li>{{witem.label}}</li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(vitem, vindex) in (active_menu === 'TaskList' ? task_menu : report_menu)" :key="vindex" :command="vitem">{{vitem.label}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tab-pane>
        </el-tabs>
        <div class="write-report" v-if="active_menu === 'ReportList'" @click="querySkip('ReportRedact')">
          <i class="iconfont icon-compile"></i>
          <span>写周报</span>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import frequent from '../../../mixins/frequent.js';

  export default {
    mixins: [frequent],
    data() {
      return {
        active_menu: this.$route.name,
        menu_list: {
          TaskList: {
            label: '我的KT',
            name: 'TaskList',
            type: 'create'
          },
          ReportList: {
            label: '我的周报',
            name: 'ReportList',
            type: 'self'
          }
        },
        task_menu: [
          {
            label: '我的KT',
            name: 'TaskList',
            type: 'create'
          },
          {
            label: '参与KT',
            name: 'TaskList',
            type: 'take'
          },
          {
            label: '团队KT',
            name: 'TaskList',
            type: 'team'
          },
          {
            label: '全部KT',
            name: 'TaskList',
            type: 'all'
          }
        ],
        report_menu: [
          {
            label: '我的周报',
            name: 'ReportList',
            type: 'self'
          },
          {
            label: '我收到的',
            name: 'ReportList',
            type: 'recipient'
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
      handleClick(e) {
        let that = this;
        if(e.name === that.$route.name) return;
        that.$router.push({name: e.name});
      },
      handleCommand(command) {
        let that = this;
        that.menu_list[that.$route.name] = command;
        that.$router.push({name: that.$route.name, query: {label: command.label, type: command.type}});
      }
    }
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
                li {
                  font-size: $h2Font;
                  font-weight: $h1Weight;
                  line-height: 1;
                  color: #C0C4CC;
                }
                &.is-active li{
                  color: #fff;
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
            font-size: $h3Font;
          }
          span {
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
          }
        }
      }
    }
  }
</style>

