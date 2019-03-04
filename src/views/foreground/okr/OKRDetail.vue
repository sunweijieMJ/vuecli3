<template>
  <div class="okr-detail">
    <div class="black-bg">
      <div class="black-con">
        <div class="title">
          <div class="subtitle" v-if="okr_detail">
            <span class="kt-tag">{{okr_detail.okr_type_name}}</span>
            <span class="kt-title">{{okr_detail.objective_name}}</span>
          </div>
        </div>
        <div class="joinner" v-if="okr_detail">
          <div class="left" v-if="okr_detail.bo_info">
            <div v-if="okr_detail.okr_type === 3" style="margin-right: 50px;">
              <p>{{okr_detail.okr_type_name}}</p>
              <p>{{okr_detail.bo_info.department_name}}</p>
            </div>
            <!-- <img v-if="okr_detail.bo_info.header_photo" :src="okr_detail.bo_info.header_photo" alt=""> -->
            <el-popover
              placement="bottom"
              trigger="hover"
              class="head-img">
              <img slot="reference" style="cursor: pointer;" v-if="okr_detail.bo_info" :src="okr_detail.bo_info.header_photo" alt="" @click.stop="goProFile(okr_detail.bo_info.user_id)">
              <user-popover :userinfo="okr_detail.bo_info"></user-popover>
            </el-popover>
            <div class="name">
              <p>Owner</p>
              <p>{{okr_detail.bo_info.user_name}}</p>
            </div>
            <div>
              <p>起止时间</p>
              <p v-if="okr_detail.duration_span">
                <span>{{okr_detail.create_year}}</span>
                - 
                <span>{{okr_detail.duration_span}}</span>
              </p>
              <p v-else>
                <span>{{dateFormat(okr_detail.start_time, 'yyyy/MM/dd')}}</span>
                - 
                <span>{{dateFormat(okr_detail.end_time, 'yyyy/MM/dd')}}</span>
              </p>
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
      </div>
    </div>
    <div class="okr-content">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(ml, mindex) in menu_list" :label="ml.label" :name="ml.name" :key="mindex">
            <div >
              <div v-if="ml.name === 'first'" v-infinite-scroll="infinite1" infinite-scroll-disabled="disabled">
                <div class="key-result">
                  <KeyResult 
                    @updateOkr="updateOkr"
                    :isOwner="okr_detail.is_owner"
                    :okrDec="okr_detail.obj_desc"
                    :objId="okr_detail.obj_id"
                    :kr_list="kr_list"
                    :okr_detail="okr_detail"
                    ></KeyResult>
                </div>
                <div class="add-key-task">
                  <span class="task-name">Key Task</span>
                  <span class="span2" v-show="okr_detail.is_parter" @click="$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: okr_detail})">
                    <i class="iconfont icon-btn_add_kt1"></i>
                    <span class="task-add" >添加</span>
                  </span>
                </div>
                <div class="key-task">
                  <KeyTask :kt_list="kt_list" @upDateList="upDateList"></KeyTask>
                </div>
              </div>
              <div v-if="ml.name === 'second'" v-infinite-scroll="infinite2" infinite-scroll-disabled="disabled2">
                <OkrDynamic :okr_dynamic_list="okr_dynamic_list"></OkrDynamic>
              </div>
              <loading v-if="ml.name === 'first'" :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
              <loading v-if="ml.name === 'second'" :loading="disabled2" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="drop-link-class">
      <el-dropdown @command="handleCommand" v-if="okr_detail && okr_detail.is_owner">
        <span class="el-dropdown-link">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-btn_more_green1"></use>
          </svg>
        </span>
        <el-dropdown-menu slot="dropdown" class="okr-pop">
          <el-dropdown-item command="编辑">
            <span class="iconfont icon-icon_edit"></span>
            <span class="edits">编辑</span>
          </el-dropdown-item>
          <el-dropdown-item command="删除">
            <span class="iconfont icon-icon_delete"></span>
            <span class="edits">删除</span>
          </el-dropdown-item>
          <el-dropdown-item command="添加">
            <span class="iconfont icon-icon_add2"></span>
            <span class="edits">添加KT</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <o-k-r-publish @handleOkrEdit="handleOkrEdit"></o-k-r-publish>
    <task-publish @handleTaskCreate="handleTaskCreate" @handleTaskPublish="handleTaskPublish" @handleTaskEdit="handleTaskEdit"></task-publish>
  </div>
