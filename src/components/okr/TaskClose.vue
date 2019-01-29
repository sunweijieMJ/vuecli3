<template>
  <div class="task-close custom-dialog" v-if="task_close.status">
    <el-dialog width="752px" :before-close="beforeClose" @close="closeDialog" :visible.sync="task_close.status">
      <div class="header" slot="title">
        <h2>关闭</h2>
        <div class="title">
          <span>{{task_close.parent.is_key_task ? 'KT' : 'T'}}</span>
          <p>{{task_info.task_name}}</p>
        </div>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
          <div class="rate">
            <h4>自我评价</h4>
            <el-rate class="middle-rate" v-model="form.rate" :allow-half="true" show-score
              :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
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
        <el-button class="cancel" @click="beforeClose">取消</el-button>
        <el-button class="confirm" @click="confirmClose('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import TaskApi from '../../api/Task.js';
  import {validatePercent, validateDuration} from './validate.js';
  let origin = {};

  export default {
    data() {
      return {
        task_info: '',
        form: {
          rate: 0,
          summary: '',
          percent: '',
          duration: ''
        },
        rules: {
          summary: [{required: true, message: ' ', trigger: 'change'}],
          percent: [{required: true, validator: validatePercent, trigger: 'change'}],
          duration: [{required: true, validator: validateDuration, trigger: 'change'}]
        }
      };
    },
    methods: {
      // 确认关闭
      confirmClose(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            TaskApi().finishTask(that.close_info).then(res => {
              if(res.status) {
                this.$emit('handleTaskClose');
                that.closeDialog();
                that.$message({message: '关闭成功', type: 'success'});
              } else {
                that.$message({message: res.message, type: 'error'});
              }
            });
          } else {
            return false;
          }
        });
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setTaskClose', {status: false, source: null});
      },
      // 关闭前
      beforeClose() {
        let [that, flag] = [this, true];
        for(let key in origin) {
          if(JSON.stringify(origin[key]) !== JSON.stringify(this.$data.form[key])) {
            flag = false;
            break;
          }
        }
        if(flag) {
          that.closeDialog();
        } else {
          that.$confirm('您填写的内容将不做保留', '取消', {type: 'warning'}).then(() => {
            that.closeDialog();
          });
        }
      }
    },
    computed: {
      close_info() {
        let that = this;
        return {
          taskId: that.task_info.task_id,
          objId: that.task_info.obj_id,
          remark: that.form.summary,
          speedTime: that.form.duration,
          progress: that.form.percent,
          selfComments: that.form.rate
        };
      },
      ...mapState({
        task_close: store => store.task_close
      })
    },
    watch: {
      'task_close.status'(cur) {
        let that = this;
        if(cur && that.task_close.parent) {
          Object.assign(that.$data, that.$options.data());
          that.task_info = that.task_close.parent;
          if(!that.task_close.parent.check_info) {
            origin = JSON.parse(JSON.stringify(this.$data.form));
            return;
          }
          that.form = {
            rate: that.task_close.parent.check_info.score,
            summary: that.task_close.parent.check_info.remarks,
            percent: that.task_close.parent.check_info.progress,
            duration: that.task_close.parent.check_info.spend_time
          };
          origin = JSON.parse(JSON.stringify(this.$data.form));
        }
      }
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
              width: 36px;
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
