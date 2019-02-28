<template>
  <ul class="log-list">
    <li v-for="(vitem, vindex) in loglist" :key="vindex">
      <div class="header">
        <i class="iconfont icon-okrziyuan-"></i>
        <div class="desc">
          <div class="author">
            <span>Paddy</span>
            <strong>&nbsp;编辑</strong>
            <p>了这个OKR</p>
          </div>
          <p>15分钟前</p>
        </div>
      </div>
      <div class="main">
        <ul class="okr" v-if="0">
          <h4>提升自有品牌商品研发与内部交付效率</h4>
          <li v-for="(witem, windex) in 3" :key="windex">
            <div class="kr">
              <span>KR</span>
              <p>开发一个准确度达到90%的图像识别接口</p>
            </div>
            <div class="precent">
              <span>信心指数 </span>
              <i>60%</i>
            </div>
          </li>
        </ul>
        <div class="task" v-else>
          <span>KT</span>
          <p>商品看板的需求与交互稿确认，业务，产品，开发明确一期技术产品目标及内容。搞定 一期技术产品目标及内容。</p>
        </div>
      </div>
      <div class="footer">
        <div class="time">
          <h5>时间</h5>
          <p>2019-Q1</p>
        </div>
        <div class="user">
          <span v-for="(witem, windex) in 3" :key="windex">刘峥</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    props: ['loglist']
  };
</script>
<style lang="scss" scoped>
  .log-list {
    >li {
      width: 750px;
      padding: 27px 0;
      border-bottom: 1px solid $lineColor;
      .header {
        display: flex;
        align-items: center;
        i {
          font-size: 38px;
        }
        .desc {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 40px;
          padding: 1px 0;
          margin-left: 12px;
          .author {
            display: flex;
            align-items: center;
            font-size: $h3Font;
            line-height: 1;
            color: $h2Color;
            span {
              font-weight: $h1Weight;
              color: $h1Color;
              cursor: pointer;
              @extend %textlight;
            }
            strong {
              font-weight: $h1Weight;
              color: $h1Color;
            }
          }
          >p {
            font-size: $h4Font;
            line-height: 1;
            color: $h3Color;
          }
        }
      }
      .main {
        padding: 20px 30px;
        margin: 20px 50px;
        background-color: $backColor;
        .okr {
          h4 {
            margin-bottom: 15px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1.4;
            color: $h1Color;
          }
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            &:last-child {
              margin-bottom: 0;
            }
            .kr {
              display: flex;
              align-items: center;
              span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 16px;
                border-radius: 8px;
                background-color: $green;
                font-size: $h4Font;
                color: #fff;
              }
              p {
                margin-left: 12px;
                font-size: $h3Font;
                line-height: 1;
                color: $h1Color;
              }
            }
            .precent {
              display: flex;
              align-items: center;
              span {
                font-size: $h3Font;
                line-height: 1;
                color: $h3Color;
              }
              i {
                margin-left: 5px;
                font-size: $h3Font;
                font-style: normal;
                line-height: 1;
                color: $h1Color;
              }
            }
          }
        }
        .task {
          display: flex;
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 16px;
            margin: 3px 0;
            border-radius: 8px;
            background-color: $purple;
            font-size: $h4Font;
            color: #fff;
          }
          p {
            flex: 1;
            margin-left: 12px;
            font-size: $h3Font;
            line-height: 1.4;
            color: $h1Color;
          }
        }
      }
      .footer {
        margin: 0 50px;
        .time {
          display: flex;
          align-items: center;
          h5 {
            font-size: $h3Font;
            font-weight: normal;
            line-height: 1;
            color: $h2Color;
          }
          p {
            margin-left: 12px;
            font-size: $h3Font;
            line-height: 1;
            color: $h2Color;
          }
        }
        .user {
          display: flex;
          align-items: center;
          margin-top: 14px;
          span {
            padding: 2px 15px;
            margin-right: 6px;
            border-radius: 13px;
            background-color: $backColor;
            font-size: $h4Font;
            color: $h1Color;
            cursor: pointer;
            @extend %textlight;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
</style>

