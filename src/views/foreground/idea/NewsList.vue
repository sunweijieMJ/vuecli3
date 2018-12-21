<template>
  <div class="new-list">
    <div class="warn">
      提醒
    </div>
    <ul>
      <li v-for="(a, index) in 3" :key="index">
        <div class="head-img">
          <img src="https://p0.ssl.qhimgs4.com/t01fc20f943803bdb92.jpg" alt="">
        </div>
        <div class="comment">
          <div class="reply">
            <span>
              <span class="name">YANCY</span><span class="idea">回复了你的想法</span>
            </span>
            <span class="date">2018-12-12 10:30</span>
          </div>
          <div class="comment-idea">
            <p>
              我觉得这个很好
            </p>
          </div>
          <div class="distr">
            <p>
              PGS正式上线，你不知道的21个隐藏功能。PGS正式上线，你不知道的21个隐藏功能，快…
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'NewsList',
  data(){
    return {

    };
  }
};
</script>
<style lang="scss" scoped>
.new-list{
  width: 100%;
  background-color: white;
  text-align: left;
  .warn{
    width: 750px;
    padding: 20px 0;
    font-size:38px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    color:rgba(255,118,120,1);
    line-height:53px;
    border-bottom:1px solid rgba(246,246,246,1);
  }
  ul{
    width: 750px;
    li{
      width: 100%;
      display: flex;
      justify-content: flex-start;
      padding: 14px 0 28px 0;
      border-bottom:1px solid rgba(246,246,246,1);
      .head-img{
        img{
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
      }
      .comment{
        margin-left: 14px;
        padding-top: 14px;
        .reply{
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size:16px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color: #303133;
          .name{
            color:rgba(85,129,199,1);
          }
          .date{
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(144,147,153,1);
          }
        }
        .comment-idea{
          margin-top: 9px;
          p{
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(96,98,102,1);
            line-height:22px;
          }
        }
        .distr{
          margin-top: 13px;
          padding: 14px 17px;
          background:rgba(246,246,246,1);
          p{
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(96,98,102,1);
            line-height:25px;
          }
        }
      }
    }
  }
}
</style>
