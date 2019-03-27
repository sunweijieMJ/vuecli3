<template>
  <div class="task-feedback custom-dialog" v-if="task_feedback.status">
    <el-dialog width="752px" :before-close="beforeClose" @close="closeDialog" :visible.sync="task_feedback.status">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <div class="main">
          <div class="info">
            <div class="name">
              <span>KT</span>
              <h4>{{kt_info.task_name}}</h4>
            </div>
            <div class="num" v-if="kt_info.check_info">
              <li>
                <span>完成度</span>
                <p>{{kt_info.progress}}%</p>
              </li>
              <li>
                <span>总投入时长</span>
                <p>{{kt_info.spend_time}}天</p>
              </li>
              <li>
                <span>满意度</span>
                <el-rate class="small-rate" v-model="kt_info.review_performance" show-score disabled :allow-half="true" show-text
                  :disabled-void-color="'#c0c4cc'"
                  :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </li>
              <li>
                <span>相关度</span>
                <el-rate class="small-rate" v-model="kt_info.review_relativity" show-score disabled :allow-half="true" show-text
                  :disabled-void-color="'#c0c4cc'"
                  :disabled-void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </li>
            </div>
            <div class="desc">
              <div class="text">
                <span><strong>{{kt_info.creator_info.real_name}}</strong> 的自评：</span>
                <p :style="{'-webkit-line-clamp': show_text ? 'initial' : 2}" v-html="textFilter(kt_info.review_comment)"></p>
              </div>
              <i class="iconfont" @click="show_text = !show_text" :class="show_text ? 'icon-xiangshang' : 'icon-xiangxia'"></i>
            </div>
          </div>
          <div class="feedback">
            <h4>你的反馈</h4>
            <div class="rate">
              <el-form-item prop="performance" :key="form.performance + 'performance'">
                <span>KT完成表现分</span>
                <el-rate class="middle-rate" v-model="form.performance" :allow-half="true" show-text :texts="['糟糕', '失望', '一般', '满意', '超预期']"
                  :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </el-form-item>
              <el-form-item prop="relativity" :key="form.relativity + 'relativity'">
                <span>OKR相关程度</span>
                <el-rate class="middle-rate" v-model="form.relativity" :allow-half="true" show-text :texts="['糟糕', '失望', '一般', '满意', '超预期']"
                  :void-icon-class="'icon-icon_star iconfont'" :icon-classes="['icon-icon_star iconfont', 'icon-icon_star iconfont','icon-icon_star iconfont']"></el-rate>
              </el-form-item>
            </div>
            <el-form-item prop="remark">
              <el-input class="custom-input" type="textarea" v-model="form.remark" maxlength="500" placeholder="详细描述你的观点，帮助下属成长"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div class="footer" slot="footer">
        <el-checkbox class="custom-checkbox" v-model="form.self_view">仅KT的Owner可见</el-checkbox>
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
  import textFilter from '../../utils/filters/textFilter.js';
  import {validatePerformance} from './validate.js';

  export default {
    data() {
      return {
        textFilter,
        show_text: true,
        form: {
          performance: 0, // ETC 满意度
          relativity: 0, // ETC 相关度
          remark: '', // ETC 反馈信息
          self_view: false // ETC 仅本人可见
        },
        rules: {
          performance: [{required: true, validator: validatePerformance, trigger: 'change'}],
          relativity: [{required: true, validator: validatePerformance, trigger: 'change'}],
          remark: [{required: true, message: ' ', trigger: 'change'}]
        }
      };
    },
    methods: {
      calcDesc() {
        let that = this;
        const p = that.$el.querySelector('.desc p');
        if(p.offsetHeight <= 50 && p.style['-webkit-line-clamp'] === 'initial') {
          p.parentNode.nextSibling.style.display = 'none';
        } else {
          that.show_text = false;
        }
      },
      // 确认关闭
      confirmClose(formName) {
        let that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = Object.assign({}, {task_id: that.kt_info.task_id}, that.form);
            TaskApi().feedback(params).then(res => {
              if(res.status) {
                this.$emit('handleTaskFeedback');
                that.closeDialog();
                that.$message({message: '反馈成功', type: 'success'});
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
    watch: {
      'task_feedback.status'(cur) {
        if(cur) {
          let that = this;
          Object.assign(that.$data, that.$options.data());
          that.$nextTick(() => {
            this.calcDesc();
          });
        }
      }
    },
    computed: {
      kt_info() {
        return this.task_feedback.parent;
      },
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
      max-height: 500px;
      overflow-y: auto;
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
            line-height: 1.4;
            color: $h1Color;
          }
        }
        .num {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 44px;
          margin: 25px 0 14px;
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
          display: flex;
          padding: 0 30px 0 44px;
          .text {
            span {
              font-size: $h3Font;
              line-height: 1;
              color: $h1Color;
            }
            p {
              position: relative;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              font-size: $h3Font;
              line-height: 25px;
              color: $h1Color;
            }
          }
          i {
            align-self: flex-end;
            font-size: 14px;
            line-height: 14px;
            cursor: pointer;
          }
        }
      }
      .feedback {
        padding: 0 $left-right;
        h4 {
          margin: $up-down 0;
          font-size: $h1Font;
          font-weight: $h1Weight;
          line-height: 1;
          color: $themeColor;
        }
        .rate {
          .is-error .el-form-item__content span{
            color: #f56c6c;
          }
          .el-form-item__content {
            display: flex;
            margin-bottom: 30px;
            .el-rate__text {
              font-size: $h3Font;
              font-weight: 400;
              line-height: 1;
              color: $h2Color;
            }
            >span {
              display: inline-flex;
              align-items: center;
              width: 100px;
              margin-right: 40px;
              font-size: $h3Font;
              line-height: 1;
              color: $h2Color;
            }
          }
        }
        .el-form-item {
          textarea {
            height: 184px;
          }
        }
      }
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
