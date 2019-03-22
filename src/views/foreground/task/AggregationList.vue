<template>
  <div class="aggregation">
    <div v-if="item.task_list && item.task_list.list.length">
      <div class="okr-kt" v-for="(ac, aindex) in 1" :key="aindex">
        <el-collapse accordion v-model="activeNames" @change="handleChange">
          <el-collapse-item :name="aindex">
            <template slot="title">
              <div class="title-box">
                <div class="title-mes">
                  <div :class="{icon: true, isActive: activeJudge(aindex)}">
                    <span style="cursor: pointer;" class="iconfont icon-sanjiaoyou"></span>
                  </div>
                  <div>
                    <span class="okr-name" @click.stop="pathSkip(`/foreground/fore_okr/okr_detail/${item.obj_info.obj_id}`)" v-if="item.obj_info">{{item.obj_info.okr_name}}</span>
                  </div>
                </div>
                <div class="insert" v-if="item.obj_info && item.obj_info.is_member && obj.switch_index === 0">
                  <span class="span2" @click.stop="addTask">
                    <span class="iconfont icon-icon_add2"></span>
                    <span class="add-kt">添加KT</span>
                  </span>
                </div>
              </div>
            </template>
            <ul class="kr-box" v-if="item.newKr && item.newKr.length">
              <li v-for="(kr, krindex) in item.newKr" :key="krindex">
                <div class="okr-krs">
                  <span class="tags">KR</span><span>{{kr.kr_name}}</span>
                </div>
                <div class="confidence">
                  <span>信心指数 </span><span class="percent">{{kr.confidenc_index}}%</span>
                </div>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
        <div class="kt-box">
          <ul>
            <li v-for="(kt, ktindex) in item.task_list.list" :key="ktindex + pages">
              <div class="keytask">
                <span class="KT">KT</span>
                <span class="keytask-name" @click="pathSkip(`/foreground/fore_task/task_detail/${kt.task_id}`)">{{kt.task_name}}</span>
              </div>
              <div class="desc">
                <div class="left">
                  <el-popover
                    placement="bottom-start"
                    trigger="hover">
                    <img slot="reference" v-if="kt.users_info" @click.stop="pathSkip(`/foreground/fore_mine/profile/${kt.creator_id}`)" :src="kt.users_info.header_photo" alt="">
                    <user-popover :userinfo="kt.users_info"></user-popover>
                  </el-popover>
                  <span class="name" v-if="kt.users_info" @click.stop="pathSkip(`/foreground/fore_mine/profile/${kt.creator_id}`)">{{kt.users_info.user_name}}</span>
                  <span v-if="kt.edit_time">编辑于 {{kt.edit_time | timeFilter}}</span>
                  <span v-else>创建于 {{kt.create_time | timeFilter}}</span>
                </div>
                <div class="right">
                  <div>
                    <span>{{`${Moment().format(kt.start_time)}-${Moment().format(kt.end_time)}`}}</span><span></span>
                  </div>
                  <div class="grocess">
                    <el-progress :percentage="kt.progress" :stroke-width="9" v-if="kt.status === 1"></el-progress>
                    <p class="progress" v-else>
                      <span>完成度</span>
                      <i>{{kt.progress}}</i>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="check-more">
          <span @click="CheckMore(item.obj_info.obj_id)" v-if="item.task_list.cnt > item.task_list.list.length && hiddenMore">查看更多KT</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Moment from '../../../utils/business/moment.js';
import OkrApi from '../../../api/Okr.js';
import TaskApi from '../../../api/Task.js';
import frequent from '../../../../src/mixins/frequent.js';
import {UserPopover} from '../../../components/popup';

