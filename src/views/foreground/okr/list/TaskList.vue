<template>
  <div class="task-list">
    <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <li v-for="(item, index) in task_list" :key="index">
        <single-task :item="item"></single-task>
      </li>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </ul>
    <task-publish @handleTaskEdit="handleTaskEdit"></task-publish>
    <task-follow></task-follow>
    <task-close></task-close>
  </div>
</template>
<script>
  import TaskApi from '../../../../api/Task.js';
  import {Loading} from '../../../../components/public';
  import {SingleTask, TaskPublish, TaskFollow, TaskClose} from '../../../../components/okr';

  export default {
    components: {SingleTask, Loading, TaskPublish, TaskFollow, TaskClose},
    data() {
      return {
        task_list: [],
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false // ETC 空列表
        }
      };
    },
    methods: {
      handleTaskEdit() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.infinite();
      },
      handleTaskPublish() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.infinite();
      },
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getSelfList(++that.pageInfo.current_page).then(() => {
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
      async getSelfList(curPage) {
        let that = this;
        await TaskApi().getSelfList({curPage}).then(res => {
          const users_info = res.data.users_info;
          const obj_infos = res.data.obj_infos;
          const task_list = res.data.list;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = task_list.length; i < ILEN; i++) {
            if(task_list[i].obj_id) {
              task_list[i].obj_info = [];
              for(let j = 0, JLEN = task_list[i].obj_id.length; j < JLEN; j++) {
                task_list[i].obj_info.push(obj_infos[task_list[i].obj_id[j]]);
              }
            }
            if(!task_list[i].check_info) continue;
            if(!users_info) continue;
            task_list[i].check_info.creator_info = users_info[task_list[i].creator_id];
          }

          that.task_list = that.task_list.concat(task_list);
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .task-list {
    width: 967px;
    margin: auto;
    .list {
      li {
        margin-top: 12px;
      }
    }
  }
</style>


