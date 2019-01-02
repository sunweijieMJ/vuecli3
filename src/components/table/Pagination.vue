<template>
  <el-pagination
    class="pagination"
    :page-size="15"
    :current-page="pageInfo.current_page"
    @current-change="handleCurrentChange"
    layout="prev,pager,next"
    :total="pageInfo.page_total">
  </el-pagination>
</template>
<script>
  export default {
    props: {
      pageInfo: {
        type: Object,
        default: null,
        required: true
      }
    },
    methods: {
      // 分页
      handleCurrentChange(page) {
        this.$emit('pageChange', page);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .pagination{
    margin: 20px 0;
  }
</style>
