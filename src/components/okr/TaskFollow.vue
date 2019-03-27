<template>
  <div class="task-follow custom-dialog" v-if="task_follow.status">
    <el-dialog width="752px" :before-close="beforeClose" @close="closeDialog" :visible.sync="task_follow.status">
      <div class="header" slot="title">
        <h2>跟进</h2>
        <div class="title">
          <span>{{task_follow.parent.is_key_task ? 'KT' : 'T'}}</span>
          <p>{{task_info.task_name}}</p>
        </div>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
          <div class="status">
            <h4>状态</h4>
            <div class="radio">
              <el-radio class="custom-radio" v-model="form.type" label="1">KT跟进中</el-radio>
              <el-radio class="custom-radio" v-model="form.type" label="2">KT已完成</el-radio>
            </div>
          </div>
          <div class="num">
            <el-form-item label="完成度" prop="percent">
              <el-input class="custom-input" v-model="form.percent" placeholder="最小单位为1"></el-input>
            </el-form-item>
            <el-form-item label="投入时长" prop="duration">
              <el-input class="custom-input" v-model="form.duration" placeholder="最小单位为0.5"></el-input>
            </el-form-item>
          </div>
          <div class="rate" :style="{height: form.type === '2' ? '100px' : 0}">
            <el-form-item v-if="form.type === '2'" prop="performance" :key="form.performance + 'performance'">
              <span>KT完成表现分</span>
              <el-rate class="middle-rate" v-model="form.performance" :allow-half="true" show-text :texts="['糟糕', '失望', '一般', '满意', '超预期']"
                :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
            </el-form-item>
            <el-form-item v-if="form.type === '2'" prop="relativity" :key="form.relativity + 'relativity'">
              <span>OKR相关程度</span>
              <el-rate class="middle-rate" v-model="form.relativity" :allow-half="true" show-text :texts="['糟糕', '失望', '一般', '满意', '超预期']"
                :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
            </el-form-item>
          </div>
          <div class="summary">
            <el-form-item prop="summary">
              <el-input class="custom-input" type="textarea" v-model="form.summary" maxlength="500" :placeholder="form.type === '1' ? '记录下执行中遇到的问题、个人表现和最新进展吧' : '对整个KT做下复盘吧'"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="beforeClose">取消</el-button>
        <el-button class="confirm" @click="confirmFollow('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import TaskApi from '../../api/Task.js';
  import {validatePercent, validateDuration, validatePerformance} from './validate.js';

  export default {
    data() {
      return {
        task_info: '',
        form: {
          type: '1',
          performance: 0,
          relativity: 0,
          summary: '',
          percent: '',
          duration: ''
        },
        rules: {
          summary: [{required: true, message: ' ', trigger: 'change'}],
          percent: [{required: true, validator: validatePercent, trigger: 'change'}],
          duration: [{required: true, validator: validateDuration, trigger: 'change'}],
          performance: [{required: true, validator: validatePerformance, trigger: 'change'}],
          relativity: [{required: true, validator: validatePerformance, trigger: 'change'}]
        }
      };
    },
    methods: {
      confirmFollow(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            TaskApi().checkTask(that.check_info).then(res => {
              if(res.status) {
                this.$emit('handleTaskCheck', Object.assign({status: that.check_info.type}, res.data));
                that.closeDialog();
                that.$message({message: '跟进成功', type: 'success'});
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
        this.$store.dispatch('setTaskFollow', {status: false, source: null});
      },
      // 关闭前
      beforeClose() {
        let that = this;
        if(JSON.stringify(that.$data.form) === JSON.stringify(that.$options.data().form)) {
          that.closeDialog();
        } else {
          that.$confirm('您填写的内容将不做保留', '取消', {type: 'warning'}).then(() => {
            that.closeDialog();
          });
        }
      }
    },
    computed: {
      check_info() {
        let that = this;
        return {
          taskId: that.task_info.task_id,
          objId: that.task_info.obj_id,
          remark: that.form.summary,
          speedTime: that.form.duration,
          progress: that.form.percent,
          performance: that.form.performance,
          relativity: that.form.relativity,
          type: that.form.type
        };
      },
      ...mapState({
        task_follow: store => store.task_follow
      })
    },
    watch: {
      'task_follow.status'(cur) {
        let that = this;
        if(cur && that.task_follow.parent) {
          Object.assign(that.$data, that.$options.data());
          that.task_info = that.task_follow.parent;
        }
      }
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 30px;

  .task-follow {
    .main {
      transition: height 0.5s;
      .status {
        display: flex;
        padding: $up-down $left-right;
        border-bottom: 1px solid $lineColor;
        h4 {
          font-size: $h3Font;
          font-weight: normal;
          line-height: 1;
          color: $h2Color;
        }
        .radio {
          margin-left: 60px;
        }
      }
      .num {
        display: flex;
        justify-content: space-between;
        padding: $up-down $left-right;
        .el-form-item {
          .el-form-item__label {
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
      .rate {
        padding: 0 $left-right;
        overflow: hidden;
        transition: height 0.5s;
        .is-error .el-form-item__content span{
          color: #f56c6c;
        }
        .el-form-item__content {
          display: flex;
          align-items: center;
          margin-bottom: $up-down !important;
          &:last-child {
            margin-bottom: 0;
          }
          >span {
            width: 100px;
          }
          span {
            font-size: $h3Font;
            font-weight: 400;
            line-height: 1;
            color: $h2Color;
          }
          .el-rate {
            margin-left: 15px;
          }
        }
      }
      .summary {
        padding: 0 $left-right $up-down;
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
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 28px;
            color: $h3Color;
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
      .el-dialog__footer {
        padding-top: 0 !important;
      }
    }
  }
</style>
