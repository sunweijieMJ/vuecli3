<template>
  <div class="okr-publish">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="okr_publish.status">
      <input type="text" class="header" slot="title" placeholder="给OKR起个名称吧">
      <div class="main">
        <!-- okr信息 -->
        <div class="title">
          <div class="bo">
            <img src="" alt="">
            <div class="item">
              <h4>Bo</h4>
              <p>Omi</p>
            </div>
          </div>
          <div class="type">
            <div class="item">
              <h4>类型</h4>
              <el-dropdown trigger="click">
                <p>项目<i class="iconfont icon-shopping_cart__ic_do"></i></p>
                <el-dropdown-menu slot="dropdown" class="okr">
                  <el-dropdown-item>公司</el-dropdown-item>
                  <el-dropdown-item>项目</el-dropdown-item>
                  <el-dropdown-item>个人</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="time">
            <div class="item">
              <h4>时间</h4>
              <el-date-picker
                v-model="form.daterange"
                type="daterange"
                format="yyyy/MM/dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <!-- <i class="iconfont icon-shopping_cart__ic_do"> -->
            </div>
          </div>
        </div>
        <!-- 参与者 -->
        <member></member>
        <!-- Objective -->
        <div class="objective">
          <h4>Objective</h4>
          <textarea placeholder="你的Objective是什么？" v-model="form.objective"></textarea>
        </div>
        <!-- Key Result -->
        <div class="key-result">
          <h4>Key Result</h4>
          <div class="result">
            <ul class="list">
              <li v-for="(item, index) in form.key_result" :key="index">
                <input type="text" placeholder="KR1">
                <div class="number">
                  <h5>信心指数</h5>
                  <p>50%</p>
                </div>
                <i class="el-icon-delete" @click="removeKeyResult(index)"></i>
              </li>
            </ul>
            <el-button class="add" @click="addKeyResult">添加</el-button>
          </div>
        </div>
      </div>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="cancelSetup">取消</el-button>
        <el-button class="confirm" @click="confirmSetup">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {Member} from '../../../components/popup';

  export default {
    components: {Member},
    data() {
      return {
        form: {
          daterange: '',
          objective: '',
          key_result: [1, 2, 3, 4]
        }
      };
    },
    methods: {
      confirmSetup() {
        let that = this;
        that.$confirm('确定删除KR?', '取消', {type: 'warning'}).then(() => {
          that.closeDialog();
        });
      },
      cancelSetup() {},
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setOKRPublish', {status: false, source: null});
      },
      addKeyResult() {
        this.form.key_result.push(1);
      },
      removeKeyResult(index) {
        let that = this;
        that.$confirm(`确定删除KR${index}?`, '删除', {type: 'warning'}).then(() => {
          that.form.key_result.pop();
        });
      }
    },
    computed: mapState(['okr_publish'])
  };
</script>
<style lang="scss" scoped>
  .okr-publish {
    .main {
      max-height: 500px;
      overflow-y: auto;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 30px 37px;
        border-bottom: 1px solid $lineColor;
        .bo {
          display: flex;
          img {
            box-sizing: border-box;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 2px solid $lineColor;
          }
          .item {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            h4 {
              font-size: $h4Font;
              font-weight: normal;
              color: $h3Color;
            }
            p {
              font-size: $h3Font;
              color: $h1Color;
            }
          }
        }
        .type {
          display: flex;
          .item {
            display: flex;
            flex-direction: column;
            h4 {
              font-size: $h4Font;
              font-weight: normal;
              color: $h3Color;
            }
            p {
              font-size: $h3Font;
              color: $h1Color;
              cursor: pointer;
              i {
                font-size: 12px;
              }
            }
          }
        }
        .time {
          display: flex;
          margin-right: 190px;
          .item {
            display: flex;
            flex-direction: column;
            h4 {
              font-size: $h4Font;
              font-weight: normal;
              color: $h3Color;
            }
          }
        }
      }
      .objective {
        box-sizing: border-box;
        height: 177px;
        padding: 25px 37px 34px;
        border-bottom: 1px solid $lineColor;
        h4 {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 30px;
          color: $themeColor;
        }
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 73px;
          padding: 10px 20px;
          margin-top: 15px;
          border-radius: 2px;
          font-size: $h3Font;
          line-height: 25px;
          resize: none;
          border: none;
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
        }
      }
      .key-result {
        box-sizing: border-box;
        padding: 25px 37px 23px;
        h4 {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 30px;
          color: $themeColor;
        }
        .result {
          margin-top: 15px;
          .list {
            display: flex;
            flex-wrap: wrap;
            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              margin-bottom: 20px;
              input {
                box-sizing: border-box;
                width: 677px;
                height: 48px;
                padding-left: 20px;
                border-radius: 2px;
                background-color: $backColor;
                &::placeholder {
                  font-size: $h3Font;
                  line-height: 48px;
                  color: $h3Color;
                }
              }
              .number {
                display: flex;
                flex-direction: column;
                h5 {
                  font-size: $h4Font;
                  font-weight: normal;
                  line-height: 18px;
                  color: $h3Color;
                }
                p {
                  font-size: $h2Font;
                  line-height: 25px;
                  color: $h1Color;
                }
              }
              i {
                font-size: 20px;
                color: $linkBlue;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .okr-publish {
    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 auto !important;
        .el-dialog__header {
          padding: 32px 37px 0;
          .header {
            box-sizing: border-box;
            width: 100%;
            height: 48px;
            padding-left: 20px;
            background-color: $backColor;
            border-radius: 2px;
          }
          .el-dialog__headerbtn {
            top: 25px; right: -50px;
            .el-dialog__close {
              font-size: 24px;
              color: #fff;
            }
          }
        }
        .el-dialog__body {
          padding: 0;
        }
        .el-dialog__footer {
          padding: 24px 37px;
        }
      }
    }
    .el-date-editor--daterange {
      width: 200px;
      height: 20px;
      padding: 0;
      border: 0;
      input {
        display: inline-flex;
        width: 90px;
        font-size: 15px;
        line-height: 20px;
        color: $h1Color;
        &::placeholder {
          text-align: left;
        }
      }
      i {
        display: none;
      }
      span {
        padding: 0;
        line-height: 20px;
      }
    }
  }

  .el-dropdown-menu {
    &.okr {
      padding: 0;
      .el-dropdown-menu__item {
        margin-bottom: 0;
        width: 160px;
        height: 47px;
        line-height: 47px;
        border-bottom: 1px solid $lineColor;
      }
    }
  }

  .el-button {
    &.cancel {
      width: 90px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 20px;
      font-size: $h2Font;
      font-weight: $h1Weight;
      line-height: 40px;
      color: #fff;
      border:1px solid $themeColor;
      color: $themeColor;
      background-color: #fff;
    }
    &.confirm {
      width: 90px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 20px;
      font-size: $h2Font;
      font-weight: $h1Weight;
      line-height: 40px;
      color: #fff;
      color: #fff;
      background: linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
    }
    &.add {
      box-sizing: border-box;
      width: 82px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 20px;
      font-size: $h2Font;
      font-weight: $h1Weight;
      line-height: 36px;
      color: $linkBlue;
      border:1px solid $linkBlue;
      background-color: #fff;
    }
  }
</style>


