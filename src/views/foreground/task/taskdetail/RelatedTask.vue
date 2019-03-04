<template>
  <div class="task-right">
    <div class="header">
      <div class="title">关联task</div>
      <!-- <div class="add" @click="Judge()" v-if="keyTask && keyTask.is_parter"> -->
      <div class="add" @click="Judge()" v-if="0">
        <span class="iconfont icon-btn_add_kt1"></span><span>添加</span>
      </div>
    </div>
    <ul>
      <li v-for="(rt, rtindex) in task_list" :key="rtindex">
        <span class="related-t">T</span>
        <span class="con" @click.stop="gotTaskDetail(rt.task_id)">{{rt.task_name}}</span>
        <!-- <img :src="rt.user_info.header_photo" alt=""> -->
        <el-popover
          placement="bottom"
          trigger="hover"
          class="head-img">
          <img slot="reference" style="cursor: pointer;" v-if="rt.user_info" :src="rt.user_info.header_photo" alt="" @click.stop="goPersonal(rt.user_info.user_id)">
          <user-popover :userinfo="rt.user_info"></user-popover>
        </el-popover>
      </li>
    </ul>
    <ul class="null" v-if="task_list.length === 0">
      <li>当前没有关联的Task</li>
    </ul>
  </div>
</template>
<script>
import UserPopover from '../../../../components/popup/UserPopover';
export default {
  name: 'RelatedTask',
  props: ['task_list', 'keyTask'],
  components: {
    UserPopover
  },
  data(){
    return {

    };
  },
  methods: {
    goPersonal(user_id){
      window.open(`/foreground/fore_mine/profile/${user_id}`, '_blank');
    },
    Judge(){
      this.$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: this.keyTask});
    },
    gotTaskDetail(task_id){
      window.open(`/foreground/fore_task/task_detail/${task_id}`, '_blank');
    }
  }
};
</script>
<style lang="scss" scoped>
.task-right{
  width: 440px;
  .header{
    padding: 21px 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $h2Font;
    font-weight:500;
    .title{
      color: #909399;
      line-height:25px;
    }
    .add{
      cursor: pointer;
      color: #303133;
      display: flex;
      align-items: center;
      .iconfont{
        cursor: pointer;
        color: #948BEA;
        font-size: 20px;
        margin-right: 6px;
      }
    }
    .add:hover{
      color: #948BEA;
    }
  }
  ul{
    background: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:2px;
    li{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 15px 22px;
      border-bottom: 1px solid #f6f6f6;
      .related-t{
        display: inline-block;
        width:32px;
        height:16px;
        background:#948BEA;
        border-radius:8px;
        text-align: center;
        line-height: 16px;
        color: #FFFFFF;
      }
      .con{
        cursor: pointer;
        @extend %textlight;
        margin-left: 8px;
        margin-right: 27px;
        width: 258px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      img{
        width: 31px;
        height: 31px;
        border-radius: 50px;
      }
    }
  }
}
</style>
