<template>
  <div class="dynamic-left">
    <div class="header">
      动态({{dynamic_num}})
    </div>
    <ul v-for="(dy, dyindex) in dynamic_list" :key="dyindex">
      <li class="item-state">
        <span class="iconfont icon-icon_manage"></span><span>{{dy.type_name}}</span>
      </li>
      <li>
        <div class="person-photo">
          <img :src="dy.user_info.header_photo" alt="" @click="goPersonal(dy.user_info.user_id)">
          <div>
            <p>
              <span class="name">{{dy.user_info.user_name}}</span><span>{{dy.type_name}}了这个Task</span>
            </p>
            <p class="time">{{dy.publish_time | timeFilter}}</p>
          </div>
        </div>
        <div class="hot">
          <div class="rate">
            <el-rate disabled text-color="#F5A623" v-model="dy.self_score"></el-rate> <span class="number">{{dy.self_score}}</span>
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
        <p class="des">
          {{dy.remarks}}
        </p>
      </li>
    </ul>
    <ul class="null" v-if="dynamic_list.length === 0">
      <li>
        <span class="iconfont icon-wenbenicon"></span><span>当前没有动态</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TaskDynamic',
  props: ['dynamic_list', 'dynamic_num'],
  data(){
    return {
      value1: 3
    };
  },
  methods:{
    goPersonal(user_id){
      this.$router.push({name: 'Profile', params: {id: user_id}});
    }
  }
};
</script>
<style lang="scss" scoped>
.dynamic-left{
  width: 591px;
  .header{
    padding: 21px 25px;
    font-size:18px;
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
      padding: 14px 28px;
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
      width: 535px;
      padding: 17px 28px 24px 28px;
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
          font-weight:400;
          color: #606266;
          line-height:21px;
        }
        .name{
          color: #5581C7;
          margin-right: 7px;
        }
        .time{
          font-size:13px;
          font-weight:400;
          color: #909399;
          line-height:18px;
        }
      }
      .hot{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rate{
          display: flex;
          align-items: center;
          .number{
            margin-left: 7px;
            font-size: 18px;
            color: #303133;
          }
        }
        .final{
          color: #606266;
          font-size: 18px;
          font-weight:400;
          .bignum{
            color: #FF7678;
          }
          .min{
            font-size: 13px;
          }
          .left{
            margin-right: 12px;
          }
        }
      }
      .des{
        margin-top: 17px;
        word-spacing: 1px;
        font-size:15px;
        font-weight:400;
        color: #303133;
        line-height:21px;
      }
    }
  }
  .null{
    width:501px;
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
        color: #FF7678;
        font-size: 34px;
        margin-right: 16px;
      }
    }
  }
}
</style>
