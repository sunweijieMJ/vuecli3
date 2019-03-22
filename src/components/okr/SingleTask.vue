<template>
  <div class="single-task">
    <div class="task-info">
      <div class="info-title">
        <span>{{item.is_key_task ? 'KT' : 'T'}}</span>
        <h4 @click="pathSkip(`/foreground/fore_task/task_detail/${item.task_id}`)">{{item.task_name}}</h4>
      </div>
      <div class="info-desc">
        <div class="okr">
          <p class="name" @click="pathSkip(`/foreground/fore_okr/okr_detail/${item.obj_info[0].obj_id}`)">
            <i v-if="item.obj_info && item.obj_info.length && item.obj_info[0]" class="iconfont icon-icon_link1"></i>
            <span v-if="item.obj_info && item.obj_info.length && item.obj_info[0]">{{item.obj_info[0].objective_name}}</span>
          </p>
        </div>
        <div class="desc">
          <div class="owner" v-if="item.creator_info" @click.stop="pathSkip(`/foreground/fore_mine/profile/${item.creator_info.user_id}`)">
            <el-popover
              placement="bottom"
              trigger="hover">
              <img slot="reference" :src="item.creator_info.header_photo | imageSize('80x80')" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${item.creator_info.user_id}`)">
              <user-popover :userinfo="item.creator_info"></user-popover>
            </el-popover>
            <span class="owner-name">{{item.creator_info.user_name}}</span>

            <div class="update" v-if="item.edit_time || item.create_time">
              <p v-if="item.edit_time">编辑于 {{item.edit_time | timeFilter}}</p>
              <p v-else>创建于 {{item.create_time | timeFilter}}</p>
            </div>
          </div>
          <div class="grocess">
            <template>
              <p v-if="item.duration_span" class="time">{{item.create_year}}-{{item.duration_span}}</p>
              <p v-else class="time">{{`${Moment().format(item.start_time)}-${Moment().format(item.end_time)}`}}</p>
            </template>
            <template>
              <el-progress :percentage="item.progress" :stroke-width="9" v-if="item.status === 1"></el-progress>
              <p class="progress" v-else>
                <span>完成度</span>
                <i>{{item.progress}}</i>
              </p>
            </template>
          </div>
        </div>
      </div>
      <task-check :item="item"></task-check>
    </div>
    <div class="check-info" v-if="item.check_info && item.check_info.type !== 5 && item.check_info.type !== 6 && 0">
      <el-popover
        placement="bottom-start"
        trigger="hover">
        <img slot="reference" @click.stop="pathSkip(`/foreground/fore_mine/profile/${item.check_info.creator_id}`)" :src="item.check_info.creator_info.header_photo" alt="">
        <user-popover :userinfo="item.check_info.creator_info"></user-popover>
      </el-popover>
      <div class="info">
        <h4>
          <el-rate class="small-rate" v-model="item.check_info.score" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          <p>{{item.check_info.publish_time | timeFilter}}</p>
        </h4>
        <p>{{item.check_info.remarks}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  import Moment from '../../utils/business/moment.js';
  import {UserPopover} from '../../components/popup';
  import TaskCheck from '../../components/popup/TaskCheck.vue';

  export default {
    components: {UserPopover, TaskCheck},
    mixins: [frequent],
    props: ['item'],
    data() {
      return {
        Moment
      };
    }
  };
</script>
<style lang="scss">
  $left-right: 50px;

  .single-task {
    width: 100%;
    margin-bottom: 12px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
    .task-info {
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 19px $left-right;
      .info-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 16px;
          border-radius: 8px;
          background-color: $purple;
          font-size: 14px;
          color: #fff;
        }
        h4 {
          margin-left: 10px;
          font-size: $h2Font;
          font-weight: $h1Weight;
          color: $h1Color;
          cursor: pointer;
          @extend %textlight;
        }
      }
      .info-desc {
        .okr {
          margin-left: 44px;
          display: flex;
          align-items: center;
          .name {
            display: flex;
            align-items: center;
            width: 270px;
            cursor: pointer;
            &:hover i{
              color: $themeColor;
            }
            &:hover span{
              color: $themeColor;
            }
            i {
              font-size: 12px;
              color: #909399;
            }
            span {
              @include tofl(250px);
              line-height: 1;
              margin-left: 3px;
              font-size: $h4Font;
              color: #909399;
            }
          }
        }
        .desc {
          margin-top: 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .owner {
            display: flex;
            align-items: center;
            img {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              cursor: pointer;
            }
            .owner-name {
              margin-left: 7px;
              font-size: $h4Font;
              font-weight: 500;
              line-height: 1;
              color: #303133;
              cursor: pointer;
              @extend %textlight;
            }
          }
          .grocess{
            width: 400px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .time {
            font-size: $h4Font;
            color: $h2Color;
          }
          .el-progress {
            display: flex;
            align-items: center;
            width: 190px;
            .el-progress-bar {
              padding: 0;
              margin: 0;
              .el-progress-bar__outer {
                width: 145px;
                .el-progress-bar__inner {
                  background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                }
              }
            }
            .el-progress__text {
              font-size: $h4Font !important;
            }
          }
          .progress {
            display: flex;
            align-items: flex-end;
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
    .check-info {
      display: flex;
      align-items: center;
      padding: 20px $left-right;
      border-top: 1px solid $lineColor;
      img {
        box-sizing: border-box;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid $lineColor;
        cursor: pointer;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 450px;
        height: 32px;
        margin-left: 12px;
        h4 {
          display: flex;
          align-items: center;
          .el-rate {
            display: flex;
            align-items: center;
            height: 14px;
          }
          >p {
            margin-left: 12px;
            font-size: 12px;
            font-weight: normal;
            line-height: 1;
            color: $h3Color;
          }
        }
        >p {
          @include tofl(450px);
          font-size: $h4Font;
          line-height: 1;
          color: $h2Color;
        }
      }
    }
    &:hover .task-check{
      opacity: 1;
      background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%);
    }
    .update {
      display: flex;
      align-items: center;
      margin-left: 6px;
      p {
        font-size: $h4Font;
        color: #606266;
        font-weight: 400;
      }
    }
  }
</style>

