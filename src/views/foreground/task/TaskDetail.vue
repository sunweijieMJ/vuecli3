<template>
  <div class="task-detail">
    <div class="header-bg"></div>
    <div class="detail-box">
      <div class="head-padding">
        <div class="titles">
          <div class="subtitle">
            <span v-if="task_basic.is_key_task === 1" class="kt-tag">KT</span>
            <span v-else class="kt-tag">T</span>
            <span>{{task_basic.task_name}}</span>
          </div>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="iconfont icon-icon_manage" style="color: white;"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="黄金糕">
                编辑
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="chao-link">
          <span class="iconfont icon-icon_manage" v-if="okr_name"></span><span>{{okr_name}}</span>
        </div>
        <div class="joinners">
          <div class="left" v-if="task_basic.to_info">
            <img :src="task_basic.to_info.header_photo" alt="">
            <div class="name">
              <p>BO</p>
              <p>{{task_basic.to_info.user_name}}</p>
            </div>
            <div>
              <p>时间</p>
              <p>{{task_basic.start_time | dateFormat('yyyy/MM/dd')}}-{{task_basic.end_time | dateFormat('yyyy/MM/dd')}}</p>
            </div>
          </div>
          <div class="right">
            <img v-for="(a, index) in 4" :key="index" src="https://p0.ssl.qhimg.com/t01c7526f609f50ca85.jpg" alt="">
            <el-dropdown @command="">
              <span class="el-dropdown-link">
                <div class="all-per">23</div>
              </span>
              <el-dropdown-menu slot="dropdown" class="joinner-drops">
                <el-dropdown-item v-for="(j, jindex) in 2" :key="jindex" command="大大" :divided="true">
                  <img src="https://p0.ssl.qhimg.com/t01c7526f609f50ca85.jpg" alt="">
                  <span>大大(哈哈)</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="task-modal">
        <div class="task-dynamic">
          <TaskDynamic :dynamic_list="dynamic_list" :dynamic_num="dynamic_num"></TaskDynamic>
        </div>
        <div class="telated-task">
          <RelatedTask :task_list="task_list"></RelatedTask>
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import TaskDynamic from './taskdetail/TaskDynamic';
import RelatedTask from './taskdetail/RelatedTask';

import taskApi from '../../../api/Task.js';
export default {
  name: 'taskpage',
  components: {
    TaskDynamic, RelatedTask
  },
  data(){
    return {
      task_basic: '', // ETC task基础信息
      okr_name: '',
      dynamic_list: [],
      dynamic_num: '',
      last_id: '',
      task_list: []
    };
  },
  methods:{
    handleCommand(){

    },
    getTaskBasicInfo(){
      taskApi().getTaskBasicInfo({taskId: 12}).then(res => {
        if(res.status){
          this.task_basic = res.data;
          if(res.data.obj_infos){
            this.okr_name = Object.values(res.data.obj_infos)[0].okr_name;
          }
        }
      });
    },
    getTaskDynamicList(){
      taskApi().getTaskDynamicList({
        taskId: 2, // ETC okr id
        currpage: 1, // ETC 当前第几页
        pages: 15, // ETC 每页总数
        lastId: '' // ETC 最后一条id
      }).then(res => {
        if(res.status){
          let newArr = res.data.list;
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].user_info = res.data.users_info[res.data.list[i].creator_id];
          }
          this.dynamic_list = this.dynamic_list.concat(newArr);
          this.dynamic_num = res.data.cnt;
        }
      });
    },
    getTaskList(){
      taskApi().getTaskList({taskId: 1}).then(res => {
        if(res.status){
          let newArr = res.data.list;
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].user_info = res.data.user_info[res.data.list[i].creator_id];
          }
          this.task_list = this.task_list.concat(newArr);
        }
      });
    }
  },
  mounted(){
    this.getTaskBasicInfo();
    this.getTaskDynamicList();
    this.getTaskList();
    
  }
};
</script>
<style lang="scss" scoped>
.task-detail{
  .header-bg{
    width: 100%;
    height: 206px;
    background: #606266;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    // z-index: 0 !important;
  }
  .detail-box{
    width: 1026px;
    margin: auto;
    margin-top: -206px;
    .head-padding{
      height: 140px;
      padding: 40px 25px 26px 25px;
    }
    .chao-link{
      margin-top: 11px;
      margin-left: 46px;
      font-size:15px;
      font-weight:400;
      color: #FFFFFF;
      line-height:21px;
      .iconfont{
        margin-right: 8px;
      }
    }
    .titles{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .subtitle{
        font-size: 22px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        span{
          line-height: 1;
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
      margin-top: 43px;
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
          font-weight:400;
          color: #FFFFFF;
          line-height:21px;
          p:nth-child(1){
            font-size:13px;
            font-weight:400;
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
    font-weight:400;
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
</style>
