
<template>
  <div class="idea-detail" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
    <template v-if="!idea_delete">
      <public-detail :detail="ieda_detail" :commentNums="common_list.total" @activeComment="activeComment"></public-detail>
      <!-- 点赞用户列表 -->
      <div class="detail-thump" v-if="thump_list.length">
        <div class="thump-title">
          他们都觉得很赞
        </div>
        <div class="thump-icon">
          <el-popover
            v-for="(item, index) in thump_list.slice(0,47)" :key="index"
            placement="bottom"
            trigger="hover">
            <img slot="reference"  @click="pathSkip(`/foreground/fore_mine/profile/${item.user_id}`)" :src="item.header_photo" alt="">
            <user-popover :userinfo="item"></user-popover>
          </el-popover>
          <span class="max" v-if="thump_list.length >= 48">{{thump_list.length > 99 ? '99+' : thump_list.length}}</span>
        </div>
      </div>
      <!-- 回复评论 -->
      <div class="detail-comment">
        <img :src="self_info.header_photo" alt="">
        <div class="comment-publish" v-if="ieda_detail.user_info">
          <publish :textEnabled="textEnabled">
            <textarea ref="textarea" placeholder="写下你的评论..." v-model="textEnabled.text"
              @propertychange="autoTextarea($event.target, 0, 184)" @input="autoTextarea($event.target, 0, 184)" @focus="textEnabled.status = true"
              ></textarea>
          </publish>
          <div class="publish-btn" v-if="textEnabled.status">
            <span @click="textEnabled = {status: false, text: ''}">取消</span>
            <button @click="sendComment(idea_id, textEnabled.text)">发送</button>
          </div>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="detail-splendid" v-if="splendid_list.list.length">
        <div class="splendid-title">
          <h4>精彩评论 ({{splendid_list.list.length}})</h4>
        </div>
        <comment-list :list="splendid_list.list" @commentSuccess="commentSuccess"></comment-list>
      </div>
      <!-- 普通评论 -->
      <div class="detail-common" v-if="common_list.total">
        <div class="common-title">
          <h4>评论 ({{common_list.total}})</h4>
        </div>
        <comment-list :list="common_list.list" @commentSuccess="commentSuccess" @deleteSuccess="deleteSuccess"></comment-list>
      </div>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </template>
    <div class="idea-delete" v-else>
      <p>
        <i class="iconfont icon-icon_info"></i>
        <span>该内容已被删除</span>
      </p>
    </div>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import IdeaApi from '../../../api/Idea.js';
  import frequent from '../../../mixins/frequent.js';
  import {UserPopover} from '../../../components/popup';
  import {autoTextarea} from '../../../utils/business/tools.js';
  import {Publish, Loading} from '../../../components/public';
  import {PublicDetail, CommentList} from '../../../components/business';

  export default {
    components: {PublicDetail, UserPopover, CommentList, Publish, Loading},
    mixins: [frequent],
    data() {
      return {
        autoTextarea,
        idea_delete: false, // ETC 想法被删除
        idea_id: 0, // ETC 详情id
        ieda_detail: {}, // ETC 详情
        thump_list: [], // ETC 点赞用户列表
        textEnabled: { // ETC textarea 状态
          status: false,
          text: ''
        },
        splendid_list: { // ETC 精彩评论
          list: [],
          total: 0
        },
        common_list: { // ETC 普通评论
          list: [],
          total: 0
        },
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_size: 15,
          page_total: 0
        },
        disabled: false, // ETC 加载开关
        loading: {
          nomore: false, // ETC 触底
          noresult: false // ETC 空列表
        }
      };
    },
    created() {
      let that = this;
      that.idea_id = +that.$route.params.id;
      that.getIdeaDetail(that.idea_id);
      that.getThumpList(that.idea_id);
      that.sendIdeaView(that.idea_id);
    },
    mounted() {
      let that = this;
      if(!that.$route.query.active) return;
      that.$nextTick(() => {
        // that.activeComment();
      });
    },
    methods: {
      // 触底刷新
      infinite() {
        let that = this;
        that.idea_id = +that.$route.params.id;

        that.disabled = true;
        that.getCommentList(that.idea_id, ++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.common_list.list.length) {
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
      // 详情信息
      getIdeaDetail(thinksId) {
        let that = this;
        IdeaApi().getIdeaDetail({thinksId}).then(res => {
          if(res.status) {
            that.ieda_detail = res.data;
            if(!res.data.info) return;
            const user_infos = res.data.info;
            that.ieda_detail.user_info = user_infos[that.ieda_detail.user_id];
          } else {
            that.idea_delete = true;
          }
        });
      },
      // 点赞用户列表
      getThumpList(thinksId) {
        IdeaApi().getThumpList({thinksId}).then(res => {
          this.thump_list = Object.values(res.data.list || {});
        });
      },
      // 评论列表
      async getCommentList(thinksId, curPage) {
        let that = this;
        await IdeaApi().getCommentList({thinksId, curPage}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const common = res.data.list || [];
          const splendid = res.data.hot_comments || [];
          that.common_list.total = res.data.total_comments || 0;
          that.pageInfo.page_total = Math.ceil(res.data.total / that.pageInfo.page_size) || 0;

          // 精彩评论
          for(let i = 0, ILEN = splendid.length; i < ILEN; i++) {
            // 点赞整理
            splendid[i].self_zan = self_zan[splendid[i].comment_id];
            // 用户整理
            splendid[i].user_info = user_infos[splendid[i].user_id];
            if(!splendid[i].replys) splendid[i].replys = [];
            for(let j = 0, JLEN = splendid[i].replys.length; j < JLEN; j++) {
              // 点赞整理
              splendid[i].replys[j].self_zan = self_zan[splendid[i].replys[j].comment_id];
              // 用户整理
              splendid[i].replys[j].user_info = user_infos[splendid[i].replys[j].user_id];
            }
          }
          // 普通评论
          for(let i = 0, ILEN = common.length; i < ILEN; i++) {
            // 点赞整理
            common[i].self_zan = self_zan[common[i].comment_id];
            // 用户整理
            common[i].user_info = user_infos[common[i].user_id];
            if(!common[i].replys) common[i].replys = [];
            for(let j = 0, JLEN = common[i].replys.length; j < JLEN; j++) {
              // 点赞整理
              common[i].replys[j].self_zan = self_zan[common[i].replys[j].comment_id];
              // 用户整理
              common[i].replys[j].user_info = user_infos[common[i].replys[j].user_id];
            }
          }

          that.common_list.list = that.common_list.list.concat(common);
          that.splendid_list.list = that.splendid_list.list.concat(splendid);
        });
      },
      // 单页浏览数增加
      sendIdeaView(thinksId) {
        IdeaApi().sendIdeaView({thinksId});
      },
      // 发送评论
      sendComment(thinksId, commentContent) {
        let that = this;
        if(commentContent.trim()) {
          if(commentContent.length > 500) {
            that.$message({message: '评论不能超过500字', type: 'warning'});
          } else {
            IdeaApi().PubishComment({thinksId, commentContent}).then(res => {
              if(res.status) {
                const textarea = that.$el.querySelector('.detail-comment textarea');
                textarea.value = '';
                autoTextarea(textarea);
                that.textEnabled = {
                  status: false,
                  text: ''
                };
                that.commentSuccess({data: res.data});
              }
            });
          }
        } else {
          that.$message({message: '评论不能为空', type: 'warning'});
        }
      },
      // 评论成功
      commentSuccess(res) {
        let that = this;
        let comment = res.data;
        comment.replys = [];
        comment.user_info = that.self_info;
        const common = JSON.parse(JSON.stringify(that.common_list.list));
        const splendid = JSON.parse(JSON.stringify(that.splendid_list.list));

        // 一级评论
        if(!res.hasOwnProperty('id')) {
          common.unshift(comment);
        } else {
          // 二级评论
          for(let i = 0, LEN = common.length; i < LEN; i++) {
            if(common[i].comment_id !== res.id) continue;

            if(res.hasOwnProperty('index')) {
              common[i].replys.splice(res.index + 1, 0, comment);
            } else {
              common[i].replys.unshift(comment);
            }
          }
          for(let i = 0, LEN = splendid.length; i < LEN; i++) {
            if(splendid[i].comment_id !== res.id) continue;
            if(res.hasOwnProperty('index')) {
              splendid[i].replys.splice(res.index + 1, 0, comment);
            } else {
              splendid[i].replys.unshift(comment);
            }
          }
        }

        that.common_list.list = common;
        that.common_list.total++;
        that.splendid_list.list = splendid;
      },
      // 评论删除成功
      deleteSuccess() {
        this.common_list.total--;
      },
      // 激活评论区
      activeComment() {
        let that = this;
        // const comment = that.$el.querySelector('.detail-comment');
        const textarea = that.$el.querySelector('.detail-comment textarea');
        textarea.focus();
      }
    },
    watch: {
      'textEnabled.status'(cur) {
        let that = this;
        if(cur) {
          that.$nextTick(() => {
            const textarea = that.$el.querySelector('.detail-comment textarea');
            textarea.focus();
          });
        }
      },
      $route(to) {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.getIdeaDetail(to.params.id);
        that.getThumpList(to.params.id);
        that.sendIdeaView(to.params.id);
      }
    },
    computed: mapState({
      self_info: store => store.self_info
    })
  };
