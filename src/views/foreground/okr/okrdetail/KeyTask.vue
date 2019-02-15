<template>
  <div class="kt">
    <div class="kt-task" v-for="(kt, ktindex) in kt_list" :key="ktindex">
      <el-collapse accordion @change="handleChange" v-model="activeNames">
        <el-collapse-item :name="ktindex">
          <template slot="title">
            <div class="task-box">
              <div class="title">
                <div :class="{icon: true, isActive: activeJudge(ktindex)}">
                  <i v-if="kt.sub_tasks && kt.sub_tasks.length" style="cursor: pointer;" class="iconfont icon-sanjiaoyou"></i>
                </div>
                <div>
                  <span class="task-box-kt">KT</span><span class="got-task-detail" style="cursor: pointer;" @click.stop="gotTaskDetail(kt.task_id)">{{kt.task_name}}</span>
                </div>
              </div>
              <div class="objactive">
                <div class="left">
                  <div class="img" v-if="kt.users_info">
                    <!-- <img :src="kt.users_info.header_photo" alt=""> -->
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      class="head-img">
                      <img slot="reference" style="cursor: pointer;" v-if="kt.users_info" :src="kt.users_info.header_photo" alt="" @click.stop="goProFile(kt.users_info.user_id)">
                      <user-popover :userinfo="kt.users_info"></user-popover>
                    </el-popover>
                    <span @click.stop="goProFile(kt.users_info.user_id)" class="head-name">{{kt.users_info.user_name}}</span>
                  </div>
                  <div>
                    <span>{{dateFormat(kt.start_time, 'yyyy/MM/dd')}}-{{dateFormat(kt.end_time, 'yyyy/MM/dd')}}</span>
                  </div>
                </div>
                <div @mouseover="overlayShow(ktindex)">
                  <el-progress v-if="kt.status_name !== '完成'" :percentage="kt.progress" ></el-progress>
                  <div class="finally-status" v-if="kt.status_name == '完成'">
                    <span class="cont">完成度</span>
                    <span class="span2">
                      <span class="number">{{kt.progress}}</span><span>%</span>
                    </span>
                  </div>
                </div>
                
              </div>
              <task-check :item="kt"></task-check>
            </div>
          </template>
          <ul>
            <li v-for="(t, tindex) in kt.sub_tasks" :key="tindex">
              <div class="title">
                <span class="t-title">T</span>
                <span @click.stop="gotTaskDetail(t.task_id)" style="cursor: pointer;">{{t.task_name}}</span>
              </div>
              <div class="date">
                <div class="left">
                  <div class="img">
                    <!-- <img :src="t.users_info.header_photo" alt=""> -->
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      class="head-img">
                      <img slot="reference" style="cursor: pointer;" v-if="t.users_info" :src="t.users_info.header_photo" alt="" @click.stop="goProFile(t.users_info.user_id)">
                      <user-popover :userinfo="t.users_info"></user-popover>
                    </el-popover>
                    <span @click.stop="goProFile(t.users_info.user_id)" class="head-name">{{t.users_info.user_name}}</span>
                  </div>
                  <div>
                    <span>{{dateFormat(t.start_time, 'yyyy/MM/dd')}}-{{dateFormat(t.end_time, 'yyyy/MM/dd')}}</span>
                  </div>
                </div>
                <div @mouseover="overlayShowChild(tindex)" class="right">
                  <el-progress v-if="t.status_name !== '完成'" :percentage="t.progress" ></el-progress>
                  <div class="finally-status" v-if="t.status_name == '完成'">
                    <span class="cont">完成度</span>
                    <span class="span2">
                      <span class="number">{{t.progress}}</span><span>%</span>
                    </span>
                  </div>
                </div>
                
              </div>
              <task-check :item="t"></task-check>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-if="!kt_list.length" class="kt-task kt-task2">
      当前没有KeyTask
    </div>
    <task-follow @handleTaskCheck="handleTaskCheck"></task-follow>
    <task-close @handleTaskClose="handleTaskClose"></task-close>
  </div>
</template>
<script>
import dateFormat from '../../../../utils/filters/dateFormat.js';
import TaskCheck from '../../../../components/popup/TaskCheck.vue';
import {TaskFollow, TaskClose} from '../../../../components/okr';
import UserPopover from '../../../../components/popup/UserPopover';

