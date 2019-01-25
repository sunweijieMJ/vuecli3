<template>
  <div class="single-okr" @click="paramsSkip('OKRDetail', {id: item.obj_id})">
    <div class="okr-info">
      <div class="title">
        <h3>{{item.okr_name}}</h3>
        <p>
          <i class="iconfont icon-icon_depart"></i>
          <span>{{item.okr_type !== 3 ? item.okr_type_name : item.creator_info.department_name}}</span>
        </p>
      </div>
      <div class="desc">
        <p>{{item.objective_desc}}</p>
      </div>
    </div>
    <div class="okr-time">
      <div class="name">
        <img :src="item.creator_info.header_photo | imageSize('80x80')" alt="">
        <span>{{item.creator_info.user_name}}</span>
      </div>
      <p>{{`${Moment().format(item.start_time)}-${Moment().format(item.end_time)}`}}</p>
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
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    padding: 23px 50px;
    border-radius:4px;
    cursor: pointer;
    background-color: #fff;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    .okr-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .title {
        display: flex;
        align-items: center;
        line-height: 25px;
        h3 {
          font-size: $h2Font;
          font-weight: $h1Weight;
          color: $h1Color;
        }
        p {
          margin-left: 9px;
          i {
            font-size: 13px;
            color: $green;
          }
          span {
            margin-left: 3px;
            font-size: $h4Font;
            font-weight: $h1Weight;
            color: $h3Color;
          }
        }
      }
      .desc {
        display: flex;
        align-items: center;
        margin-top: 8px;
        line-height: 21px;
        p {
          @include tofl(400px);
          font-size: $h3Font;
          font-weight: 400;
          color: $h1Color;
        }
      }
    }
    .okr-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-self: flex-end;
      width: 350px;
      .name {
        display: flex;
        align-items: center;
        margin-right: 100px;
        img {
          box-sizing: border-box;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid $lineColor;
        }
        span {
          margin-left: 7px;
          font-size: $h4Font;
          color: $h2Color;
        }
      }
      p {
        font-size: $h4Font;
        color: $h2Color;
      }
    }
  }
</style>

