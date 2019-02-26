<template>
  <div class="okr-list">
    <div class="okr-menu">
      <h3>OKR</h3>
      <div class="menu-box">
        <el-tabs v-model="active_okr" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in menu_list" :key="index" :label="item.label" :name="item.name"></el-tab-pane>
          <router-view></router-view>
        </el-tabs>
        <div class="new-okr" @click="$store.dispatch('setOKRPublish', {status: true, type: 'create'})">
          <span>
            <i class="iconfont icon-icon_add1"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="okr-select" v-if="active_okr === 'all'">
      <el-cascader
        v-model="active_part"
        placeholder="全部作者"
        expand-trigger="click"
        :options="part_list"
        :show-all-levels="false"
        :change-on-select="true"
        @change="partChange"
      ></el-cascader>
      <el-cascader
        v-model="active_kind"
        :options="kind_list"
        placeholder="全部类型"
        @change="resetList()"
      ></el-cascader>
    </div>
    <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <li v-for="(item, index) in okr_list" :key="index">
        <single-okr :item="item"></single-okr>
      </li>
      <div class="no-result" v-if="loading.noresult">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-icon_nothing"></use>
        </svg>
        <p>暂时没有内容哦</p>
      </div>
    </ul>
    <o-k-r-publish @handleOkrPublish="handleOkrPublish"></o-k-r-publish>
  </div>
