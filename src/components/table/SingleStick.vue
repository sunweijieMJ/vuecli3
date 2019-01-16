<template>
  <div class="single-stick">
    <div class="stick-main">
      <div class="sort">
        <i class="iconfont icon-shangchuan1" @click="move({id: item.thinks_id, type: 'up'})"></i>
        <i class="iconfont icon-xiala1" @click="move({id: item.thinks_id, type: 'down'})"></i>
      </div>
      <div class="main">
        <div class="main-paragraph">
          <paragraph :text="item.content"></paragraph>
        </div>
        <div class="main-images">
          <img v-for="(witem, windex) in item.photos.length > 5 ? item.photos.slice(0, 4) : item.photos" :key="windex" :src="witem" alt="" @click.stop="showImage(item.photos, windex)">
          <div v-if="item.photos.length > 5" class="more" @click.stop="showImage(item.photos, 4)">
            <img :src="item.photos[4]" alt="">
            <span v-if="item.photos.length > 5">等{{item.photos.length}}张</span>
          </div>
        </div>
      </div>
      <div class="user">
        <li>
          <span>ID：</span>
          <p>{{item.thinks_id}}</p>
        </li>
        <li>
          <span>作者：</span>
          <p>{{`${item.user_info.user_name} (${item.user_info.real_name})`}}</p>
        </li>
        <li>
          <span>时间：</span>
          <p>{{item.publish_time | timeFilter}}</p>
        </li>
      </div>
    </div>
    <div class="stick-btn">
      <p @click="cancelStick(item.thinks_id, item.is_top)">
        <i class="iconfont icon-zhiding"></i>
        <span>取消置顶</span>
      </p>
    </div>
  </div>
</template>
<script>
  import IdeaApi from '../../api/Idea.js';
  import frequent from '../../mixins/frequent.js';
  import {Paragraph} from '../../components/business';

  export default {
    components: {Paragraph},
    mixins: [frequent],
    props: ['item'],
    methods: {
      move(data) {
        this.$emit('move', data);
      },
      // 取消置顶
      cancelStick(thinksId, currTop) {
        let that = this;
        that.$confirm('确定取消置顶这个想法吗？', '取消置顶', {
          type: 'warning'
        }).then(() => {
          IdeaApi().stickIdea({thinksId, currTop}).then(res => {
            if(res.status) {
              that.$message({message: '取消置顶成功', type: 'success'});
              this.$emit('cancelSuccess');
            } else {
              that.$message({message: res.message, type: 'error'});
            }
          });
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .single-stick {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 55px;
    margin-bottom: 4px;
    background-color: #fff;
    .stick-main {
      display: flex;
      align-items: center;
      .sort {
        display: flex;
        flex-direction: column;
        padding-right: 55px;
        i {
          font-size: 32px;
          cursor: pointer;
          &:first-child {
            margin-bottom: 18px;
          }
        }
      }
      .main {
        box-sizing: border-box;
        width: 374px;
        height: 172px;
        padding: 18px;
        background-color: $backColor;
        .main-paragraph {
          margin-bottom: 12px;
        }
        .main-images {
          display: flex;
          img {
            width: 64px;
            height: 64px;
            margin-right: 4px;
            cursor: pointer;
          }
          .more {
            position: relative;
            cursor: pointer;
            img {
              margin-right: 0;
            }
            span {
              position: absolute;
              left: 0;top: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 64px;
              height: 64px;
              font-size: $h3Font;
              color: $h1Color;
              background-color: rgba(255,255,255,0.8);
            }
          }
        }
      }
      .user {
        margin-left: 60px;
        li {
          display: flex;
          margin-bottom: 10px;
          font-size: $h3Font;
          line-height: 22px;
          color: $h2Color;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .stick-btn {
      p {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        i {
          font-size: 28px;
        }
        span {
          font-size: $h3Font;
          line-height: 22px;
          color: $h1Color;
        }
      }
    }
  }
</style>
<style lang="scss">
  .single-stick .main-paragraph {
    p {
      @include erow(3);
      max-height: 66px;
      font-size: $h3Font;
      line-height: 22px;
      color: $h2Color;
      a {
        font-size: $h3Font;
        color: $linkBlue;
      }
    }
  }
</style>


