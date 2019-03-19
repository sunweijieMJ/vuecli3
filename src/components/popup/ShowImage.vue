<template>
  <div class="showImage">
    <el-dialog @close="closeDialog" :visible.sync="image_popup.status">
        <el-carousel :initial-index="image_popup.index" indicator-position="outside"
          v-if="image_popup.status"
          height="800px" :autoplay="false" trigger="click"
          :arrow="(image_popup.source.entity_photo_hashes ? image_popup.source.entity_photo_hashes : image_popup.source).length === 1 ? 'never' : 'hover'"
          @change="imgChange">
          <el-carousel-item v-for="(item, index) in (image_popup.source.entity_photos ? (image_popup.source.entity_photos.length ? image_popup.source.entity_photos : (image_popup.source.entity_extra.from.entity_photos ? image_popup.source.entity_extra.from.entity_photos : [])) : image_popup.source)" :key="index">
            <img :src="item | imageSize('origin')" alt="">
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
      .el-dialog {
        @media screen and (min-width: 1000px){
          margin-top: 2%!important;
        }
        @media screen and (max-width: 999px){
          margin-top: 10%!important;
        }
        box-shadow: none;
        background-color: transparent;
      }
      z-index: 3000 !important;
      .el-dialog__header{
        text-align: left;
        .el-dialog__headerbtn {
          top: 3px;right: -20px;
          .el-dialog__close {
            font-size: 25px;
            color: rgba(255,255,255,0.8);
          }
        }
      }
      .el-dialog__body {
        padding: 0;
      }
      .el-carousel__container{
        .el-carousel__arrow {
          background-color: rgba(31,45,61,0.3);
        }
        .el-carousel__item{
          display: flex;
          justify-content: center;
          img{
            height: 800px;
            @media screen and (max-width: 750px){
              height: 60%;
            }
          }
        }
      }
      .el-carousel__indicators {
        .el-carousel__button{
          background-color: rgba(255,255,255,0.8);
        }
      }
    }
  }
</style>
