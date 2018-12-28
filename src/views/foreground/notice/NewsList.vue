<template>
  <div class="new-list">
    <div class="new-box" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled" infinite-scroll-distance="30">
      <div class="warn">
        提醒
      </div>
      <ul>
        <li v-for="(a, index) in for_list" :key="index" @click="goIdeaDetail(a.to_user_id)">
          <div class="head-img" @click.stop="goProFile(a.to_user_id)">
            <img :src="a.name.header_photo" alt="">
          </div>
          <div class="comment">
            <div class="reply">
              <span>
                <span class="name">{{a.name.user_name}}</span><span class="idea">{{a.message_title}}</span>
              </span>
              <span class="date">{{a.publish_time}}</span>
            </div>
            <div class="comment-idea">
              <p>
                {{a.message_desc}}
              </p>
            </div>
            <div class="distr">
              <p>
                {{a.content.content}}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <loading :loading="disabled && for_list.length < pageInfo.page_total"></loading>
  </div>
</template>
<script>
import NoticeApi from '../../../api/Notice.js';
import {Loading} from '../../../components/public';
export default {
  name: 'NewsList',
  components: {
    Loading
  },
  data(){
    return {
      for_list: [], // ETC 信息列表
      disabled: false, // ETC 加载开关
      pageInfo: { // ETC 页码信息
        current_page: 0,
        page_total: 0
      }
    };
  },
  methods: {
    goIdeaDetail(user_id){
      this.$router.push({name: 'IdeaDetail', params: {id: user_id}});
    },
    goProFile(user_id){
      this.$router.push({name: 'Profile', params: {id: user_id}});
    },
    // 触底刷新
    infinite() {
      let that = this;
      that.disabled = true;
      that.getIdeaListData(++that.pageInfo.current_page).then(() => {
        // 触底判断
        that.disabled = false;
        if(this.for_list.length === that.pageInfo.page_total){
          that.disabled = true;
        }
      });
    },
    async getIdeaListData(curpage){
      return await NoticeApi().getMessageList({waitRead: 1, pages: 7, curPage: curpage}).then(res => {
        let for_list = res.data.list;
        for (let i = 0; i < for_list.length; i++) {
          for_list[i].name = res.data.users_info[res.data.list[i].push_user_id];
          let content = res.data.origin_msg[res.data.list[i].business_type];
          for_list[i].content = content[res.data.list[i].business_id];
        }
        this.pageInfo.page_total = res.data.total;
        this.for_list = this.for_list.concat(for_list);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.new-list{
  margin-top: 5px;
  width: 100%;
  background-color: white;
  text-align: left;
  .new-box{
    width: 1160px;
    margin: auto;
  }
  .warn{
    width: 750px;
    padding: 20px 0;
    font-size:38px;
    font-family:PingFangSC-Medium;
    font-weight:500;
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
          width: 48px;
          height: 48px;
          border-radius: 50%;
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
          font-size:16px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color: #303133;
          .name{
            color:rgba(85,129,199,1);
          }
          .date{
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(144,147,153,1);
          }
        }
        .comment-idea{
          margin-top: 9px;
          p{
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(96,98,102,1);
            line-height:22px;
          }
        }
        .distr{
          width: 652px;
          margin-top: 13px;
          padding: 14px 17px;
          background:rgba(246,246,246,1);
          p{
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(96,98,102,1);
            line-height:25px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
