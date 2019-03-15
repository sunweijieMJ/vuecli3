<template>
  <div class="single-follow">
    <div class="kt">
      <div class="content">
        <span>{{item.is_key_task ? 'KT' : 'T'}}</span>
        <div class="info">
          <h4>
            <span @click="pathSkip(`/foreground/fore_task/task_detail/${item.task_id}`)">{{item.task_name}}</span>
            <single-status v-if="item.status !== 1" :text="'已完成'" :color="'#5581C7'" :back="'#EAF1FB'"></single-status>
          </h4>
          <p v-if="item.obj_info && item.obj_info[0]" @click="pathSkip(`/foreground/fore_okr/okr_detail/${item.obj_info[0].obj_id}`)">
            <i class="iconfont icon-icon_link"></i>
            <span>{{item.obj_info[0].objective_name}}</span>
          </p>
        </div>
      </div>
      <el-button v-if="!hideBtn && item.status === 1" class="add" @click="$store.dispatch('setTaskFollow', {status: true, parent: item})">跟进</el-button>
    </div>
    <div class="follow" v-if="item.check_info">
      <div class="title">
        <p>
          <span>自评</span>
          <i>&nbsp;{{item.check_info.score}}</i>
        </p>
        <p>
          <span>完成度</span>
          <i>&nbsp;{{item.check_info.progress}}%</i>
        </p>
        <p>
          <span>总投入时长</span>
          <i>&nbsp;{{item.check_info.spend_time}}</i>
        </p>
      </div>
      <p class="content">{{item.check_info.remarks}}</p>
    </div>
  </div>
</template>
<script>
  import frequent from '../../mixins/frequent.js';
  import SingleStatus from '../../components/report/SingleStatus.vue';

  export default {
    components: {SingleStatus},
    mixins: [frequent],
    props: ['item', 'hideBtn']
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
      margin: 15px 0 0 30px;
      border-radius:2px;
      background-color: $backColor;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        p {
          display: flex;
          align-items: center;
          margin-right: 23px;
          &:last-child {
            margin-right: 0;
          }
          span {
            font-size: $h4Font;
            line-height: 1;
            color: $h3Color;
          }
          i {
            font-size: $h4Font;
            font-style: normal;
            line-height: 1;
            color: $themeColor;
          }
        }
      }
      .content {
        font-size: $h3Font;
        line-height: 1.4;
        color: $h1Color;
      }
    }
  }
</style>
