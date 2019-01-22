<template>
  <div class="okr-publish custom-dialog">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="okr_publish.status">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <el-form-item class="header" prop="okr_name">
          <el-input type="text" v-model="form.okr_name" placeholder="给OKR起个名称吧"></el-input>
        </el-form-item>
        <div class="main">
          <!-- okr信息 -->
          <div class="title">
            <div class="bo">
              <img :src="form.bo_user.header_photo" alt="">
              <div class="item">
                <h4>Bo</h4>
                <p>{{form.bo_user.user_name}}</p>
              </div>
            </div>
            <div class="type">
              <h4>类型</h4>
              <el-dropdown @command="handleCommand" trigger="click">
                <p>{{form.okr_type.name}}<i class="iconfont icon-shopping_cart__ic_do"></i></p>
                <el-dropdown-menu slot="dropdown" class="okr-type">
                  <el-dropdown-item v-for="(item, index) in project_type" :key="index" :command="item">{{item.name}}</el-dropdown-item>
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
            <member :member_list="form.task_user" @confirmUser="confirmUser"></member>
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
                <li v-for="(key_result, index) in form.key_result" :key="index">
                  <el-form-item :prop="`key_result.${index}.kr_name`" :rules="{required: true, message: ' ', trigger: 'change'}">
                    <el-input type="text" v-model="key_result.kr_name" :placeholder="`KR${index + 1}`"></el-input>
                  </el-form-item>
                  <div class="number">
                    <i class="el-icon-minus" @click="reducePercent(index)"></i>
                    <div class="percent">
                      <h5>信心指数</h5>
                      <p>{{key_result.confidenc_index}}%</p>
                    </div>
                    <i class="el-icon-plus" @click="addPercent(index)"></i>
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
  import OkrApi from '../../../../api/Okr.js';
  import Moment from '../../../../utils/business/moment.js';
  import {Member, DateRange} from '../../../../components/popup';

  export default {
    components: {Member, DateRange},
    data() {
      return {
        form: {
          okr_name: '',
          bo_user: '',
          okr_type: {
            name: '个人',
            type: 4
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
              confidenc_index: 0
            }
          ]
        },
        project_type: [
          {
            name: '公司',
            type: 1
          },
          {
            name: '项目',
            type: 2
          },
          {
            name: '部门',
            type: 3
          },
          {
            name: '个人',
            type: 4
          }
        ],
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
          kr_id: null,
          kr_name: '',
          confidenc_index: 0
        });
      },
      // 移除key-result
      removeKeyResult(index) {
        let that = this;
        that.$confirm(`确定删除KR${index + 1}?`, '删除', {type: 'warning'}).then(() => {
          if(that.form.key_result[index].kr_id) {
            OkrApi().deleteKrFromOkr({objId: that.form.key_result[index].obj_id, krId: that.form.key_result[index].kr_id}).then(res => {
              console.log(res);
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
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.closeDialog();
            OkrApi().createOkr(that.okr_info).then(res => {
              alert(res.data.id);
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
        const keyResult = [];
        for(let i = 0, LEN = that.form.task_user.length; i < LEN; i++) {
          takeUser.push(that.form.task_user[i].user_id);
        }
        for(let i = 0, LEN = that.form.key_result.length; i < LEN; i++) {
          keyResult.push({
            name: that.form.key_result[i].kr_name,
            index: that.form.key_result[i].confidenc_index
          });
        }
        return {
          okrName: that.form.okr_name,
          boUser: that.form.bo_user.user_id,
          okrType: that.form.okr_type.type,
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
      self_info(cur) {
        this.form.bo_user = cur;
      },
      'okr_publish.source'(cur) {
        if(!cur) return;
        let that = this;
        that.form =  {
          okr_name: cur.okr_name,
          bo_user: cur.bo_info,
          okr_type: {
            name: cur.okr_type_name,
            type: cur.okr_type
          },
          daterange: {
            start_time: Moment().format(cur.start_time, 'YYYY/MM/DD'),
            end_time: Moment().format(cur.end_time, 'YYYY/MM/DD')
          },
          task_user: Object.values(cur.participants),
          objective: cur.objective_desc,
          key_result: Object.values(cur.key_result)
        };
      }
    }
  };
</script>
<style lang="scss">
  $left-right: 37px;
  $up-down: 20px;

  .okr-publish {
    .header {
      padding: $up-down $left-right;
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
      max-height: 470px;
      overflow-y: auto;
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
              .number {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 170px;
                .percent {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin: 0 18px;
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
                &:hover i{
                  display: inline-flex;
                }
                >i {
                  display: none;
                  font-size: 16px;
                  color: #000;
                  cursor: pointer;
                }
              }
              >i {
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

  .el-dialog__wrapper {
    .el-dialog__header {
      padding: 0;
    }
  }

  // okr类型
  .el-dropdown-menu {
    &.okr-type {
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
</style>


