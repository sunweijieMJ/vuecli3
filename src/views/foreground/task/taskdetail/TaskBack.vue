<template>
  <div class="task-back" v-if="basic.status === 2 && basic.need_feedbacker === self_info.user_id">
    <div class="header">反馈</div>
    <div class="main" v-if="basic.feedbacker">
      <div class="title">
        <i class="iconfont icon-icon_feedback_s"></i>
        <span>反馈</span>
      </div>
      <div class="info">
        <div class="user">
          <img :src="basic.feedbacker.header_photo" alt="">
          <div class="name">
            <h5>{{basic.feedbacker.real_name}}</h5>
            <span>{{basic.feedbacker.update_time | timeFilter}}</span>
          </div>
        </div>
        <div class="rate">
          <li>
            <span>满意度</span>
            <el-rate class="small-rate" v-model="basic.feedback_performance" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          </li>
          <li>
            <span>相关度</span>
            <el-rate class="small-rate" v-model="basic.feedback_relativity" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          </li>
        </div>
        <div class="remark">{{basic.feedback_comment}}</div>
      </div>
    </div>
    <div class="null" v-else>
      <p>{{self_info.real_name}}期待你的反馈哦…</p>
      <div class="write" @click="$store.dispatch('setTaskFeedback', {status: true, parent: basic})">
        <i class="iconfont icon-icon_feedback_s"></i>
        <span>写反馈</span>
      </div>
    </div>
    <task-feedback></task-feedback>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {TaskFeedback} from '../../../../components/okr';

  export default {
    components: {TaskFeedback},
    props: ['basic'],
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>

<style lang="scss" scoped>
  .task-back {
    width: 328px;
    .header {
      display: flex;
      align-items: center;
      height: 54px;
      font-size: $h2Font;
      font-weight: $h1Weight;
      color: $h3Color;
    }
    .main {
      background-color: #fff;
      .title {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 45px;
        padding: 8px 20px;
        border-bottom: 1px solid $lineColor;
        i {
          font-size: 15px;
        }
        span {
          margin-left: 5px;
          font-size: $h3Font;
          font-weight: $h1Weight;
          color: $h1Color;
        }
      }
      .info {
        padding: 28px;
        .user {
          display: flex;
          align-items: center;
          img {
            box-sizing: border-box;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 1px solid $lineColor;
          }
          .name {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 38px;
            margin-left: 10px;
            h5 {
              font-size: $h3Font;
              font-weight: $h1Weight;
              line-height: 1;
              color: $h1Color;
            }
            span {
              font-size: $h4Font;
              line-height: 1;
              color: $h3Color;
            }
          }
        }
        .rate {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 18px;
          li {
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 50%;
            height: 48px;
            padding: 7px 0;
            &::after {
              position: absolute;
              content: '';
              top: 0; right: 0;
              width: 2px;
              height: 48px;
              background-color: #EAE9E9;
            }
            &:last-child::after {
              display: none;
            }
            span {
              font-size: $h4Font;
              line-height: 1;
              color: $h3Color;
            }
            p {
              font-size: $h3Font;
              font-weight: $h1Weight;
              line-height: 1;
              color: $h1Color;
            }
          }
        }
        .remark {
          margin-top: 19px;
          font-size: $h3Font;
          line-height: 25px;
          color: $h1Color;
        }
      }
    }
    .null {
      display: flex;
      flex-direction: column;
      height: 217px;
      background-color: #fff;
      p {
        margin: 87px auto 50px;
        font-size: $h3Font;
        font-weight: $h1Weight;
        line-height: 1;
        color: $h3Color;
      }
      .write {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: flex-end;
        width: 102px;
        height: 36px;
        margin-right: 28px;
        border-radius: 18px;
        border: 1px solid $themeColor;
        color: $themeColor;
        cursor: pointer;
        @extend %imglight;
        i {
          font-size: 16px;
        }
        span {
          margin-left: 6px;
          font-size: $h3Font;
          font-weight: $h1Weight;
        }
      }
    }
  }
</style>
