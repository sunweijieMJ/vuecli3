<template>
  <div class="task-list">
    <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <li v-for="(item, index) in task_list" :key="index">
        <single-task :item="item"></single-task>
      </li>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </ul>
  </div>
</template>
<script>
  import TaskApi from '../../../../api/Task.js';
  import {Loading} from '../../../../components/public';
  import {SingleTask} from '../../../../components/business';

  export default {
    components: {SingleTask, Loading},
    data() {
      return {
        task_list: [1, 2],
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
        await TaskApi().getSelfList({curPage}).then(res => {
          console.log(res);
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


