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
          <el-slider v-model="photo_size" :format-tooltip="formatTooltip"></el-slider>
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
        context: null
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

        that.canvas.onmousemove = (e) => {
          this.dragImage(e, originX, originY);
        };
        that.canvas.onmouseup = () => {
          that.canvas.onmousemove = null;
          that.canvas.onmouseup = null;
        };
      },
      dragImage(e) {
        let that = this;
        const toLeft = e.offsetX;
        const toTop = e.offsetY;
        that.drawImage(toLeft - ((that.canvas.width / 100) * (that.photo_size)), toTop - ((that.canvas.height / 100) * (that.photo_size)));
      },
      drawImage(start, end) {
        let that = this;
        that.canvas = this.$el.querySelector('canvas');
        that.context = that.canvas.getContext('2d');
        const img = new Image();

        img.src = that.upload_photo.source;
        img.onload = () => {
          that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
          that.context.save();
          const multiple = that.canvas.width / 100;
          start = start || (that.canvas.width / 2) - (((that.photo_size * multiple) + 250) / 2);
          end = end || (that.canvas.height / 2) - (((that.photo_size * multiple) + 250) / 2);

          that.context.drawImage(img, start, end, ((that.photo_size * multiple) + 250), ((that.photo_size * multiple) + 250));
          that.context.fillStyle = 'rgba(246,246,246,0.8)';
          that.context.fillRect(0, 0, that.canvas.width, that.canvas.height);
          that.context.rect(54, 54, 250, 250);
          that.context.clip();
          that.context.drawImage(img, start, end, ((that.photo_size * multiple) + 250), ((that.photo_size * multiple) + 250));
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
        if(!cur) return;
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
