<template>
  <div class="frame-manage">
    <div class="header">组织架构</div>
    <div class="statistics">
      <div class="st-header">
        <span>共 {{all_num.dep_total}} 个部门，{{all_num.user_total}} 个小伙伴</span>
        <span class="crease">新增</span>
      </div>
      <div class="staff-list">
        <ul class="left">
          <li v-for="(a, index) in department" :key="index" @click="checkDepartment(a.dep_id, index, a.department_name)">
            <div class="angle">
              <i class="iconfont icon-sanjiaoyou" v-if="show[index]"></i>
            </div>
            <div>
              {{a.department_name}}
            </div>
          </li>
        </ul>
        <ul class="right" v-infinite-scroll="infinite" infinite-scroll-disabled="disabled" infinite-scroll-distance="30">
          <div class="r-head">{{depart_name}}（{{pageInfo.page_total}}人）</div>
          <li v-for="(b, tindex) in department_staff" :key="tindex" :class="{gray: quit(b.state)}">
            <div class="staff-header-img">
              <img :src="b.header_photo" alt="">
              <span class="sex">
                <span class="iconfont icon-icon_male1" v-if="b.gender === 1"></span>
                <span class="iconfont icon-icon_male" v-if="b.gender === 2"></span>
                <span>{{b.nick_name}} ({{b.real_name}})</span>
              </span>
            </div>
            <div class="staff-formation">
              <div>
                <span class="iconfont icon-icon_phone"></span><span>{{b.mobile}}</span>
              </div>
              <div>
                <span class="iconfont icon-icon_mail"></span><span>{{b.email}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <loading :loading="disabled && department_staff.length < pageInfo.page_total"></loading>
  </div>
</template>
<script>
import ManageApi from '../../../api/Manage.js';
import {Loading} from '../../../components/public';
export default {
  name: 'FrameManage',
  components: {
    Loading
  },
  data(){
    return {
      department: [], // ETC 部门列表
      department_staff: [], // ETC 部门人员
      show: [],
      depart_name: '', // ETC 部门名字
      depart_num: '', // ETC 部门数量
      all_num: '',

      disabled: false, // ETC 加载开关
      pageInfo: { // ETC 页码信息
        current_page: 0,
        page_total: 0
      },
      depart_id: '' // ETC 部门id
    };
  },
  methods: {
    // 辞职样式
    quit(val){
      if(val !== '在职'){
        return true;
      }
    },
    checkDepartment(id, key, name){
      this.disabled = false;
      this.pageInfo.current_page = 1;
      this.show = [];
      for (let i = 0; i < this.department.length; i++) {
        if(key === i){
          this.show.push(true);
        }else{
          this.show.push(false);
        }
      }
      this.depart_id = id;
      this.getStaffData2(id);
      this.depart_name = name;
    },
    // 基础数据
    getBasicData(){
      ManageApi().getBasicData({}).then(res => {
        this.all_num = res.data;
      });
    },
    // 部门列表
    getDepartMentData(page){
      ManageApi().getDepartMentData({}).then(res => {
        this.department = res.data.list;
        if(this.department.length){
          this.show = [];
          for (let i = 0; i < this.department.length; i++) {
            if(this.show.length){
              this.show.push(false);
            }else{
              this.show.push(true);
            }
          }
          this.depart_id = res.data.list[0].dep_id;
          this.getStaffData2(res.data.list[0].dep_id, page);
          this.depart_name = res.data.list[0].department_name;
        }
      });
    },
    // 员工列表
    async getStaffData(id, page){
      return await ManageApi().getStaffData({depId: id, curPage: page, pages: 20}).then(res => {
        if(res.data.list){
          this.department_staff = this.department_staff.concat(Object.values(res.data.list));
        }
        this.pageInfo.page_total = res.data.total;
      });
    },
    getStaffData2(id){
      ManageApi().getStaffData({depId: id, curPage: 1, pages: 20}).then(res => {
        this.department_staff = Object.values(res.data.list);
        // console.log(Object.values(res.data.list));
        this.pageInfo.page_total = res.data.total;
      });
    },
    // 触底刷新
    infinite() {
      let that = this;
      that.disabled = true;
      that.getStaffData(this.depart_id, ++that.pageInfo.current_page).then(() => {
        // 触底判断
        that.disabled = false;
        if(this.department_staff.length === that.pageInfo.page_total){
          that.disabled = true;
        }
      });
    }
  },
  mounted(){
    this.getBasicData();
    this.getDepartMentData();
  },
  watch: {
    page_total(){
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.frame-manage{
  padding-bottom: 20px;
  .header{
    font-size:23px;
    font-weight:500;
    color:rgba(255,118,120,1);
    padding: 12px 79px;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
  }
  .statistics{
    padding: 0 86px 0 79px;
    .st-header{
      padding: 14px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom:1px solid rgba(246,246,246,1);
      span{
        font-size:16px;
        font-weight:400;
        color:rgba(96,98,102,1);
      }
      .crease{
        cursor: pointer;
        width:85px;
        height:40px;
        background:linear-gradient(142deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
        border-radius:20px;
        text-align: center;
        line-height: 40px;
        font-size:18px;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }
    .staff-list{
      font-size:14px;
      margin-top: 20px;
      display: flex;
      .left{
        li{
          padding:17px 22px 17px 0;
          line-height: 1;
          // font-size:14px;
          font-weight:400;
          color:rgba(48,49,51,1);
          display: flex;
          align-items: center;
          div{
            cursor: pointer;
          }
          .angle{
            width: 18px;
            height: 18px;
          }
          i{
            color: rgba(255,118,120,1);
          }
        }
      }
      .right{
        margin-left: 47px;
        .r-head{
          padding: 17px 0;
          // font-size:14px;
          line-height: 1;
          font-weight:500;
          color:rgba(96,98,102,1);
          border-bottom:1px solid rgba(246,246,246,1);
        }
        .gray{
          color:rgba(144,147,153,1);
          .staff-header-img{
            color:rgba(144,147,153,1);
            .sex{
              .iconfont{
                color:rgba(144,147,153,1);
              }
              .icon-icon_male{
                color:rgba(144,147,153,1);
              }
            }
          }
          .staff-formation{
            div{
              color:rgba(144,147,153,1);
            }
          }
        }
        li{
          padding: 15px 26px;
          display: flex;
          border-bottom:1px solid rgba(246,246,246,1);
          align-items: center;
          justify-content: space-between;
          .staff-header-img{
            display: flex;
            align-items: center;
            // font-size:14px;
            font-weight:400;
            color:rgba(48,49,51,1);
            img{
              width:40px;
              height:40px;
              border-radius: 50px;
              box-sizing: border-box;
              border:1px solid rgba(136,135,136,1);
            }
            .sex{
              margin-left: 26px;
              display: flex;
              align-items: center;
              .iconfont{
                margin-right: 7px;
                color: rgba(85,129,199,1);
                font-size: 14px;
              }
              .icon-icon_male{
                color: rgba(255,118,120,1);
              }
            }
          }
          .staff-formation{
            display: flex;
            width: 60%;
            div{
              margin-right: 55px;
              // font-size:14px;
              font-weight:400;
              color:rgba(96,98,102,1);
              display: flex;
              align-items: center;
              .iconfont{
                font-size: 14px;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
