<template>
  <div class="comment-publish">
    <div class="hello">
      <div class="new-idea">新想法 <div class="shut" @click="shutDown"><span class="iconfont icon-icon-"></span></div></div>
      <div class="comment-idea">
        <textarea name="" id="text" cols="30" rows="10"
          @blur="dealContent"
          @keyup="keyCode($event)"
          @input="content"
          @click.stop="curse" placeholder="分享你得想法吧"></textarea>
        <ul v-if="show && friend.list && friend.list.length" :style="at_style">
          <li v-for="(a, index) in friend.list" :key="index" @click.stop="insertAtCursor(a.user_name + ' ')">{{a.user_name}}</li>
        </ul>
        <ul v-if="jshow" :style="at_style">
          <li>创建话题#PGS上线啦#</li>
          <li v-for="(tpic, index) in topic.list" :key="index" @click.stop="insertAtCursor(tpic.topic_title + '# ')">{{tpic.topic_title}}</li>
        </ul>
      </div>
      <div class="upload-imgs" v-if="!upLoad_state">
        <span @click="viewUploadImg" class="u-i-i">
          <i class="iconfont icon-tupian" style="font-size: 22px;"></i>
          <span>上传图片</span>
        </span>
        <span class="submit" @click="ideaSubmit">发布</span>
      </div>
      <div class="add-img" v-if="upLoad_state">
        <div class="quantity">
          <i class="iconfont icon-tupian" style="font-size: 22px;"></i>
          <span>上传图片</span>
          <span>({{hash_num.length}}/9)</span>
        </div>
        <div class="image">
          <upLoadImg :multiple="true" :limint="9"
            :disabled="false"
            @handleSuccess="handleSuccess"
            @handleRemove="handleRemove"
            :hashNum="hash_num.length"
            ></upLoadImg>
        </div>
        <div class="raise" @click="ideaSubmit">
          <span class="submit">发布</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import IdeaApi from '../../api/Idea.js';
