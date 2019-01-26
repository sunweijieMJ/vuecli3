<template>
  <div class="showImage custom-dialog">
    <el-dialog @close="closeDialog" :visible.sync="image_popup.status">
        <el-carousel :initial-index="image_popup.index" indicator-position="outside"
          v-if="image_popup.status"
          height="500px" :autoplay="false" trigger="click"
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
        box-shadow: none;
        background-color: transparent;
        .el-dialog__header {
          .el-dialog__headerbtn {
            top: 0; right: 0;
            .el-dialog__close {
              font-size: 24px;
              line-height: 30px;
              color: #fff;
            }
          }
        }
        .el-dialog__body {
          .el-carousel__container{
            .el-carousel__item{
              display: flex;
              justify-content: center;
              img{
                height: 500px;
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
    }
  }
</style>
