<template>
  <div class="kr">
    <div class="kr-title">
      <div>{{okr_detail.objective_name}}</div>
    </div>
    <ul>
      <li v-for="(kr, krindex) in kr_list" :key="krindex">
        <div class="kr-left">
          <span class="left-tag">KR</span>
          <span>{{kr.kr_name}}</span>
        </div>
        <div class="kr-right">
          <span class="left">信心指数</span>
          <span class="span2">
            <span class="number">{{kr.confidenc_index}}</span>
            <span>%</span>
          </span>
        </div>
      </li>
    </ul>
    <div class="edit" v-if="!isOwner && !okrDec"></div>
    <div class="edit" v-else>
      <div class="left">
        <span class="text">描述</span>
      </div>
      <span @click="personEdit" v-show="isOwner" class="iconfont icon-compile"></span>
    </div>
    <div class="description" v-if="okrDec">
      <!-- 默认展示一行 -->
      <div @click="ShowOrNot" v-if="!content_state" class="hidden">
        <Paragraph class="content_style" :text="okrDec"></Paragraph>
      </div>
      <!-- <p class="content_style" v-if="!content_state">{{okrDec}}</p> -->
      <!-- 展开 -->
      <div @click="ShowOrNot" v-if="content_state" class="">
        <Paragraph  class="content-des" :text="okrDec"></Paragraph>
      </div>
      
      <!-- <p class="content-des" v-if="content_state" @click="ShowOrNot">{{okrDec}}</p> -->
      <div class="angle" v-show="on_in">
        <span v-if="content_state  && okrDec" class="iconfont icon-xiangshang" @click="onShow"></span>
        <span v-if="!content_state" class="iconfont icon-xiangxia" @click="inShow"></span>
      </div>
    </div>

    <el-dialog
      title="描述"
      :visible.sync="dialogVisible"
      :top="hello_box"
      :before-close="handleClose">
      
      <textarea :style="textarea_style" name="" id="" v-model="okr_description" placeholder="描述设定OKR的思路吧！"></textarea>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pushEditCon">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UserPopover from '../../../../components/popup/UserPopover';
