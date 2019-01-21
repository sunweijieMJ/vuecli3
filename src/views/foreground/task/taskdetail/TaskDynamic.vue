<template>
  <div class="dynamic-left">
    <div class="header">
      动态(0)
    </div>
    <ul v-for="(dy, dyindex) in 3" :key="dyindex">
      <li class="item-state">
        <span class="iconfont icon-icon_manage"></span><span>关闭</span>
      </li>
      <li>
        <div class="person-photo">
          <img src="https://p0.ssl.qhimg.com/t01c7526f609f50ca85.jpg" alt="">
          <div>
            <p>
              <span class="name">Paddy</span><span>关闭了这个Task</span>
            </p>
            <p class="time">17分钟之前</p>
          </div>
        </div>
        <div class="hot">
          <div class="rate">
            <el-rate disabled text-color="#F5A623" v-model="value1"></el-rate> <span class="number">3.0</span>
          </div>
          <div class="final">
            <span class="left">
              完成度
              <span class="bignum">87</span>
              <span class="bignum min">%</span>
            </span>
            <span class="right">
              总投入时长<span class="bignum">3.6</span>
            </span>
          </div>
        </div>
        <p class="des">
          这周有点问题，什么问题。这周有点问题，什么问题。这周有点问题什么问题。
          这周有点问题什么问题。这周有点问题，什么问题。这周有点问题，什么问题
          。这周有点问题，什么问题。这周有点问题什么问题。这周有点问题什么问题。
          这周有点问题，什么问题。
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TaskDynamic',
  data(){
    return {
      value1: 3
    };
  }
};
</script>
<style lang="scss" scoped>
.dynamic-left{
  width: 591px;
  .header{
    padding: 21px 25px;
    font-size:18px;
    font-weight:500;
    color: #909399;
    line-height:25px;
  }
  ul{
    margin-bottom: 12px;
    background: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:2px;
    .item-state{
      padding: 14px 28px;
      border-bottom: 1px solid #f6f6f6;
      font-size:15px;
      font-weight:500;
      color: #303133;
      line-height:21px;
      span{
        margin-right: 8px;
      }
    }
    li{
      width: 535px;
      padding: 17px 28px 24px 28px;
      .person-photo{
        display: flex;
        align-items: center;
        img{
          width: 38px;
          height: 38px;
          border-radius: 50px;
          margin-right: 10px;
        }
        p{
          font-size:15px;
          font-weight:400;
          color: #606266;
          line-height:21px;
        }
        .name{
          color: #5581C7;
          margin-right: 7px;
        }
        .time{
          font-size:13px;
          font-weight:400;
          color: #909399;
          line-height:18px;
        }
      }
      .hot{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rate{
          display: flex;
          align-items: center;
          .number{
            margin-left: 7px;
            font-size: 18px;
            color: #303133;
          }
        }
        .final{
          color: #606266;
          font-size: 18px;
          font-weight:400;
          .bignum{
            color: #FF7678;
          }
          .min{
            font-size: 13px;
          }
          .left{
            margin-right: 12px;
          }
        }
      }
      .des{
        margin-top: 17px;
        word-spacing: 1px;
        font-size:15px;
        font-weight:400;
        color: #303133;
        line-height:21px;
      }
    }
  }
}
</style>
