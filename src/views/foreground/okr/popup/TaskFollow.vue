<template>
  <div class="task-follow">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="task_follow.status">
      <div class="header" slot="title">
        <h2>跟进</h2>
        <div class="title">
          <span>KT</span>
          <p>一行显示不了，一行显示不了一行显示不了一行显示不了一行显示不了一行显示不了一行显示一行显示不了，一行</p>
        </div>
      </div>
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <div class="main">
          <div class="rate">
            <h4>感觉怎么样?</h4>
            <el-rate v-model="form.rate" :allow-half="true" show-text></el-rate>
          </div>
          <div class="summary">
            <el-form-item prop="summary">
              <el-input type="textarea" v-model="form.summary" placeholder="总结一下吧"></el-input>
            </el-form-item>
          </div>
          <div class="num">
            <div class="percent">
              <h4>完成度</h4>
              <div class="input">
                <el-form-item prop="percent">
                  <el-input v-model="form.percent"></el-input>
                </el-form-item>
                <p>最小单位为1%</p>
              </div>
            </div>
            <div class="duration">
              <h4>投入时长</h4>
              <div class="input">
                <el-form-item prop="duration">
                  <el-input v-model="form.duration"></el-input>
                </el-form-item>
                <p>最小单位为0.1天</p>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="closeDialog">取消</el-button>
        <el-button class="confirm" @click="confirmFollow('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        form: {
          rate: 0,
          summary: '',
          percent: '',
          duration: ''
        },
        rules: {
          summary: [{required: true, message: ' ', trigger: 'change'}],
          percent: [{required: true, message: ' ', trigger: 'change'}],
          duration: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      confirmFollow(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.closeDialog();
          } else {
            return false;
          }
        });
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setTaskClose', {status: false, source: null});
      }
    },
    computed: {
      ...mapState({
        task_follow: store => store.task_follow
      })
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 30px;

  .task-follow {
    .main {
      .rate {
        display: flex;
        padding: $up-down $left-right;
        h4 {
          font-size: $h3Font;
          font-weight: 400;
          line-height: 21px;
          color: $h2Color;
        }
        .el-rate {
          margin-left: 15px;
        }
      }
      .summary {
        padding: 0 $left-right;
        .is-error {
          textarea {
            border-color: #f56c6c;
          }
        }
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 152px;
          padding: 10px 20px;
          border-radius: 2px;
          font-size: $h3Font;
          line-height: 25px;
          resize: none;
          border-color: #fff;
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
          }
        }
      }
      .num {
        display: flex;
        justify-content: space-between;
        padding: $up-down $left-right;
        .percent, .duration {
          display: flex;
          h4 {
            margin-right: 20px;
            font-size: $h3Font;
            font-weight: 400;
            line-height: 48px;
            color: $h2Color;
          }
          .input {
            display: flex;
            flex-direction: column;
            .el-form-item {
              position: relative;
              width: 204px;
              margin-bottom: 8px;
              &::after {
                position: absolute;
                content: '%';
                top: 14px;right: 30px;
              }
              input {
                box-sizing: border-box;
                width: 100%;
                height: 48px;
                padding-left: 20px;
                background-color: $backColor;
                border-radius: 2px;
                border-color: #fff;
                background-image: none !important;
              }
            }
            p {
              margin-left: 40px;
              font-size: $h3Font;
              font-weight: 400;
              line-height: 21px;
              color: $themeColor;
            }
          }
          &.duration {
            .el-form-item::after {
              content: '天';
            }
          }
        }
      }
    }

    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 auto !important;
        .el-dialog__header {
          padding: 28px $left-right;
          border-bottom: 1px solid $lineColor;
          .header {
            h2 {
              margin-bottom: 12px;
              font-size: $h1Font;
              font-weight: $h1Weight;
              line-height: 30px;
              color: $themeColor;
            }
            .title {
              display: flex;
              align-items: center;
              span {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 32px;
                height: 16px;
                border-radius: 8px;
                background-color: $purple;
                font-size: $h4Font;
                color: #fff;
              }
              p {
                @include tofl(100%);
                margin-left: 8px;
                font-size: $h3Font;
                color: $h1Color;
              }
            }
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
          .el-form-item {
            display: flex;
            align-items: center;
            margin-bottom: 0;
            &.is-error .el-form-item__content{
              input {
                border-color: #f56c6c;
              }
            }
            &.is-success .el-form-item__content{
              input {
                border-color: #67c23a;
              }
            }
            .el-form-item__content {
              display: flex;
              width: 100%;
              line-height: normal;
            }
          }
        }
        .el-dialog__footer {
          padding: 24px $left-right;
        }
      }
    }
  }
</style>
