<template>
  <div class="init">
    <div class="title">PGS</div>
    <div class="discription" v-if="status === 0">Hi，亲爱的LANEHUBER，欢迎使用PGS</div>
    <div class="discription" v-if="status === 2">Ops…好像没有输入正确的工作邮箱</div>
    <div class="discription" v-if="status === 1">已发送密码至你的邮箱 {{ruleForm2.email}} ，请在邮件中查看</div>
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
          <span v-show="!show" @click="countDown">获取密码</span>
          <span v-show="show" class="countdown">{{time}}</span>
        </div>
        <el-button type="primary" @click="submitForm('ruleForm2')">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const storageApi = require('../../utils/storage')('cookie');

import userApi from '../../api/User.js';
export default {
  name: 'initpage',
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
      rules2: {
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']}
        ],
        pass: [{validator: this.validatePass, trigger: 'blur'}]
      }
    };
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '' && this.ruleForm2.email !== '') {
        callback(new Error('请输入密码'));
      }
    },
    submitForm() {
      this.login_status = false;
      if(this.ruleForm2.pass && this.ruleForm2.email && !this.login_status){
        userApi().getLogin({email: this.ruleForm2.email, passwd: this.ruleForm2.pass}).then(res => {

          if(res.status){
            storageApi.set('pgs_authinfo', res.data.pgs_authinfo);
            this.$message({message: '登陆成功', type: 'success', duration: 1000});
            setTimeout(() => {
              this.$router.push({name: 'IdeaList'});
              // this.status = 0;
              this.login_status = true;
            }, 1000);
          }
        });
      }else{
        this.$message({message: '密码不正确', type: 'warning'});
      }
    },
    // 计时器
    countDown(){
      this.firm_dis = false;
      let Reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if(!this.firm_dis && this.ruleForm2.email && Reg.test(this.ruleForm2.email)){
        userApi().getPssword({email: this.ruleForm2.email}).then(res => {
          if(res.status){
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
              }
            }, 1000);
          }
        });
      }else{
        this.status = 2;
        this.$message({message: '请填写正确的邮箱', type: 'warning'});
      }
      setTimeout(() => {
        this.firm_dis = true;
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.init{
  background:rgba(246,246,246,1);
  width: 100%;
  height: 100vh;
  text-align: center;
  .title{
    padding-top: 166px;
    font-size:62px;
    font-weight:500;
    color:rgba(48,49,51,1);
    margin-bottom: 52px;
  }
  .discription{
    font-size:20px;
    font-weight:500;
    color:rgba(96,98,102,1);
    margin-bottom: 18px;
  }
  .security{
    cursor: pointer;
    padding: 0 10px;
    display: flex;
    justify-content: flex-end;
    font-size:14px;
    font-weight:400;
    color:rgba(85,129,199,1);
    margin-bottom: 18px;
    .countdown{
      font-size:14px;
      font-weight:400;
      color:rgba(144,147,153,1);
    }
    span{
      line-height: 1;
    }
  }
}
</style>
<style>
.init > .el-form{
  width: 315px;
  margin: auto;
}
.init > .el-form > .el-form-item > .el-form-item__content > .el-input {
  width: 315px !important;
  height: 40px !important;
}
.init > .el-form > .el-form-item > .el-form-item__content{
  margin-left: 0 !important;
  line-height: 1;
}
.init > .el-form > .el-form-item > .el-form-item__content > .el-input > .el-input__inner{
  border-radius: 20px;
  background:rgba(255,255,255,1);
  border: none;
}
.init > .el-form > .el-form-item > .el-form-item__content > .el-button {
  width: 312px;
  border-radius: 20px;
  border: none;
  font-size: 18px;
  font-weight:500;
  color:rgba(255,255,255,1);
  background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
}
</style>
