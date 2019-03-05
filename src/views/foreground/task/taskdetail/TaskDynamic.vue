<template>
  <div class="dynamic-left">
    <div class="header">
      动态({{dynamic_num}})
    </div>
    <ul v-for="(dy, dyindex) in dynamic_list" :key="dyindex">
      <li class="item-state">
        <span class="iconfont icon-icon_add2" v-if="dy.type_name === '创建'"></span>
        <span class="iconfont icon-icon_edit" v-if="dy.type_name === '编辑'"></span>
        <span class="iconfont icon-icon_close_l" v-if="dy.type_name === '完成'"></span>
        <span class="iconfont icon-icon_check" v-if="dy.type_name === '跟进'"></span>
        <span>{{dy.type_name}}</span>
      </li>
      <li>
        <div class="person-photo">
          <el-popover
            placement="bottom"
            trigger="hover"
            class="head-img">
            <img slot="reference" style="cursor: pointer;" v-if="dy.user_info" :src="dy.user_info.header_photo" alt="" @click.stop="goPersonal(dy.user_info.user_id)">
            <user-popover :userinfo="dy.user_info"></user-popover>
          </el-popover>
          <div>
            <p>
              <span class="name" @click="goPersonal(dy.user_info.user_id)">{{dy.user_info.user_name}}</span>
              <span class="description">{{dy.type_name}}了这个Task</span>
              <span class="checkout" v-if="dy.type_name === '创建' || dy.type_name === '编辑'" @click="goDialg(dy.task_id, dy.mao_id)">查看</span>
            </p>
            <p class="time">{{dy.publish_time | timeFilter}}</p>
          </div>
        </div>
        <div class="hot" v-if="dy.type_name !== '创建' && dy.type_name !== '编辑'">
          <div class="rate">
            <el-rate class="small-rate" v-model="dy.score" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          </div>
          <div class="final">
            <span class="left">
              完成度
              <span class="bignum">{{dy.progress}}</span>
              <span class="bignum min">%</span>
            </span>
            <span class="right">
              总投入时长<span class="bignum">{{dy.spend_time}}</span>
            </span>
          </div>
        </div>
        <p v-if="dy.type_name !== '创建' && dy.type_name !== '编辑'" class="des">
          {{dy.remarks}}
        </p>
      </li>
    </ul>
    <ul class="null" v-if="dynamic_list.length === 0">
      <li>
        <svg class="iconfont" aria-hidden="true">
          <use xlink:href="#icon-icon_file1"></use>
        </svg>
        <span>当前没有动态</span>
      </li>
    </ul>
  </div>
</template>
<script>
import UserPopover from '../../../../components/popup/UserPopover';
import frequent from '../../../../mixins/frequent';
export default {
  name: 'TaskDynamic',
  mixins: [frequent],
  props: ['dynamic_list', 'dynamic_num'],
  components: {
    UserPopover
  },
  data(){
    return {
      value1: 3
    };
  },
  methods: {
    goPersonal(user_id){
      this.pathSkip(`/foreground/fore_mine/profile/${user_id}`);
    },
    goDialg(pro_id, mao_id){
      this.pathSkip('/foreground/fore_notice/log_list', {log_type: 2, log_id: pro_id, anchor: mao_id});
    }
  }
};
</script>
<style lang="scss" scoped>
.dynamic-left{
  // width: 586px;
  width: 750px;
  .header{
    padding: 21px 2px;
    font-size: $h2Font;
    font-weight:500;
    color: #909399;
    line-height:25px;
  }
  ul{
    margin-bottom: 12px;
    background: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:2px;
    .item-state{
      width: 706px;
      padding: 16px 22px;
      border-bottom: 1px solid #f6f6f6;
      font-size:15px;
      font-weight:500;
      color: #303133;
      line-height:21px;
      span{
        margin-right: 8px;
      }
    }
    li{
      // 510
      width: 674px;
      padding: 26px 38px 26px 38px;
      .person-photo{
        display: flex;
        align-items: center;
        img{
          cursor: pointer;
          width: 38px;
          height: 38px;
          border-radius: 50px;
          margin-right: 10px;
        }
        p{
          font-size:15px;
          color: #606266;
          line-height:21px;
        }
        .name{
          cursor: pointer;
          @extend %textlight;
          color: #303133;
          font-weight: 500;
          margin-right: 7px;
        }
        .description{
          margin-right: 10px;
          font-size: 15px;
          color: #606266;
          line-height:21px;
        }
        .checkout{
          cursor: pointer;
          @extend %textlight;
          font-size: 15px;
          font-weight: 500;
          color: #303133;
          line-height: 21px;
        }
        .time{
          font-size:13px;
          color: #909399;
          line-height:18px;
        }
      }
      .hot{
        margin-top: 13px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .rate{
          display: flex;
          align-items: center;
          .number{
            margin-left: 7px;
            font-size: $h2Font;
            color: #303133;
            font-weight: 400;
          }
        }
        .final{
          margin-left: 23px;
          color: #606266;
          font-size: 13px;
          .bignum{
            color: #FF7678;
            font-size: $h2Font;
            font-weight: 500;
          }
          .min{
            font-size: 13px;
            font-weight: normal;
          }
          .left{
            margin-right: 12px;
          }
        }
      }
      .des{
        margin-top: 14px;
        word-spacing: 1px;
        font-size:15px;
        color: #303133;
        line-height:21px;
      }
    }
  }
  .null{
    width:496px;
    height:42px;
    padding: 54px 45px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:2px;
    li{
      width: 100%;
      padding: 0;
      color: #606266;
      font-size: 15px;
      font-weight: 400;
      display: flex;
      align-items: center;
      .iconfont{
        width: 36px;
        height: 36px;
        font-size: 34px;
        margin-right: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
.hot{
  .rate{
    .small-rate{
      .el-rate__text{
        font-weight: 500;
      }
    }
  }
}
</style>
