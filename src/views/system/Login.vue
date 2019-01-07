<template>
  <div class="init">
    <div class="box">
      <div class="title">PGS</div>
      <div class="discription" v-if="status === 0">Hi，亲爱的LANEHUBER，欢迎使用PGS</div>
      <div class="discription" v-if="status === 2">Ops…好像没有输入正确的工作邮箱</div>
      <div class="discription" v-if="status === 1">已发送密码至你的邮箱 {{push_email}} ，请在邮件中查看</div>
      <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item
        prop="email">
          <el-input type="text" v-model="ruleForm2.email" autocomplete="off" placeholder="工作邮箱地址"></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" autocomplete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="security">
            <span class="push-sec" v-show="!show" @click="countDown">获取密码</span>
            <span v-show="show" class="countdown">{{time}}</span>
          </div>
          <el-button type="primary" @click="submitForm('ruleForm2')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
const storageApi = require('../../utils/storage')('cookie');

import userApi from '../../api/User.js';
export default {
  name: 'login',
  data(){
    return{
      status: 0, // ETC 提示信息展示
      firm_dis: true, // ETC 获取密码防抖
      login_status: true, // ETC 登陆防抖
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
      }
    };
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
    },
    submitForm(formName) {
      // submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      // },
      this.login_status = false;
      if(this.ruleForm2.pass && this.ruleForm2.email && !this.login_status){
        userApi().getLogin({email: this.ruleForm2.email, passwd: this.ruleForm2.pass}).then(res => {
          if(res.status){
            storageApi.set('pgs_authinfo', res.data.pgs_authinfo, 31636000);
            this.$message({message: '登陆成功', type: 'success', duration: 1000});
            setTimeout(() => {
              this.$router.push({name: 'IdeaList'});
              // this.status = 0;
              this.login_status = true;
            }, 1000);
          }else{
            this.$message({message: '邮箱或密码不正确', type: 'warning', duration: 1000});
          }
        });
      }
    },
    // 计时器
    countDown(){
      this.firm_dis = false;
      let Reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if(!this.firm_dis && this.ruleForm2.email && Reg.test(this.ruleForm2.email)){
        userApi().getPssword({email: this.ruleForm2.email}).then(res => {
          if(res.status){
            this.push_email = this.ruleForm2.email;
            this.status = 1;
            let time = 50;
            let timeStop = setInterval(() => {
              time--;
              if (time > 0) {
                this.show = true;
                this.time = time + ' ' + 's ' + '后可再次发送';
              }else{
                time = 50; // ETC当减到0时赋值为60
                this.show = false;
                clearInterval(timeStop);// ETC 清除定时器
                this.firm_dis = true;
              }
            }, 1000);
          }
        });
      }else{
        this.status = 2;
        this.$message({message: '请输入正确的邮箱', type: 'warning', duration: 1000});
      }
      // setTimeout(() => {
        // this.firm_dis = true;
      // }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.init{
  background:rgba(246,246,246,1);
  background-image: url('../../../static/img/login_bg.png');
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  .box{
    width: 600px;
    margin: auto;
    text-align: center;
    position: relative;
    right: 180px;
  }
  .title{
    padding-top: 147px;
    font-size:62px;
    font-weight: bold;
    color:rgba(255,255,255,1);
    margin-bottom: 50px;
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
  height: 20px;
  line-height: 20px;
  padding: 20px;
}
.init > .box > .el-form > .el-form-item > .el-form-item__content > .el-button {
  width: 312px;
  border-radius: 20px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color:rgba(255,255,255,1);
  background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
}
</style>
