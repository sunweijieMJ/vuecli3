<template>
  <div class="topic-list">
    <div class="list-header">
      <h3>PGS正式上线啦</h3>
    </div>
    <div class="list-content" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled" infinite-scroll-distance="30">
      <public-list :list="topic_list"></public-list>
      <loading :loading="disabled && topic_list.length && topic_list.length < pageInfo.page_total"></loading>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../../api/Idea.js';
  import {Loading} from '../../../components/public';
  import {PublicList} from '../../../components/business';

  export default {
    components: {
      Loading, PublicList
    },
    data(){
      return {
        topic_list: [], // ETC 想法列表
        disabled: false, // ETC 加载开关
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_total: 0
        }
      };
    },
    methods: {
      // 想法列表
      async getTopicList(curPage) {
        let that = this;
        return await IdeaApi().getIdeaList({curPage}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const topic_list = res.data.list;
          that.pageInfo.page_total = res.data.total;
          // 数据整理
          for(let i = 0, ILEN = topic_list.length; i < ILEN; i++) {
            // 点赞整理
            topic_list[i].self_zan = self_zan[topic_list[i].thinks_id];
            // 用户整理
            topic_list[i].user_info = user_infos[topic_list[i].user_id];
            if(!topic_list[i].replys) continue;
            for(let j = 0, JLEN = topic_list[i].replys.length; j < JLEN; j++) {
              topic_list[i].replys[j].user_info = user_infos[topic_list[i].replys[j].user_id];
            }
          }

          that.topic_list = that.topic_list.concat(topic_list);
        });
      },
      // 触底刷新
      infinite() {
        let that = this;
        that.disabled = true;
        that.getTopicList(++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(that.topic_list.length === that.pageInfo.page_total || !that.topic_list.length){
            that.disabled = true;
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_base.scss';

  .topic-list {
    width: 1040px;
    margin: auto;
    padding-top: 12px;
    .list-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 750px;
      height: 74px;
      padding-left: 58px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
      h3 {
        font-size: 20px;
        line-height: 28px;
        color: $h1Color;
      }
    }
    .list-content {
      width: 750px;
    }
  }
</style>


