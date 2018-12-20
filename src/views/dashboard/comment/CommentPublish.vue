<template>
  <div class="comment-publish">
    <div class="hello">
      <div class="new-idea">新想法 <div class="shut">X</div></div>
      <div class="comment-idea">
        <textarea name="" id="text" cols="30" rows="10"
          @blur="dealContent"
          @keyup="keyCode($event)"
          @input="content"
          @click="curse" placeholder="分享你得想法吧"></textarea>
        <ul v-if="show" :style="at_style">
          <li v-for="(a, index) in 5" :key="index" @click="insertAtCursor(friend)">{{friend}}</li>
        </ul>
      </div>
      <div class="upload-img">
        <span ><i class="iconfont icon-qianming"></i><span>上传图片</span></span>
        <span class="submit">发布</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'commentpublish',
  data() {
    return {
      friend: '好友列表',
      at_style: {
        position: 'absolute',
        top: '',
        left: ''
      },
      show: false,
      div_caretOffset: ''
    };
  },
  methods: {
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
      let mirror = '<div style="font-size:12px;" id="' + 'text' + '">'
      + escape(beforeText)
      + '<span id="cursor">|</span>'
      + escape(afterText)
      + '</div>';
      // 添加到 textarea 同级，注意设置定位及 zIndex，使两个元素重合
      textarea.insertAdjacentHTML('afterend', mirror);
      // 通过镜像元素中的假光标占位元素获取像素位置
      let cursor = document.getElementById('cursor');
      // 获取页面元素位置
      let finaly = cursor.getBoundingClientRect(); // ETC { width, height, top, right, bottom, right }
      console.log('字节计算 ：', finaly)
      this.at_style.top = (finaly.bottom - 476) + 'px';
      this.at_style.left = finaly.left + 'px';
      console.log('这是啥：', finaly)
      console.log('你是正确的')
    },
    // textarea 内容改变触发
    content(event){
      let text = document.getElementById('text').value;
      let value = text.charAt(text.length - 1);
      console.log('nedasda', text, value);
      if(value === '@'){
        this.mirrorCompute();
        this.show = true;
      }else{
        this.show = false;
      }
    },
    curse(e){
      let eleP = e.target.parentNode; // ETC 获取父级元素
      let pos = 0;
      if (e.target.nodeName == 'DIV') {
        pos = this.getDivPosition(e.target);
      } else {
        pos = this.getPosition(e.target);
      }
      let spanEle = (eleP.childNodes)[1];
      spanEle.innerText = pos;
    },
    // 获取光标位置
    getPosition(element) {
      console.log('光标：', element);
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
      this.div_caretOffset = cursorPos;
      return cursorPos;
    },
    keyCode(e){
      if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 8){
        this.curse(e);
      }
    },
    // 插入文本6
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
        let restoreTop = myField.scrollTop;
        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
        if (restoreTop > 0) {
          myField.scrollTop = restoreTop;
        }
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
        myField.focus();
      } else {
        myField.value += myValue;
        myField.focus();
      }
      this.show = false;
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
  background-color: rgba(0,0,0,0.5);;
  // opacity: 0.5;
  .hello{
    width: 687px;
    margin: auto;
    margin-top: 94px;
    text-align: left;
    font-size: 12px;
    letter-spacing: normal;
    background-color: white;
    // position: relative;
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
      height: 498px;
      overflow: hidden;
      #text {
        margin-top: 22px;
        width: 604px;
        height: 476px;
        box-sizing: border-box;
        border: 1px solid orange;
        font-size: 12px;
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
    .upload-img{
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
  }
  .shut{
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
    padding: 5px 0px;
    border-top: 1px solid #eee;
    width: 100%;
  }
  li:first-of-type{
    border-top:none;
  }
}
</style>
