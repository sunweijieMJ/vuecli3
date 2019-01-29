<template>
  <div class="dynamic-left">
    <div class="header">
      动态({{dynamic_num}})
    </div>
    <ul v-for="(dy, dyindex) in dynamic_list" :key="dyindex">
      <li class="item-state">
        <span class="iconfont icon-icon_close_l" v-if="dy.type_name === '完成'"></span>
        <span class="iconfont icon-icon_check" v-if="dy.type_name === '跟进'"></span>
        <span>{{dy.type_name}}</span>
      </li>
      <li>
        <div class="person-photo">
          <img :src="dy.user_info.header_photo" alt="" @click="goPersonal(dy.user_info.user_id)">
          <div>
            <p>
              <span class="name" @click="goPersonal(dy.user_info.user_id)">{{dy.user_info.user_name}}</span>
            </p>
            <p class="time">{{dy.publish_time | timeFilter}}</p>
          </div>
        </div>
        <div class="hot">
          <div class="rate">
            <el-rate disabled text-color="#F5A623" v-model="dy.score"
              class="middle-rate"
              :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"
            ></el-rate> <span class="number">{{dy.score.toFixed(1)}}</span>
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
        <svg class="iconfont" aria-hidden="true">
          <use xlink:href="#icon-icon_file1"></use>
        </svg>
        <span>当前没有动态</span>
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
  width: 546px;
  .header{
    padding: 21px 2px;
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
      width: 490px;
      padding: 24px 28px 24px 28px;
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
          color: #303133;
          margin-right: 7px;
        }
        .time{
          font-size:13px;
          color: #909399;
          line-height:18px;
        }
      }
      .hot{
        margin-top: 12px;
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
            font-weight: 400;
          }
        }
        .final{
          color: #606266;
          font-size: 13px;
          .bignum{
            color: #FF7678;
            font-size: 18px;
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
        margin-top: 14px;
        word-spacing: 1px;
        font-size:15px;
        color: #303133;
        line-height:21px;
      }
    }
  }
  .null{
    width:456px;
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
.dynamic-left{
  ul>li{
    .hot{
      .rate{
        .middle-rate{
          .el-rate__item{
            .el-rate__icon,
            .icon-icon_star,
            .iconfont{
              font-size: 14px !important;
            }
          }
        }
      }
    }
  }
  
}
</style>
