<template>
  <div class="comment-publish">
    <div class="hello">
      <div class="new-idea">新想法 <div class="shut" @click="shutDown">X</div></div>
      <div class="comment-idea">
        <!-- <textarea name="" id="text" cols="30" rows="10"
          @blur="dealContent"
          @keyup="keyCode($event)"
          @input="content"
          @click.stop="curse" placeholder="分享你得想法吧"></textarea> -->
        <div contenteditable="true" id="text"
          @blur="dealContent"
          @keyup="keyCode($event)"
          @input="content"
          @click.stop="curse"
        ></div>
      </div>
      <ul v-if="show" :style="at_style">
        <li v-for="(a, index) in 5" :key="index" @click.stop="insertAtCursor(friend)">{{friend}}</li>
      </ul>
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
      at_style: {
        position: 'absolute',
        top: '',
        left: ''
      },
      show: false,
      startOffset: '', // ETC 起始选中区域节点
      endOffset: '', // ETC 结尾选中区域节点
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
    // 计算光标位置
    mirrorCompute(){
      let range = window.getSelection().getRangeAt(0);
      let finaly = range.getBoundingClientRect(); // ETC { width, height, top, right, bottom, right }
      console.log(finaly);
      this.at_style.top = (finaly.top + finaly.height) + 'px';
      this.at_style.left = (finaly.left - 21) + 'px';
      // 光标位置
    },
    // textarea 内容改变触发
    content(event){
      this.getSelectData();
      let text = document.getElementById('text').textContent;
      let value = text.charAt(text.length - 1);
      console.log(text.length);
      if(value === '@'){
        this.mirrorCompute();
        this.show = true;
      }else{
        this.show = false;
      }
    },
    // 获取选中区域的数据
    getSelectData(){
      let sel = window.getSelection();
      // console.log('当前页面被选中区域:', sel);
      let objRange = sel.getRangeAt(0);
      this.startOffset = objRange.startOffset;
      this.endOffset = objRange.endOffset;
      /*
       * console.log('选中区域的range对象:', objRange);
       * objRange.rangeCount; // ETC 表示选中区域的range对象数量
       * sel.removeAllRanges(); // ETC 可以移除选中区域的range对象
       * document.createRange(); // ETC 可以创建新的range对象
       * sel.addRange(range); // ETC 可以给选中区域添加range对象
       */
    },
    // 鼠标聚焦
    curse(e){
      this.getSelectData();
      // console.log('鼠标聚焦', e)
      let eleP = e.target.parentNode; // ETC 获取父级元素
      let pos = 0;
      if (e.target.nodeName == 'DIV') {
        pos = this.getDivPosition(e.target);
        // console.log('执行getDivPosition')
      } else {
        pos = this.getPosition(e.target);
        console.log('执行getPosition');
      }
      /*
       * let spanEle = (eleP.childNodes)[0];
       * spanEle.innerText = pos;
       */
    },
    // 可编辑div获取坐标
    getDivPosition(element) {
      // console.log('element', element)
      let caretOffset = 0;
      let doc = element.ownerDocument || element.document;
      let win = doc.defaultView || doc.parentWindow;
      let sel;
      if (typeof win.getSelection !== 'undefined') {// ETC 谷歌、火狐
        sel = win.getSelection();
        if (sel.rangeCount > 0) {// ETC 选中的区域
          let range = win.getSelection().getRangeAt(0);
          let preCaretRange = range.cloneRange();// ETC 克隆一个选中区域
          preCaretRange.selectNodeContents(element);// ETC 设置选中区域的节点内容为当前节点
          preCaretRange.setEnd(range.endContainer, range.endOffset);  // ETC 重置选中区域的结束位置
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel === doc.selection) && sel.type !== 'Control') {// ETC IE
        // console.log('这个是啥 sel === doc.selection && sel.type Control', sel.type)
        let textRange = sel.createRange();
        let preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint('EndToEnd', textRange);
        caretOffset = preCaretTextRange.text.length;
      }

      let text = document.getElementById('text').textContent;
      let value = text.charAt(caretOffset - 1);
      if(value === '@'){
        this.mirrorCompute();
        this.show = true;
        console.log('你是正确的');
      }else{
        this.show = false;
      }
      // this.div_caretOffset = caretOffset;
      return caretOffset;
    },
    keyCode(es){
      this.getSelectData();
      console.log('键盘:', es);
      if(es.charCode === 13){
        es.preventDefault();
        this.show = false;
        return false;
      }else if(es.keyCode === 37 || es.keyCode === 38 || es.keyCode === 39 || es.keyCode === 40 || es.keyCode === 8){
        this.curse(es);
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
      }else if (this.startOffset || this.startOffset === '0') { // ETC FireFox、Chrome等
        let startPos = this.startOffset;
        let endPos = this.endOffset;
        // 保存滚动条
        let restoreTop = myField.scrollTop;
        console.log('保存滚动条：', myField, restoreTop);
        myField.textContent = myField.textContent.substring(0, startPos) + myValue + myField.textContent.substring(endPos, myField.textContent.length);

        if (restoreTop > 0) {
          myField.scrollTop = restoreTop;
        }
        this.startOffset = startPos + myValue.length;
        this.endOffset = startPos + myValue.length;
        myField.focus();
      } else {
        myField.textContent += myValue;
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
      height: 422px;
      overflow: hidden;
      // position: relative;
      #text {
        &::-webkit-scrollbar {display:none}
        margin-top: 22px;
        width: 604px;
        height: 400px;
        overflow-y: scroll;
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
