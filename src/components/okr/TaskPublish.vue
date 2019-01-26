<template>
  <div class="task-publish custom-dialog" v-if="task_publish.status">
    <el-dialog width="752px" :before-close="beforeClose" @close="closeDialog" :visible.sync="task_publish.status">
      <h2 class="header" slot="title">Task</h2>
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <div class="main">
          <!-- task信息 -->
          <div class="title">
            <div class="bo">
              <img :src="form.to_user.header_photo" alt="">
              <div class="item">
                <h4>Owner</h4>
                <p>{{form.to_user.user_name}}</p>
              </div>
            </div>
            <date-range v-model="form.daterange"></date-range>
          </div>
          <!-- ktask -->
          <div class="ktask">
            <el-form-item prop="task_content">
              <el-input type="textarea" v-model="form.task_content" maxlength="50" placeholder="请填写达成OKR的关键任务(50字以内)"></el-input>
            </el-form-item>
          </div>
          <!-- 参与者 -->
          <div class="task-user">
            <member v-model="form.task_user"></member>
          </div>
          <!-- 关联 -->
          <div class="relevancy">
            <relevancy :object_ids="form.object_ids"></relevancy>
          </div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="beforeClose">取消</el-button>
        <el-button class="confirm" @click="confirmSetup('ruleForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import TaskApi from '../../api/Task.js';
  import Moment from '../../utils/business/moment.js';
  import {DateRange, Member, Relevancy} from '../../components/popup';
  let origin = {};

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
          parent_id: 0,
          object_ids: []
        },
        rules: {
          task_content: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      // 确认创建task
      confirmSetup(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(that.task_publish.type === 'edit') {
              that.task_info.taskId = that.task_publish.source.task_id;
              TaskApi().updateTask(that.task_info).then(res => {
                if(res.status) {
                  that.$emit('handleTaskEdit');
                  that.closeDialog();
                } else {
                  that.$message({message: res.message, type: 'error'});
                }
              });
            } else {
              TaskApi().createTask(that.task_info).then(res => {
                if(res.status) {
                  that.$emit('handleTaskPublish');
                  that.closeDialog();
                } else {
                  that.$message({message: res.message, type: 'error'});
                }
              });
            }
          } else {
            that.$message({message: '请填写完整信息', type: 'warning'});
            return false;
          }
        });
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
        const objectIds = [];
        for(let i = 0, LEN = that.form.object_ids.length; i < LEN; i++) {
          objectIds.push(that.form.object_ids[i].obj_id);
        }
        return {
          toUser: that.form.to_user.user_id,
          startTime: Moment().format(that.form.daterange.start_time, 'YYYY-MM-DD'),
          endTime: Moment().format(that.form.daterange.end_time, 'YYYY-MM-DD'),
          taskContent: that.form.task_content,
          takeUser,
          parentId: that.form.parent_id,
          objectIds
        };
      },
      ...mapState({
        self_info: store => store.self_info,
        task_publish: store => store.task_publish
      })
    },
    watch: {
      'task_publish.type'(cur) {
        if(!cur) return;
        let that = this;
        Object.assign(that.$data, that.$options.data());
        if(cur === 'edit') {
          let object_ids = [];
          if(that.task_publish.source.parent_id) {
            object_ids.push(that.task_publish.source.parent_info);
          } else if (that.task_publish.source.obj_id) {
            object_ids = Object.values(that.task_publish.source.obj_infos);
          }

          that.form =  {
            to_user: that.task_publish.source.to_info,
            daterange: {
              start_time: Moment().format(that.task_publish.source.start_time, 'YYYY/MM/DD'),
              end_time: Moment().format(that.task_publish.source.end_time, 'YYYY/MM/DD')
            },
            task_content: that.task_publish.source.task_name,
            task_user: Object.values(that.task_publish.source.participants),
            parent_id: that.task_publish.source.parents_id,
            object_ids
          };
        } else {
          that.form.to_user = that.self_info;
          // 区分关联的上级
          if(cur && this.task_publish.parent) {
            if(this.task_publish.parent.okr_type) {
              that.form.parent_id = 0;
              that.form.object_ids.push({
                obj_id: this.task_publish.parent.obj_id,
                okr_type_name: this.task_publish.parent.okr_type_name,
                okr_name: this.task_publish.parent.okr_name
              });
            } else {
              that.form.parent_id = this.task_publish.parent.task_id;
              that.form.object_ids.push({
                task_id: this.task_publish.parent.task_id,
                task_name: this.task_publish.parent.task_name
              });
            }
          }
        }
      },
      'form.daterange'() {
        origin = JSON.parse(JSON.stringify(this.$data.form));
      }
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
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid $lineColor;
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
            i {
              font-size: 12px;
            }
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
        padding: $up-down $left-right 18px;
        border-bottom: 1px solid $lineColor;
      }
      .relevancy {
        padding: $up-down $left-right 18px;
      }
    }

    .el-dialog__wrapper {
      .el-dialog__header {
        padding: 28px $left-right 0;
        .header {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 30px;
          color: $themeColor;
        }
      }
    }
  }
</style>


