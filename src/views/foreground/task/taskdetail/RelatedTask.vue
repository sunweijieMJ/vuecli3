<template>
  <div class="task-right">
    <div class="header">
      <div class="title">关联task</div>
      <div class="add" @click="$store.dispatch('setTaskPublish', {status: true, type: 'create', parent: keyTask})">
        <span class="iconfont icon-btn_add_kt1"></span><span>添加</span>
      </div>
    </div>
    <ul>
      <li v-for="(rt, rtindex) in task_list" :key="rtindex">
        <span class="related-t">T</span>
        <span class="con">{{rt.task_name}}</span>
        <img :src="rt.user_info.header_photo" alt="">
      </li>
    </ul>
    <ul class="null" v-if="task_list.length === 0">
      <li>当前没有关联的Task</li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'RelatedTask',
  props: ['task_list', 'keyTask'],
  data(){
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.task-right{
  width: 400px;
  .header{
    padding: 21px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:18px;
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
        color: #948BEA;
        font-size: 20px;
        margin-right: 6px;
      }
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