</template>
<script>
import KeyResult from './okrdetail/KeyResult.vue';
import KeyTask from './okrdetail/KeyTask';
import OkrDynamic from './okrdetail/OkrDynamic';
import frequent from '../../../mixins/frequent.js';
import {Loading} from '../../../components/public';
import {OKRPublish, TaskPublish} from '../../../components/okr';
import dateFormat from '../../../utils/filters/dateFormat.js';
import UserPopover from '../../../components/popup/UserPopover';
import okrApi from '../../../api/Okr.js';

export default {
  name: 'okrdetail',
  mixins: [frequent],
  components: {KeyResult, KeyTask, Loading, OKRPublish, TaskPublish, UserPopover, OkrDynamic},
  data(){
    return {
      dateFormat,
      okr_detail: '', // ETC okr基础信息
      AllJoinnerNum: '',
      AllJoinner: [],
      kr_list: [], // ETC kr列表
      kt_list: [], // ETC kt列表
      okr_dynamic_list: [],
      pageInfo: { // ETC 页码信息
        current_page: 0,
        current_page2: 0,
        page_size: 6,
        page_total: 0
      },
      disabled: false, // ETC 加载开关
      disabled2: false,
      loading: {
        nomore: false, // ETC 触底
        noresult: false // ETC 空列表
      },
      task_id: '',
      activeName: 'first',
      // window.sessionStorage.getItem('label') ? window.sessionStorage.getItem('label') :
      menu_list: [
        {
          label: 'OKR',
          name: 'first'
        },
        {
          label: '动态',
          name: 'second'
        }
      ]
    };
  },
  methods: {
    // tab切换
    handleClick(){
      // window.sessionStorage.setItem('label', this.activeName);
      this.pageInfo.current_page = 0;
      this.pageInfo.current_page2 = 0;
      this.task_id = '';
      this.kt_list = [];
      this.okr_dynamic_list = [];
      this.loading.nomore = false;
      this.loading.noresult = false;
      this.disabled2 = false,
      this.disabled = false;
      this.pageInfo.page_total = 0;
      if(this.activeName === 'first'){
        this.infinite1();
      }else if(this.activeName === 'second'){
        this.infinite2();
      }
    },
    // 刷新okr列表
    updateOkr(){
      this.getBasicInfo();
    },
    goProFile(user_id){
      this.pathSkip(`/foreground/fore_mine/profile/${user_id}`);
    },
    clear(){
      this.kt_list = [];
      this.task_id = '';
      this.pageInfo.current_page = 0;
      this.pageInfo.current_page2 = 0;
      if(this.activeName === 'first'){
        this.infinite1();
      }else if(this.activeName === 'second'){
        this.infinite2();
      }
    },
    // 刷新数据
    upDateList(){
      this.clear();
    },
    handleTaskEdit(){
      this.clear();
    },
    // 编辑okr回调
    handleOkrEdit() {
      this.getBasicInfo();
      if(this.activeName === 'second'){
        location.reload();
      }else{
        this.getKeyResultList();
      }
    },
    handleTaskPublish(){
      this.clear();
    },
    handleTaskCreate() {
      this.clear();
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
        case '添加':
          this.$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: this.okr_detail});
          break;
        default:
          break;
      }
    },
    // okr删除
    okrDelete(){
      okrApi().deleteOkr({
        objId: this.$route.params.id // ETC obj id
      }).then(res => {
        if(res.status){
          this.$message({message: '删除成功', type: 'success', duration: 1750});
          this.$router.push({name: 'OKRList', query: {active_menu: 'create'}});
        }else{
          this.$message({message: res.message, type: 'warning', duration: 1750});
        }
      });
    },
    // 显示全部参与者
    showAllJoinner(val){
      this.pathSkip(`/foreground/fore_mine/profile/${val}`);
    },
    getBasicInfo(){
      okrApi().getBasicInfo({objId: this.$route.params.id}).then(res => {
        if(!res.status) {
          this.$message({message: res.message, type: 'warning', duration: 1750});
          this.$router.push({name: 'OKRList', query: {active_menu: 'create'}});
        }else{
          this.okr_detail = res.data;
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
    getKeyResultList(){
      okrApi().getKeyResultList({objId: this.$route.params.id}).then(res => {
        this.kr_list = Object.values(res.data);
      });
    },
    // okr触底刷新
    infinite1(){
      // if(this.activeName === 'second') return;
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
    // 动态触底刷新
    infinite2() {
      if(this.activeName === 'first') return;
      let that = this;
      that.disabled2 = true;
      that.getOkrDynamic(++this.pageInfo.current_page2).then(() => {
        that.disabled2 = false;
        if(!that.okr_dynamic_list.length) {
          that.disabled2 = true;
          that.loading = {
            nomore: true,
            noresult: true
          };
        } else if(that.pageInfo.current_page2 >= that.pageInfo.page_total){
          that.disabled2 = true;
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
    },

    async getOkrDynamic(){
      return await okrApi().getOkrDynamic({
        obj_id: this.$route.params.id, // ETC okr id
        currPage: this.pageInfo.current_page2, // ETC 当前第几页
        pages: this.pageInfo.page_size, // ETC 每页总数
        last_id: this.task_id ? this.task_id : ''
      }).then(res => {
        this.pageInfo.page_total = Math.ceil(res.data.cnt / this.pageInfo.page_size);
        this.task_id = res.data.last_id;
        let new_key_task = res.data.list;

        if(res.status && new_key_task.length){
          for (let i = 0; i < new_key_task.length; i++){
            new_key_task[i].users_info = res.data.users_info[new_key_task[i].creator_id];
          }
          this.okr_dynamic_list = this.okr_dynamic_list.concat(new_key_task);
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
    height: 230px;
    background-color: #45474B;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    z-index: 0 !important;
  }
  .black-con{
    width: 1040px;
    margin: auto;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .subtitle{
        margin-top: 33px;
        font-size: $h2Font;
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
          font-size: 14px;
          line-height: 18px;
          text-align: center;
          background: #22D7A0;
          border-radius:10px;
          margin-right: 10px;
        }
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
  }
  .okr-content{
    width: 1040px;
    margin: auto;
    // color: white;
    // margin-top: -200px;
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
      cursor: pointer;
      @extend %imglight;
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
      margin-top: 12px;
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
        &:hover span{
          color: $purple
        }
      }
      .iconfont{
        cursor: pointer;
        color: #948BEA;
        font-size: 20px;
        margin-left: 20px;
        margin-right: 6px;
      }
      .task-name{
        font-size: $h2Font;
        font-weight:500;
        color: #909399;
      }
      .task-add{
        font-size: $h2Font;
        font-weight:500;
        color: #303133;
        cursor: pointer;
      }
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
    }
    .el-dropdown-link{
      cursor: pointer;
      @extend %imglight;
      .icon{
        width: 48px;
        height: 48px;
        box-shadow:0px 0px 15px 0px rgba(34,215,160,0.5);
        border-radius:30px;
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
.okr-pop{
  padding: 0;
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
    color: #303133 !important;
  }
}
.black-con{
  .title{
    .el-dropdown{
      position: fixed;
      right: 138px;
      bottom: 21px !important;
      z-index: 1000;
    }
  }
}
.okr-detail{
  .okr-content{
    .el-tabs{
      box-sizing: border-box;
      .el-tabs__header{
        margin-top: -61px;
        margin-bottom: 0;
        .el-tabs__nav-wrap::after{
          display: none;
        }
        .el-tabs__nav-scroll{
          padding: 5px 0; 
          height: 51px;
          background-color: #303133; 
          .el-tabs__nav{
            line-height: 56px;
            margin-left: 50px;
            .el-tabs__item.is-active{
              color: white;
              font-size: $h2Font;
              font-weight:500;
            }
            .el-tabs__item{
              color: #C0C4CC;
              font-size: $h2Font;
              font-weight:500;
            }
          }
          .el-tabs__active-bar{
            bottom: 14px;
            height: 3px;
            border-radius: 2px;
            background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
          }
        }
      }
      .el-tabs__content{
        // overflow: initial;
        .el-tab-pane{
        }
      }
    }
  }
}

</style>

