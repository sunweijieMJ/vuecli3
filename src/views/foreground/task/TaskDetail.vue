<template>
  <div class="task-detail">
    <div class="header-bg"></div>
    <div class="detail-box">
      <div class="head-padding">
        <div class="titles">
          <div class="subtitle">
            <span v-if="task_basic.is_key_task === 1" class="kt-tag">KT</span>
            <span v-else class="kt-tag">T</span>
            <span class="sub-kt-tag">{{task_basic.task_name}}</span>
          </div>
        </div>
        <div class="chao-link">
          <span class="iconfont icon-icon_link1" v-show="okr_name ? okr_name : false"></span>
          <span class="chao-limit" @click="goOkrDetail(obj_id)">{{okr_name}}</span>
        </div>
        <div class="joinners">
          <div class="left" v-if="task_basic.to_info">
            <el-popover
              placement="bottom"
              trigger="hover"
              class="head-img">
              <img slot="reference" style="cursor: pointer;" v-if="task_basic.to_info" :src="task_basic.to_info.header_photo" alt="" @click.stop="goProFile(task_basic.to_info.user_id)">
              <user-popover :userinfo="task_basic.to_info"></user-popover>
            </el-popover>
            <div class="name">
              <p>Owner</p>
              <p>{{task_basic.to_info.user_name}}</p>
            </div>
            <div>
              <p>起止时间</p>
              <p>{{task_basic.start_time | dateFormat('yyyy/MM/dd')}}-{{task_basic.end_time | dateFormat('yyyy/MM/dd')}}</p>
            </div>
          </div>
          <div class="right">
            <el-popover
              placement="bottom"
              trigger="hover"
              v-for="(a, index) in AllJoinner" :key="index"
              class="head-img">
              <img slot="reference" style="cursor: pointer;" v-if="a" :src="a.header_photo" alt="" @click.stop="goProFile(a.user_id)">
              <user-popover :userinfo="a"></user-popover>
            </el-popover>
            <el-dropdown v-if="AllJoinnerNum.length && AllJoinnerNum.length > 6" @command="showAllJoinner">
              <span class="el-dropdown-link">
                <div class="all-per" v-if="AllJoinnerNum">{{AllJoinnerNum.length}}</div>
              </span>
              <el-dropdown-menu slot="dropdown" class="joinner-drops">
                <el-dropdown-item v-for="(j, jindex) in AllJoinnerNum" :key="jindex" :command="j.user_id" :divided="true">
                  <img v-if="j.header_photo" :src="j.header_photo" alt="">
                  <span>{{j.user_name}}({{j.real_name}})</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="task-modal">
        <div class="task-dynamic" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
          <TaskDynamic :dynamic_list="dynamic_list" :dynamic_num="dynamic_num"></TaskDynamic>
        </div>
        <task-back :basic="task_basic"></task-back>
      </div>
    </div>
    <div class="drop-link-class" v-if="+task_basic.status === 1">
      <el-dropdown @command="handleCommand" v-if="task_basic && task_basic.is_owner">
        <span style="fontSize: 48px;" class="iconfont icon-btn_more_green1"></span>
        <el-dropdown-menu slot="dropdown" class="task-pop">
          <el-dropdown-item command="跟进">
            <span class="iconfont icon-icon_check"></span>
            <span class="edit" @click="$store.dispatch('setTaskFollow', {status: true, parent: task_basic})">跟进</span>
          </el-dropdown-item>
          <el-dropdown-item command="编辑">
            <span class="iconfont icon-icon_edit"></span>
            <span class="edit" @click="$store.dispatch('setTaskPublish', {status: true, type: 'edit', taskId: task_basic.task_id})">编辑</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item command="关闭">
            <span class="iconfont icon-icon_close_l"></span>
            <span class="edit" @click="$store.dispatch('setTaskClose', {status: true, parent: task_basic})">关闭</span>
          </el-dropdown-item> -->
          <el-dropdown-item v-if="0" command="添加Task">
            <span class="iconfont icon-icon_add2"></span>
            <span class="edit" @click="$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: task_basic})">添加Task</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    <task-publish @handleTaskCreate="handleTaskCreate" @handleTaskEdit="handleTaskEdit" @handleTaskPublish="handleTaskPublish"></task-publish>
    <TaskClose @handleTaskClose="handleTaskClose"></TaskClose>
    <TaskFollow @handleTaskCheck="handleTaskCheck"></TaskFollow>
    <task-feedback @handleTaskFeedback="handleTaskFeedback"></task-feedback>
  </div>
