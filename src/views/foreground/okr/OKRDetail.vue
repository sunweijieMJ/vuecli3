<template>
  <div class="okr-detail">
    <div class="black-bg"></div>
    <div class="content">
      <div class="title">
        <div class="subtitle">
          <span class="kt-tag">{{okr_detail.okr_type_name}}</span>
          <span class="kt-title">{{okr_detail.okr_name}}</span>
        </div>
        <el-dropdown @command="handleCommand" v-if="okr_detail && okr_detail.is_owner">
          <span class="el-dropdown-link">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-btn_more_g1"></use>
            </svg>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="编辑">
              <span class="iconfont icon-icon_edit_l"></span>
              <span class="edits">编辑</span>
            </el-dropdown-item>
            <el-dropdown-item command="删除">
              <span class="iconfont icon-icon_delete"></span>
              <span class="edits">删除</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="joinner">
        <div class="left" v-if="okr_detail.bo_info">
          <div v-if="okr_detail.okr_type === 3" style="margin-right: 50px;">
            <p>{{okr_detail.okr_type_name}}</p>
            <p>{{okr_detail.bo_info.department_name}}</p>
          </div>
          <img v-if="okr_detail.bo_info.header_photo" :src="okr_detail.bo_info.header_photo" alt="">
          <div class="name">
            <p>Owner</p>
            <p>{{okr_detail.bo_info.user_name}}</p>
          </div>
          <div>
            <p>起止时间</p>
            <p>{{dateFormat(okr_detail.start_time, 'yyyy/MM/dd')}}
              -{{dateFormat(okr_detail.end_time, 'yyyy/MM/dd')}}
            </p>
          </div>
        </div>
        <div class="right">
          <img v-for="(a, index) in AllJoinner" :key="index" v-if="a.header_photo" :src="a.header_photo" alt="">
          <el-dropdown @command="showAllJoinner" v-if="AllJoinnerNum.length && AllJoinnerNum.length > 6">
            <span class="el-dropdown-link">
              <div class="all-per" v-if="AllJoinnerNum">{{AllJoinnerNum.length}}</div>
            </span>
            <el-dropdown-menu slot="dropdown" class="joinner-drop">
              <el-dropdown-item v-for="(j, jindex) in AllJoinnerNum" :key="jindex" :command="j.user_id" :divided="true">
                <img v-if="j.header_photo" :src="j.header_photo" alt="">
                <span>{{j.user_name}}({{j.real_name}})</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="key-result">
        <KeyResult :kr_list="kr_list" :okr_detail="okr_detail"></KeyResult>
      </div>
      <div class="add-key-task">
        <span class="task-name">Key Task</span>
        <span class="span2" v-show="okr_detail.is_parter">
          <span class="iconfont icon-btn_add_kt1"></span>
          <span class="task-add" @click="$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: okr_detail})">添加</span>
        </span>
      </div>
      <div class="key-task" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
        <KeyTask :kt_list="kt_list" @upDateList="upDateList"></KeyTask>
      </div>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </div>
    <o-k-r-publish @handleOkrEdit="handleOkrEdit"></o-k-r-publish>
    <task-publish @handleTaskCreate="handleTaskCreate" @handleTaskPublish="handleTaskPublish"></task-publish>
  </div>
</template>
<script>
import KeyResult from './okrdetail/KeyResult.vue';
import KeyTask from './okrdetail/KeyTask';
import {Loading} from '../../../components/public';
import {OKRPublish, TaskPublish} from '../../../components/okr';
import dateFormat from '../../../utils/filters/dateFormat.js';

