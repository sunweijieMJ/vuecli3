<template>
  <div class="dynamic-left">
    <div class="header">动态({{dynamic_num}})</div>
    <ul class="main" v-if="dynamic_list.length" v-for="(dy, dyindex) in dynamic_list" :key="dyindex">
      <div class="item-state">
        <i class="iconfont icon-icon_add2" v-if="dy.type_name === '创建'"></i>
        <i class="iconfont icon-icon_edit" v-if="dy.type_name === '编辑'"></i>
        <i class="iconfont icon-icon_close_l" v-if="dy.type_name === '完成'"></i>
        <i class="iconfont icon-icon_check" v-if="dy.type_name === '跟进'"></i>
        <span>{{dy.type_name}}</span>
      </div>
      <li>
        <div class="person-photo">
          <el-popover
            placement="bottom"
            trigger="hover"
            class="head-img">
            <img slot="reference" style="cursor: pointer;" v-if="dy.user_info" :src="dy.user_info.header_photo" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${dy.user_info.user_id}`)">
            <user-popover :userinfo="dy.user_info"></user-popover>
          </el-popover>
          <div>
            <p>
              <span class="name" @click="pathSkip(`/foreground/fore_mine/profile/${dy.user_info.user_id}`)">{{dy.user_info.user_name}}</span>
              <span class="description">{{dy.type_name}}了这个Task</span>
              <span class="checkout" v-if="dy.type_name === '创建' || dy.type_name === '编辑'" @click="pathSkip('/foreground/fore_notice/log_list', {log_type: 2, log_id: dy.task_id, anchor: dy.mao_id})">查看</span>
            </p>
            <p class="time">{{dy.publish_time | timeFilter}}</p>
          </div>
        </div>
        <div class="hot" v-if="dy.type_name !== '创建' && dy.type_name !== '编辑'">
          <!-- 更改的内容 -->
          <div class="categray">
            <div class="cut">
              <span>完成度</span>
              <div class="rate core">
                {{dy.progress}}%
              </div>
            </div>
            <div class="cut">
              <span>总投入时长</span>
              <div class="rate core">
                {{dy.spend_time}}天
              </div>
            </div>
            <div class="cut">
              <span>满意度</span>
              <div class="rate">
                <el-rate class="small-rate" v-model="dy.review_performance" show-score disabled :allow-half="true" show-text
                  :disabled-void-color="'#c0c4cc'"
                  :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </div>
            </div>
            <div class="cut">
              <span>相关度</span>
              <div class="rate">
                <el-rate class="small-rate" v-model="dy.review_relativity" show-score disabled :allow-half="true" show-text
                  :disabled-void-color="'#c0c4cc'"
                  :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </div>
            </div>
          </div>
          <!-- <div class="final">
            <span class="left">
              完成度
              <span class="bignum">{{dy.progress}}</span>
              <span class="bignum min">%</span>
            </span>
            <span class="right">
              总投入时长 <span class="bignum">{{dy.spend_time}}天</span>
            </span>
          </div> -->
        </div>
        <p v-if="dy.type_name !== '创建' && dy.type_name !== '编辑'" class="des" v-html="textFilter(dy.remarks)"></p>
      </li>
    </ul>
    <ul class="null" v-else>
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
  import {UserPopover} from '../../../../components/popup';
  import frequent from '../../../../mixins/frequent';
  import textFilter from '../../../../utils/filters/textFilter.js';

  export default {
    components: {UserPopover},
    mixins: [frequent],
    props: ['dynamic_list', 'dynamic_num'],
    data(){
      return {
        textFilter
      };
    }
  };
</script>
<style lang="scss" scoped>
  .dynamic-left{
    width: 700px;
    .header{
      display: flex;
      align-items: center;
      height: 54px;
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
        width: 660px;
        padding: 11px 20px;

        border-bottom: 1px solid #f6f6f6;
        font-size:15px;
        font-weight:500;
        color: #303133;
        line-height:21px;
        span{
          margin-left: 8px;
        }
      }
      li{
        // 510
        width: 644px;
        padding: 26px 28px 26px 28px;

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
          margin-top: 19px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .rate{
            display: flex;
            justify-content: center;;
            align-items: center;
            .number{
              margin-left: 7px;
              font-size: $h2Font;
              color: #303133;
              font-weight: 400;
            }
          }
          .final{
            // margin-left: 23px;
            color: #606266;
            font-size: 13px;
            .bignum{
              color: #303133;
              font-size: 15px;
              font-weight: 500;
            }
            .min{
              font-size: 13px;
              font-weight: normal;
            }
            .left{
              margin-right: 47px;
            }
          }
          .categray{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            .cut{
              width: 25%;
              border-right: 1px solid #EAE9E9;
              text-align: center;
              &:last-child{
                border-right: none;
              }
              .core{
                font-size:15px;
                font-weight: 500;
                color: #303133;
                // margin-top: 7px;
                // line-height: 1;
              }
            }
          }
        }
        .des{
          margin-top: 9px;
          word-spacing: 1px;
          font-size:15px;
          color: #303133;
          line-height:21px;
        }
      }
    }
    .null{
      width:446px;
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
