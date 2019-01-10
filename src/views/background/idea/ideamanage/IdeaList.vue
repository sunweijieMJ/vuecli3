<template>
  <div class="idea-list-manage">
    <div class="header">
      <div class="form">
        <el-input class="inp" v-model="idea_id" placeholder="输入内容ID"></el-input>
        <el-button @click="getIdeaList({keyword: idea_id})">搜索</el-button>
        <el-button @click="resetData">重置</el-button>
      </div>
    </div>
    <div class="list">
      <idea-list :list="idea_list" @stickSuccess="updateList" @deleteSuccess="updateList"></idea-list>
      <pagination :pageInfo="pageInfo" @pageChange="pageChange"></pagination>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../../../api/Idea.js';
  import {IdeaList, Pagination} from '../../../../components/table';

  export default {
    components: {IdeaList, Pagination},
    data() {
      return {
        idea_id: '',
        idea_list: [],
        pageInfo: { // ETC 页码信息
          current_page: 0,
          page_total: 0
        }
      };
    },
    created() {
      let that = this;
      that.getIdeaList({curPage: ++that.pageInfo.current_page});
    },
    methods: {
      // 想法列表
      getIdeaList({curPage, keyword}) {
        let that = this;
        IdeaApi().getIdeaList({curPage, keyword}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const idea_list = res.data.list;
          that.pageInfo.page_total = res.data.total;
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

          that.idea_list = idea_list;
        });
      },
      // 更新列表
      updateList(thinksId) {
        this.resetData();
        console.log(thinksId)
      },
      // 重置数据
      resetData() {
        let that = this;
        Object.assign(that.$data, that.$options.data());
        that.getIdeaList({curPage: ++that.pageInfo.current_page});
      },
      pageChange(curPage) {
        this.getIdeaList({curPage});
      }
    }
  };
</script>
<style lang="scss">
  @import '../../../../assets/scss/_base.scss';

  .idea-list-manage {
    .header {
      display: flex;
      align-items: center;
      height: 86px;
      padding: 0 76px;
      .form {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        padding: 24px;
        border-bottom: 1px solid $lineColor;
        .el-input, input {
          width: 377px;
          height: 40px;
          background-color: $backColor;
          border-radius: 20px;
        }
        .el-button {
          width: 85px;
          height: 40px;
          padding: 0;
          border: none;
          margin-left: 22px;
          background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          border-radius: 20px;
          font-size: $h2Font;
          line-height: 40px;
          color: #fff;
        }
      }
    }
    .list {
      padding: 0 76px;
    }
  }
</style>
