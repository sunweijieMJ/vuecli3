<template>
  <div class="single-okr" @click="paramsSkip('OKRDetail', {id: item.obj_id})">
    <div class="okr-info">
      <div class="title">
        <h3>{{item.okr_name}}</h3>
        <p>
          <i class="iconfont icon-icon_depart"></i>
          <span>{{item.creator_info.department_name}}</span>
        </p>
      </div>
      <div class="desc">
        <i class="iconfont icon-icon_okr_l"></i>
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

  export default {
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
    padding: 23px 50px 23px 60px;
    border-radius:4px;
    cursor: pointer;
    background-color: #fff;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    .okr-info {
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
            color: $h2Color;
          }
        }
      }
      .desc {
        display: flex;
        align-items: center;
        margin-top: 8px;
        line-height: 21px;
        i {
          font-size: 15px;
          color: $h1Color;
        }
        p {
          margin-left: 7px;
          font-size: $h3Font;
          font-weight: 400;
          color: $h1Color;
        }
      }
    }
    .okr-time {
      display: flex;
      align-items: center;
      .name {
        display: flex;
        align-items: center;
        img {
          box-sizing: border-box;
          width: 20px;
          height: 20px;
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
        margin-left: 100px;
        font-size: $h4Font;
        color: $h2Color;
      }
    }
  }
</style>

