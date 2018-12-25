<template>
  <div class="comment-publish">
    <div class="hello">
      <div class="new-idea">新想法 <div class="shut" @click="shutDown">X</div></div>
      <div class="comment-idea">
        <textarea name="" id="text" cols="30" rows="10"
          @blur="dealContent"
          @keyup="keyCode($event)"
          @input="content"
          @click.stop="curse" placeholder="分享你得想法吧"></textarea>
        <ul v-if="show" :style="at_style">
          <li v-for="(a, index) in 5" :key="index" @click.stop="insertAtCursor(friend + ' ')">{{friend}}</li>
        </ul>
        <ul v-if="jshow" :style="at_style">
          <li v-for="(a, index) in 5" :key="index" @click.stop="insertAtCursor(topic + '# ')">{{topic}}</li>
        </ul>
      </div>
      <!-- <div class="upload-imgs">
        <span>
          <i class="iconfont icon-qianming"></i>
          <span>上传图片</span>
        </span>
        <span class="submit">发布</span>
      </div> -->
      <div class="add-img">
        <div class="quantity">
          <i class="iconfont icon-qianming"></i>
          <span>上传图片</span>
          <span>(2/9)</span>
        </div>
        <div class="image">
          <upLoadImg :multiple="true" :limint="9"
            :disabled="false"
            ></upLoadImg>
        </div>
        <div class="raise">
          <span class="submit">发布</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import upLoadImg from '../upload/UploadImg';
export default {
  name: 'commentpublish',
  components: {upLoadImg},
  data() {
    return {
      friend: '好友列表',
      topic: '话题列表',
      at_style: {
        position: 'absolute',
        top: '',
        left: ''
      },
      show: false,
      jshow: false,
      div_caretOffset: ''
    };
  },
  methods: {
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
      console.log('内容：', textarea)
      let beforeText = textarea.value.slice(0, end);
      // 光标后的内容
      let afterText = textarea.value.slice(end);
      // 对影响 UI 的特殊元素编码
      let escape = function(textarea) {
        return textarea.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br>');
      }
      // 创建镜像内容，复制样式
      let mirror = '<p style="font-size:21px;font-family:PingFangSC-Medium;" id="' + 'text' + '">'
      + escape(beforeText)
      + '<span id="cursor">|</span>'
      + escape(afterText)
      + '</p>';
      // 添加到 textarea 同级，注意设置定位及 zIndex，使两个元素重合
      textarea.insertAdjacentHTML('afterend', mirror);
      // 通过镜像元素中的假光标占位元素获取像素位置
      let cursor = document.getElementById('cursor');
      // 获取页面元素位置
      let finaly = cursor.getBoundingClientRect(); // ETC { width, height, top, right, bottom, right }
      this.at_style.top = (finaly.bottom - 317) + 'px';
      this.at_style.left = (finaly.x - 10) + 'px';
    },
    // textarea 内容改变触发
    content(event){
      let text = document.getElementById('text').value;
      let value = text.charAt(text.length - 1);
      if(value === '@'){
        this.mirrorCompute();
        this.show = true;
      }else{
        this.show = false;
      }
      if(value === '#'){
        this.jshow = true;
        this.mirrorCompute();
      }else{
        this.jshow = false;
      }
    },
    curse(e){
      let eleP = e.target.parentNode; // ETC 获取父级元素
      let pos = 0;
      // if (e.target.nodeName == 'DIV') {
      //   pos = this.getDivPosition(e.target);
      // } else {
      pos = this.getPosition(e.target);
      // }
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
        this.mirrorCompute();
        this.show = true;
        console.log('你是正确的');
      }else{
        this.show = false;
      }
      if(value === '#'){
        this.jshow = true;
        this.mirrorCompute();
      }else{
        this.jshow = false;
      }
      this.div_caretOffset = cursorPos;
      return cursorPos;
    },
    keyCode(e){
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 8){
        this.curse(e);
      }
    },
    // 插入文本
    insertAtCursor(myValue) {
      // IE 浏览器  获取当前输入框dom元素
      let myField = document.getElementById('text');
      console.log('1:', myField)
      if (document.selection) {
        myField.focus();
        let sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
      }else if (myField.selectionStart || myField.selectionStart == '0') { // ETC FireFox、Chrome等
        console.log('1:1', myField.selectionStart)
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        // 保存滚动条
        // let restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        // if (restoreTop > 0) {
        //   myField.scrollTop = restoreTop;
        // }
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
        myField.focus();
      } else {
        myField.value += myValue;
        myField.focus();
      }
      this.show = false;
      this.jshow = false;
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
    }
    .comment-idea{
      padding: 0px 41px;
      z-index: 1001;
      width: 604px;
      height: 337px;
      // overflow: hidden;
      #text {
        margin-top: 22px;
        width: 604px;
        height: 315px;
        box-sizing: border-box;
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
