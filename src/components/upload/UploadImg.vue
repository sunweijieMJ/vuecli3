<template>
  <div class="upload-img">
    <!--
      参数
        indexnum 索引
        showicon {Boolean} 是否显示替换图片按钮
        multiple {Boolean} 是否多是多图上传  默认false (多图上传即可多选)
        name {String | Number} 当前上传组件的唯一标识(一个页面上需要多个组件时比较有用)
        accepts {String} 设置上传文件类型  默认.jpg和.png
        list {Array} 加载时是否已有图片  默认为空
        limint {Number} 图片个数上限
        disabled {Boolean}  是否禁用  默认false
      方法
        handleSuccess 参数(response, file, fileList)  必须  上传成功后(返回当前上传文件和已上传全部文件)
        handleError 参数(response, file, fileList) 上传失败
        handleRemove 参数(file, fileList) 删除文件
      数据格式
        list: [{url: 'xxx', hash: 'xxx', cover: Boolean}]
        cover 封面图 true为封面图(有且只有一个)  false为普通图片
     -->
     <!-- :on-preview="handlePreview" -->
    <el-upload
      class="avatar-uploader"
      :disabled="disabled ? disabled : isDisabled"
      :action="uploadurl"
      :name="'file'"
      list-type="picture-card"
      :show-file-list="multi"
      :multiple="multi"
      :file-list="fileList"
      :accept="accepts ? accepts : accept"
      :limit="limint ? limint : 0"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-error="handleError"
      
      :on-remove="handleRemove"
      >
      <div @mouseover="show = !show" @mouseout="show = !show" v-if="num < 9" class="img-box">
        <!-- <el-button v-if="!multi && imgUrl && showicon && show && !disabled" type='text' class="change">替换图片</el-button> -->
        <img class="img" v-if="!multi && imgUrl" :src="imgUrl" alt="" >
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
    <!-- <el-dialog title="大图" :visible.sync="isDialog">
      <div style="text-align: center;">
        <img v-if="isDialog" :src="imgUrl" :width="400">
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
  import linsign from '../../utils/signFun';
  const root = process.env.VUE_APP_BaseURL;

  export default {
    props: ['multiple', 'accepts', 'list', 'limint', 'disabled', 'name', 'showicon', 'indexnum', 'Ossprivate', 'hashNum'],
    data() {
      return {
        show: false,
        uploadurl: root + '/upload_image?sign=80448712a43f26ee2485ae58dca29d11',
        fileList: [],
        multi: this.multiple ? this.multiple : false, // ETC 是否多图上传
        index: this.name + '' ? this.name : '', // ETC 当前上传文件的唯一标识
        accept: '.jpg,.jpeg,.png,.JPEG', // ETC  默认支持上传格式
        num: 0, // ETC 记录当前已上传文件个数
        isDisabled: false, // ETC 是否禁用（默认不禁用）
        isDialog: false, // ETC 查看大图弹窗
        imgUrl: '' // ETC 查看大图时的url
      };
    },
    methods: {
      // 文件状态改变时(添加，成功，失败)
      handleChange(file, fileList) {
        this.num = fileList.length;
      },
      // 上传文件之前
      beforeUpload(file) {
        if (file.size / 1024 > 20480) { // ETC 20M
          this.$message({message: '请上传小于20M的图片', type: 'warning'});
          return false;
        }
      },
      // 文件超出个数限制时的钩子
      handleExceed() {
        this.$message({message: '最多上传 ' + this.limint + ' 个', type: 'warning'});
      },
      // 文件上传成功
      handleSuccess(response, file, fileList) {
        if (!this.multi) {
          this.imgUrl = response.result.file.image_url;
          this.$emit('handleSuccess', {name: this.index, file: this.setOneData(file), indexnum: this.indexnum, origin: fileList});
        } else {
          this.$emit('handleSuccess', {name: this.index, file: this.setOneData(file), fileList: this.setData(fileList), indexnum: this.indexnum, origin: fileList});
        }
      },
      // 文件上传失败
      handleError(response, file, fileList) {
        this.$emit('handleError', {name: this.index, file: this.setOneData(file), fileList: this.setData(fileList)});
      },
      // 点击已上传文件
      // handlePreview(file) {
      //   this.isDialog = true;
      //   this.imgUrl = file.url;
      // },
      // 删除文件
      handleRemove(file, fileList) {
        this.$emit('handleRemove', {name: this.index, file: this.setOneData(file), fileList: this.setData(fileList), origin: fileList});
      },
      // 处理数据结构 --> 数组
      setData(data) {
        let arr = [];
        data.forEach((item) => {
          arr.push(this.setOneData(item));
        });
        return arr;
      },
      // 处理数据结构 --> 单张图片
      setOneData(data) {
        let obj = {};
        if (data.response) {
          obj.url = data.response.result.file.image_url;
          obj.hash = data.response.result.file.image_hash;
        } else {
          obj.url = data.url;
          obj.hash = data.hash;
        }
        return obj;
      }
    },
    computed: {
      imglist() {
        if (this.list) {
          if (this.multi) {
            this.fileList = this.list;
          } else {
            this.imgUrl = this.list.url;
          }
        }
        return this.list;
      },
      OssprivateCheck() {
        if(this.Ossprivate) {
          let sign = linsign.signHash('/upload_image', {access: 'private'});
          this.uploadurl = root + '/upload_image?access=private&sign=' + sign;
        }
      }
    },
    watch: {
      hashNum(){
        this.num = this.hashNum;
      },
      imglist(val) {
        return val;
      },
      OssprivateCheck(val) {
        this.Ossprivate = val;
      }
    }
  };
</script>
<style lang="scss">
  .avatar-uploader{
    width: 100% !important;
    margin-top: 29px;
    display: flex !important;
    flex-wrap: wrap;
    overflow: hidden;
    ul{
      margin-right: 4px;
      display: flex !important;
      justify-content: flex-start;
    }
  }
  .avatar-uploader, .img-box, .el-upload--picture-card {
    width: 100%;
    box-sizing: border-box;
    li{
      margin-right: 4px !important;
      width: 64px !important;
      height: 64px !important;
      .el-upload-list__item-actions{
        span{
          font-size: 12px !important;
        }
      }
    }
    li:last-of-type{
      margin-right: 0 !important;
    }
    width: 64px;
    height: 64px;
  }
  .avatar-uploader, .img-box{
    width: 64px;
    height: 64px;
    position: relative;
    .el-icon-plus{
      width: 64px;
      line-height: 64px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

</style>
