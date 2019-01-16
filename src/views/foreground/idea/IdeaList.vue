<template>
  <div class="idea-list">
    <div class="idea-write">
      <div class="write-btn" @click="comment_popup = true">
        <img src="../../../../static/svg/icon_add_thought.svg" alt="">
      </div>
    </div>
    <comment-publish v-if="comment_popup" @shutDown="comment_popup = false" @publishSuccess="publishSuccess" :clientHeight="clientHeight"></comment-publish>
    <div class="idea-content" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
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
  import CommentPublish from '../../../components/comment/CommentPublish';

  export default {
    name: 'IdeaList',
    components: {
      PublicList, Loading, CommentPublish
    },
    mixins: [activate],
    data(){
      return {
        idea_list: [], // ETC 想法列表
        comment_popup: false, // ETC 评论弹框
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        clientHeight: '',
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false // ETC 空列表
        }
      };
    },
    methods: {
      // 想法列表
      async getIdeaList(curPage) {
        let that = this;
        await IdeaApi().getIdeaList({curPage}).then(res => {
          if(!res.status) return;
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const idea_list = res.data.list;
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
        that.clientHeight = document.documentElement.clientHeight;

        that.disabled = true;
        that.getIdeaList(++that.pageInfo.current_page).then(() => {
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
      },
      // 发布评论成功回调
      publishSuccess() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.infinite();
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../assets/scss/_base.scss';

  .idea-list {
    width: 1040px;
    margin: auto;
    padding-top: 12px;
    .idea-write {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width:750px;
      height:56px;
      margin-bottom: 4px;
      background-color: #fff;
      box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
      .write-btn {
        display: flex;
        align-items: center;
        margin-right: 58px;
        cursor: pointer;
        span {
          font-size: $h2Font;
          color:rgba(255,118,118,1);
        }
        img {
          width: 38px;
        }
      }
    }
    .idea-content {
      width: 750px;
    }
  }
</style>


