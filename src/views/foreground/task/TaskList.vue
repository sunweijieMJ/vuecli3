<template>
  <div class="task-list">
    <no-result v-if="loading.noresult"></no-result>
    <template v-else>
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
        <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
      </ul>
      <task-publish @handleTaskEdit="resetList()" @handleTaskCreate="resetList()"></task-publish>
      <task-follow @handleTaskCheck="resetList()"></task-follow>
      <task-close @handleTaskClose="resetList()"></task-close>
    </template>
  </div>
</template>
<script>
  import TaskApi from '../../../api/Task.js';
  import UserApi from '../../../api/User.js';
  import {Loading, NoResult} from '../../../components/public';
  import {SingleTask, TaskPublish, TaskFollow, TaskClose} from '../../../components/okr';

  export default {
    components: {SingleTask, Loading, NoResult, TaskPublish, TaskFollow, TaskClose},
    data() {
      return {
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
      that.getPartList();
      that.active_task = that.$route.query.type || 'create';
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
          for(let key in obj_infos) {
            if(!users_info) break;
            obj_infos[key].creator_info = users_info[obj_infos[key].creator_id];
          }
          for(let i = 0, ILEN = task_list.length; i < ILEN; i++) {
            if(task_list[i].obj_id) {
              task_list[i].obj_info = [];
              for(let j = 0, JLEN = task_list[i].obj_id.length; j < JLEN; j++) {
                task_list[i].obj_info.push(obj_infos[task_list[i].obj_id[j]]);
              }
            }
            if(!users_info) continue;
            task_list[i].creator_info = users_info[task_list[i].creator_id];
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
          for(let key in obj_infos) {
            if(!users_info) break;
            obj_infos[key].creator_info = users_info[obj_infos[key].creator_id];
          }
          for(let i = 0, ILEN = task_list.length; i < ILEN; i++) {
            if(task_list[i].obj_id) {
              task_list[i].obj_info = [];
              for(let j = 0, JLEN = task_list[i].obj_id.length; j < JLEN; j++) {
                task_list[i].obj_info.push(obj_infos[task_list[i].obj_id[j]]);
              }
            }
            if(!users_info) continue;
            task_list[i].creator_info = users_info[task_list[i].creator_id];
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
          that.active_task = that.$route.query.type || 'create';
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
    }
  }
</style>
<style lang="scss">
  .task-list {
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


