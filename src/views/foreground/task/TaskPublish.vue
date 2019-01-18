<template>
  <div class="task-publish">
    <el-dialog width="80%" @close="closeDialog" :visible.sync="task_publish.status">
      <h2 class="header" slot="title">Task</h2>
      <div class="main">
        <!-- okr信息 -->
        <div class="title">
          <div class="bo">
            <img src="" alt="">
            <div class="item">
              <h4>Bo</h4>
              <p>Omi</p>
            </div>
          </div>
          <div class="time">
            <div class="item">
              <h4>时间</h4>
              <el-date-picker
                v-model="form.daterange"
                type="daterange"
                format="yyyy/MM/dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <!-- <i class="iconfont icon-shopping_cart__ic_do"> -->
            </div>
          </div>
        </div>
        <!-- ktask -->
        <div class="ktask">
          <textarea placeholder="你的KT是什么？" v-model="form.ktask"></textarea>
        </div>
        <!-- 参与者 -->
        <member></member>
      </div>
      <div class="footer" slot="footer">
        <el-button class="cancel" @click="cancelSetup">取消</el-button>
        <el-button class="confirm" @click="confirmSetup">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import {Member} from '../../../components/popup';

  export default {
    components: {Member},
    data() {
      return {
        form: {
          daterange: '',
          ktask: '',
          key_result: [1, 2, 3, 4]
        }
      };
    },
    methods: {
      // 确认创建task
      confirmSetup() {
        let that = this;
        that.$confirm('确定删除KR?', '取消', {type: 'warning'}).then(() => {
          that.closeDialog();
        });
      },
      // 取消创建task
      cancelSetup() {
        let that = this;
        that.$confirm('确定删除KR?', '取消', {type: 'warning'}).then(() => {
          that.closeDialog();
        });
      },
      // 关闭dialog
      closeDialog() {
        this.$store.dispatch('setTaskPublish', {status: false, source: null});
      },
      addKeyResult() {
        this.form.key_result.push(1);
      },
      removeKeyResult(index) {
        let that = this;
        that.$confirm(`确定删除KR${index}?`, '删除', {type: 'warning'}).then(() => {
          that.form.key_result.pop();
        });
      }
    },
    computed: mapState(['task_publish'])
  };
</script>
<style lang="scss" scoped>
  $distance: 37px;

  .task-publish {
    .main {
      max-height: 500px;
      overflow-y: auto;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 30px $distance;
        .bo {
          display: flex;
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
          margin-right: 190px;
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
      .ktask {
        padding: 0 $distance;
        textarea {
          box-sizing: border-box;
          width: 100%;
          height: 73px;
          padding: 10px 20px;
          margin-top: 30px;
          border-radius: 2px;
          font-size: $h3Font;
          line-height: 25px;
          resize: none;
          border: none;
          background: $backColor;
          &::placeholder {
            font-size: $h3Font;
            line-height: 25px;
            color: $h3Color;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  $distance: 37px;

  .task-publish {
    .el-dialog__wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-dialog {
        margin: 0 auto !important;
        .el-dialog__header {
          padding: 28px $distance 0;
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
        }
        .el-dialog__footer {
          padding: 24px $distance;
        }
      }
    }
    .el-date-editor--daterange {
      width: 200px;
      height: 20px;
      padding: 0;
      border: 0;
      input {
        display: inline-flex;
        width: 90px;
        font-size: 15px;
        line-height: 20px;
        color: $h1Color;
        &::placeholder {
          text-align: left;
        }
      }
      i {
        display: none;
      }
      span {
        padding: 0;
        line-height: 20px;
      }
    }
  }
</style>


