<template>
  <div class="idea-list">
    <div class="idea-write">
      <div class="write-btn">
        <span>提出你的想法</span>
        <i class="iconfont icon-qianming"></i>
      </div>
    </div>
    <public-list></public-list>
    <!-- <CommentPublish></CommentPublish> -->
  </div>
</template>
<script>
  import systemApi from '../../../api/System';
  import {PublicList} from '../../../components/business/index.js';

  export default {
    components: {
      PublicList
    },
    created() {
      systemApi().getGlobalInfo().then(res => {
        console.log(res);
      });
    }
  };
</script>
<style lang="scss" scoped>
  .idea-list {
    width: 1040px;
    margin: auto;
    padding-top: 12px;
    .idea-write {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width:750px;
      height:56px;
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
      .write-btn {
        display: flex;
        align-items: center;
        margin-right: 58px;
        cursor: pointer;
        span {
          font-size:18px;
          font-weight:400;
          color:rgba(255,118,118,1);
        }
        i {
          font-size: 24px;
          color:rgba(255,118,118,1);
        }
      }
    }
  }
</style>


