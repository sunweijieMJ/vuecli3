<template>
  <div class="okr-dynamic">
    <ul v-for="(d, dindex) in okr_dynamic_list" :key="dindex">
      <li>
        <div class="header">
          <span class="iconfont icon-icon_edit"></span><span>{{d.type_name}}</span>
        </div>
        <div class="con">
          <div class="img">
            <el-popover
              placement="bottom"
              trigger="hover"
              class="head-img">
              <img slot="reference" style="cursor: pointer;" v-if="d.users_info" :src="d.users_info.header_photo" alt="" @click.stop="goProFile(d.users_info.user_id)">
              <user-popover :userinfo="d.users_info"></user-popover>
            </el-popover>
          </div>
          <div class="right">
            <div class="title">
              <span class="name" @click.stop="goProFile(d.users_info.user_id)">{{d.users_info.user_name}}</span>
              <span class="action">编辑了这个okr</span>
              <span class="check" @click="goCheckout(d.obj_id, d.mao_id)">查看</span>
            </div>
            <div class="date">
              <span>{{d.publish_time | timeFilter}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import UserPopover from '../../../../components/popup/UserPopover';
export default {
  name: 'OkrDynamic',
  props: ['okr_dynamic_list'],
  components: {UserPopover},
  data(){
    return {

    };
  },
  methods: {
    goCheckout(pro_id, mao_id){
      this.$router.push({name: 'LogList', query: {log_type: 1, log_id: pro_id, anchor: mao_id}});
    },
    goProFile(user_id){
      // this.$router.push({name: 'Profile', params: {id: user_id}});
      window.open(`/foreground/fore_mine/profile/${user_id}`, '_blank');
    }
  }

};
</script>
<style lang="scss" scoped>
.okr-dynamic{
  ul{
    margin-top: 12px;
    width: 728px;
    background: #FFFFFF;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius: 2px;
    li{
      .header{
        padding: 16px 11px;
        color: #303133;
        border-bottom: 1px solid #f6f6f6;
        span{
          font-size: 15px;
          font-weight:500;
          line-height: 1;
        }
        .iconfont{
          margin-right: 10px;
        }
      }
      .con{
        padding: 39px 36px;
        display: flex;
        justify-content: flex-start;
        .img{
          margin-right: 12px;
          width: 38px;
          height: 38px;
          border-radius: 50px;
          img{
            width: 38px;
            height: 38px;
            border-radius: 50px;
          }
        }
        .right{
          .title{
            font-size: 15px;
            span{
              line-height: 1;
            }
            .action{
              color: #606266;
              margin-left: 10px;
              margin-right: 10px;
            }
            .name,
            .check{
              cursor: pointer;
              @extend %textlight;
              font-weight: 500;
              color: #303133;
            }
          }
          .date{
            margin-top: 8px;
            font-size: 13px;
            font-weight:400;
            color: #909399;
            line-height: 1;
          }
        }
      }
    }
  }
}
</style>
