<template>
  <div class="single-okr">
    <div class="info">
      <div class="name">
        <h3 @click="pathSkip(`/foreground/fore_okr/okr_detail/${item.obj_id}`)">{{item.objective_name}}</h3>
      </div>
      <div class="desc">
        <p class="type">
          <i class="iconfont icon-icon_depart"></i>
          <span>{{item.okr_type !== 3 ? item.okr_type_name : item.creator_info.department_name}}</span>
        </p>
        <div class="num">
          <div class="name" @click.stop="pathSkip(`/foreground/fore_mine/profile/${item.creator_id}`)">
            <el-popover
              placement="bottom"
              trigger="hover">
              <img slot="reference" :src="item.creator_info.header_photo | imageSize('80x80')" alt="">
              <user-popover :userinfo="item.creator_info"></user-popover>
            </el-popover>
            <span class="user-name">{{item.creator_info.user_name}}</span>
          </div>
          <p v-if="item.duration_span" class="time">{{item.create_year}}-{{item.duration_span}}</p>
          <p v-else class="time">{{`${Moment().format(item.start_time)}-${Moment().format(item.end_time)}`}}</p>
        </div>
      </div>
    </div>
    <div class="update">
      <p v-if="item.edit_time">编辑于 {{item.edit_time | timeFilter}}</p>
      <p v-else>创建于 {{item.create_time | timeFilter}}</p>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  import Moment from '../../utils/business/moment.js';
  import {UserPopover} from '../../components/popup';

  export default {
    components: {UserPopover},
    mixins: [frequent],
    props: ['item'],
    data() {
      return {
        Moment
      };
    }
  };
</script>
<style lang="scss" scoped>
  .single-okr {
    width: 100%;
    margin-bottom: 12px;
    border-radius:4px;
    background-color: #fff;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    .info {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 100px;
      padding: 25px 50px;
      .name {
        display: flex;
        align-items: center;
        h3 {
          @include tofl(100%);
          font-size: $h2Font;
          font-weight: $h1Weight;
          color: $h1Color;
          cursor: pointer;
          @extend %textlight;
        }
      }
      .desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .type {
          display: flex;
          align-items: flex-end;
          flex: 1;
          i {
            font-size: 13px;
            color: $green;
          }
          span {
            margin-left: 3px;
            font-size: $h4Font;
            line-height: 15px;
            color: $h2Color;
          }
        }
        .num {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 385px;
          .name {
            display: flex;
            align-items: center;
            cursor: pointer;
            img {
              box-sizing: border-box;
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 1px solid $lineColor;
            }
            .user-name {
              margin-left: 7px;
              font-size: $h4Font;
              color: $h2Color;
              @extend %textlight;
            }
          }
          .time {
            font-size: $h4Font;
            color: $h2Color;
          }
        }
      }
    }
    .update {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 50px;
      border-top: 1px solid $lineColor;
      p {
        font-size: $h4Font;
        color: $h3Color;
      }
    }
  }
</style>

