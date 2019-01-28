<template>
  <div class="okr-list">
    <div class="header">
      <el-radio-group v-model="active_name" @change="handleClick">
        <el-radio-button v-for="(item, index) in $store.state.global.type_list" :key="index" :label="item.id">{{item.name}}</el-radio-button>
      </el-radio-group>
      <div class="new-okr" @click="$store.dispatch('setOKRPublish', {status: true, type: 'create'})">
        <span>
          <i class="iconfont icon-icon_add1"></i>
        </span>
        <p>新增OKR</p>
      </div>
    </div>
    <ul class="content" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <li v-for="(item, index) in okr_list" :key="index">
        <single-okr :item="item"></single-okr>
      </li>
    </ul>
    <o-k-r-publish @handleOkrPublish="handleOkrPublish"></o-k-r-publish>
  </div>
</template>
<script>
  import OkrApi from '../../../../api/Okr.js';
  import {Loading} from '../../../../components/public';
  import {SingleOkr, OKRPublish} from '../../../../components/okr';

  export default {
    components: {SingleOkr, Loading, OKRPublish},
    data() {
      return {
        okr_list: [],
        active_name: 0,
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false // ETC 空列表
        },
        last_id: 0
      };
    },
    created() {
      let that = this;
      that.getTypeList();
      if(!that.$route.query.okr_type) {
        that.active_name = 0;
      } else {
        that.active_name = +that.$route.query.okr_type;
      }
    },
    methods: {
      handleOkrPublish() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.active_name = +that.$route.query.okr_type;
        that.infinite();
      },
      handleClick(tab) {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.active_name = tab;
        that.$router.push({name: 'OKRList', query: {okr_type: tab}});
        that.infinite();
      },
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getOkrList(that.active_name, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.okr_list.length) {
            that.disabled = true;
            that.loading = {
              nomore: true,
              noresult: true
            };
          } else if(that.pageInfo.current_page >= that.pageInfo.page_total){
            that.disabled = true;
            that.loading.nomore = true;
          }
        });
      },
      async getOkrList(okr_type, currPage) {
        let that = this;
        await OkrApi().getOkrList({okr_type, currPage, last_id: that.last_id}).then(res => {
          const user_info = res.data.user_info;
          const okr_list = res.data.list;
          this.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = okr_list.length; i < ILEN; i++) {
            okr_list[i].creator_info = user_info[okr_list[i].creator_id];
          }

          that.okr_list = that.okr_list.concat(okr_list);
        });
      },
      getTypeList() {
        let that = this;
        OkrApi().getTypeList({}).then(res => {
          that.$store.state.global.type_list = res.data;
          that.$store.state.global.type_list.unshift({id: 0, name: '全部'});
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