</template>
<script>
  import OkrApi from '../../../api/Okr.js';
  import UserApi from '../../../api/User.js';
  import {Loading} from '../../../components/public';
  import {SingleOkr, OKRPublish} from '../../../components/okr';

  export default {
    components: {SingleOkr, Loading, OKRPublish},
    data() {
      return {
        menu_list: [], // ETC 菜单列表
        active_okr: '', // ETC 当前激活菜单
        part_list: [], // ETC 角色列表
        active_part: [], // ETC 当前激活角色
        kind_list: [], // ETC 种类列表
        active_kind: [], // ETC 当前激活种类
        okr_list: [], // ETC okr列表
        disabled: false, // ETC 列表加载开关
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        loading: { // ETC loading状态
          nomore: false, // ETC 触底
          noresult: false, // ETC 空列表
          last_id: 0
        }
      };
    },
    created() {
      let that = this;
      that.menu_list = [
        {
          label: '我的',
          name: 'create'
        },
        {
          label: '我参与的',
          name: 'take'
        },
        {
          label: '我团队的',
          name: 'team'
        },
        {
          label: '全部OKR',
          name: 'all'
        }
      ];
      that.getKindList();
      that.getPartList();
      that.active_okr = that.$route.query.active_okr || 'create';
    },
    methods: {
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getOkrList(that.loading.last_id, ++that.pageInfo.current_page).then(() => {
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
      // 角色改变
      partChange(item) {
        let that = this;
        UserApi().getStaffsByDep({depId: item[0]}).then(res => {
          if(!res.status) return;
          const user_list = Object.values(res.data.list);
          for(let i = 0, ILEN = that.part_list.length; i < ILEN; i++) {
            if(that.part_list[i].dep_id === item[0]) {
              that.part_list[i].children = [];
              for(let j = 0, JLEN = user_list.length; j < JLEN; j++) {
                that.part_list[i].children.push({
                  label: `${user_list[j].user_name}(${user_list[j].real_name})`,
                  value: user_list[j].user_id
                });
              }
              that.$set(that.part_list, i, that.part_list[i]);
            }
          }
        });
        that.resetList();
      },
      // 菜单改变
      handleClick(e) {
        let that = this;
        that.$router.push({name: that.$route.name, query: {active_okr: e.name}});
      },
      // 发布回调
      handleOkrPublish() {
        this.resetList();
      },
      // 角色列表
      getPartList() {
        let that = this;
        UserApi().getPartList({}).then(res => {
          if(!res.status) return;
          that.part_list = res.data.list;
          for(let i = 0, LEN = that.part_list.length; i < LEN; i++) {
            that.part_list[i].label = that.part_list[i].department_name;
            that.part_list[i].value = that.part_list[i].dep_id;
            that.part_list[i].children = [];
          }
        });
      },
      // 种类列表
      getKindList() {
        let that = this;
        OkrApi().getKindList({}).then(res => {
          if(!res.status) return;
          that.kind_list = res.data;
          that.kind_list.unshift({id: 0, name: '全部'});
          for(let i = 0, LEN = that.kind_list.length; i < LEN; i++) {
            that.kind_list[i].label = that.kind_list[i].name;
            that.kind_list[i].value = that.kind_list[i].id;
          }
        });
      },
      // okr列表
      async getOkrList(last_id, currPage, qtype = this.active_okr, qdep_id = this.active_part[0], quser_id = this.active_part[1], okr_type = this.active_kind[0]) {
        let that = this;
        await OkrApi().getOkrList({last_id, currPage, qtype, qdep_id, quser_id, okr_type}).then(res => {
          const user_info = res.data.user_info;
          const okr_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = okr_list.length - 1; i >= 0; i--) {
            if(!okr_list[i]) {
              okr_list.splice(i, 1);
              continue;
            }
            okr_list[i].creator_info = user_info[okr_list[i].creator_id];
          }

          that.okr_list = that.okr_list.concat(okr_list);
        });
      },
      // 重置okr列表
      resetList(last_id, currPage, qtype = this.active_okr, qdep_id = this.active_part[0], quser_id = this.active_part[1], okr_type = this.active_kind[0]) {
        let that = this;
        that.okr_list = [];
        Object.assign(that.$data.pageInfo, that.$options.data().pageInfo);
        Object.assign(that.$data.loading, that.$options.data().loading);
        Object.assign(that.$data.disabled, that.$options.data().disabled);

        OkrApi().getOkrList({last_id, currPage, qtype, qdep_id, quser_id, okr_type}).then(res => {
          const user_info = res.data.user_info;
          const okr_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = okr_list.length - 1; i >= 0; i--) {
            if(!okr_list[i]) {
              okr_list.splice(i, 1);
              continue;
            }
            okr_list[i].creator_info = user_info[okr_list[i].creator_id];
          }

          that.okr_list = okr_list;
        });
      }
    },
    watch: {
      // 刷新当前页面
      $route(to, from) {
        let that = this;
        if(to.name === that.$route.name && from.name === that.$route.name) {
          that.active_okr = that.$route.query.active_okr || 'create';
          that.resetList();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .okr-list {
    .list {
      width: 1040px;
      margin: 12px auto 0;
      .no-result {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        svg {
          margin: 170px 0 10px;
          width: 180px;
        }
        p {
          font-size: $h3Font;
          font-weight: $h1Weight;
          color: $h3Color;
        }
      }
    }
  }
</style>
<style lang="scss">
  .okr-list {
    .okr-menu {
      display: flex;
      flex-direction: column;
      height: 140px;
      background-color: $h2Color;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      h3 {
        width: 1040px;
        margin: 30px auto;
        font-size: 30px;
        line-height: 1;
        font-weight: $h1Weight;
        color: $themeColor;
      }
      .menu-box {
        display: flex;
        justify-content: space-between;
        width: 1040px;
        margin: 0 auto;
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            .el-tabs__nav-wrap {
              &:after {
                position: static;
              }
              .el-tabs__active-bar {
                height: 3px;
                border-radius: 1.5px;
                background: linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);;
              }
              .el-tabs__item {
                height: 30px;
                font-size: $h2Font;
                font-weight: $h1Weight;
                line-height: 30px;
                color: $h3Color;
                &.is-active {
                  color: #fff;
                }
              }
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
            width: 38px;
            height: 38px;
            border-radius:30px;
            background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
            box-shadow:0px 0px 15px 0px rgba(255,118,120,0.5);
            @extend %imglight;
            i {
              font-size: 20px;
              color: #fff;
            }
          }
        }
      }
    }
    .okr-select {
      display: flex;
      align-items: center;
      width: 1040px;
      margin: 20px auto;
      .el-cascader {
        box-sizing: border-box;
        display: flex;
        width: 170px;
        height: 40px;
        padding: 10px 20px;
        margin-right: 12px;
        border-radius: 20px;
        line-height: 1;
        background-color: rgba(222,222,222,1);
        &:last-child {
          margin-right: 0;
        }
        .el-input {
          input {
            width: inherit;
            height: 20px;
            padding: 0;
            font-size: $h3Font;
            line-height: 20px;
            color: $h1Color;
            border: none;
            background-color: transparent;
            &::placeholder {
              font-size: $h3Font;
              line-height: 20px;
              color: $h1Color;
            }
          }
          .el-input__icon {
            color: $h1Color;
          }
        }
        .el-cascader__label {
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>