import {Paragraph} from '../../../../components/business';
import okrApi from '../../../../api/Okr.js';
export default {
  name: 'keyresult',
  props: ['kr_list', 'okr_detail', 'objId', 'isOwner', 'okrDec'],
  components: {
    UserPopover, Paragraph
  },
  data(){
    return {
      dialogVisible: false,
      clientHeight: null,
      textarea_style: {
        height: this.limitHeight() + 'px !important'
      },
      hello_box: this.distance() + 'px', // ETC 盒子距离顶部距离
      okr_description: '',
      on_in: true, // ETC 内容展开箭头状态
      content_state: null // ETC 描述内容的高度
    };
  },
  methods: {
    // 展示编辑窗口
    personEdit(){
      this.dialogVisible = true;
      this.okr_description = this.okrDec;
    },
    // 发布编辑内容
    pushEditCon(){
      okrApi().pushOkrDes({
        objDesc: this.okr_description,
        objId: this.objId
      }).then(res => {
        if(res.status){
          this.dialogVisible = false;
          this.$message({message: res.message, type: 'success', duration: 1000});
          this.$emit('updateOkr');
        }else{
          this.$message({message: res.message, type: 'warning'});
        }
      });
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {

        });
    },
    limitHeight(){
      if((document.documentElement.clientHeight * 80 / 100) > 500){
        return 500;
      }else{
        return (document.documentElement.clientHeight * 80 / 100);
      }
    },
    distance(){
      if((document.documentElement.clientHeight * 80 / 100) > 500){
        return (document.documentElement.clientHeight - (document.documentElement.clientHeight * 80 / 100)) / 2;
      }else{
        return (document.documentElement.clientHeight * 20 / 100) / 2;
      }
    },
    ShowOrNot(){
      this.content_state = !this.content_state;
    },
    onShow(){
      this.content_state = false;
    },
    inShow(){
      this.content_state = true;
    }
  },
  mounted(){
    this.clientHeight = document.documentElement.clientHeight;
  },
  watch: {
    okrDec(){
      this.content_state = false;
      setTimeout(() => {
        if(document.querySelector('.content_style').clientWidth > 920 || document.querySelector('.content_style').clientHeight > 29){
          this.on_in = true;
        }else{
          this.on_in = false;
        }
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
.kr{
  background-color: #FFFFFF;
  box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
  border-radius:4px;
  padding: 25px 50px 25px 50px;
  .kr-title{
    font-size:17px;
    font-weight:500;
    color: #303133;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .iconfont{
      color: #22D7A0;
      margin-right: 9px;
      font-size: 28px;
    }
  }
  ul{
    margin-top: 23px;
    width: 100%;
    li{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 0;
      border-top: 1px solid #F6F6F6;
      &:last-child{
        border-bottom: 1px solid #F6F6F6;
      }
      .kr-left{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 15px;
        color: #303133;
        .left-tag{
          display: inline-block;
          width:36px;
          height:16px;
          background: #22D7A0;
          border-radius:8px;
          color: #FFFFFF;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          margin-right: 10px;
        }
      }
      .kr-right{
        width: 110px;
        font-size:13px;
        color: #909399;
        display: flex;
        justify-content: space-between;
        .left{
          line-height: 25px;
        }
        span{
          line-height: 1;
          text-align: bottom;
        }
        .span2{
          // display: flex;
          // align-items: center;
          color: #303133;
        }
        .number{
          font-size:22px;
        }
      }
    }
  }
  .edit{
    display: flex;
    align-items: center;
    margin-top: 21px;
    font-size: 15px;
    font-weight:500;
    color: #303133;
    line-height: 21px;
    .left{
      position: relative;
      .text{
        position: relative;
        z-index: 1;
        color: #22D7A0;
        font-weight: 500;
      }
    }
    span{
      cursor: pointer;
      // @extend %imglight;
    }
    .iconfont{
      color: #303133;
      font-size: 22px;
      margin-left: 8px;
    }
  }
  .description{
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    .hidden{
      height: 29px;
      overflow: hidden;
    }
    .content_style{
      cursor: pointer;
      word-break: break-word;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      font-size: 15px;
      font-weight: 400;
      color: #606266;
      line-height: 29px;
    }
    .content-des{
      cursor: pointer;
      word-break: break-word;
      font-size: 15px;
      font-weight: 400;
      color: #606266;
      line-height: 29px;
    }
    .angle{
      width: 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      cursor: pointer;
      line-height: 29px;
      .iconfont{
        font-size: 15px;
      }
    }
  }
  textarea{
    width: 100%;
    resize: none;
    box-sizing: border-box;
    border: none;
    font-size: 15px;
    font-family: PingFangSC-Regular;
  }
  textarea::-webkit-input-placeholder{
    color:#C0C4CC;
    font-size: 15px;
  }
  textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#C0C4CC;
    font-size: 15px;
  }
  textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#C0C4CC;
    font-size: 15px;
  }
  textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#C0C4CC;
    font-size: 15px;
  }
}
</style>
<style lang="scss">
.kr{
  .el-dialog{
    width: 687px !important;
    .el-dialog__header{
      padding: 28px 37px;
      border-bottom: 1px solid #f6f6f6;
      .el-dialog__title{
        font-size: 22px;
        font-weight: 500;
        color: #FF7678;
        line-height: 1;
      }
      .el-dialog__headerbtn{
        color: white;
        right: -40px;
        font-size: 28px;
        z-index: 1001;
      }
    }
    .el-dialog__body{
      padding: 22px 41px;
      border-bottom: 1px solid #f6f6f6;
    }
    .el-dialog__footer{
      padding: 23px 33px;
      .el-button{
        padding: 8px 26px;
        background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
        border: none;
        border-radius: 20px;
        @extend %imglight;
        span{
          font-size: 18px;
          line-height: 1;
        }
      }
    }
  }
}
</style>
