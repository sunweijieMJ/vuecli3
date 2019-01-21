<template>
  <div class="task-publish">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="task_publish.status">
      <h2 class="header" slot="title">Task</h2>
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <div class="main">
          <!-- task信息 -->
          <div class="title">
            <div class="bo">
              <img :src="self_info.header_photo" alt="">
              <div class="item">
                <h4>To</h4>
                <p>{{self_info.user_name}}</p>
              </div>
            </div>
            <div class="time">
              <div class="item">
                <h4>时间</h4>
                <date-range @formatDate="formatDate">
                  <p>
                    <span>{{`${form.daterange.start_time}-${form.daterange.end_time}`}}</span>
                    <i class="iconfont icon-shopping_cart__ic_do"></i>
                  </p>
                </date-range>
              </div>
            </div>
          </div>
          <!-- ktask -->
          <div class="ktask">
            <el-form-item prop="task_content">
              <el-input type="textarea" v-model="form.task_content" placeholder="你的KT是什么？"></el-input>
            </el-form-item>
          </div>
          <!-- 参与者 -->
          <div class="task-user">
            <member :user_list="form.task_user" @confirmUser="confirmUser"></member>
          </div>
          <!-- 关联 -->
          <div class="relevancy">
            <relevancy :ktask_list="form.object_ids"></relevancy>
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
  import TaskApi from '../../../api/Task.js';
  import Moment from '../../../utils/business/moment.js';
  import {DateRange, Member, Relevancy} from '../../../components/popup';

  export default {
    components: {DateRange, Member, Relevancy},
    data() {
      return {
        form: {
          to_user: '',
          daterange: {
            start_time: '',
            end_time: ''
          },
          task_content: '',
          task_user: [],
          parent_id: '',
          object_ids: [
            {
              type: 'KT',
              name: 'LANEHUB商品2.0'
            }
          ]
        },
        rules: {
          task_content: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      // 日期选择回调
      formatDate(data) {
        this.form.daterange = JSON.parse(JSON.stringify(data));
      },
      // 参与者添加回调
      confirmUser(data) {
        this.form.task_user = data;
      },
      // 确认创建task
      confirmSetup(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.closeDialog();
            TaskApi().createTask(that.task_info).then(res => {
              console.log(res)
            });
          } else {
            return false;
          }
        });
      },
      // 取消创建task
      cancelSetup() {
        let that = this;
        that.$confirm('您填写的内容将不做保留', '取消', {type: 'warning'}).then(() => {
          that.closeDialog();
        });
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setTaskPublish', {status: false, source: null});
      }
    },
    computed: {
      task_info() {
        let that = this;
        const takeUser = [];
        for(let i = 0, LEN = that.form.task_user.length; i < LEN; i++) {
          takeUser.push(that.form.task_user[i].user_id);
        }
        return {
          toUser: that.form.to_user || that.self_info.user_id,
          startTime: Moment().format(that.form.daterange.start_time, 'YYYY-MM-DD'),
          endTime: Moment().format(that.form.daterange.end_time, 'YYYY-MM-DD'),
          taskContent: that.form.task_content,
          takeUser,
          parentId: that.form.parent_id,
          objectIds: that.form.object_ids
        };
      },
      ...mapState({
        self_info: store => store.self_info,
        task_publish: store => store.task_publish
      })
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 30px;

  .task-publish {
    .main {
      max-height: 500px;
      overflow-y: auto;
      .title {
        display: flex;
        padding: $up-down $left-right;
        .bo {
          display: flex;
          width: 235px;
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
      .ktask {
        padding: 0 $left-right $up-down;
        border-bottom: 1px solid $lineColor;
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
          border-radius: 2px;
          font-size: $h3Font;
          line-height: 25px;
          resize: none;
          border-color: #fff;
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 25px;
            color: $h3Color;
          }
        }
      }
      .task-user {
        padding: $up-down $left-right;
        border-bottom: 1px solid $lineColor;
      }
      .relevancy {
        padding: $up-down $left-right;
      }
    }

    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 auto !important;
        .el-dialog__header {
          padding: 28px $left-right 0;
          .header {
            font-size: $h1Font;
            font-weight: $h1Weight;
            line-height: 30px;
            color: $themeColor;
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
            margin-bottom: 0;
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