</script>
<style lang="scss" scoped>
  .idea-detail {
    @media screen and (min-width: 1000px){
      width: 800px;
    }
    margin: 12px auto 0;
    background-color: #fff;
    .detail-thump {
      @media screen and (min-width: 1000px){
        padding: 35px 66px 25px;
      }
      @media screen and (max-width: 750px){
        padding: 35px 5%;
      }
      .thump-title {
        margin-bottom: 20px;
        font-size: $h2Font;
        font-weight: 500;
        line-height: 25px;
        color: $h1Color;
      }
      .thump-icon {
        display: flex;
        flex-wrap: wrap;
        img {
          box-sizing: border-box;
          width: 30px;
          height: 30px;
          margin: 0 10px 10px 0;
          border-radius: 50%;
          border: 1px solid $lineColor;
          cursor: pointer;
        }
        .max {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30px;
          height: 30px;
          background-color:$backColor;
          border: 1px solid $lineColor;
          border-radius: 50%;
          font-size: $h4Font;
          color: $h3Color;
        }
      }
    }
    .idea-delete {
      display: flex;
      justify-content: center;
      align-items: center;
      @media screen and (min-width: 1000px){
        width: 800px;
      }
      height: 450px;
      background-color: #fff;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.05);
      border-radius: 2px;
      i {
        font-size: 22px;
        color: $themeColor;
      }
      span {
        margin-left: 7px;
        font-size: 20px;
        color: $h3Color;
      }
    }
    .detail-comment {
      display: flex;
      @media screen and (min-width: 1000px){
        padding: 25px 66px;
      }
      @media screen and (max-width: 999px){
        padding: 25px 5%;
      }
      
      img {
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 30px;
        border: 1px solid $lineColor;
      }
      .comment-publish {
        flex: 1;
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          padding: 10px 20px;
          border-radius: 2px;
          font-size: $h3Font;
          line-height: 25px;
          resize: none;
          border: none;
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &::-webkit-input-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &:-moz-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &::-moz-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
          &:-ms-input-placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
        }
        .publish-btn {
          margin-top: 15px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span {
            font-size: $h3Font;
            font-weight: 500;
            line-height: 22px;
            color: $h1Color;
            cursor: pointer;
            @extend %textlight;
          }
          button {
            margin-left: 20px;
            width: 74px;
            height: 36px;
            background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
            border-radius: 20px;
            font-size: $h3Font;
            font-weight: 500;
            color: #fff;
            cursor: pointer;
            @extend %imglight;
          }
        }
      }
    }
    .detail-common, .detail-splendid {
      @media screen and (min-width: 1000px){
        padding: 15px 66px;
      }
      @media screen and (max-width: 999px){
        padding: 15px 5%;
      }
      .common-title, .splendid-title {
        display: flex;
        align-items: center;
        padding: 15px 0 10px;
        border-bottom: 1px solid #F6F6F6;
        h4 {
          font-size: $h2Font;
          font-weight: 500;
          line-height: 25px;
          color: $h1Color;
        }
      }
    }
  }
</style>

