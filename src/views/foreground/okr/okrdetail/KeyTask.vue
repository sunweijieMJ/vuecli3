<template>
  <div class="kt">
    <div class="kt-task">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div>
              <i class="header-icon el-icon-info"></i><span>KT</span><span>UGS完成A系统，B系统，C系统和D系统</span>
              <div>
                <div>
                  <span>2019/01/30-2019/01/28</span>
                </div>
                <div>
                  <img src="" alt="">
                  <span>TO: Paddy</span>
                </div>
              </div>
            </div>
          </template>
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  name: 'keyTask',
  data(){
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.kt{
  .kt-task{
    background-color: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:4px;
    padding: 25px 53px; 
  }
}
</style>
<style lang="scss">
.kt{
  .el-collapse{
    border: none;
    .el-collapse-item{
      .el-collapse-item__header{
        display: flex disabled;
        line-height: normal;
        border-bottom: none;
        .el-icon-arrow-right{
          display: none;
        }
      }
    }
  }
}
</style>
