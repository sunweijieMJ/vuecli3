<template>
  <div class="kr">
    <div class="kr-title">
      <div>
        <i class="iconfont icon-icon_okr_l"></i>
      </div>
      <div>{{okr_detail.objective_desc}}</div>
    </div>
    <ul>
      <li v-for="(kr, krindex) in kr_list" :key="krindex">
        <div class="kr-left">
          <span class="left-tag">KR</span>
          <span>{{kr.kr_name}}</span>
        </div>
        <div class="kr-right">
          <span>信心指数</span>
          <span class="span2">
            <span class="number">{{kr.confidenc_index}}</span>
            <span>%</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'keyresult',
  props: ['kr_list', 'okr_detail'],
  data(){
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.kr{
  background-color: #FFFFFF;
  box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
  border-radius:4px;
  padding: 25px 50px 0 50px;
  .kr-title{
    font-size:19px;
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
          margin-right: 5px;
        }
      }
      .kr-right{
        width: 116px;
        font-size:13px;
        font-weight:400;
        color: #909399;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span{
          line-height: 1;
        }
        .span2{
          display: flex;
          align-items: center;
          color: #303133;
        }
        .number{
          font-size:22px;
          font-family:PingFangSC-Regular;
          font-weight:400;
        }
      }
    }
  }
}
</style>
