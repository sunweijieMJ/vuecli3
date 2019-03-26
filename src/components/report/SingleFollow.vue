<template>
  <div class="single-follow">
    <div class="kt">
      <div class="content">
        <span>{{item.is_key_task ? 'KT' : 'T'}}</span>
        <div class="info">
          <h4>
            <span @click="pathSkip(`/foreground/fore_task/task_detail/${item.task_id}`)">{{item.task_name}}</span>
            <single-status v-if="+item.status === 2" :text="'已完成'" :color="'#5581C7'" :back="'#EAF1FB'"></single-status>
          </h4>
          <p v-if="item.obj_info && item.obj_info[0]" @click="pathSkip(`/foreground/fore_okr/okr_detail/${item.obj_info[0].obj_id}`)">
            <i class="iconfont icon-icon_link1"></i>
            <span>{{item.obj_info[0].objective_name}}</span>
          </p>
        </div>
      </div>
      <el-button v-if="!hideBtn && +item.status === 1 && !hideFollow" class="add" @click="$store.dispatch('setTaskFollow', {status: true, parent: item})">跟进</el-button>
    </div>
    <div class="follow" v-if="item.check_info && !hideFollow">
      <div class="title">
        <template v-if="+item.status === 2">
          <li>
            <span>完成度</span>
            <p>{{item.check_info.progress}}%</p>
          </li>
          <li>
            <span>总投入时长</span>
            <p>{{item.check_info.spend_time}}天</p>
          </li>
          <li>
            <span>满意度</span>
            <el-rate class="small-rate" v-model="item.check_info.review_performance" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          </li>
          <li>
            <span>相关度</span>
            <el-rate class="small-rate" v-model="item.check_info.review_relativity" show-score disabled :allow-half="true" show-text
              :disabled-void-color="'#c0c4cc'"
              :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
          </li>
        </template>
        <template v-else>
          <p>
            <span>完成度</span>
            <strong>{{item.check_info.progress}}%</strong>
          </p>
          <p>
            <span>投入时长</span>
            <strong>{{item.check_info.spend_time}}天</strong>
          </p>
        </template>
      </div>
      <p class="content" v-html="textFilter(item.check_info.remarks)"></p>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  import textFilter from '../../utils/filters/textFilter.js';
  import SingleStatus from '../../components/report/SingleStatus.vue';

  export default {
    components: {SingleStatus},
    mixins: [frequent],
    props: ['item', 'hideBtn', 'hideFollow'],
    data() {
      return {
        textFilter
      };
    }
  };
</script>
<style lang="scss" scoped>
  .single-follow {
    display: flex;
    flex-direction: column;
    .kt {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .content {
        display: flex;
        align-items: center;
        >span {
          display: flex;
          justify-content: center;
          align-items: center;
          align-self: flex-start;
          margin: 4px 0;
          width: 36px;
          height: 16px;
          border-radius: 8px;
          background-color: $purple;
          font-size: $h4Font;
          color: #fff;
        }
        .info {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 6px;
          h4 {
            max-width: 520px;
            @include erow(2);
            span {

              font-size: $h3Font;
              font-weight: $h1Weight;
              line-height: 23px;
              color: $h1Color;
              @extend %textlight;
            }
            .single-status {
              margin-left: 6px;
            }
          }
          p {
            @include tofl(520px);
            cursor: pointer;
            &:hover i{
              color: $themeColor;
            }
            &:hover span{
              color: $themeColor;
            }
            i {
              font-size: 13px;
              color: $h3Color;
            }
            span {
              margin-left: 5px;
              font-size: $h4Font;
              line-height: 1;
              color: $h3Color;
            }
          }
        }
      }
      .add {
        align-self: flex-start;
      }
    }
    .follow {
      padding: 17px 22px;
      margin: 15px 0 0 22px;
      border-radius:2px;
      background-color: $backColor;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        li {
          box-sizing: border-box;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          width: 25%;
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
        >p {
          margin-right: 23px;
          span {
            margin-right: 5px;
            font-size: $h4Font;
            color: $h3Color;
          }
          strong {
            font-size: $h3Font;
            color: $h1Font;
          }
        }
      }
      .content {
        font-size: $h3Font;
        line-height: 1.5;
        color: $h2Color;
      }
    }
  }
</style>
