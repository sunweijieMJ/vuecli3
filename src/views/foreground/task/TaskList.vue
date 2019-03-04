<template>
  <div class="task-list">
    <div class="task-menu">
      <h3>TASK</h3>
      <div class="menu-box">
        <el-tabs v-model="active_task" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in menu_list" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
          <router-view></router-view>
        </el-tabs>
      </div>
    </div>
    <div class="task-select" v-if="active_task === 'all'">
      <el-cascader
         v-model="active_part"
        placeholder="全部用户"
        expand-trigger="hover"
        popper-class="custom-cascader"
        :options="part_list"
        :clearable="true"
        :show-all-levels="false"
        @active-item-change="handleItemChange"
        @change="resetList()"
      ></el-cascader>
    </div>
    <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <li v-for="(item, index) in task_list" :key="index">
        <single-task :item="item"></single-task>
      </li>
      <div class="no-result" v-if="loading.noresult">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon_nothing"></use>
        </svg>
        <p>当前没有内容</p>
      </div>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </ul>
    <task-publish @handleTaskEdit="handleTaskEdit" @handleTaskCreate="handleTaskCreate"></task-publish>
    <task-follow @handleTaskCheck="handleTaskCheck"></task-follow>
    <task-close @handleTaskClose="handleTaskClose"></task-close>
  </div>
