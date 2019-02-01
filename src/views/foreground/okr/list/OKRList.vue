<template>
  <div class="okr-list">
    <div class="header">
      <el-radio-group v-model="active_name" @change="handleClick">
        <el-radio-button v-for="(item, index) in type_list" :key="index" :label="item.id">{{item.name}}</el-radio-button>
      </el-radio-group>
      <div class="new-okr" @click="$store.dispatch('setOKRPublish', {status: true, type: 'create'})">
        <span>
          <i class="iconfont icon-icon_add1"></i>
        </span>
        <p>新增OKR</p>
      </div>
    </div>
    <components :is="Zero" :key="key" :type="active_name"></components>
    <o-k-r-publish @handleOkrPublish="handleOkrPublish"></o-k-r-publish>
  </div>
</template>
<script>
  import OkrApi from '../../../../api/Okr.js';
  import {Loading} from '../../../../components/public';
  import {Zero} from './okrlist/index.js';
  import {SingleOkr, OKRPublish} from '../../../../components/okr';

  export default {
    components: {SingleOkr, Loading, OKRPublish},
    data() {
      return {
        Zero,
        key: 0,
        type_list: [],
        active_name: 0
      };
    },
    created() {
      let that = this;
      that.getTypeList();
      if(!that.$route.query.okr_type) {
        that.active_name = that.key =  0;
      } else {
        that.active_name = that.key = +that.$route.query.okr_type;
      }
    },
    methods: {
      handleOkrPublish() {
        let that = this;
        that.key++;
        that.$router.push({name: 'OKRList', query: {okr_type: that.active_name}});
      },
      handleClick(tab) {
        let that = this;
        that.active_name = that.key = tab;
        that.$router.push({name: 'OKRList', query: {okr_type: tab}});
      },
      // okr类型列表
      getTypeList() {
        let that = this;
        OkrApi().getTypeList({}).then(res => {
          that.type_list = res.data;
          that.type_list.unshift({id: 0, name: '全部'});
        });
      }
    }
  };
</script>
<style lang="scss">
  .okr-list {
    width: 960px;
    margin: auto;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-radio-group {
        height: 38px;
        margin: 15px 0;
        border-radius: 20px;
        background:rgba(222,222,222,1);
        .el-radio-button {
          box-shadow: none !important;
          &.is-active {
            .el-radio-button__inner {
              color: #fff;
              box-shadow: none;
              background-color: $themeColor;
            }
          }
          .el-radio-button__inner {
            width: 82px;
            height: 38px;
            border-radius: 20px;
            border: 0 none;
            background-color: transparent;
            font-size: $h3Font;
            color: $h2Color;
          }
        }
      }
      .new-okr {
        display: flex;
        align-items: center;
        cursor: pointer;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          border-radius:30px;
          background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          i {
            font-size: 16px;
            color: #fff;
          }
        }
        p {
          margin-left: 8px;
          font-size: $h2Font;
          font-weight: $h1Weight;
          color: $themeColor;
        }
      }
    }
  }
</style>

