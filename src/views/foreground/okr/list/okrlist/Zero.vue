<template>
  <ul class="list" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
    <li v-for="(item, index) in okr_list" :key="index">
      <single-okr :item="item"></single-okr>
    </li>
  </ul>
</template>
<script>
  import OkrApi from '../../../../../api/Okr.js';
  import {SingleOkr} from '../../../../../components/okr';

  export default {
    components: {SingleOkr},
    props: ['type'],
    data() {
      return {
        okr_list: [],
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false, // ETC 空列表
          last_id: 0
        }
      };
    },
    methods: {
      // 触底刷新
      infinite() {
        let that = this;

        that.disabled = true;
        that.getOkrList(that.type, ++that.pageInfo.current_page, that.loading.last_id).then(() => {
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
      async getOkrList(okr_type, currPage, last_id) {
        let that = this;
        await OkrApi().getOkrList({okr_type, currPage, last_id}).then(res => {
          const user_info = res.data.user_info;
          const okr_list = res.data.list;
          that.loading.last_id = res.data.last_id;
          that.pageInfo.page_total = Math.ceil(res.data.cnt / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = okr_list.length; i < ILEN; i++) {
            okr_list[i].creator_info = user_info[okr_list[i].creator_id];
          }

          that.okr_list = that.okr_list.concat(okr_list);
        });
      }
    }
  };
</script>

