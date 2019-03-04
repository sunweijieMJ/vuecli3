<template>
  <div class="single-log">
    <div class="header">
      <i class="iconfont icon-icon_log"></i>
      <div class="desc">
        <div class="author">
          <span @click.stop="pathSkip(`/foreground/fore_mine/profile/${vitem.user_info.user_id}`)">{{vitem.user_info.user_name}}</span>
          <p>&nbsp;{{vitem.action_name}}</p>
        </div>
        <p>{{vitem.update_time | timeFilter}}</p>
      </div>
    </div>
    <div class="main">
      <ul class="okr" v-if="vitem.business_type === 1">
        <h4>{{vitem.origin.basic.objective_name}}</h4>
        <li v-for="(witem, windex) in vitem.origin.kr" :key="windex">
          <div class="kr">
            <span>KR</span>
            <p>{{witem.name}}</p>
          </div>
          <div class="precent">
            <span>信心指数 </span>
            <i>{{witem.index}}%</i>
          </div>
        </li>
      </ul>
      <div class="task" v-else>
        <span>KT</span>
        <p>{{vitem.origin.basic.task_name}}</p>
      </div>
    </div>
    <div class="footer">
      <div class="time">
        <h5>时间</h5>
        <p v-if="vitem.origin.basic.duration_span">{{`${new Date().getFullYear()}-${vitem.origin.basic.duration_span}`}}</p>
        <p v-else>{{Moment().format(vitem.origin.basic.start_time)}}-{{Moment().format(vitem.origin.basic.end_time)}}</p>
      </div>
      <div class="user">
        <span v-for="(witem, windex) in vitem.origin.parter_infos" :key="windex" @click.stop="pathSkip(`/foreground/fore_mine/profile/${witem.user_id}`)">{{witem.real_name}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  import Moment from '../../utils/business/moment.js';

  export default {
    mixins: [frequent],
    props: ['vitem'],
    data() {
      return {
        Moment
      };
    }
  };
</script>
<style lang="scss" scoped>
  .single-log {
    width: 750px;
    padding: 27px 0;
    border-bottom: 1px solid $lineColor;
    .header {
      display: flex;
      align-items: center;
      i {
        font-size: 38px;
      }
      .desc {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 40px;
        padding: 1px 0;
        margin-left: 12px;
        .author {
          display: flex;
          align-items: center;
          font-size: $h3Font;
          line-height: 1;
          color: $h2Color;
          span {
            font-weight: $h1Weight;
            color: $h1Color;
            cursor: pointer;
            @extend %textlight;
          }
        }
        >p {
          font-size: $h4Font;
          line-height: 1;
          color: $h3Color;
        }
      }
    }
    .main {
      padding: 20px 30px;
      margin: 20px 0 20px 50px;
      background-color: $backColor;
      .okr {
        h4 {
          margin-bottom: 15px;
          font-size: $h3Font;
          font-weight: $h1Weight;
          line-height: 1.4;
          color: $h1Color;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          &:last-child {
            margin-bottom: 0;
          }
          .kr {
            display: flex;
            align-items: center;
            span {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 36px;
              height: 16px;
              border-radius: 8px;
              background-color: $green;
              font-size: $h4Font;
              color: #fff;
            }
            p {
              margin-left: 12px;
              font-size: $h3Font;
              line-height: 1;
              color: $h1Color;
            }
          }
          .precent {
            display: flex;
            align-items: center;
            span {
              font-size: $h3Font;
              line-height: 1;
              color: $h3Color;
            }
            i {
              margin-left: 5px;
              font-size: $h3Font;
              font-style: normal;
              line-height: 1;
              color: $h1Color;
            }
          }
        }
      }
      .task {
        display: flex;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 16px;
          margin: 3px 0;
          border-radius: 8px;
          background-color: $purple;
          font-size: $h4Font;
          color: #fff;
        }
        p {
          flex: 1;
          margin-left: 12px;
          font-size: $h3Font;
          line-height: 1.4;
          color: $h1Color;
        }
      }
    }
    .footer {
      margin: 0 50px;
      .time {
        display: flex;
        align-items: center;
        h5 {
          font-size: $h3Font;
          font-weight: normal;
          line-height: 1;
          color: $h2Color;
        }
        p {
          margin-left: 12px;
          font-size: $h3Font;
          line-height: 1;
          color: $h2Color;
        }
      }
      .user {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 2px;
        span {
          display: inline-flex;
          padding: 5px 15px;
          margin: 12px 6px 0 0;
          border-radius: 13px;
          background-color: $backColor;
          font-size: $h3Font;
          line-height: 1;
          color: $h1Color;
          cursor: pointer;
          @extend %textlight;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
</style>

