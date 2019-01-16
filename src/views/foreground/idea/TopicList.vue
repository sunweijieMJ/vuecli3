<template>
  <div class="topic-list">
    <div class="list-header">
      <h3>#{{topic_info.sTopicTitle}}#</h3>
    </div>
    <div class="list-content">
      <public-list :list="idea_list"></public-list>
      <infinite-loading @infinite="infinite">
        <div class="message" slot="spinner">加载中...</div>
        <div class="message" slot="no-more">到底啦</div>
        <div class="message" slot="no-results">列表为空</div>
      </infinite-loading>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../../api/Idea.js';
  import {PublicList} from '../../../components/business';

  export default {
    name: 'TopicList',
    components: {PublicList},
    data(){
      return {
        topic_id: 0, // ETC 话题id
        topic_info: {}, // ETC 话题信息
        idea_list: [], // ETC 想法列表
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        }
      };
    },
    methods: {
      // 想法列表
      async getTopicList(topicId, curPage) {
        let that = this;
        await IdeaApi().getIdeaList({topicId, curPage}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const idea_list = Object.values(res.data.list);
          that.topic_info = res.data.topic_info;
          that.pageInfo.page_total = Math.ceil(res.data.total / that.pageInfo.page_size);
          // 数据整理
          for(let i = 0, ILEN = idea_list.length; i < ILEN; i++) {
            // 点赞整理
            idea_list[i].self_zan = self_zan[idea_list[i].thinks_id];
            // 用户整理
            idea_list[i].user_info = user_infos[idea_list[i].user_id];
            if(!idea_list[i].replys) continue;
            for(let j = 0, JLEN = idea_list[i].replys.length; j < JLEN; j++) {
              idea_list[i].replys[j].user_info = user_infos[idea_list[i].replys[j].user_id];
            }
          }

          that.idea_list = that.idea_list.concat(idea_list);
        });
      },
      // 触底刷新
      infinite($state) {
        let that = this;
        that.topic_id = +that.$route.params.id;
        that.getTopicList(that.topic_id, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          if(that.pageInfo.current_page >= that.pageInfo.page_total || !that.idea_list.length){
            $state.complete();
          } else {
            $state.loaded();
          }
        });
      }
    },
    watch: {
      $route() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
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
      margin-bottom: 4px;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
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


