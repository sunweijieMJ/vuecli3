<template>
  <div class="single-info" v-if="info">
    <div class="feedback" v-if="info.basic.feedback">
      <div class="feedbacker">
        <div class="user">
          <el-popover
            placement="bottom-start"
            trigger="hover">
            <img slot="reference" :src="info.basic.feedbacker_info.header_photo" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${info.basic.feedbacker_info.user_id}`)">
            <user-popover :userinfo="info.basic.feedbacker_info"></user-popover>
          </el-popover>
          <h4>{{info.basic.feedbacker_info.real_name}} 的反馈</h4>
        </div>
        <span>{{info.basic.feedback_time | timeFilter}}</span>
      </div>
      <p>{{info.basic.feedback}}</p>
    </div>
    <div class="detail">
      <div class="header">
        <div class="from-user">
          <div class="user">
            <el-popover
              placement="bottom-start"
              trigger="hover">
              <img slot="reference" :src="info.basic.user_info.header_photo" alt="" @click.stop="pathSkip(`/foreground/fore_mine/profile/${info.basic.user_info.user_id}`)">
              <user-popover :userinfo="info.basic.user_info"></user-popover>
            </el-popover>
            <div class="info">
              <h4>W{{info.basic.report_week}}周报-{{info.basic.user_info.real_name}}</h4>
              <p>{{Moment().format(info.basic.report_start_day, 'MM-DD')}}-{{Moment().format(info.basic.report_end_day, 'MM-DD')}}</p>
            </div>
          </div>
          <span class="time">{{info.basic.publish_time | timeFilter}}</span>
        </div>
        <div class="to-user">
          <h4>发周报给：</h4>
          <p>
            <span v-for="(item, index) in info.basic.recipient_info" :key="index">{{item.real_name}}</span>
          </p>
        </div>
      </div>
      <div class="main">
        <div class="last-week week">
          <h3 class="title">
            <i></i>
            <span>上周工作</span>
          </h3>
          <ul class="list" v-if="info.curr_week_list && info.curr_week_list.length">
            <li v-for="(item, index) in info.curr_week_list.slice(0, 2)" :key="index">
              <single-follow :item="item" :hideBtn="true"></single-follow>
            </li>
          </ul>
          <div class="other">
            <h4>其他工作</h4>
            <p class="desc" v-html="textFilter(info.basic.curr_week_other)"></p>
          </div>
        </div>
        <div class="next-week week">
          <h3 class="title">
            <i></i>
            <span>下周工作</span>
          </h3>
          <ul class="list" v-if="info.next_week_list && info.next_week_list.length">
            <li v-for="(item, index) in info.next_week_list.slice(0, 2)" :key="index">
              <single-follow :item="item" :hideBtn="true"></single-follow>
            </li>
          </ul>
          <div class="other">
            <h4>其他工作</h4>
            <p class="desc" v-html="textFilter(info.basic.next_week_other)"></p>
          </div>
        </div>
        <div class="summary week">
          <h3 class="title">
            <i></i>
            <span>心得</span>
          </h3>
          <div class="other">
            <p class="desc" v-html="textFilter(info.basic.summary)"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import frequent from '../../mixins/frequent.js';
  import Moment from '../../utils/business/moment.js';
  import textFilter from '../../utils/filters/textFilter.js';
  import {UserPopover} from '../../components/popup';
  import SingleFollow from '../../components/report/SingleFollow.vue';

  export default {
    components: {UserPopover, SingleFollow},
    mixins: [frequent],
    props: ['info'],
    data() {
      return {
        Moment,
        textFilter
      };
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss" scoped>
  $left-right: 38px;
  $up-down: 30px;

  .single-info {
    >.feedback {
      padding: 26px $left-right;
      margin-bottom: 6px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      .feedbacker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3px;
        .user {
          display: flex;
          align-items: center;
          img {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid $lineColor;
            cursor: pointer;
          }
          h4 {
            margin-left: 10px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
        }
        span {
          font-size: $h4Font;
          line-height: 1;
          color: $h3Color;
        }
      }
      p {
        margin: 0 52px;
        font-size: $h3Font;
        line-height: 1.4;
        color: $h1Color;
      }
    }
    >.detail {
      padding-top: $left-right;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      .header {
        padding: 0 $left-right;
        .from-user {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .user {
            display: flex;
            align-items: center;
            img {
              box-sizing: border-box;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              border-bottom: 1px solid $lineColor;
              cursor: pointer;
            }
            .info {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 44px;
              margin-left: 18px;
              h4 {
                font-size: $h2Font;
                font-weight: $h1Weight;
                line-height: 1;
                color: $h1Color;
              }
              p {
                font-size: $h2Font;
                font-weight: $h1Weight;
                line-height: 1;
                color: $h1Color;
              }
            }
          }
          .time {
            align-self: flex-start;
            font-size: $h4Font;
            line-height: 1;
            color: $h3Color;
          }
        }
        .to-user {
          display: flex;
          align-items: center;
          padding: 20px 0 15px;
          border-bottom: 2px solid $lineColor;
          h4 {
            align-self: flex-start;
            font-size: $h3Font;
            font-weight: normal;
            line-height: 27px;
            color: $h1Color;
          }
          p {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            margin-left: 20px;
            span {
              height: 27px;
              padding: 0 15px;
              margin: 0 10px 10px 0;
              border-radius: 14px;
              font-size: $h3Font;
              line-height: 27px;
              color: $h1Color;
              background-color: $backColor;
            }
          }
        }
      }
      .main {
        padding: 0 $left-right;
        .week {
          padding: 28px $up-down $up-down 0;
          border-bottom: 1px solid $lineColor;
          &.summary {
            border-bottom: 0;
          }
          .title {
            display: flex;
            align-items: center;
            margin-bottom: 28px;
            i {
              display: inline-flex;
              width: 5px;
              height: 17px;
              background-color: $themeColor;
            }
            span {
              margin-left: 5px;
              font-size: $h2Font;
              font-weight: $h1Weight;
              line-height: 1;
              color: $h1Color;
            }
          }
          .list {
            li {
              margin-bottom: 30px;
            }
          }
          .other {
            padding: 0 $up-down 0 52px;
            h4 {
              margin-bottom: 15px;
              font-size: $h3Font;
              font-weight: $h1Weight;
              line-height: 1;
              color: $h1Color;
            }
            .desc {
              font-size: $h3Font;
              line-height: 25px;
              color: $h1Color;
            }
          }
          .content {
            margin-left: 52px;
            li {
              font-size: $h3Font;
              line-height: 1.4;
              color: $h1Color;
            }
          }
        }
      }
    }
  }
</style>


