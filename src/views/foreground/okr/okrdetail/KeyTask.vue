<template>
  <div class="kt">
    <div class="kt-task" v-for="(kt, ktindex) in 3" :key="ktindex">
      <el-collapse accordion @change="handleChange" v-model="activeNames">
        <el-collapse-item :name="ktindex">
          <template slot="title">
            <div class="task-box">
              <div class="title">
                <div :class="{icon: true, isActive: activeJudge(ktindex)}">
                  <i class="iconfont icon-sanjiaoyou"></i>
                </div>
                <div>
                  <span>KT</span><span>UGS完成A系统，B系统，C系统和D系统</span>
                </div>
              </div>
              <div class="objactive">
                <div class="left">
                  <div>
                    <span>2019/01/30-2019/01/28</span>
                  </div>
                  <div class="img">
                    <img src="https://p.ssl.qhimg.com/t01138e5aba54ac6524.jpg" alt="">
                    <span>TO: Paddy</span>
                  </div>
                </div>
                <div @mouseover="overlayShow(ktindex)">
                  <el-progress :percentage="80" ></el-progress>
                </div>
              </div>
              <div :class="{overlay: true, overlayJudge: overlayJudge(ktindex)}" @click.stop="">
                <div class="over-box" @mouseleave.stop="overlayHide">
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>添加Task</span>
                  </div>
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>跟进</span>
                  </div>
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>编辑</span>
                  </div>
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>完成</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <ul>
            <li v-for="(t, tindex) in 3" :key="tindex">
              <div class="title">
                <span class="t-title">T</span>
                <span>UGS完成A系统，B系统，C系统和D系统</span>
              </div>
              <div class="date">
                <div class="left">
                  <div>
                    <span>2019/01/30-2019/01/28</span>
                  </div>
                  <div class="img">
                    <img src="https://p.ssl.qhimg.com/t01138e5aba54ac6524.jpg" alt="">
                    <span>TO: Paddy</span>
                  </div>
                </div>
                <div @mouseover="overlayShowChild(tindex)">
                  <el-progress :percentage="80" ></el-progress>
                </div>
              </div>

              <div :class="{'overlay-child': true, 'overlayJudge-child': overlayJudgeChild(tindex)}">
                <div class="over-box-child" @mouseleave.stop="overlayHideChild">
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>跟进</span>
                  </div>
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>编辑</span>
                  </div>
                  <div>
                    <span class="iconfont icon-tianjia"></span>
                    <span>完成</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  name: 'keyTask',
  data(){
    return {
      activeNames: '',
      overlay_state: '',
      overlay_child_state: ''
    };
  },
  methods: {
    handleChange(val){
      this.activeNames = val;
      console.log(val)
    },
    activeJudge(kindex){
      if(kindex === this.activeNames){
        return true;
      }else{
        return false;
      }
    },
    overlayShow(val){
      this.overlay_state = val;
    },
    overlayHide(){
      this.overlay_state = '';
    },
    overlayJudge(kindex){
      if(kindex === this.overlay_state){
        return true;
      }else{
        return false;
      }
    },

    overlayShowChild(val){
      this.overlay_child_state = val;
    },
    overlayJudgeChild(tindex){
      if(tindex === this.overlay_child_state){
        return true;
      }else{
        return false;
      }
    },
    overlayHideChild(){
      this.overlay_child_state = '';
    }
  }
};
</script>
<style lang="scss" scoped>
.kt{
  .kt-task{
    margin-bottom: 12px;
    background-color: #FFFFFF;
    box-shadow:0px 0px 6px 0px rgba(0,0,0,0.05);
    border-radius:4px;
    padding: 25px 53px 0 53px;
    .task-box{
      position: relative;
      .overlayJudge{
        display: block !important;
      }
      .overlay{
        display: none;
      }
      .over-box{
        z-index: 1000;
        width: 300px;
        height: 70px;
        background-image: url('../../../../../static/img/jianbian_bg.png');
        background-size: 100% 100%;
        // background: white;
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        justify-content: flex-end;
        div{
          text-align: center;
          margin-left: 34px;
          color: #000000;
          span{
            font-size:14px;
            font-weight:400;
            color: #303133;
          }
        }
        .iconfont{
          font-size: 33px;
          display: block;
        }
      }
    }
    .title{
      display: flex;
      align-items: center;
      font-size:15px;
      font-weight:500;
      color: #303133;
      line-height: 1;
      .icon{
        width: 20px;
        height: 20px;
        text-align: center;
        transition: transform 0.5s;
        .iconfont{
          line-height: 20px;
        }
      }
      .isActive{
        transform: rotate(90deg);
      }
    }
    .objactive{
      margin-top: 11px;
      margin-left: 20px;
      display: flex;
      width: 847px;
      justify-content: space-between;
      align-items: center;
      font-size:13px;
      font-weight:400;
      color:#606266;
      line-height: 1;
      .left{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        div{
          margin-right: 41px;
        }
        img{
          width: 20px;
          height: 20px;
          border-radius: 50px;
          margin-right: 7px;
        }
        .img{
          display: flex;
          align-items: center;
        }
      }
    }
    ul{
      margin-left: 20px;
      li{
        border-top: 1px solid #F6F6F6;
        padding: 23px 0;
        position: relative;
        .overlayJudge-child{
          display: block !important;
        }
        .overlay-child{
          display: none;
        }
        .over-box-child{
          z-index: 1001;
          width: 300px;
          height: 70px;
          background-image: url('../../../../../static/img/jianbian_bg.png');
          background-size: 100% 100%;
          // background: red;
          position: absolute;
          right: 0;
          top: 23px;
          display: flex;
          justify-content: flex-end;
          div{
            text-align: center;
            margin-left: 34px;
            color: #000000;
            span{
              font-size:14px;
              font-weight:400;
              color: #303133;
            }
          }
          .iconfont{
            cursor: pointer;
            font-size: 33px;
            line-height: 1;
            display: block;
          }
        }
        .title{
          cursor: pointer;
          display: flex;
          align-items: center;
          font-size:15px;
          font-weight:500;
          color: #303133;
          line-height:1;
          .t-title{
            display: inline-block;
            width: 36px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            background: #948BEA;
            border-radius:8px;
            font-size:14px;
            font-weight:400;
            color: #FFFFFF;
            margin-right: 10px;
          }
        }
        .date{
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
            display: flex;
            align-items: center;
            div{
              margin-right: 41px;
            }
            .img{
              display: flex;
              align-items: center;
            }
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
</style>
<style lang="scss">
.kt{
  .el-collapse{
    border: none;
    .el-collapse-item{
      .el-collapse-item__wrap{
        border-bottom: none;
        .el-collapse-item__content{
          padding-bottom: 0;
        }
      }
      .el-collapse-item__header{
        display: flex disabled;
        line-height: normal;
        border-bottom: none;
        padding-bottom: 25px;
        .el-icon-arrow-right{
          display: none;
        }
        .objactive{
          .el-progress{
            font-size: 13px;
            color: #303133;
            .el-progress-bar{
              width: 200px;
              .el-progress-bar__outer{
                width: 145px;
                height: 9px !important;
                .el-progress-bar__inner{
                  background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                  border-radius:8px;
                }
              }
            }
          }
        }
      }
    }
  }
  ul{
    li{
      .date{
        .el-progress{
          font-size: 13px;
          color: #303133;
          .el-progress-bar{
            width: 195px;
            .el-progress-bar__outer{
              width: 145px;
              height: 9px !important;
              .el-progress-bar__inner{
                background:linear-gradient(90deg,rgba(251,136,81,1) 0%,rgba(226,82,108,1) 100%);
                border-radius:8px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
