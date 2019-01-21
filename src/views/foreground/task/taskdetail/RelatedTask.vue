<template>
  <div class="task-right">
    <div class="header">
      <div class="title">关联task</div>
      <div class="add">
        <span class="iconfont icon-tianjia1"></span><span>添加</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RelatedTask',
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

}
</style>