</template>
<script>
  import TaskApi from '../../../api/Task.js';
  import UserApi from '../../../api/User.js';
  import {Loading} from '../../../components/public';
  import {SingleTask, TaskPublish, TaskFollow, TaskClose} from '../../../components/okr';

  export default {
    components: {SingleTask, Loading, TaskPublish, TaskFollow, TaskClose},
    data() {
      return {
        menu_list: [], // ETC 菜单列表
        active_task: '', // ETC 当前激活菜单
        part_list: [], // ETC 部门列表
        active_part: [], // ETC 当前作者
        task_list: [],
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false, // ETC 空列表
          last_id: 0
        }
      };
    },
    created() {
      let that = this;
      that.menu_list = [
        {
          label: '我的',
          name: 'create'
        },
        {
          label: '我参与的',
          name: 'take'
        },
        {
          label: '我团队的',
          name: 'team'
        },
        {
          label: '全部TASK',
          name: 'all'
        }
      ];
      that.getPartList();
      that.active_task = that.$route.query.active_task || 'create';
    },
    methods: {
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getTaskList(that.loading.last_id, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.task_list.length) {
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
      // 菜单改变
      handleClick(e) {
        let that = this;
        that.$router.push({name: that.$route.name, query: {active_task: e.name}});
      },
      // 角色改变
      handleItemChange(item) {
        let that = this;
        UserApi().getStaffsByDep({depId: item[0]}).then(res => {
          if(!res.status) return;
          const user_list = Object.values(res.data.list);
          for(let i = 0, ILEN = that.part_list.length; i < ILEN; i++) {
            if(that.part_list[i].dep_id === item[0]) {
              that.part_list[i].children = [];
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
      handleTaskCreate() {
        this.resetList();
      },
      handleTaskEdit() {
        this.resetList();
      },
      handleTaskCheck() {
        this.resetList();
      },
      handleTaskClose() {
        this.resetList();
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
      // Task列表
      async getTaskList(lastId, currPage, qtype = this.active_task, qdep_id = this.active_part[0], quser_id = this.active_part[1]) {
        let that = this;
        await TaskApi().getTaskList({lastId, currPage, qtype, qdep_id, quser_id}).then(res => {
          const users_info = res.data.users_info;
          const obj_infos = res.data.obj_infos;
          const task_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = task_list.length; i < ILEN; i++) {
            if(task_list[i].obj_id) {
              task_list[i].obj_info = [];
              for(let j = 0, JLEN = task_list[i].obj_id.length; j < JLEN; j++) {
                task_list[i].obj_info.push(obj_infos[task_list[i].obj_id[j]]);
                for(let k = 0, KLEN = task_list[i].obj_info.length; k < KLEN; k++) {
                  task_list[i].obj_info[k].creator_info = users_info[task_list[i].obj_info[k].creator_id];
                }
              }
            }
            if(!users_info) continue;
            if(!task_list[i].check_info) continue;
            task_list[i].check_info.creator_info = users_info[task_list[i].creator_id];
          }

          that.task_list = that.task_list.concat(task_list);
        });
      },
      // 重置Task列表
      resetList(qtype = this.active_task, qdep_id = this.active_part[0], quser_id = this.active_part[1]) {
        let that = this;
        that.disabled = true;
        // 重置数据
        that.task_list = [];
        Object.assign(that.$data.pageInfo, that.$options.data().pageInfo);
        Object.assign(that.$data.loading, that.$options.data().loading);
        Object.assign(that.$data.disabled, that.$options.data().disabled);

        TaskApi().getTaskList({lastId: that.loading.last_id, currPage: ++that.pageInfo.current_page, qtype, qdep_id, quser_id}).then(res => {
          const users_info = res.data.users_info;
          const obj_infos = res.data.obj_infos;
          const task_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = task_list.length; i < ILEN; i++) {
            if(task_list[i].obj_id) {
              task_list[i].obj_info = [];
              for(let j = 0, JLEN = task_list[i].obj_id.length; j < JLEN; j++) {
                task_list[i].obj_info.push(obj_infos[task_list[i].obj_id[j]]);
                for(let k = 0, KLEN = task_list[i].obj_info.length; k < KLEN; k++) {
                  task_list[i].obj_info[k].creator_info = users_info[task_list[i].obj_info[k].creator_id];
                }
              }
            }
            if(!users_info) continue;
            if(!task_list[i].check_info) continue;
            task_list[i].check_info.creator_info = users_info[task_list[i].creator_id];
          }
          that.task_list = task_list;

          // 触底判断
          that.disabled = false;
          if(!that.task_list.length) {
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
      }
    },
    watch: {
      // 刷新当前页面
      $route(to, from) {
        let that = this;
        if(to.name === that.$route.name && from.name === that.$route.name) {
          that.active_task = that.$route.query.active_task || 'create';
          that.resetList();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .task-list {
    .list {
      width: 1040px;
      margin: 12px auto 0;
      .no-result {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        svg {
          margin: 170px 0 10px;
          width: 180px;
        }
        p {
          font-size: $h3Font;
          font-weight: $h1Weight;
          color: $h3Color;
        }
      }
    }
  }
</style>
<style lang="scss">
  .task-list {
    .task-menu {
      display: flex;
      flex-direction: column;
      height: 140px;
      background-color: #45474B;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      h3 {
        width: 1040px;
        margin: 36px auto 26px;
        font-size: 30px;
        line-height: 1;
        font-weight: $h1Weight;
        color: $themeColor;
      }
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
                font-size: $h2Font;
                font-weight: $h1Weight;
                line-height: 30px;
                color: $h3Color;
                &.is-active {
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
    .task-select {
      display: flex;
      align-items: center;
      width: 1040px;
      margin: 12px auto;
      .el-cascader {
        box-sizing: border-box;
        display: flex;
        height: 40px;
        padding: 10px 20px;
        margin-right: 12px;
        border-radius: 20px;
        line-height: 1;
        background-color: rgba(222,222,222,1);
        &:last-child {
          margin-right: 0;
        }
        .el-input {
          input {
            height: 20px;
            padding: 0;
            font-size: $h3Font;
            line-height: 20px;
            color: $h1Color;
            border: none;
            background-color: transparent;
            &::placeholder {
              font-size: $h3Font;
              line-height: 20px;
              color: $h1Color;
            }
          }
          .el-input__icon {
            color: $h1Color;
          }
          .el-input__suffix {
            right: -10px;
          }
        }
        .el-cascader__label {
          width: 90%;
          padding: 0 20px;
          line-height: 40px;
          color: $h1Color;
        }
      }
    }
  }
</style>


