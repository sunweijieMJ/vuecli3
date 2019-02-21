<template>
  <div class="upload-photo custom-dialog" v-if="upload_photo.status">
    <el-dialog width="700px" @close="closeDialog" :visible.sync="upload_photo.status">
      <h2 class="header" slot="title">修改头像</h2>
      <div class="main">
        <div class="container">
          <canvas width="360" height="360" @mousedown.stop.prevent="mousedown">
            <p>您的系统不支持此程序!</p>
          </canvas>
        </div>
        <div class="btn">
          <el-slider v-model="photo_size" :min="1" :step="0.1" :max="2" :format-tooltip="formatTooltip"></el-slider>
        </div>
      </div>
      <div class="footer" slot="footer">
        <span>重新上传</span>
        <el-button class="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  export default {
    data() {
      return {
        photo_size: 0,
        canvas: null,
        context: null,
        start: 0,
        end: 0,
        img_width: 0,
        img_height: 0
      };
    },
    methods: {
      formatTooltip(val) {
        return val;
      },
      mousedown(e) {
        let that = this;
        const originX = e.clientX;
        const originY = e.clientY;

        const disX = originX - that.start;
        const disY = originY - that.end;

        let new_start = e.clientX - disX;
        let new_end = e.clientY - disY;
        const maxX = new_start + that.img_width;
        const maxY = new_end + that.img_height;
        that.canvas.onmousemove = (e) => {
          if(new_start <= 54 && new_end <= 54 && maxX >= 360 - 54 && maxY >= 360 - 54) {
            new_start = e.clientX - disX;
            new_end = e.clientY - disY;
            that.drawImage(new_start, new_end);
          }
        };
        that.canvas.onmouseup = () => {
          that.canvas.onmousemove = null;
          that.canvas.onmouseup = null;
        };
      },
      drawImage(start, end) {
        let that = this;
        that.canvas = this.$el.querySelector('canvas');
        that.context = that.canvas.getContext('2d');
        const img = new Image();
        img.src = that.upload_photo.source;
        // 画布构图
        img.onload = () => {
          that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
          that.context.save();


          that.img_width = img.width;
          that.img_height = img.height;
          const ratio = that.img_width / that.img_height;
          if(that.img_width > that.img_height) {
            that.img_width = that.canvas.width;
            that.img_height = that.img_width / ratio;
          } else {
            that.img_height = that.canvas.height;
            that.img_width = that.img_height * ratio;
          }
          that.img_width = that.img_width * that.photo_size;
          that.img_height = that.img_height * that.photo_size;
          that.start = start || (that.canvas.width / 2) - ((that.img_width) / 2);
          that.end = end || (that.canvas.height / 2) - ((that.img_height) / 2);

          that.context.drawImage(img, that.start, that.end, that.img_width, that.img_height);
          that.context.fillStyle = 'rgba(246,246,246,0.8)';
          that.context.fillRect(0, 0, that.canvas.width, that.canvas.height);
          that.context.rect(54, 54, 250, 250);
          that.context.clip();
          that.context.drawImage(img, that.start, that.end, that.img_width, that.img_height);
          that.context.restore();
        };
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setUploadPhoto', {status: false, source: null});
      }
    },
    computed: mapState({
      upload_photo: store => store.upload_photo
    }),
    watch: {
      'upload_photo.status'(cur) {
        if(!cur) return;
        let that = this;
        that.$nextTick(() => {
          that.drawImage();
        });
      },
      photo_size(cur) {
        if(cur === 1) return;
        this.drawImage();
      }
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 24px;

  .upload-photo {
    .main {
      .container {
        width: 360px;
        height: 360px;
        margin: $up-down auto;
        canvas {
          width: 360px;
          height: 360px;
          cursor: grab;
        }
      }
      .btn {
        margin: $up-down 120px;
      }
    }

    .el-dialog__wrapper {
      .el-dialog__header {
        padding: $up-down $left-right;
        border-bottom: 1px solid $lineColor;
        .header {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 30px;
          color: $themeColor;
        }
      }
      .el-dialog__footer {
        border-top: 1px solid $lineColor;
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          >span {
            font-size: $h2Font;
            font-weight: $h1Weight;
            color: $h1Color;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