export default {
  props: ['item', 'obj'],
  mixins: [frequent],
  name: 'AggregationList',
  components: {
    UserPopover
  },
  data(){
    return {
      Moment,
      activeNames: '',
      okr_list: [], // ETC okr列表
      pages: 1,
      hiddenMore: true,
      mouse_state: false
    };
  },
  methods: {
    mouseenter(){
      this.mouse_state = true;
    },
    mouseout(){
      this.mouse_state = false;
    },
    addTask(){
      this.$emit('addTask', this.item.obj_info);
    },
    // 获取对应kr列表
    async getKRList(id){
      await OkrApi().getKeyResultList({objId: id}).then(res => {
        if(res.status){
          this.$set(this.item, 'newKr', res.data);
        }
      });
    },
    handleChange(val) {
      this.activeNames = val;
      this.getKRList(this.item.obj_info.obj_id);
    },
    activeJudge(kindex){
      if(kindex === this.activeNames){
        return true;
      }else{
        return false;
      }
    },
    //  加载更多
    async CheckMore(objId){
      await TaskApi().getTaskList({
        obj_id: objId,
        qtype: this.obj.qtype,
        qdep_id: this.obj.qdep_id,
        quser_id: this.obj.quser_id,
        status: this.obj.status, // ETC 完成或进行中的状态
        currPage: ++this.pages,
        pages: 5,
        lastId: this.item.task_list.last_id
      }).then(res => {
        if(res.status){
          let newKTlist = [];
          newKTlist = res.data.list;
          if(newKTlist.length){
            for (let i = 0; i < newKTlist.length; i++) {
              newKTlist[i].users_info = res.data.users_info[newKTlist[i].task_owner_id];
            }
          }
          let newKt = [];
          newKt = this.item.task_list.list;
          newKt = newKt.concat(newKTlist);
          this.$set(this.item.task_list, 'list', newKt);
          this.$set(this.item.task_list, 'last_id', res.data.last_id);
          if(res.data.list.length){

          }else{
            this.$message({message: '没有更多KT了！', type: 'warning'});
            this.hiddenMore = false;
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.aggregation{
  box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
  border-radius: 2px;
  
  .okr-kt{
    margin-bottom: 13px;
    background: white;
    .kr-box{
      background: #FAFAFA;
      padding: 0 50px 9px 50px;
      li{
        display: flex;
        justify-content: space-between;
        padding-bottom: 16px;
        .okr-krs{
          display: flex;
          align-items: center;
          font-size: 15px;
          font-weight: 400;
          color: #303133;
          .tags{
            text-align: center;
            line-height: 16px;
            display: inline-block;
            width: 36px;
            height: 16px;
            background: #1AD59D;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 400;
            color: #FFFFFF;
            margin-right: 10px;
          }
          span{
            line-height: 1;
          }
        }
        .confidence{
          width: 91px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 400;
          color: #909399;
          span{
            line-height: 1;
          }
          .percent{
            color: #303133;
          }
        }
      }
    }
    .kt-box{
      padding: 0 50px;
      ul{
        li{
          padding: 23px 0 22px 0;
          border-bottom: 1px solid #F6F6F6;
          &:last-child{
            border-bottom: none;
          }
          .keytask{
            display: flex;
            align-items: center;
            font-size: 17px;
            font-weight:500;
            color: #303133;
            .keytask-name{
              cursor: pointer;
              @extend %textlight;
            }
            .KT{
              display: inline-block;
              text-align: center;
              width: 36px;
              height: 16px;
              font-size: 14px;
              font-weight: 400;
              color: #FFFFFF;
              line-height: 16px;
              background: #948BEA;
              border-radius: 8px;
              margin-right: 8px;
            }
          }
          .desc{
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            .left{
              display: flex;
              justify-content: flex-start;
              align-items: center;
              color: #606266;
              .name{
                font-weight: 500;
                color: #303133;
                margin-left: 6px;
                margin-right: 6px;
                cursor: pointer;
                @extend %textlight;
              }
              img{
                width: 22px;
                height: 22px;
                border-radius: 50px;
              }
            }
            .right{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
    }
    .title-box{
      background: #FAFAFA;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 36px;
      font-weight:500;
      color: #303133;
      font-size: 15px;
      position: relative;
      &:hover .insert{
        display: flex;
      }
      .insert{
        display: none;
        width: 500px;
        background-image: url('../../../../static/img/pnl_bg.png');
        background-size: 100% 100%;
        padding-right: 50px;
        position: absolute;
        top: 0;
        right: 0;
        align-items: center;
        justify-content: flex-end;
        .span2{
          display: flex;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
          @extend %textlight;
        }
        .add-kt{
          
        }
        .iconfont{
          margin-right: 5px;
        }
      }
    }

    .title-mes{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size:17px;
      .okr-name{
        cursor: pointer;
        @extend %textlight;
      }
      .icon{
        width: 20px;
        height: 20px;
        text-align: center;
        display: flex;
        align-items: center;
        transition: transform 0.5s;
        .iconfont{
          line-height: 21px;
        }
      }
      .isActive{
        transform: rotate(90deg);
      }
    }
    .check-more{
      margin: 0 50px;
      border-top: 1px solid #F6F6F6;
      span{
        cursor: pointer;
        @extend %textlight;
        line-height: 60px;
        font-size:15px;
        font-weight: 400;
        color: #606266;
      }
    }
  }
}
</style>
<style lang="scss">
.aggregation{
  .okr-kt{
    .el-collapse{
      .el-collapse-item{
        .el-collapse-item__wrap{
          border: none ;
        }
        .el-collapse-item__content{
          padding-bottom: 0;
        }
        .el-collapse-item__header{
          height: 58px;
          line-height: 58px !important;
          border: none ;
          cursor: default;
          display: flex disabled;
          .el-collapse-item__arrow{
            display: none;
          }
        }
      }
    }
    .kt-box{
      ul{
        li{
          .desc{
            .right{
              .grocess{
                .el-progress{
                  margin-left: 50px;
                  width: 190px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .el-progress__text{
                    font-size: 13px !important;
                  }
                  .el-progress-bar{
                    
                    .el-progress-bar__outer{
                      width: 145px;
                      height: 9px;
                      background: #DEDEDE;
                      border-radius: 8px;
                      .el-progress-bar__inner{
                        background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                        border-radius: 8px;
                        height:9px;
                      }
                    }
                  }
                }
                .progress {
                  width: 170px;
                  margin-left: 50px;
                  display: flex;
                  justify-content: flex-end;
                  align-items: flex-end;
                  padding-bottom: 7px;
                  span {
                    font-size: $h4Font;
                    color: $h2Color;
                  }
                  i {
                    position: relative;
                    margin-left: 10px;
                    font-size: $h1Font;
                    font-style: normal;
                    font-weight: $h1Weight;
                    line-height: 100%;
                    color: $themeColor;
                    &::after {
                      content: '%';
                      position: absolute;
                      font-size: 13px;
                      height: 12px;
                      bottom: 7px;
                    }
                  }
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

