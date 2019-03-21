<template>
  <div class="task-list">
    <no-result v-if="loading.noresult"></no-result>
    <template v-else>
      <div class="task-select">
        <div class="check-left">
          <div class="switch-checkout">
            <span :class="switch_index === sindex ? 'hight' : ''" v-for="(s, sindex) in switch_btn" :key="sindex" @click="switchButton(sindex, s.status)">{{s.btn}}</span>
          </div>
          <el-cascader
            v-if="active_task === 'all'"
            v-model="active_part"
            placeholder="全部作者"
            expand-trigger="hover"
            popper-class="custom-cascader"
            :options="part_list"
            :clearable="true"
            :show-all-levels="false"
            @active-item-change="handleItemChange"
            @change="resetList()"
          ></el-cascader>
        </div>
        <div class="checkout-btn">
          <span class="iconfont icon-icon_view"></span>
          <span class="checkout-view" @click="chekcoutView">切换视图</span>
        </div>
      </div>
      <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
        <li v-for="(item, index) in (chekcout_view === 0 ? task_list : group_list)" :key="index">
          <single-task :item="item" v-if="chekcout_view === 0"></single-task>
          <AggregationList v-if="chekcout_view === 1" :item="item"
          :obj="{qtype: active_task, qdep_id: active_part[0], quser_id: active_part[1], status: 1, switch_index: switch_index}"
          @addTask="addTask"></AggregationList>
        </li>
        <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
      </ul>
      <task-publish @handleTaskEdit="resetList()" @handleTaskPublish="resetList()"></task-publish>
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
  import AggregationList from './AggregationList';

  export default {
    components: {SingleTask, Loading, NoResult, TaskPublish, TaskFollow, TaskClose, AggregationList},
    data() {
      return {
        active_task: '', // ETC 当前激活菜单
        part_list: [], // ETC 部门列表
        active_part: [], // ETC 当前作者
        task_list: [],
        group_list: [], // ETC 聚合列表
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false, // ETC 空列表
          last_id: ''
        },
        switch_btn: [
          {
            btn: '进行中',
            status: 1
          },
          {
            btn: '已完成',
            status: 2
          }
        ],
        button_state: 1, // ETC 按钮状态记录
        chekcout_view: 1, // ETC 切换试图
        switch_index: 0 // ETC 按钮切换识别
      };
    },
    created() {
      let that = this;
      that.getPartList();
      that.active_task = that.$route.query.type || 'create';
    },
    methods: {
      resetData(){
        this.disabled = false;
        this.loading.nomore = false;
        this.loading.noresult = false;
        this.pageInfo.current_page = 0;
        this.task_list = [];
        this.group_list = [];
        this.loading.last_id = '';
        this.infinite();
      },
      addTask(data){
        this.$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: data});
      },
      // 切换视图
      chekcoutView(){
        if(this.chekcout_view === 0){
          this.chekcout_view = 1;
          this.pageInfo.page_size = 5;
        }else{
          this.pageInfo.page_size = 15;
          this.chekcout_view = 0;
        }
        this.resetData();
      },
      // 切换状态列表
      switchButton(index, status){
        this.switch_index = index;
        this.button_state = status;
        this.resetData();
      },
      //  获取聚合列表
      async getGroupList(){
        await TaskApi().getGroupList({
          qtype: this.active_task,
          qdep_id: this.active_part[0],
          quser_id: this.active_part[1],
          status: this.button_state, // ETC 完成或进行中的状态
          currPage: this.pageInfo.current_page,
          pages: 5,
          lastId: this.loading.last_id
        }).then(res => {
          if(res.status){
            let newList = [];
            newList = res.data.list;
            if(newList.length){
              for (let i = 0; i < newList.length; i++) {
                for (let j = 0; j < newList[i].task_list.list.length; j++) {
                  newList[i].task_list.list[j].users_info = res.data.list[i].task_list.users_info[res.data.list[i].task_list.list[j].task_owner_id];
                }
              }
            }
            this.group_list = this.group_list.concat(newList);
            this.loading.last_id = res.data.last_id;
            this.pageInfo.page_total = Math.ceil(res.data.cnt / this.pageInfo.page_size);
          }
        });
      },

      // 触底刷新
      infinite() {
        let that = this;
        that.disabled = true;
        if(this.chekcout_view){
          console.log(1)
          that.getGroupList(that.loading.last_id, ++that.pageInfo.current_page).then(() => {
            // 触底判断
            that.disabled = false;
            if(!that.group_list.length) {
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
        }else{
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
        }
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
          this.resetData();
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
      async getTaskList(lastId, currPage, qtype = this.active_task, qdep_id = this.active_part[0], quser_id = this.active_part[1], status = this.button_state) {
        let that = this;
        await TaskApi().getTaskList({lastId, currPage, qtype, qdep_id, quser_id, status}).then(res => {
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
      resetList() {
        let that = this;
        // 重置数据
        that.task_list = [];
        this.group_list = [];
        Object.assign(that.$data.pageInfo, that.$options.data().pageInfo);
        Object.assign(that.$data.loading, that.$options.data().loading);
        Object.assign(that.$data.disabled, that.$options.data().disabled);
        that.infinite();
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
    .task-select{
      .checkout-btn{
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 17px;
        font-size: 15px;
        font-weight:400;
        color: #303133;
        line-height: 1;
        .checkout-view{
          cursor: pointer;
          @extend %textlight;
        }
        .iconfont{
          margin-right: 4px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .task-list {
    .task-select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 1040px;
      margin: 12px auto;
      .check-left{
        display: flex;
        justify-content: flex-start;
      }
      .switch-checkout{
        margin-right: 16px;
        width: 192px;
        height: 38px;
        background: #DEDEDE;
        border-radius:20px;
        .hight{
          background: #FFFFFF;
          box-sizing: border-box;
          box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.1);
          border-radius: 19px;
          font-weight:400;
          color: $h1Color;
        }
        span{
          cursor: pointer;
          display: inline-block;
          line-height: 38px;
          text-align: center;
          width: 96px;
          font-size: $h3Font;
          height: 38px;
          color: #606266;
        }
      }
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


