<template>
  <div class="okr-publish custom-dialog" v-if="okr_publish.status">
    <el-dialog width="950px" :before-close="beforeClose" @close="closeDialog" :visible.sync="okr_publish.status">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
          <!-- name -->
          <el-form-item class="name" prop="okr_name">
            <el-input type="text" v-model="form.okr_name" maxlength="15" placeholder="给OKR起个简称吧(15字以内)"></el-input>
          </el-form-item>
          <!-- okr信息 -->
          <div class="title">
            <div class="bo">
              <img :src="form.bo_user.header_photo" alt="">
              <div class="item">
                <h4>Owner</h4>
                <p>{{form.bo_user.user_name}}</p>
              </div>
            </div>
            <div class="type">
              <h4>类型</h4>
              <el-dropdown @command="handleCommand" trigger="click">
                <p>{{form.okr_type.name}}<i class="iconfont icon-btn_more_s"></i></p>
                <el-dropdown-menu slot="dropdown" class="okr-type">
                  <el-dropdown-item v-for="(item, index) in project_type" :key="index" :command="item">{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="time">
              <h4>时间</h4>
              <date-range :range="form.daterange" @formatDate="formatDate">
                <p>
                  <span>{{`${form.daterange.start_time}-${form.daterange.end_time}`}}</span>
                  <i class="iconfont icon-btn_more_s"></i>
                </p>
              </date-range>
            </div>
          </div>
          <!-- 参与者 -->
          <div class="task-user">
            <member :member_list="form.task_user" @confirmUser="confirmUser"></member>
          </div>
          <!-- Objective -->
          <div class="objective">
            <h4>Objective</h4>
            <el-form-item prop="objective">
              <el-input type="textarea" v-model="form.objective" maxlength="50" placeholder="你的目标是什么?(50字以内)"></el-input>
            </el-form-item>
          </div>
          <!-- Key Result -->
          <div class="key-result">
            <h4>Key Result</h4>
            <div class="result">
              <ul class="list">
                <li v-for="(key_result, index) in form.key_result" :key="index">
                  <el-form-item :prop="`key_result.${index}.kr_name`" :rules="{required: true, message: ' ', trigger: 'change'}">
                    <el-input type="text" v-model="key_result.kr_name" maxlength="30" :placeholder="'请填写达成目标的关键衡量结果(30字以内)'"></el-input>
                  </el-form-item>
                  <div class="percent">
                    <h5>信心指数</h5>
                    <p>
                      <i class="el-icon-minus" :class="{hidden: key_result.confidenc_index <= 0}" @click="reducePercent(index)"></i>
                      <span>{{key_result.confidenc_index}}%</span>
                      <i class="el-icon-plus" :class="{hidden: key_result.confidenc_index >= 100}" @click="addPercent(index)"></i>
                    </p>
                  </div>
                  <i class="icon-btn_delete iconfont" :class="{hidden: form.key_result.length === 1}" @click="removeKeyResult(index)"></i>
                </li>
              </ul>
              <el-button class="add" @click="addKeyResult" v-if="form.key_result.length < 6">添加</el-button>
            </div>
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
  import OkrApi from '../../api/Okr.js';
  import Moment from '../../utils/business/moment.js';
  import {Member, DateRange} from '../../components/popup';
  let origin = {};

  export default {
    components: {Member, DateRange},
    data() {
      return {
        form: {
          okr_name: '',
          bo_user: '',
          okr_type: {
            id: 4,
            name: '个人'
          },
          daterange: {
            start_time: '',
            end_time: ''
          },
          task_user: [],
          objective: '',
          key_result: [
            {
              kr_id: null,
              kr_name: '',
              confidenc_index: 50
            }
          ]
        },
        project_type: [],
        rules: {
          okr_name: [{required: true, message: ' ', trigger: 'change'}],
          objective: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      getTypeList() {
        OkrApi().getTypeList({}).then(res => {
          this.project_type = res.data;
        });
      },
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
        if(that.form.key_result.length >= 6) {
          that.$message({message: '已经添加的够多了', type: 'warning'});
        } else {
          that.form.key_result.push({
            kr_id: null,
            kr_name: '',
            confidenc_index: 50
          });
        }
      },
      // 移除key-result
      removeKeyResult(index) {
        let that = this;
        that.$confirm(`确定删除KR${index + 1}?`, '删除', {type: 'warning'}).then(() => {
          if(that.form.key_result[index].kr_id) {
            OkrApi().deleteKrFromOkr({objId: that.form.key_result[index].obj_id, krId: that.form.key_result[index].kr_id}).then(res => {
              if(!res.status) that.$message({message: res.message, type: 'error'});
            });
          }
          that.form.key_result.splice(index, 1);
        });
      },
      // 增加指数
      addPercent(index) {
        let that = this;
        if(that.form.key_result[index].confidenc_index >= 100) {
          that.$message({message: '已经到顶了', type: 'warning'});
          return;
        }
        that.form.key_result[index].confidenc_index += 10;
      },
      // 减少指数
      reducePercent(index) {
        let that = this;
        if(that.form.key_result[index].confidenc_index <= 0) {
          that.$message({message: '不能再减了', type: 'warning'});
          return;
        }
        that.form.key_result[index].confidenc_index -= 10;
      },
      // 确认创建
      confirmSetup(formName) {
        let that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            if(that.okr_publish.type === 'edit') {
              that.okr_info.objId = that.okr_publish.source.obj_id;
              OkrApi().updateOkr(that.okr_info).then(res => {
                if(res.status) {
                  that.$emit('handleOkrEdit');
                  that.closeDialog();
                } else {
                  that.$message({message: res.message, type: 'error'});
                }
              });
            } else {
              OkrApi().createOkr(that.okr_info).then(res => {
                if(res.status) {
                  that.$emit('handleOkrPublish');
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
        this.$store.dispatch('setOKRPublish', {status: false, source: null});
      }
    },
    computed: {
      okr_info() {
        let that = this;
        const takeUser = [];
        const keyResult = [];
        for(let i = 0, LEN = that.form.task_user.length; i < LEN; i++) {
          takeUser.push(that.form.task_user[i].user_id);
        }
        for(let i = 0, LEN = that.form.key_result.length; i < LEN; i++) {
          keyResult.push({
            krId: that.form.key_result[i].kr_id || 0,
            name: that.form.key_result[i].kr_name,
            index: that.form.key_result[i].confidenc_index
          });
        }
        return {
          okrName: that.form.okr_name,
          boUser: that.form.bo_user.user_id,
          okrType: that.form.okr_type.id,
          startTime: Moment().format(that.form.daterange.start_time, 'YYYY-MM-DD'),
          endTime: Moment().format(that.form.daterange.end_time, 'YYYY-MM-DD'),
          takeUser,
          objectiveName: that.form.objective,
          keyResult
        };
      },
      ...mapState({
        self_info: store => store.self_info,
        okr_publish: store => store.okr_publish
      })
    },
    watch: {
      'okr_publish.type'(cur) {
        if(!cur) return;
        let that = this;
        Object.assign(that.$data, that.$options.data());
        if(cur === 'edit') {
          that.form =  {
            okr_name: that.okr_publish.source.okr_name,
            bo_user: that.okr_publish.source.bo_info,
            okr_type: {
              name: that.okr_publish.source.okr_type_name,
              id: that.okr_publish.source.okr_type
            },
            daterange: {
              start_time: Moment().format(that.okr_publish.source.start_time, 'YYYY/MM/DD'),
              end_time: Moment().format(that.okr_publish.source.end_time, 'YYYY/MM/DD')
            },
            task_user: that.okr_publish.source.participants,
            objective: that.okr_publish.source.objective_desc,
            key_result: that.okr_publish.source.key_result
          };
        } else if(cur === 'create') {
          that.form.bo_user = that.self_info;
        }
        this.getTypeList();
      },
      'form.daterange'() {
        origin = JSON.parse(JSON.stringify(this.$data.form));
      }
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 24px;

  .okr-publish {
    .main {
      max-height: 570px;
      overflow-y: auto;
      .name {
        padding: 8px $left-right $up-down;
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
      .title {
        position: relative;
        display: flex;
        height: 40px;
        padding: 0 $left-right $up-down;
        border-bottom: 1px solid $lineColor;
        .bo {
          display: flex;
          width: 240px;
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
              i {
                font-size: 12px;
              }
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
              color: $h1Color;
            }
          }
        }
      }
      .task-user {
        padding: $up-down $left-right 8px;
        border-bottom: 1px solid $lineColor;
      }
      .objective {
        position: relative;
        padding: $up-down $left-right;
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
        padding: $up-down $left-right 0;
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
              .el-form-item {
                flex: 1;
              }
              .is-error {
                input {
                  border-color: #f56c6c;
                }
              }
              input {
                box-sizing: border-box;
                width: 100%;
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
              .percent {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 170px;
                h5 {
                  font-size: $h4Font;
                  font-weight: normal;
                  line-height: 18px;
                  color: $h3Color;
                }
                p {
                  display: flex;
                  align-items: center;
                  span {
                    display: flex;
                    justify-content: center;
                    width: 50px;
                    margin: 0 16px;
                    font-size: $h2Font;
                    line-height: 25px;
                    color: $h1Color;
                  }
                  &:hover i{
                    visibility: visible;
                  }
                  >i {
                    visibility: hidden;
                    font-size: 16px;
                    color: #000;
                    cursor: pointer;
                    &.hidden {
                      visibility: hidden;
                    }
                  }
                }
              }
              >i {
                font-size: 24px;
                color: $linkBlue;
                cursor: pointer;
                &.hidden {
                  visibility: hidden;
                }
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__wrapper {
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding-top: $up-down!important;
    }
  }

  // okr类型
  .el-dropdown-menu {
    &.okr-type {
      padding: 0;
      .el-dropdown-menu__item {
        margin-bottom: 0;
        width: 100px;
        height: 47px;
        line-height: 47px;
        border-bottom: 1px solid $lineColor;
        font-size: $h3Font;
        color: $h1Color;
        &:hover {
          background-color: $backColor;
        }
      }
    }
  }
</style>