import okrApi from '../../../api/Okr.js';
export default {
  name: 'okrdetail',
  components: {KeyResult, KeyTask, Loading, OKRPublish, TaskPublish},
  data(){
    return {
      dateFormat,
      okr_detail: '', // ETC okr基础信息
      AllJoinnerNum: '',
      AllJoinner: [],
      kr_list: [], // ETC kr列表
      kt_list: [], // ETC kt列表
      pageInfo: { // ETC 页码信息
        current_page: 0,
        page_size: 6,
        page_total: 0
      },
      disabled: false, // ETC 加载开关
      loading: {
        nomore: false, // ETC 触底
        noresult: false // ETC 空列表
      },
      task_id: ''
    };
  },
  methods: {
    // 刷新数据
    upDateList(){
      this.kt_list = [];
      this.task_id = '';
      this.pageInfo.current_page = 0;
      this.infinite();
    },
    // 编辑okr回调
    handleOkrEdit() {
      this.getBasicInfo();
    },
    handleTaskPublish(){
      this.kt_list = [];
      this.task_id = '';
      this.pageInfo.current_page = 0;
      this.infinite();
    },
    handleTaskCreate() {
      this.kt_list = [];
      this.task_id = '';
      this.pageInfo.current_page = 0;
      this.infinite();
    },
    handleCommand(command){
      switch (command) {
        case '编辑':
          this.okr_detail.key_result = this.kr_list;
          this.$store.dispatch('setOKRPublish', {status: true, type: 'edit', okrId: this.okr_detail.obj_id});
          break;
        case '删除':
          this.okrDelete();
          break;
        default:
          break;
      }
    },
    // okr删除
    okrDelete(){
      okrApi().delOkr({
        objId: this.$route.params.id // ETC obj id
      }).then(res => {
        this.$message({message: res.message, type: 'success', duration: 1000});
        window.history.go(-1);
      }).catch(res => {
        this.$message({message: res.message, type: 'warning', duration: 1000});
      });
    },
    // 显示全部参与者
    showAllJoinner(val){
    },
    getBasicInfo(){
      okrApi().getBasicInfo({objId: this.$route.params.id}).then(res => {
        this.okr_detail = res.data;
        let AllJoinners = Object.values(res.data.participants);
        this.AllJoinnerNum = Object.values(res.data.participants);

        if(this.AllJoinnerNum.length && this.AllJoinnerNum.length <= 6){
          this.AllJoinner = AllJoinners;
        }else{
          this.AllJoinner = this.AllJoinnerNum.slice(0, 5);
        }
      });
    },
    getKeyResultList(){
      okrApi().getKeyResultList({objId: this.$route.params.id}).then(res => {
        this.kr_list = Object.values(res.data);
      });
    },
    // 触底刷新
    infinite() {
      let that = this;
      that.disabled = true;
      that.getKeyTaskList(++this.pageInfo.current_page).then(() => {
        // 触底判断
        that.disabled = false;
        if(!that.kt_list.length) {
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
    async getKeyTaskList(){
      return await okrApi().getKeyTaskList({
        objId: this.$route.params.id, // ETC okr id
        currPage: this.pageInfo.current_page, // ETC 当前第几页
        pages: this.pageInfo.page_size, // ETC 每页总数
        lastId: this.task_id ? this.task_id : ''
      }).then(res => {
        this.pageInfo.page_total = Math.ceil(res.data.cnt / this.pageInfo.page_size);
        let new_key_task = res.data.list;
        if(res.status && new_key_task.length){
          for (let i = 0; i < new_key_task.length; i++){
            new_key_task[i].users_info = res.data.users_info[new_key_task[i].task_owner_id];
            if(new_key_task[i].sub_tasks && new_key_task[i].sub_tasks.length){
              for (let j = 0; j < new_key_task[i].sub_tasks.length; j++) {
                new_key_task[i].sub_tasks[j].users_info = res.data.users_info[new_key_task[i].sub_tasks[j].task_owner_id];
              }
            }
          }
          this.kt_list = this.kt_list.concat(new_key_task);
          this.task_id = this.kt_list[this.kt_list.length - 1].task_id;
        }
      });
    }
  },
  mounted(){
    this.getBasicInfo();
    this.getKeyResultList();
  }
};
</script>
<style lang="scss" scoped>
.okr-detail{
  .black-bg{
    width: 100%;
    height: 206px;
    background-color: #606266;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    z-index: 0 !important;
  }
  .content{
    width: 967px;
    margin: auto;
    // color: white;
    margin-top: -170px;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .subtitle{
        font-size: 20px;
        color: #FFFFFF;
        font-weight: 500;
        display: flex;
        align-items: center;
        span{
          line-height: 1;
        }
        .kt-title{
          display: inline-block;
          width: 817px;
          line-height: 41px;
          
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .kt-tag{
          display: inline-block;
          width: 44px;
          height: 18px;
          font-size: 15px;
          line-height: 18px;
          text-align: center;
          background: #22D7A0;
          border-radius:10px;
          margin-right: 10px;
        }
      }
    }
    .el-dropdown-link{
      .icon{
        width: 38px;
        height: 38px;
      }
    }
    .joinner{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 33px;
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
          margin-right: 50px;
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
    .key-result{
      margin-top: 22px;
    }
    .add-key-task{
      padding: 20px 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span{
        line-height: 1;
      }
      .span2{
        display: flex;
        align-items: center;
      }
      .iconfont{
        cursor: pointer;
        color: #948BEA;
        font-size: 20px;
        margin-left: 20px;
        margin-right: 6px;
      }
      .task-name{
        font-size:18px;
        font-weight:500;
        color: #909399;
      }
      .task-add{
        font-size:18px;
        font-weight:500;
        color: #303133;
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.joinner-drop{
  width: 300px;
  padding: 0 0 16px 0;
  height: 300px;
  overflow-y: scroll;
  margin-right: -145px;
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
ul{
  &.el-dropdown-menu{
    padding: 0;
  }
  .el-dropdown-menu__item{
    .edits{
      display: inline-block;
      width: 65px;
      text-align: center;
    }
    .iconfont{
      margin-right: 10px;
    }
    &:hover{
      color: #303133 !important;
      background-color: #f6f6f6 !important;
    }
    font-size: 15px;
    padding: 0 29px;
    line-height: 54px;
  }
}
</style>

