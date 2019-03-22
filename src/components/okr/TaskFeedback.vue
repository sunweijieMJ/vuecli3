<template>
  <div class="task-feedback custom-dialog" v-if="task_feedback.status">
    <el-dialog width="752px" :before-close="beforeClose" @close="closeDialog" :visible.sync="task_feedback.status">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
          <div class="info">
            <div class="name">
              <span>KT</span>
              <h4>PGS信息流，OKR上线</h4>
            </div>
            <div class="num">
              <li v-for="(item, index) in 4" :key="index">
                <span>完成度</span>
                <p>50%</p>
              </li>
            </div>
            <p class="desc">
              <span>烧烧鱼饭</span>：这周有点问题，什么问题。这周有点问题，什么问题。这周有点什问题。这周有点问题什么问题。这周有点问题，什么问题。这周有点问题，什么问题。这周这周有点问题，什么问题。这周有点问题，什么问题。这周有点什么问题。这周有点问题什么问题。这周有点问题，什么问题。这周有点问题，什么问题。
            </p>
          </div>
          <div class="feedback"></div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-checkbox class="custom-checkbox" v-model="form.checked">仅本人可见</el-checkbox>
        <div class="btn">
          <el-button class="cancel" @click="beforeClose">取消</el-button>
          <el-button class="confirm" @click="confirmClose('ruleForm')">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import TaskApi from '../../api/Task.js';
  let origin = {};

  export default {
    data() {
      return {
        form: {
          checked: false
        },
        rules: {}
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
        this.$store.dispatch('setTaskFeedback', {status: false, source: null});
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
      ...mapState({
        task_feedback: store => store.task_feedback
      })
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 30px;

  .task-feedback {
    .main {
      .info {
        padding: $up-down $left-right;
        background-color: $backColor;
        .name {
          display: flex;
          align-items: center;
          span {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 36px;
            height: 16px;
            border-radius: 8px;
            background-color: $purple;
            font-size: $h3Font;
            color: #fff;
          }
          h4 {
            margin-left: 8px;
            font-size: $h3Font;
            font-weight: $h1Weight;
            line-height: 1;
            color: $h1Color;
          }
        }
        .num {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 25px;
          li {
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 150px;
            height: 48px;
            padding: 7px 0;
            &::after {
              position: absolute;
              content: '';
              top: 0; right: 0;
              width: 2px;
              height: 48px;
              background-color: #EAE9E9;
            }
            &:last-child::after {
              display: none;
            }
            span {
              font-size: $h4Font;
              line-height: 1;
              color: $h3Color;
            }
            p {
              font-size: $h3Font;
              font-weight: $h1Weight;
              line-height: 1;
              color: $h1Color;
            }
          }
        }
        .desc {
          @include erow(2);
          font-size: $h3Font;
          line-height: 25px;
          color: $h1Color;
          span {
            font-weight: $h1Weight;
          }
        }
      }
      .feedback {}
    }
    .el-dialog__wrapper {
      .el-dialog__header {
        padding: 0;
      }
      .el-dialog__footer {
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
