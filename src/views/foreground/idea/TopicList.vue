<template>
  <div class="topic-list">
    <div class="list-header">
      <h3 v-if="topic_info">#{{topic_info.sTopicTitle}}#</h3>
    </div>
    <div class="list-content" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <public-list :list="idea_list"></public-list>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../../api/Idea.js';
  import activate from '../../../mixins/activate.js';
  import {Loading} from '../../../components/public';
  import {PublicList} from '../../../components/business';

  export default {
    name: 'TopicList',
    components: {PublicList, Loading},
    mixins: [activate],
    data(){
      return {
        topic_id: 0, // ETC 话题id
        topic_info: {}, // ETC 话题信息
        idea_list: [], // ETC 想法列表
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
      // 想法列表
      async getTopicList(topicId, curPage, last_id) {
        let that = this;
        await IdeaApi().getIdeaList({topicId, curPage, last_id}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const idea_list = Object.values(res.data.list);
          that.topic_info = res.data.topic_info;
          that.loading.last_id = res.data.last_id;
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
      infinite() {
        let that = this;
        that.topic_id = +that.$route.params.id;

        that.disabled = true;
        that.getTopicList(that.topic_id, ++that.pageInfo.current_page, that.loading.last_id).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.idea_list.length) {
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
  .topic-list {
    width: 1040px;
    margin: auto;
    padding-top: 12px;
    .list-header {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 750px;
      height: 56px;
      padding-left: 58px;
      margin-bottom: 4px;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      h3 {
        font-size: $h2Font;
        line-height: 28px;
        color: $h1Color;
      }
    }
    .list-content {
      width: 750px;
    }
  }
</style>