import UserApi from '../../api/User.js';
import upLoadImg from '../upload/UploadImg';
export default {
  name: 'commentpublish',
  components: {upLoadImg},
  data() {
    return {
      upLoad_state: false,
      publish_state: true, // ETC 发布防抖
      friend: '好友列表',
      topic: '话题列表',
      at_style: {
        position: 'absolute',
        top: '',
        left: ''
      },
      show: false, // ETC 用户列表状态
      jshow: false, // ETC 话题列表状态

      hash_num: [], // ETC 记录hash数
      At_anchor: '', // ETC 保存@出现的节点位置
      content_end: '', // ETC 保存@输入内容的末尾节点位置

      topic_anchor: '', // ETC 保存话题#出现的节点位置
      string_length: 0, // ETC 保存搜索的字符长度
      thinksPhotos: '' // ETC 图片Hash
    };
  },
  methods: {
    viewUploadImg(){
      this.upLoad_state = true;
    },
    // 关闭弹层
    shutDown(){
      this.$emit('shutDown', false);
    },
    // 失去焦点事件
    dealContent(){
      // this.show = false;
    },
    // 计算镜像光标位置
    mirrorCompute(){
      let textarea = document.getElementById('text');
      // 光标位置
      let end = textarea.selectionEnd;
      // 光标前的内容
      let beforeText = textarea.value.slice(0, end);
      // 光标后的内容
      let afterText = textarea.value.slice(end);
      // 对影响 UI 的特殊元素编码
      let escape = function(textarea) {
        return textarea.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br>');
      };
      // 创建镜像内容，复制样式
      let mirror = '<p style="font-size:22px;font-family:monospace; line-height: normal;" id="' + 'text' + '">' +
      escape(beforeText) +
      '<span id="cursor">|</span>' +
      escape(afterText) +
      '</p>';
      // 添加到 textarea 同级，注意设置定位及 zIndex，使两个元素重合
      textarea.insertAdjacentHTML('afterend', mirror);
      // 通过镜像元素中的假光标占位元素获取像素位置
      let cursor = document.getElementById('cursor');
      // 获取页面元素位置
      let finaly = cursor.getBoundingClientRect(); // ETC { width, height, top, right, bottom, right }
      this.at_style.top = (finaly.bottom - 315) + 'px';
      this.at_style.left = (finaly.x - 6) + 'px';
    },
    // textarea 内容改变触发
    content(event){
      // 获取文本内容
      let text = document.getElementById('text').value;
      // 得到文本长度
      this.content_end = text.length;
      // 光标前一位的字符
      let value = text.charAt(text.length - 1);
      if(value === '@'){
        // 置空话题#出现的节点位置
        this.topic_anchor = '';
        // @符出现的节点位置
        this.At_anchor = text.length;
        this.mirrorCompute();
        this.show = true;
      }else{
        this.show = false;
      }

      if(this.At_anchor){
        // 搜索用户的字符 用户关键字截取
        let final_content = text.substring(this.At_anchor + 1, this.content_end);
        this.string_length = final_content.length + 1; // ETC 搜索的字符长度
        let noneArr = [];
        // 分解字符
        for (let j = 0; j < final_content.length; j++) {
          noneArr.push(final_content[j]);
        }
        // 判断@后搜索字符是否包含 空 字符
        if(noneArr.length && noneArr.indexOf(' ') === -1){
          this.show = true;
          this.searchData(final_content);
        }else if(!noneArr.length){
          this.searchData();
        }else{
          this.show = false;
          this.At_anchor = '';
          this.content_end = '';
        }
      }

      if(value === '#'){
        // 置空@节点位置
        this.At_anchor = '';
        this.topic_anchor = text.length; // ETC 话题#首次出现的节点
        this.jshow = true;
        this.mirrorCompute();
      }else{
        this.jshow = false;
      }
      if(this.topic_anchor){
        // 搜索话题关键字截取
        let final_content = text.substring(this.topic_anchor + 1, this.content_end);
        this.string_length = final_content.length + 1; // ETC 搜索的字符长度
        let noneArr = [];
        // 拆分话题字符
        for (let j = 0; j < final_content.length; j++) {
          noneArr.push(final_content[j]);
        }
        // 判断话题搜索字符中是否包含 # 字符
        if(noneArr.length && noneArr.indexOf('#') === -1){
          this.jshow = true;
          this.searchTopic(final_content);
        }else if(!noneArr.length){
          this.searchTopic();
        }else{
          this.jshow = false;
          this.topic_anchor = '';
          this.content_end = '';
        }
      }
    },
    // 用户列表搜索
    searchData(key){
      UserApi().getAdminList({keyword: key ? key : ''}).then(res => {
        console.log(res);
        this.friend = res.data;
      });
      console.log('搜索数据', key);
    },
    // 话题列表搜索
    searchTopic(key){
      IdeaApi().getTopicList({keyword: key ? key : ''}).then(res => {
        console.log('话题数据', res);
        this.topic = res.data;
      });
    },
    // 鼠标光标
    curse(e){
      let eleP = e.target.parentNode; // ETC 获取父级元素
      let pos = 0;
      pos = this.getPosition(e.target);
      let spanEle = (eleP.childNodes)[1];
      spanEle.innerText = pos;
    },
    // 获取光标位置
    getPosition(element) {
      let cursorPos = 0;
      if (document.selection) { // ETC IE
        let selectRange = document.selection.createRange();
        selectRange.moveStart('character', -element.value.length);
        cursorPos = selectRange.text.length;
      } else if (element.selectionStart || element.selectionStart == '0') {
        cursorPos = element.selectionStart;
      }
      let text = document.getElementById('text').value;
      let value = text.charAt(cursorPos - 1);
      if(value === '@'){
        /*
         * this.topic_anchor = '';
         * this.At_anchor = text.length;
         */
        this.mirrorCompute();
        this.show = true;
      }else{
        this.show = false;
      }
      if(value === '#'){
        /*
         * this.At_anchor = '';
         * this.topic_anchor = text.length;
         */
        this.jshow = true;
        this.mirrorCompute();
      }else{
        this.jshow = false;
      }
      return cursorPos;
    },
    keyCode(e){
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40){
        this.curse(e);
      }
    },
    // 插入文本
    insertAtCursor(myValue) {
      // IE 浏览器  获取当前输入框dom元素
      let myField = document.getElementById('text');
      if (document.selection) {
        myField.focus();
        let sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
      }else if (myField.selectionStart || myField.selectionStart == '0') { // ETC FireFox、Chrome等
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        // 保存滚动条
        if(this.string_length > 1){
          myField.value = myField.value.substring(0, startPos - this.string_length) + myValue + myField.value.substring(endPos, myField.value.length);
          myField.selectionStart = startPos - this.string_length + myValue.length;
          myField.selectionEnd = startPos - this.string_length + myValue.length;
        }else{
          myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
          myField.selectionStart = startPos + myValue.length;
          myField.selectionEnd = startPos + myValue.length;
        }
        myField.focus();
      } else {
        myField.value += myValue;
        myField.focus();
      }
      this.show = false;
      this.jshow = false;
      this.string_length = 0;
    },
    // 图片上传成功的函数
    handleSuccess(response){
      let res = response;
      this.imageDeal(res);
    },
    // 删除图片的函数
    handleRemove(file){
      this.imageDeal(file);
    },
    // name处理
    urlName(url){
      let img_type = '';
      let img_name = '';
      let num = url.lastIndexOf('.');
      img_name = url.substring(0, num);
      img_type = url.substring(num + 1, url.length);
      return '|' + img_name + '|' + img_type;
    },
    // URL处理
    imageDeal(img){
      let arr = '';
      let newarr = [];
      if(img && img.fileList.length){
        for (let i = 0; i < img.fileList.length; i++) {
          if(!arr){
            arr = img.fileList[i].hash + this.urlName(img.origin[i].name);
          }else{
            arr += ',' + img.fileList[i].hash + this.urlName(img.origin[i].name);
          }
          newarr.push(img.fileList[i].hash);
        }
      }
      this.thinksPhotos = arr;
      this.hash_num = newarr;
    },
    // 发布新想法
    ideaSubmit(){
      let text = document.getElementById('text').value;
      this.publish_state = false;
      if((text || this.thinksPhotos) && !this.publish_state){
        IdeaApi().PublishFor({content: text ? text : '', thinksPhotos: this.thinksPhotos ? this.thinksPhotos : ''}).then(res => {
          if(res.status){
            this.$message({message: '发布成功', type: 'success', duration: 1000});
            setTimeout(() => {
              this.$emit('shutDown', false);
            }, 1000);
          }
        });
      }else{
        this.$message({message: '请填写您想要的发布内容', type: 'warning'});
      }
      setTimeout(() => {
        this.publish_state = true;
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.comment-publish{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  .hello{
    width: 687px;
    margin: auto;
    margin-top: 94px;
    text-align: left;
    font-size: 12px;
    letter-spacing: normal;
    background-color: white;
    .new-idea{
      padding: 27px 37px;
      font-size:22px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(255,118,120,1);
      border-bottom:1px solid rgba(246,246,246,1);
      position: relative;
      .shut{
        .iconfont{
          font-size: 28px;
        }
      }
    }
    .comment-idea{
      padding: 0px 41px;
      z-index: 1001;
      width: 604px;
      height: 337px;
      overflow: hidden;
      #text {
        margin-top: 22px;
        width: 604px;
        height: 315px;
        box-sizing: border-box;
        font-family: monospace;
        // border: 1px solid orange;
        font-size: 22px;
        border: none;
        resize: none;
      }
      textarea::-webkit-input-placeholder{
        color:#C0C4CC;
      }
      textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#C0C4CC;
      }
      textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#C0C4CC;
      }
      textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
        color:#C0C4CC;
      }
    }
    .upload-imgs{
      margin-top: 22px;
      border-top:1px solid rgba(246,246,246,1);
      padding: 24px 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .u-i-i{
        cursor: pointer;
        font-size: 16px;
        color:rgba(48,49,51,1);
        display: flex;
        align-items: center;
        span{
          margin-left: 8px;
        }
      }
      .submit{
        width: 90px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
        border-radius:20px;
        font-weight:500;
        font-size: 18px;
        color:rgba(255,255,255,1);
      }
    }
    .add-img{
      color: red;
      margin-top: 22px;
      border-top:1px solid rgba(246,246,246,1);
      padding: 24px 38px;
      font-size:16px;
      font-weight:400;
      color:rgba(48,49,51,1);
      .quantity{
        display: flex;
        align-items: center;
        span{
          margin-left: 8px;
        }
      }
      .image{
        height: 64px;
        width: 100%;
      }
      .raise{
        margin-top: 24px;
        display: flex;
        justify-content: flex-end;
        .submit{
          width: 90px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
          border-radius:20px;
          font-weight:500;
          font-size: 18px;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  .shut{
    cursor: pointer;
    position: absolute;
    top: -10px;
    right: -40px;
    color: white;
    font-size: 30px;
  }
  ul{
    z-index: 1002;
    border: 1px solid #eee;
    margin: auto;
    padding: 0 0;
    width: 300px;
  }
  li{
    list-style: none;
    padding: 13px 15px;
    border-top: 1px solid #eee;
    font-size:16px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(48,49,51,1);
    background-color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  li:first-of-type{
    border-top:none;
  }
}
</style>
