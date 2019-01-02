<template>
  <div class="idea-stick">
    <stick-list :list="stick_list" @cancelSuccess="cancelSuccess"></stick-list>
  </div>
</template>
<script>
  import IdeaApi from '../../../../api/Idea.js';
  import {StickList} from '../../../../components/table';

  export default {
    components: {StickList},
    data() {
      return {
        stick_list: []
      };
    },
    created() {
      this.getIdeaList(1);
    },
    methods: {
      // 想法列表
      getIdeaList(qTop) {
        let that = this;
        IdeaApi().getIdeaList({qTop}).then(res => {
          const user_infos = res.data.user_infos;
          const self_zan = res.data.self_zan;
          const stick_list = res.data.list;
          // 数据整理
          for(let i = 0, ILEN = stick_list.length; i < ILEN; i++) {
            // 点赞整理
            stick_list[i].self_zan = self_zan[stick_list[i].thinks_id];
            // 用户整理
            stick_list[i].user_info = user_infos[stick_list[i].user_id];
            if(!stick_list[i].replys) continue;
            for(let j = 0, JLEN = stick_list[i].replys.length; j < JLEN; j++) {
              stick_list[i].replys[j].user_info = user_infos[stick_list[i].replys[j].user_id];
            }
          }

          that.stick_list = stick_list;
        });
      },
      // 取消置顶回调
      cancelSuccess() {

      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../../assets/scss/_base.scss';

  .idea-stick {
    box-sizing: border-box;
    height: 100%;
    padding: 12px 78px;
    background-color: $backColor;
  }
</style>