export default {
  components: {TaskCheck, TaskFollow, TaskClose, UserPopover},
  name: 'keyTask',
  props: ['kt_list'],
  data(){
    return {
      dateFormat,
      activeNames: '',
      overlay_state: '',
      overlay_child_state: ''
    };
  },
  methods: {
    goProFile(user_id){
      // this.$router.push({name: 'Profile', params: {id: user_id}});
      window.open(`/foreground/fore_mine/profile/${user_id}`, '_blank');
    },
    handleChange(val){
      this.activeNames = val;
    },
    handleTaskCheck() {
      let that = this;
      Object.assign(that.$data, that.$options.data());
      this.$emit('upDateList');
    },
    handleTaskClose() {
      let that = this;
      Object.assign(that.$data, that.$options.data());
      this.$emit('upDateList');
    },
    activeJudge(kindex){
      if(kindex === this.activeNames){
        return true;
      }else{
        return false;
      }
    },
    overlayShow(val){
      this.overlay_state = val;
    },
    overlayHide(){
      this.overlay_state = '';
    },
    overlayJudge(kindex){
      if(kindex === this.overlay_state){
        return true;
      }else{
        return false;
      }
    },

    overlayShowChild(val){
      this.overlay_child_state = val;
    },
    overlayJudgeChild(tindex){
      if(tindex === this.overlay_child_state){
        return true;
      }else{
        return false;
      }
    },
    overlayHideChild(){
      this.overlay_child_state = '';
    },
    gotTaskDetail(task_id){
      window.open(`/foreground/fore_task/task_detail/${task_id}`, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.kt{
  .kt-task2{
    padding-bottom: 25px !important;
    padding-left: 50px !important;
    color: #606266;
  }
  .kt-task{
    margin-bottom: 12px;
    background-color: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:4px;
    padding: 25px 0 0 30px;
    .task-box{
      padding-right: 50px;
      position: relative;
      .got-task-detail{
        @extend %textlight;
      }
      &:hover .task-check{
        opacity: 1;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 70%);
      }
      .overlayJudge{
        display: block !important;
      }
      .overlay{
        display: none;
      }
      .over-box{
        z-index: 1000;
        width: 300px;
        height: 70px;
        background-image: url('../../../../../static/img/jianbian_bg.png');
        background-size: 100% 100%;
        // background: white;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        justify-content: flex-end;
        div{
          text-align: center;
          margin-left: 34px;
          color: #000000;
          span{
            font-size:14px;
            color: #303133;
          }
        }
        .iconfont{
          cursor: pointer;
          font-size: 33px;
          display: block;
        }
      }
    }
    .title{
      display: flex;
      align-items: center;
      font-size:15px;
      font-weight:500;
      color: #303133;
      line-height: 1;
      .task-box-kt{
        display: inline-block;
        width: 36px;
        height: 16px;
        font-weight: normal;
        text-align: center;
        line-height: 16px;
        background: #948BEA;
        border-radius:8px;
        font-size:14px;
        color: #FFFFFF;
        margin-right: 10px;
      }
      .icon{
        width: 20px;
        height: 20px;
        text-align: center;
        transition: transform 0.5s;
        .iconfont{
          line-height: 20px;
        }
      }
      .isActive{
        transform: rotate(90deg);
      }
    }
    .objactive{
      margin-top: 11px;
      margin-left: 20px;
      display: flex;
      width: 947px;
      justify-content: space-between;
      align-items: center;
      font-size:13px;
      color:#606266;
      line-height: 1;
      .finally-status{
        width: 90px;
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        .cont{
          color: #606266;
          line-height: 26px;
        }
        .span2{
          color: #FF7678;
          .number{
            font-size: 22px;
          }
        }
      }
      .left{
        width: 340px;
        font-weight: normal;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img{
          width: 20px;
          height: 20px;
          border-radius: 50px;
          margin-right: 7px;
        }
        .img{
          display: flex;
          align-items: center;
          .head-name{
            cursor: pointer;
            @extend %textlight;
          }
        }
      }
    }
    ul{
      margin-left: 20px;
      li{
        border-top: 1px solid #F6F6F6;
        padding: 23px 0;
        padding-right: 50px;
        position: relative;
        .overlayJudge-child{
          display: block !important;
        }
        .overlay-child{
          display: none;
        }
        .over-box-child{
          z-index: 1001;
          width: 300px;
          height: 70px;
          background-image: url('../../../../../static/img/jianbian_bg.png');
          background-size: 100% 100%;
          // background: red;
          position: absolute;
          right: 0;
          top: 23px;
          display: flex;
          justify-content: flex-end;
          div{
            text-align: center;
            margin-left: 34px;
            color: #000000;
            span{
              font-size:14px;
              color: #303133;
            }
          }
          .iconfont{
            cursor: pointer;
            font-size: 33px;
            line-height: 1;
            display: block;
          }
        }
        .title{
          cursor: pointer;
          @extend %textlight;
          display: flex;
          align-items: center;
          font-size:15px;
          font-weight:500;
          color: #303133;
          line-height:1;
          .t-title{
            display: inline-block;
            width: 36px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            background: #948BEA;
            border-radius:8px;
            font-size:14px;
            color: #FFFFFF;
            margin-right: 10px;
          }
        }
        .date{
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            display: flex;
            width: 340px;
            justify-content: space-between;
            align-items: center;
            .img{
              display: flex;
              align-items: center;
              .head-name{
                cursor: pointer;
                @extend %textlight;
              }
            }
            img{
              width: 20px;
              height: 20px;
              border-radius: 50px;
              margin-right: 7px;
            }
          }
          .right{
            .finally-status{
              width: 90px;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              span{
                line-height: normal;
              }
              .cont{
                color: #606266;
                line-height: 30px;
              }
              .span2{
                color: #FF7678;
                .number{
                  font-size: 22px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.kt{
  .el-collapse{
    border: none;
    .el-collapse-item{
      .el-collapse-item__wrap{
        border-bottom: none;
        .el-collapse-item__content{
          padding-bottom: 0;
        }
      }
      .el-collapse-item__header{
        cursor: default;
        display: flex disabled;
        line-height: normal;
        border-bottom: none;
        padding-bottom: 25px;
        .el-icon-arrow-right{
          display: none;
        }
        .objactive{
          .el-progress{
            width: 188px;
            font-size: 13px;
            color: #303133;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .el-progress-bar{
              width: 144px;
              .el-progress-bar__outer{
                width: 145px;
                height: 10px !important;
                .el-progress-bar__inner{
                  background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                  border-radius:8px;
                }
              }
            }
          }
        }
      }
    }
  }
  ul{
    li{
      width: 947px;
      position: relative;
      &:hover .task-check{
        opacity: 1;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
      }
      .date{
        color: #606266;
        .el-progress{
          width: 188px;
          font-size: 13px;
          color: #303133;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .el-progress-bar{
            width: 144px;
            .el-progress-bar__outer{
              width: 145px;
              height: 10px !important;
              .el-progress-bar__inner{
                background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                border-radius:8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
