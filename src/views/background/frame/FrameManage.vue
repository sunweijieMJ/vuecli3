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
          <li v-for="(a, index) in department" :key="index" @click="checkDepartment(a.dep_id, index)">
            <div class="angle">
              <i class="iconfont icon-sanjiaoyou" v-if="show[index]"></i>
            </div>
            <div>
              {{a.department_name}}
            </div>
          </li>
        </ul>
        <ul class="right">
          <div class="r-head">数字产品部-后台（5人）</div>
          <li v-for="(b, tindex) in department_staff" :key="tindex">
            <div class="staff-header-img">
              <img :src="b.header_photo" alt="">
              <span class="sex">
                <span class="iconfont icon-personal_ic_man" v-if="b.gender === 1"></span>
                <span class="iconfont icon-nvxing" v-if="b.gender === 2"></span>
                <span>{{b.real_name}}</span>
              </span>
            </div>
            <div class="staff-formation">
              <div>
                <span class="iconfont icon-shoujihao"></span><span>{{b.mobile}}</span>
              </div>
              <div>
                <span class="iconfont icon-email"></span><span>{{b.email}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import ManageApi from '../../../api/Manage.js';
export default {
  name: 'FrameManage',
  data(){
    return {
      department: [], // ETC 部门列表
      department_staff: [
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 1,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        },
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 2,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        },
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 1,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        },
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 2,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        },
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 2,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        },
        {
          img: 'https://s3m.mediav.com/galileo/240158-265a9af531a8bf02fb870114e24dc5db.jpg',
          sex: 1,
          name: 'Paddy（刘沛)',
          phone: '13973330236',
          email: 'paddiliu@lanehub.com'
        }
      ], // ETC 部门人员
      show: [],
      all_num: ''
    };
  },
  methods:{
    checkDepartment(id, key){
      this.show = [];
      for (let i = 0; i < this.department.length; i++) {
        if(key === i){
          this.show.push(true);
        }else{
          this.show.push(false);
        }
      }
      this.getStaffData(id);
    },
    getBasicData(){
      ManageApi().getBasicData({}).then(res => {
        this.all_num = res.data;
      });
    },
    getDepartMentData(){
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
          this.getStaffData(res.data.list[1].dep_id);
        }
      });
    },
    getStaffData(id){
      ManageApi().getStaffData({depId: id, curPage: 1, pages: 7}).then(res => {
        this.department_staff = res.data.list;
      });
    }
  },
  mounted(){
    this.getBasicData();
    this.getDepartMentData();
    
  }
};
</script>
<style lang="scss" scoped>
.frame-manage{
  .header{
    font-size:23px;
    font-weight:500;
    color:rgba(255,118,120,1);
    padding: 12px 79px;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
  }
  .statistics{
    padding: 0 79px;
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
      position: relative;
      margin-top: 20px;
      display: flex;
      .left{
        li{
          width: 146px;
          padding:17px 22px;
          line-height: 1;
          font-size:16px;
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
        width: 839px;
        .r-head{
          width: 100%;
          padding: 17px 0;
          font-size:16px;
          line-height: 1;
          font-weight:500;
          color:rgba(96,98,102,1);
          border-bottom:1px solid rgba(246,246,246,1);
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
            font-size:16px;
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
                font-size: 16px;
              }
              .icon-nvxing{
                color: rgba(255,118,120,1);
              }
            }
          }
          .staff-formation{
            display: flex;
            div{
              margin-left: 55px;
              font-size:16px;
              font-weight:400;
              color:rgba(96,98,102,1);
              display: flex;
              align-items: center;
              .iconfont{
                font-size: 15px;
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
