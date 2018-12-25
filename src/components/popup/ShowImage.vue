<template>
  <div class="showImage">
    <el-dialog title="" width="88%" @close="closeDialog" :visible.sync="image_popup.status">
        <el-carousel :initial-index="image_popup.index" indicator-position="outside"
          v-if="image_popup.status"
          height="400px" :autoplay="false" trigger="click"
          :arrow="(image_popup.source.entity_photo_hashes ? image_popup.source.entity_photo_hashes : image_popup.source).length === 1 ? 'never' : 'hover'"
          @change="imgChange">
          <el-carousel-item v-for="(item, index) in (image_popup.source.entity_photos ? (image_popup.source.entity_photos.length ? image_popup.source.entity_photos : (image_popup.source.entity_extra.from.entity_photos ? image_popup.source.entity_extra.from.entity_photos : [])) : image_popup.source)" :key="index">
            <img :src="(item.img) || item" alt="">
          </el-carousel-item>
        </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        current: 0
      };
    },
    methods: {
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('changeImgPopup', {status: false, source: '', index: 0});
      },
      imgChange(index){
        this.current = index;
      }
    },
    computed: mapState(['image_popup'])
  };
</script>
<style lang="scss">
  .showImage{
    .el-dialog__wrapper{
      z-index: 3000 !important;
      .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn {
          right: -12px;
        }
      }
      .el-dialog__body {
        padding: 0;
        .el-carousel__container {
          .el-carousel__item {
            display: flex;
            justify-content: center;
          }
        }
        .el-carousel__indicators {
          display: none;
        }
      }
    }
  }
</style>
