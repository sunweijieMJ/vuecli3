<template>
  <div class="okr-publish">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="okr_publish.status">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item class="header" prop="okr_name">
          <input type="text" v-model="form.okr_name" placeholder="给OKR起个名称吧">
        </el-form-item>
        <div class="main">
          <!-- okr信息 -->
          <div class="title">
            <el-form-item prop="bo_user" class="bo">
              <img src="" alt="">
              <div class="item">
                <h4>Bo</h4>
                <p>Omi</p>
              </div>
            </el-form-item>
            <el-form-item prop="okr_type" class="type">
              <div class="item">
                <h4>类型</h4>
                <el-dropdown @command="handleCommand" trigger="click">
                  <p>{{form.okr_type ? form.okr_type : '选择'}}<i class="iconfont icon-shopping_cart__ic_do"></i></p>
                  <el-dropdown-menu slot="dropdown" class="okr">
                    <el-dropdown-item v-for="(item, index) in project_type" :key="index" :command="item">{{item}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-form-item>
            <el-form-item prop="daterange" class="time">
              <div class="item">
                <h4>时间</h4>
                <date-range @formatDate="formatDate">
                  <p>
                    <span>{{`${form.daterange.start_time}-${form.daterange.end_time}`}}</span>
                    <i class="iconfont icon-shopping_cart__ic_do"></i>
                  </p>
                </date-range>
              </div>
            </el-form-item>
          </div>
          <!-- 参与者 -->
          <el-form-item prop="task_user" class="task-user">
            <member :user_list="form.task_user" @confirmUser="confirmUser"></member>
          </el-form-item>
          <!-- Objective -->
          <div class="objective">
            <h4>Objective</h4>
            <el-form-item prop="objective">
              <textarea placeholder="你的Objective是什么？" v-model="form.objective"></textarea>
            </el-form-item>
          </div>
          <!-- Key Result -->
          <div class="key-result">
            <el-form-item prop="key_result">
              <h4>Key Result</h4>
            </el-form-item>
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
      </el-form>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="cancelSetup">取消</el-button>
        <el-button class="confirm" @click="confirmSetup('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {Member, DateRange} from '../../../components/popup';

  export default {
    components: {Member, DateRange},
    data() {
      return {
        form: {
          okr_name: '',
          bo_user: '',
          objective: '',
          okr_type: '',
          daterange: {
            start_time: '',
            end_time: ''
          },
          task_user: [],
          key_result: []
        },
        project_type: ['公司', '项目', '个人'],
        rules: {
          okr_name: [{required: true, message: '请填写OKR名称', trigger: 'change'}],
          bo_user: [{required: true, message: '请选择BO', trigger: 'change'}],
          okr_type: [{required: true, message: '请选择OKR类型', trigger: 'change'}],
          daterange: [{required: true, message: '请选择时间', trigger: 'change'}],
          task_user: [{required: true, message: '请选择参与者', trigger: 'change'}],
          objective: [{required: true, message: '请填写objective', trigger: 'change'}],
          key_result: [{required: true, message: '请填写key result', trigger: 'change'}]
        }
      };
    },
    methods: {
      formatDate(data) {
        this.form.daterange = JSON.parse(JSON.stringify(data));
      },
      confirmUser(data) {
        this.form.task_user = data;
      },
      confirmSetup(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.closeDialog();
            alert('submit!');
          } else {
            return false;
          }
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
      },
      handleCommand(command) {
        let that = this;
        that.form.okr_type = command;
      }
    },
    computed: mapState(['okr_publish'])
  };
</script>
<style lang="scss">
  $distance: 37px;

  .okr-publish {
    .header {
      padding: 30px $distance;
      input {
        box-sizing: border-box;
        width: 100%;
        height: 48px;
        padding-left: 20px;
        background-color: $backColor;
        border-radius: 2px;
        background-image: none !important;
      }
    }
    .main {
      max-height: 450px;
      overflow-y: auto;
      .title {
        position: relative;
        display: flex;
        height: 40px;
        padding: 0 $distance 30px;
        border-bottom: 1px solid $lineColor;
        .bo {
          display: flex;
          width: 240px;
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
          width: 230px;
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
      .task-user {
        position: relative;
        padding: 30px $distance 0;
        margin-bottom: 18px !important;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          left: 0;bottom: -30px;
          border-bottom: 1px solid $lineColor;
        }
      }
      .objective {
        position: relative;
        padding: $distance;
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
        padding: 25px $distance;
        h4 {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 25px;
          color: $themeColor;
        }
        .result {
          margin-top: 20px;
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
  $distance: 37px;

  .okr-publish {
    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 auto !important;
        .el-dialog__header {
          padding: 0;
          .el-dialog__headerbtn {
            top: 25px; right: -50px;
            .el-dialog__close {
              font-size: 24px;
              color: #fff;
            }
          }
        }
        // main
        .el-dialog__body {
          padding: 0;
          .el-form-item {
            display: flex;
            margin-bottom: 0;
            .el-form-item__content {
              display: flex;
              width: 100%;
              line-height: normal;
            }
          }
        }
        .el-dialog__footer {
          padding: 24px $distance;
        }
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

  #__lpform_input_idx_0 {
    display: none;
  }
</style>


