<template>
  <div class="init">
    <div class="box">
      <div class="icon">
        <div>
          <span class="iconfont icon-icon_lanehub"></span>
        </div>
        <div class="line"></div>
        <div>
          <span class="iconfont icon-icon_PGS"></span>
        </div>
      </div>
      <div class="discription" v-if="status === 0">Hi，亲爱的LANEHUBBER，欢迎使用PGS</div>
      <div class="discription" v-if="status === 2">Ops…好像没有输入正确的工作邮箱</div>
      <div class="discription" v-if="status === 1">已发送密码至你的邮箱 {{push_email}} ，请在邮件中查看</div>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="100px" class="demo-ruleForm">
        <el-form-item
        prop="email">
          <el-input class="custom-input" type="text" v-model="ruleForm2.email" auto-complete="off" @input="change" placeholder="工作邮箱地址"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input class="custom-input" type="password" v-model="ruleForm2.pass" auto-complete="off" @input="change" placeholder="密码"></el-input>
          <p v-show="login_judge" class="pass_error">邮箱或密码不正确</p>
        </el-form-item>
        <el-form-item>
          <div class="security">
            <span class="push-sec" v-show="!show && !checkout_state" @click="countDown">获取密码</span>
            <span class="push-sec" v-show="!show && checkout_state">获取密码</span>
            <span v-show="show" class="countdown">{{time}}</span>
          </div>
          <el-button type="primary" v-if="!login_checkout" @click="submitForm('ruleForm2')">登录</el-button>
          <el-button type="primary" v-if="login_checkout">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import storage from '../../utils/storage';
import {blocked} from '../../utils/business/tools.js';
import userApi from '../../api/User.js';
export default {
  name: 'login',
  data(){
    return{
      checkout_state: false, // ETC 获取验证码切换状态
      login_checkout: false, // ETC 登陆切换状态防抖

      status: 0, // ETC 提示信息展示
      firm_dis: true, // ETC 获取密码防抖
      show: false,
      time: '', // ETC 倒计时
      ruleForm2: {
        pass: '',
        email: ''
      },
      push_email: '', // ETC 发送邮箱密码显示的文本
      rules2: {
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'}
        ],
        pass: [{validator: this.validatePass}]
      },
      login_judge: false
    };
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
        this.login_judge = false;
      }
    },
    change(){
      this.login_judge = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
      this.login_checkout = true;
      if(this.ruleForm2.pass && this.ruleForm2.email && this.login_checkout){
        userApi().getLogin({email: this.ruleForm2.email, passwd: this.ruleForm2.pass}).then(res => {
          if(res.status){
            storage('cookie').set('pgs_authinfo', res.data.pgs_authinfo, 31636000);
            storage('cookie').set('pgs_userId', res.data.user_id, 31636000);
            this.$message({message: '登录成功', type: 'success', duration: 1000});
            setTimeout(() => {
              this.$router.push({name: 'IdeaList'});
              // this.status = 0;
              this.login_judge = false;
              this.login_checkout = false;
            }, 1000);
          }else{
            this.login_judge = true;
            this.login_checkout = false;
          }
        });
      }else{
        this.login_checkout = false;
      }
    },
    // 获取验证码
    getConfirm(){
      this.status = 0;
      this.firm_dis = false;
      this.checkout_state = true;
      let Reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if(!this.firm_dis && this.ruleForm2.email && Reg.test(this.ruleForm2.email)){
        let time = 60;
        let timeStop = setInterval(() => {
          time--;
          if (time > 0) {
            this.show = true;
            this.time = time + ' ' + 's ' + '后可再次发送';
          }else{
            time = 60; // ETC当减到0时赋值为60
            this.show = false;
            clearInterval(timeStop);// ETC 清除定时器
            this.firm_dis = true;
            this.checkout_state = false;
          }
        }, 1000);
        userApi().getPssword({email: this.ruleForm2.email}).then(res => {
          if(res.status){
            this.push_email = this.ruleForm2.email;
            this.status = 1;
          }else{
            this.$message({message: res.message, type: 'warning', duration: 1000});
          }
        });
      }else{
        this.status = 2;
        this.$message({message: '请输入正确的邮箱', type: 'warning', duration: 1000});
        this.checkout_state = false;
      }
    },
    // 计时器
    countDown(){
      blocked(this.getConfirm, 0.5)();
    }
  }
};
</script>
<style lang="scss" scoped>
@media (max-width: 750px) {
  body {
    width: 750px;
  }
}
@media (min-width: 751px) {
  body {
    width: 100%;
  }
}
.pass_error{
  color: #f56c6c;
  position: absolute;
  left: 19px;
  margin-top: 5px;
  font-size: 12px;
}
.init{
  background:rgba(246,246,246,1);
  background-image: url('../../../static/img/login_bg.png');
  background-size: 100% auto;
  -webkit-background-size: 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  .box{
    margin: auto;
    text-align: center;
    @media only screen and (min-width: 800px){
      position: relative;
      right: 180px;
    }
  }
  .icon{
    padding-top: 147px;
    // margin-bottom: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    .line{
      margin-left: 32px;
      margin-right: 32px;
      width: 2px;
      height: 44px;
      background-color: white;
    }
    span{
      color: white;
    }
    .icon-icon_lanehub{
      font-size: 46px;
    }
    .icon-icon_PGS{
      font-size: 110px;
    }
  }
  .discription{
    font-size:20px;
    color:rgba(255,255,255,1);
    margin-bottom: 20px;
  }
  .security{
    padding: 0 10px;
    display: flex;
    justify-content: flex-end;
    font-size:14px;
    color:#92B2E5;
    margin-bottom: 18px;
    .push-sec{
      cursor: pointer;
    }
    .countdown{
      font-size:14px;
      color:rgba(144,147,153,1);
    }
    span{
      line-height: 1;
    }
  }
}
</style>
<style lang="scss">
.init > .box > .el-form{
  width: 315px;
  margin: auto;
}
.init > .box > .el-form > .el-form-item > .el-form-item__content > .el-input {
  width: 315px !important;
  height: 40px !important;
  background:rgba(255,255,255,1);
  border-radius: 20px;
  line-height: 40px;
  position: relative;
  z-index: 99 !important;
}
.init > .box > .el-form > .el-form-item > .el-form-item__content{
  margin-left: 0 !important;
  line-height: 1;
  .el-form-item__error{
    left: 19px;
  }
}
.init > .box > .el-form > .el-form-item > .el-form-item__content > .el-input > .el-input__inner{
  border-radius: 20px;
  background:rgba(255,255,255,1);
  border: none;
  height: 40px;
  padding: 10px 20px;
  &::placeholder {
    font-size: $h3Font;
    line-height: 22px;
    color: $h3Color;
  }
}
.init > .box > .el-form > .el-form-item > .el-form-item__content > .el-button {
  width: 312px;
  border-radius: 20px;
  border: none;
  font-size: 18px;
  font-weight: 500;
  color:rgba(255,255,255,1);
  background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
}
</style>
