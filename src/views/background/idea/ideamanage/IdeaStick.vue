<template>
  <div class="idea-stick">
    <stick-list :list="stick_list" @move="move" @cancelSuccess="cancelSuccess"></stick-list>
    <a href="javascript:;" @click="orderStick">保存</a>
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
      this.getIdeaList();
    },
    methods: {
      // 想法列表
      getIdeaList() {
        let that = this;
        IdeaApi().getIdeaList({qTop: 1}).then(res => {
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
      // 上下排序
      move(data) {
        let [that, index] = [this, 0];
        for(let i = 0, LEN = that.stick_list.length; i < LEN; i++) {
          if(that.stick_list[i].thinks_id === data.id) index = i;
        }
        switch (data.type) {
          case 'up':
            if(index === 0) {
              that.$message({message: '已经是第一个了', type: 'warning'});
              return;
            }
            this.stick_list[index] = this.stick_list.splice(index - 1, 1, this.stick_list[index])[0];
            break;
          case 'down':
            if(index === that.stick_list.length - 1) {
              that.$message({message: '已经是最后一个了', type: 'warning'});
              return;
            }
            this.stick_list[index] = this.stick_list.splice(index + 1, 1, this.stick_list[index])[0];
            break;
          default:
            break;
        }
      },
      // 保存当前排序
      orderStick() {
        let [that, orderlist] = [this, []];
        for(let i = 0, LEN = that.stick_list.length; i < LEN; i++) {
          orderlist.push(that.stick_list[i].thinks_id);
        }
        IdeaApi().orderStick({orderlist}).then(res => {
          console.log(res);
        });
      },
      // 取消置顶回调
      cancelSuccess() {
        this.getIdeaList();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .idea-stick {
    box-sizing: border-box;
    height: 100%;
    padding: 12px 78px;
    background-color: $backColor;
  }
</style>

