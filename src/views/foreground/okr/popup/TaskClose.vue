<template>
  <div class="task-close custom-dialog">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="task_close.status">
      <div class="header" slot="title">
        <h2>关闭</h2>
        <div class="title">
          <span>KT</span>
          <p>PGS信息流，OKR上线</p>
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
            <el-form-item label="完成度" prop="percent">
              <el-input v-model="form.percent"></el-input>
            </el-form-item>
            <el-form-item label="总投入时长" prop="duration">
              <el-input v-model="form.duration"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="closeDialog">取消</el-button>
        <el-button class="confirm" @click="confirmClose('ruleForm')">确定</el-button>
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
      // 确认创建
      confirmClose(formName) {
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
        task_close: store => store.task_close
      })
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 30px;

  .task-close {
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
        .el-form-item {
          .el-form-item__label {
            width: 50px;
            padding: 0;
            font-size: $h3Font;
            line-height: 21px;
            color: $h2Color;
            &::before {
              content: '';
              margin-right: 0;
            }
          }
          &:last-child {
            .el-form-item__label{
              width: 80px;
            }
            .el-form-item__content::after {
              content: '天';
            }
          }
          .el-form-item__content {
            width: 200px !important;
            margin-left: 20px;
            position: relative;
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
        }
      }
    }

    .el-dialog__wrapper {
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
      }
    }
  }
</style>
