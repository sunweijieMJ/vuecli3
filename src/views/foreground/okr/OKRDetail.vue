<template>
  <div class="okr-detail">
    <div class="black-bg"></div>
    <div class="content">
      <div class="title">
        <div class="subtitle">
          <span class="kt-tag">KT</span>
          <span>LANEHUB商品2.0</span>
        </div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-icon_manage" style="color: white;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="黄金糕">
              黄金糕
              <div>
                好的
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="joinner">
        <div class="left">
          <img src="https://p.ssl.qhimg.com/t01138e5aba54ac6524.jpg" alt="">
          <div class="name">
            <p>BO</p>
            <p>Omi</p>
          </div>
          <div>
            <p>时间</p>
            <p>2018/12/28/-2019/03/23</p>
          </div>
        </div>
        <div class="right">
          <img v-for="(a, index) in 6" :key="index" src="https://p.ssl.qhimg.com/t01138e5aba54ac6524.jpg" alt="">
        </div>
      </div>
      <div class="key-result">
        <KeyResult></KeyResult>
      </div>
      <div class="add-key-task">
        <span class="task-name">Key Task</span>
        <span class="iconfont icon-icon_comment_m"></span>
        <span class="task-add">添加</span>
      </div>
      <div class="key-task">
        <KeyTask></KeyTask>
      </div>
    </div>
  </div>
</template>
<script>
import KeyResult from './okrdetail/KeyResult.vue';
import KeyTask from './okrdetail/KeyTask';
export default {
  name: 'okrdetail',
  components: {KeyResult, KeyTask},
  data(){
    return {

    };
  },
  methods: {
    handleCommand(command){
      console.log(command)
    }
  }
};
</script>
<style lang="scss" scoped>
.okr-detail{
  .black-bg{
    width: 100%;
    height: 206px;
    background-color: #606266;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    z-index: 0 !important;
  }
  .content{
    width: 967px;
    margin: auto;
    // color: white;
    margin-top: -170px;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .subtitle{
        font-size: 22px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        span{
          line-height: 1;
        }
        .kt-tag{
          display: inline-block;
          width: 36px;
          height: 16px;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          background: #22D7A0;
          border-radius:8px;
          margin-right: 10px;
        }
      }
    }
    .joinner{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 33px;
      img{
        width: 38px;
        height: 38px;
        border-radius: 50px;
      }
      .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        div{
          font-size:15px;
          font-weight:400;
          color: #FFFFFF;
          line-height:21px;
          p:nth-child(1){
            font-size:13px;
            font-weight:400;
            color:#C0C4CC;
            line-height:18px;
          }
        }
        .name{
          margin-left: 10px;
          margin-right: 71px;
        }
      }
      .right{
        display: flex;
        img{
          margin-left: 12px;
        }
      }
    }
    .key-result{
      margin-top: 22px;
    }
    .add-key-task{
      padding: 20px 47px;
      span{
        line-height: 1;
      }
      .iconfont{
        color: #948BEA;
        margin-left: 20px;
        margin-right: 6px;
      }
      .task-name{
        font-size:18px;
        font-weight:500;
        color: #909399;
      }
      .task-add{
        font-size:15px;
        font-weight:500;
        color: #303133;
      }
    }
  }
}
</style>
