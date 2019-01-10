<template>
  <div class="single-idea">
    <div class="idea-main">
      <div class="main">
        <div class="main-paragraph">
          <paragraph v-if="item.content" :text="item.content"></paragraph>
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
        <li v-if="item.user_info">
          <span>作者：</span>
          <p>{{`${item.user_info.user_name} (${item.user_info.real_name})`}}</p>
        </li>
        <li>
          <span>时间：</span>
          <p>{{item.publish_time | timeFilter}}</p>
        </li>
      </div>
    </div>
    <div class="idea-btn">
      <p @click="stickIdea(item.thinks_id, item.is_top)">
        <i class="iconfont icon-zhiding"></i>
        <span>置顶</span>
      </p>
      <p @click="deleteIdea(item.thinks_id)">
        <i class="iconfont icon-iconfontshanchu2"></i>
        <span>删除</span>
      </p>
    </div>
  </div>
</template>
<script>
  import {Paragraph} from '../business';
  import frequent from '../../mixins/frequent.js';
  import IdeaApi from '../../api/Idea.js';

  export default {
    components: {Paragraph},
    mixins: [frequent],
    props: ['item'],
    methods: {
      // 置顶/取消 想法
      stickIdea(thinksId, currTop) {
        let that = this;
        IdeaApi().stickIdea({thinksId, currTop}).then((res) => {
          if(res.status) {
            this.$emit('stickSuccess', thinksId);
            that.$message({message: '置顶成功', type: 'success'});
          } else {
            that.$message({message: res.message, type: 'error'});
          }
        });
      },
      // 删除想法
      deleteIdea(thinksId) {
        let that = this;
        that.$confirm('确定要删除这个想法吗？', '删除想法', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          IdeaApi().deleteIdea({thinksId, doDel: 1}).then((res) => {
            if(res.status) {
              this.$emit('deleteSuccess', thinksId);
              that.$message({message: '删除成功', type: 'success'});
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
  @import '../../assets/scss/_base.scss';

  .single-idea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid $lineColor;
    .idea-main {
      display: flex;
      align-items: center;
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
              font-size: 16px;
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
          font-size: 16px;
          line-height: 22px;
          color: $h2Color;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .idea-btn {
      display: flex;
      p {
        display: flex;
        flex-direction: column;
        margin-left: 50px;
        cursor: pointer;
        i {
          font-size: 28px;
        }
        span {
          font-size: 16px;
          line-height: 22px;
          color: $h1Color;
        }
      }
    }
  }
</style>
<style lang="scss">
  @import '../../assets/scss/_base.scss';

  .single-idea .main-paragraph {
    p {
      @include erow(3);
      max-height: 66px;
      font-size: 16px;
      line-height: 22px;
      color: $h2Color;
      a {
        font-size: 16px;
        color: $linkBlue;
      }
    }
  }
</style>



