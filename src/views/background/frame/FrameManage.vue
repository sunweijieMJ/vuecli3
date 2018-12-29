<template>
  <div class="frame-manage">
    <div class="header">组织架构</div>
    <div class="statistics">
      <div class="st-header">
        <span>共15个部门，150个小伙伴</span>
        <span>新增</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FrameManage',
  data(){
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.frame-manage{
  .header{
    font-size:23px;
    font-weight:500;
    color:rgba(255,118,120,1);
    padding: 12px 79px;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
  }
  .statistics{
    .st-header{
      padding: 20px 79px;
    }
  }
}
</style>
