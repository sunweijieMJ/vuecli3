<template>
  <div class="new-list">
    <div class="new-box" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled">
      <div class="warn">
        提醒
      </div>
      <ul v-if="for_list.length">
        <li v-for="(a, index) in for_list" :key="index" v-if="a.name" @click="goIdeaDetail(a.content.thinks_id, a.content.status)">
          <el-popover
            placement="bottom"
            trigger="hover"
            class="head-img">
            <img slot="reference" v-if="a.name" :src="a.name.header_photo" alt="" @click.stop="goProFile(a.push_user_id)">
            <user-popover :userinfo="a.name"></user-popover>
          </el-popover>
          <div class="comment">
            <div class="reply">
              <span @click.stop="goProFile(a.push_user_id)">
                <span v-if="a.name" class="name">{{a.name.user_name}}</span><span class="idea">{{a.message_title}}</span>
              </span>
              <span class="date">{{a.publish_time | timeFilter}}</span>
            </div>
            <div class="comment-idea">
              <!-- <p v-if="a.content.status !== 2">
                {{a.message_desc}}
              </p> -->
              <div class="info-paragraphs">
                <Paragraph v-if="a.content.status !== 2" :text="a.message_desc"></Paragraph>
              </div>
              <span class="bg-gray" v-if="a.content.type === 2 && a.content.status === 2 && a.message_desc">
                {{a.message_desc}}
              </span>
            </div>
            <div class="distr">
              <div class="icon-con">
                <svg class="icon" aria-hidden="true" v-if="a.content && a.content.status === 2">
                  <use xlink:href="#icon-icon_info"></use>
                </svg>
                <!-- <p class="isread" v-if="a.content && a.content.status === 2">
                  {{a.content.content}}
                </p> -->
                <div v-if="a.content && a.content.status === 2" class="info-paragraphs">
                  <Paragraph :text="a.content.content"></Paragraph>
                </div>
                <p v-else>
                  {{a.content.content}}
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <loading :loading="disabled" :nomore="loading.nomore" :noresult="loading.noresult"></loading>
    </div>
  </div>
</template>
<script>
  import UserPopover from '../../../components/popup/UserPopover';
  import NoticeApi from '../../../api/Notice.js';
  import {Loading} from '../../../components/public';
  import frequent from '../../../mixins/frequent.js';
  import Paragraph from '../../../components/business/Paragraph.js';

  export default {
    name: 'NewsList',
    mixins: [frequent],
    components: {
      UserPopover,
      Loading,
      Paragraph
    },
    data(){
      return {
        for_list: [], // ETC 信息列表
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
    methods: {
      goIdeaDetail(user_id, status){
        if(status === 2){

        }else{
          window.open(`/foreground/fore_idea/idea_detail/${user_id}`, '_blank');
        }
      },
      goProFile(user_id){
        this.pathSkip(`/foreground/fore_mine/profile/${user_id}`);
      },
      // 触底刷新
      infinite() {
        let that = this;
        that.disabled = true;
        that.getIdeaListData(++that.pageInfo.current_page).then(() => {
          // 触底判断
          that.disabled = false;
          if(!that.for_list.length) {
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
      async getIdeaListData(curpage){
        return await NoticeApi().getMessageList({waitRead: 6, pages: 7, curPage: curpage}).then(res => {
          let for_list = res.data.list;
          if(for_list.length){
            for (let i = 0; i < for_list.length; i++) {
              for_list[i].name = res.data.users_info[res.data.list[i].push_user_id];
              let content = res.data.origin_msg[res.data.list[i].business_type];
              for_list[i].content = content[res.data.list[i].business_id];
            }
            this.pageInfo.page_total = Math.ceil(res.data.total / this.pageInfo.page_size);
            this.for_list = this.for_list.concat(for_list);
          }
          if(curpage === 1) this.$store.dispatch('getMessageUnread');
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
.new-list{
  // margin-top: 5px;
  width: 100%;
  background-color: white;
  // text-align: left;
  .new-box{
    width: 1040px;
    margin: auto;
  }
  .warn{
    width: 750px;
    padding: 20px 0;
    font-size:37px;
    font-family:PingFangSC-Medium;
    font-weight: 500;
    color:rgba(255,118,120,1);
    line-height:53px;
    border-bottom:1px solid rgba(246,246,246,1);
  }
  ul{
    width: 750px;
    li{
      cursor: pointer;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      padding: 14px 0 28px 0;
      border-bottom:1px solid rgba(246,246,246,1);
      .head-img{
        cursor: pointer;
        img{
          box-sizing: border-box;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid $lineColor;
        }
      }
      .comment{
        margin-left: 14px;
        padding-top: 14px;
        .reply{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-family:PingFangSC-Regular;
          color: #303133;
          .name{
            @extend %textlight;
            color:rgba(85,129,199,1);
          }
          .date{
            font-size:12px;
            font-family:PingFangSC-Regular;
            color:rgba(144,147,153,1);
          }
        }
        .comment-idea{
          margin-top: 9px;
          .bg-gray{
            background-color: #F6F6F6;
            border-radius: 50px;
          }
          p{
            // @extend %textlight;
            font-size:15px;
            font-family:PingFangSC-Regular;
            word-break: break-word;
            color:rgba(96,98,102,1);
            line-height:22px;
          }
          span{
            color: #909399;
            font-size: 15px;
            padding: 2px 10px;
          }
        }
        .distr{
          width: 652px;
          margin-top: 13px;
          padding: 12px 17px;
          background:rgba(246,246,246,1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon-con{
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .isread{
              color: #909399 !important;
            }
          }
          .icon{
            width: 26px;
            height: 16px;
          }
          p{
            // @extend %textlight;
            font-size:15px;
            line-height: 17px;
            font-family:PingFangSC-Regular;
            color: rgba(96,98,102,1);
            line-height:25px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          // span{
          //   display: inline-block;
          //   width: 20px;
          //   height: 20px;
          //   border-radius: 50px;
          //   color: white;
          //   background: #FF7678;
          //   line-height: 20px;
          //   text-align: center;
          // }
        }
      }
    }
  }
}
</style>
<style lang="scss">
  .info-paragraphs {
    p {
      font-size: $h3Font;
      line-height: 25px;
      color: $h1Color;
      a {
        font-size: $h3Font;
        color: $linkBlue;
        @extend %textlight;
      }
    }
  }
</style>