</template>
<script>
import TaskDynamic from './taskdetail/TaskDynamic';
import TaskBack from './taskdetail/TaskBack';
import {Loading} from '../../../components/public';
import taskApi from '../../../api/Task.js';

import UserPopover from '../../../components/popup/UserPopover';
import {TaskPublish, TaskFollow, TaskClose, TaskFeedback} from '../../../components/okr';
export default {
  name: 'taskpage',
  components: {
    TaskDynamic, TaskBack, Loading, TaskPublish, TaskFollow, TaskClose, TaskFeedback, UserPopover
  },
  data(){
    return {
      task_basic: '', // ETC task基础信息
      okr_name: '',
      obj_id: 0,
      AllJoinnerNum: '',
      AllJoinner: [],
      dynamic_list: [],
      dynamic_num: '',
      last_id: '',
      task_list: [],
      pageInfo: { // ETC 页码信息
        current_page: 0,
        page_size: 8,
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
    goProFile(user_id){
      window.open(`/foreground/fore_mine/profile/${user_id}`, '_blank');
    },
    goOkrDetail(obj_id){
      window.open(`/foreground/fore_okr/okr_detail/${obj_id}`, '_blank');
    },
    // 所有参与者
    showAllJoinner(val) {
      window.open(`/foreground/fore_mine/profile/${val}`, '_blank');
    },
    handleCommand() {
      return;
    },
    handleTaskClose(){
      this.dynamic_list = [];
      this.pageInfo.current_page = 0;
      this.last_id = '';
      this.infinite();
    },
    handleTaskCheck(){
      this.dynamic_list = [];
      this.pageInfo.current_page = 0;
      this.last_id = '';
      this.infinite();
    },
    handleTaskFeedback() {
      this.getTaskBasicInfo();
    },
    handleTaskEdit() {
      this.getTaskBasicInfo();
    },
    handleTaskCreate() {
      this.getOkrKeyTask();
    },
    handleTaskPublish(){
      this.getOkrKeyTask();
    },
    getTaskBasicInfo(){
      taskApi().getBasicInfo({taskId: this.$route.params.id}).then(res => {
        if(res.status){
          this.task_basic = res.data;
          this.task_basic.creator_info = this.task_basic.to_info;
          if(res.data.obj_infos && Object.values(res.data.obj_infos)){
            this.okr_name = Object.values(res.data.obj_infos)[0].objective_name;
            this.obj_id = Object.values(res.data.obj_infos)[0].obj_id;
          }

          let AllJoinners = Object.values(res.data.participants);
          this.AllJoinnerNum = Object.values(res.data.participants);

          if(this.AllJoinnerNum.length && this.AllJoinnerNum.length <= 6){
            this.AllJoinner = AllJoinners;
          }else{
            this.AllJoinner = this.AllJoinnerNum.slice(0, 5);
          }
        }
      });
    },
    // 触底刷新
    infinite() {
      let that = this;
      that.disabled = true;
      that.getTaskDynamicList(++that.pageInfo.current_page).then(() => {
        // 触底判断
        that.disabled = false;
        if(!that.dynamic_list.length) {
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
    async getTaskDynamicList(){
      return await taskApi().getTaskDynamicList({
        taskId: this.$route.params.id, // ETC okr id
        currpage: this.pageInfo.current_page, // ETC 当前第几页
        pages: this.pageInfo.page_size, // ETC 每页总数
        lastId: this.last_id // ETC 最后一条id
      }).then(res => {
        if(res.status && res.data && res.data.list){
          let newArr = res.data.list;
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].user_info = res.data.users_info[res.data.list[i].creator_id];
          }
          this.dynamic_list = this.dynamic_list.concat(newArr);
          this.dynamic_num = res.data.cnt;
          this.pageInfo.page_total = Math.ceil(res.data.cnt / this.pageInfo.page_size);
          this.last_id = res.data.last_id;
        }
      });
    },
    getOkrKeyTask(){
      taskApi().getOkrKeyTask({taskId: this.$route.params.id}).then(res => {
        if(res.status && res.data !== [] && res.data.list){
          let newArr = res.data.list;
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].user_info = res.data.user_info[res.data.list[i].creator_id];
          }
          this.task_list = newArr;
        }
      });
    }
  },
  mounted(){
    this.getTaskBasicInfo();
    this.getOkrKeyTask();
  }
};
</script>
<style lang="scss" scoped>
.task-detail{
  .header-bg{
    width: 100%;
    height: 206px;
    background: #45474B;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    // z-index: 0 !important;
  }
  .detail-box{
    width: 1040px;
    margin: auto;
    margin-top: -206px;
    .head-padding{
      height: 135px;
      padding: 39px 2px 32px 2px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

    }
    .chao-link{
      cursor: pointer;
      @extend %textlight;
      // margin-top: 11px;
      width: 360px;
      margin-left: 46px;
      font-size:15px;
      color: #C0C4CC;
      line-height:21px;
      display: flex;
      align-items: center;
      .iconfont{
        margin-right: 8px;
      }
      .chao-limit{
        display: inline-block;
        width: 335px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .titles{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .subtitle{
        font-size: 18px;
        font-weight: 500;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        .sub-kt-tag{
          display: inline-block;
          width: 994px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        span{
          // line-height: 1;
        }
        .kt-tag{
          display: inline-block;
          width: 36px;
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          background: #948BEA;
          border-radius:8px;
          margin-right: 10px;
        }
      }
    }
    .joinners{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 36px;
      img{
        width: 38px;
        height: 38px;
        border-radius: 50px;
      }
      .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        div{
          font-size:15px;
          color: #FFFFFF;
          line-height:21px;
          p:nth-child(1){
            font-size:13px;
            color:#C0C4CC;
            line-height:18px;
          }
        }
        .name{
          margin-left: 10px;
          margin-right: 71px;
        }
      }
      .right{
        display: flex;
        img{
          margin-left: 12px;
        }
        .all-per{
          cursor: pointer;
          margin-left: 12px;
          width: 38px;
          height: 38px;
          text-align: center;
          line-height: 38px;
          border-radius: 50px;
          background-color: #eee;
        }
      }
    }
    .task-modal{
      display: flex;
      justify-content: space-between;
    }
  }
  .drop-link-class{
    width: 1040px;
    height: 50px;
    position: fixed;
    bottom: 30px;
    left: calc((100% - 1040px) / 2 + 12px);
    .el-dropdown{
      right: -100%;
      border-radius:30px;
    }
    .icon-btn_more_green1{
      color: #948BEA;
      box-shadow: 0px 0px 15px 0px rgba(148,139,234,0.5);
      border-radius:30px;
      cursor: pointer;
      @extend %imglight;
      font-size: 48px;
    }
  }
}
</style>
<style lang="scss">
.joinner-drops{
  width: 300px;
  padding: 0 0 16px 0;
  height: 300px;
  overflow-y: scroll;
  margin-right: -130px;
  // &::-webkit-scrollbar {
  //   display:none
  // }
  .el-dropdown-menu__item{
    margin-top: 0;
    padding: 8px 26px;
    line-height: 1;
    color: #303133;
    font-size:15px;
    display: flex;
    align-items: center;
    img{
      width: 38px;
      height: 38px;
      border-radius: 50px;
      margin-right: 10px;
      margin-left: 38px;
    }
  }
  .el-dropdown-menu__item--divided{
    border-top: none;
    border-bottom: 1px solid #f6f6f6;
  }
  .el-dropdown-menu__item--divided:before{
    height: 0;
  }
  .el-dropdown-menu__item:first-child{
    margin-bottom: 0;
  }
}
.task-pop{
  padding: 0;
  .el-dropdown-menu__item{
    &:hover{
      color: #303133 !important;
      background-color: #f6f6f6 !important;
    }
    .edit{
      display: inline-block;
      width: 65px;
      text-align: center;
    }
    display: flex;
    justify-content: space-between;
    padding: 0 29px;
    line-height: 54px;
    .iconfont{
      margin-right: 10px;
    }
    font-size: 15px;
    color: #303133 !important;
  }
}
.task-detail{
  .detail-box{
    .el-dropdown{
      position: fixed;
      right: 138px;
      bottom: 21px !important;
      z-index: 1000;
    }
  }
}
</style>
