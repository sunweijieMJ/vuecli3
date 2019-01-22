<template>
  <div class="okr-list">
    <div class="okr-box">
      <div class="tab">
        <span v-for="(ty, index) in okr_type" :key="index" :class="{active: (index === tindex) ? true : false}" @click="typeCheck(index, ty.id)">{{ty.name}}</span>
      </div>
      <ul>
        <li v-for="(okr, oindex) in okr_list" :key="oindex">
          <div class="title">
            <span class="objective">{{okr.objective_desc}}</span>
            <span class="iconfont icon-tianjia1"></span>
            <span class="staff">{{okr.okr_type_name}}</span>
          </div>
          <div class="formation">
            <div class="left">
              <span class="iconfont icon-tianjia1"></span><span>{{okr.okr_name}}</span>
            </div>
            <div class="right">
              <span class="name" v-if="okr.user_info">
                <img v-if="okr.user_info" :src="okr.user_info.header_photo" alt="">
                <span>{{okr.user_info.user_name}}</span>
              </span>
              <span>{{okr.start_time | dateFormat('yyyy/MM/dd')}}-{{okr.end_time | dateFormat('yyyy/MM/dd')}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import okrApi from '../../../../api/Okr.js';
export default {
  name: 'oktlist',
  data(){
    return {
      okr_type: [],
      okr_list: [],
      tab_check: {
        'background-color': '#FF7678'
      },
      tindex: 0,
      type_id: 1,
      last_id: ''
    };
  },
  methods: {
    getOkrType(){
      okrApi().getOkrType({}).then(res => {
        if(res.status){
          this.okr_type = res.data;
          this.type_id = res.data[0].id;
        }
      });
    },
    getOkrList(){
      okrApi().getOkrList({
        okr_type: this.type_id,
        last_id: this.last_id, // ETC 最后一条id
        currPage: 1, // ETC 当前第几页
        pages: 100// ETC 每页总数
      }).then(res => {
        if(res.status){
          let newArr = res.data.list;
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].user_info = res.data.user_info[res.data.list[i].creator_id];
          }
          this.okr_list = this.okr_list.concat(newArr);
          this.last_id = res.data.last_id;
        }
      });
    },
    typeCheck(index, id){
      this.tindex = index;
      this.type_id = id;
      this.okr_list = [];
      this.last_id = '';
      this.getOkrList();
    }
  },
  mounted(){
    this.getOkrType();
    this.getOkrList();
  }
};
</script>
<style lang="scss" scoped>
.okr-list{
  .okr-box{
    width: 967px;
    margin: auto;
    .tab{
      display: inline-block;
      background: #DEDEDE;
      border-radius:20px;
      margin: 15px 3px;
      span{
        display: inline-block;
        padding: 7px 26px;
        border-radius:19px;
      }
      .active{
        background-color: #FF7678;
      }
    }
    ul{
      li{
        margin-bottom: 12px;
        padding: 23px 59px;
        background: #FFFFFF;
        box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
        border-radius:4px;
        .title{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .objective{
            font-size:18px;
            font-weight:500;
            max-width: 200px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            color: #303133;
            margin-right: 9px;
          }
          .iconfont{
            color: #22D7A0;
            font-size: 13px;
            margin-right: 4px;
          }
          .staff{
            font-size:13px;
            font-weight:500;
            color: #606266;
            line-height:18px;
          }
        }
        .formation{
          margin-top: 11px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            font-size:15px;
            font-weight:400;
            color: #303133;
            .iconfont{
              font-size: 16px;
              color: #303133;
            }
          }
          .right{
            width: 290px;
            font-size:13px;
            font-weight:400;
            color: #606266;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .name{
              display: flex;
              align-items: center;
              img{
                width: 20px;
                height: 20px;
                border-radius: 50px;
                margin-right: 7px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
