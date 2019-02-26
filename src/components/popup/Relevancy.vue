<template>
  <div class="task-relevancy" v-if="object_ids.length">
    <h4>关联</h4>
    <div class="content">
      <div class="list">
        <el-tag v-for="(item, index) in object_ids" :key="index" @close="closeTag(index)">
          <p>
            <i class="okr" v-if="item.obj_id">{{item.okr_type_name}}</i>
            <i v-else>KT</i>
            <span>{{item.task_name || item.objective_name | readMore(15, '...')}}</span>
          </p>
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['object_ids'],
    methods: {
      // 关闭标签
      closeTag(index) {
        this.$emit('closeTag', index);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .task-relevancy {
    display: flex;
    align-items: center;
    h4 {
      margin-bottom: 12px;
      width: 46px;
      font-size: $h3Color;
      font-weight: 400;
      color: $h2Color;
    }
    .content {
      flex: 1;
      margin-left: 37px;
      .list {
        display: flex;
        flex-wrap: wrap;
        .el-tag {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 36px;
          padding: 0 20px;
          margin: 0 12px 12px 0;
          border-radius: 20px;
          background-color: $backColor;
          font-size: $h3Font;
          color: $h1Color;
          border: none;
          p {
            display: flex;
            align-items: center;
            i {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 36px;
              height: 16px;
              margin-right: 8px;
              border-radius: 8px;
              background-color: $purple;
              font-size: $h4Font;
              font-style: normal;
              color: #fff;
              &.okr {
                background-color: $green;
              }
            }
          }
          .el-tag__close {
            top: 0;
            color: $linkBlue;
            &:hover {
              background-color: $themeColor;
            }
          }
        }
      }
    }
  }
</style>
