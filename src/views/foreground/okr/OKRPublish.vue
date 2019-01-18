<template>
  <div class="okr-publish">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="okr_publish.status">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item class="header" prop="okr_name">
          <el-input type="text" v-model="form.okr_name" placeholder="给OKR起个名称吧"></el-input>
        </el-form-item>
        <div class="main">
          <!-- okr信息 -->
          <div class="title">
            <div class="bo">
              <img :src="self_info.header_photo" alt="">
              <div class="item">
                <h4>Bo</h4>
                <p>{{self_info.user_name}}</p>
              </div>
            </div>
            <div class="type">
              <h4>类型</h4>
              <el-dropdown @command="handleCommand" trigger="click">
                <p>{{form.okr_type}}<i class="iconfont icon-shopping_cart__ic_do"></i></p>
                <el-dropdown-menu slot="dropdown" class="okr">
                  <el-dropdown-item v-for="(item, index) in project_type" :key="index" :command="item">{{item}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="time">
              <h4>时间</h4>
              <date-range @formatDate="formatDate">
                <p>
                  <span>{{`${form.daterange.start_time}-${form.daterange.end_time}`}}</span>
                  <i class="iconfont icon-shopping_cart__ic_do"></i>
                </p>
              </date-range>
            </div>
          </div>
          <!-- 参与者 -->
          <div class="task-user">
            <member :user_list="form.task_user" @confirmUser="confirmUser"></member>
          </div>
          <!-- Objective -->
          <div class="objective">
            <h4>Objective</h4>
            <el-form-item prop="objective">
              <el-input type="textarea" v-model="form.objective" placeholder="你的Objective是什么？"></el-input>
            </el-form-item>
          </div>
          <!-- Key Result -->
          <div class="key-result">
            <h4>Key Result</h4>
            <div class="result">
              <ul class="list">
                <li v-for="(item, index) in form.key_result" :key="index">
                  <el-input type="text" v-model="item.name" :placeholder="`KR${index + 1}`"></el-input>
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
  import OkrApi from '../../../api/Okr.js';
  import {Member, DateRange} from '../../../components/popup';

  export default {
    components: {Member, DateRange},
    data() {
      return {
        form: {
          okr_name: '',
          bo_user: '',
          okr_type: '项目',
          daterange: {
            start_time: '',
            end_time: ''
          },
          task_user: [],
          objective: '',
          key_result: [
            {
              name: '',
              index: 0
            }
          ]
        },
        project_type: ['公司', '项目', '个人'],
        rules: {
          okr_name: [{required: true, message: ' ', trigger: 'change'}],
          objective: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      // 选择okr类型
      handleCommand(command) {
        let that = this;
        that.form.okr_type = command;
      },
      // 日期选择回调
      formatDate(data) {
        this.form.daterange = JSON.parse(JSON.stringify(data));
      },
      // 参与者添加回调
      confirmUser(data) {
        this.form.task_user = data;
      },
      // 添加key-result
      addKeyResult() {
        let that = this;
        that.form.key_result.push({
          name: '',
          index: that.form.key_result.length
        });
      },
      // 移除key-result
      removeKeyResult(index) {
        let that = this;
        that.$confirm(`确定删除KR${index}?`, '删除', {type: 'warning'}).then(() => {
          that.form.key_result.pop();
        });
      },
      // 确认创建
      confirmSetup(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.closeDialog();
            OkrApi().createOkr(that.okr_info).then().then(res => {
              console.log(res)
            });
          } else {
            return false;
          }
        });
      },
      // 取消创建
      cancelSetup() {
        let that = this;
        that.$confirm('您填写的内容将不做保留', '取消', {type: 'warning'}).then(() => {
          that.closeDialog();
        });
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setOKRPublish', {status: false, source: null});
      }
    },
    computed: {
      okr_info() {
        let that = this;
        const takeUser = [];
        for(let i = 0, LEN = that.form.task_user.length; i < LEN; i++) {
          takeUser.push(that.form.task_user[i].user_id);
        }
        return {
          okrName: that.form.okr_name,
          boUser: that.form.bo_user,
          okrType: that.form.okr_type,
          startTime: that.form.daterange.start_time,
          endTime: that.form.daterange.end_time,
          takeUser,
          objectiveName: that.form.objective,
          keyResult: that.form.key_result
        };
      },
      ...mapState({
        self_info: store => store.self_info,
        okr_publish: store => store.okr_publish
      })
    },
    watch: {
      self_info(cur) {
        this.form.task_user.push(cur);
      }
    }
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
        border-color: #fff;
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
          width: 230px;
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
        .time {
          h4 {
            font-size: $h4Font;
            font-weight: normal;
            color: $h3Color;
          }
          p {
            cursor: pointer;
          }
        }
      }
      .task-user {
        padding: 30px $distance;
        border-bottom: 1px solid $lineColor;
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
        .is-error {
          textarea {
            border-color: #f56c6c;
          }
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
          border-color: #fff;
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
                border-color: #fff;
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


