<template>
  <div class="showImage">
    <el-dialog @close="closeDialog" :visible.sync="image_popup.status">
        <el-carousel :initial-index="image_popup.index" indicator-position="outside"
          v-if="image_popup.status" :autoplay="false" trigger="click"
          :arrow="(image_popup.source.entity_photo_hashes ? image_popup.source.entity_photo_hashes : image_popup.source).length === 1 ? 'never' : 'hover'"
          @change="imgChange">
          <el-carousel-item v-for="(item, index) in (image_popup.source.entity_photos ? (image_popup.source.entity_photos.length ? image_popup.source.entity_photos : (image_popup.source.entity_extra.from.entity_photos ? image_popup.source.entity_extra.from.entity_photos : [])) : image_popup.source)" :key="index">
            <a :href="item | imageSize('source')" target="_blank"><img :src="item | imageSize('origin')" alt=""></a>
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
        position:absolute;
        top:40%;
        left:50%;
        margin: 0 !important;
        transform:translate(-50%, -40%);
        @media screen and (min-width: 1000px){
          margin-top: 2%!important;
          width:80%;
        }
        @media screen and (max-width: 999px){
          margin-top: 10%!important;
          width: 90%;
        }
        box-shadow: none;
        background-color: transparent;
      }
      z-index: 3000 !important;
      .el-dialog__header{
        text-align: left;
        .el-dialog__headerbtn {
          top: 3px;
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
        @media screen and (min-width: 750px){
          height: 800px;
        }
        .el-carousel__arrow {
          background-color: rgba(31,45,61,0.3);
        }
        .el-carousel__item{
          display: flex;
          display:-webkit-box;
          display:-ms-flexbox;
          display:flex-box;
          display:flex;
          -webkit-box-align:center;
          -ms-flex-align:center;
          align-items:center;
          -webkit-box-pack:center;
          -ms-flex-pack:center;
          justify-content:center;
          text-align:center;
          img{
            cursor:zoom-in;
            max-width: 1024px;
            @media screen and (max-width: 750px){
              width: 90%;
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
