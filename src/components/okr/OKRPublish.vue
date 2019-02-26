<template>
  <div class="okr-publish custom-dialog" v-if="okr_publish.status">
    <el-dialog width="950px" :before-close="beforeClose" @close="closeDialog" :visible.sync="okr_publish.status">
      <h2 class="header" slot="title">OKR</h2>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
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
            <date-range v-model="form.daterange"></date-range>
          </div>
          <!-- 参与者 -->
          <div class="task-user">
            <member v-model="form.task_user"></member>
          </div>
          <!-- Objective -->
          <div class="objective">
            <h4>Objective</h4>
            <el-form-item prop="objective">
              <el-input class="custom-input" type="textarea" v-model="form.objective" maxlength="50" placeholder="你的目标是什么?(50字以内)"></el-input>
            </el-form-item>
          </div>
          <!-- Key Result -->
          <div class="key-result">
            <h4>Key Result</h4>
            <div class="result">
              <ul class="list">
                <li v-for="(key_result, index) in form.key_result" :key="index">
                  <el-form-item :prop="`key_result.${index}.kr_name`" :rules="{required: true, message: ' ', trigger: 'change'}">
                    <el-input class="custom-input" type="text" v-model="key_result.kr_name" maxlength="50" :placeholder="'请填写达成目标的关键衡量结果(50字以内)'"></el-input>
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
          bo_user: '',
          okr_type: '',
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
          objective: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      getKindList() {
        let that = this;
        OkrApi().getKindList({type: 'create'}).then(res => {
          that.project_type = res.data;
          if(!that.form.okr_type) that.form.okr_type = that.project_type[0];
          origin = JSON.parse(JSON.stringify(this.$data.form));
        });
      },
      // 选择okr类型
      handleCommand(command) {
        this.form.okr_type = command;
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
        const ele = that.$el.querySelector('.main');
        this.$nextTick(() => {
          ele.scrollTop = ele.scrollHeight;
        });
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
                  that.$message({message: '编辑成功', type: 'success'});
                } else {
                  that.$message({message: res.message, type: 'error'});
                }
              });
            } else {
              OkrApi().createOkr(that.okr_info).then(res => {
                if(res.status) {
                  that.$emit('handleOkrPublish');
                  that.closeDialog();
                  that.$message({message: '创建成功', type: 'success'});
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
            bo_user: that.okr_publish.source.bo_info,
            okr_type: {
              name: that.okr_publish.source.okr_type_name,
              id: that.okr_publish.source.okr_type
            },
            daterange: {
              start_time: Moment().format(that.okr_publish.source.start_time, 'YYYY/MM/DD'),
              end_time: Moment().format(that.okr_publish.source.end_time, 'YYYY/MM/DD')
            },
            task_user: Object.values(that.okr_publish.source.participants),
            objective: that.okr_publish.source.objective_name,
            key_result: that.okr_publish.source.key_result
          };
        } else if(cur === 'create') {
          that.form.bo_user = that.self_info;
        }
        this.getKindList();
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
    .el-dialog__wrapper {
      .el-dialog__header {
        padding: $up-down $left-right;
        .header {
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 30px;
          color: $themeColor;
        }
      }
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


