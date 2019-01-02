<template>
  <div class="publish">
    <slot></slot>
    <ul class="user-list" v-if="user">
      <li v-for="(item, index) in user" :key="index">{{item}}</li>
    </ul>
    <ul class="topic-list" v-if="topic">
      <li v-for="(item, index) in topic" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: ['user', 'topic']
  };
</script>
<style lang="scss" scoped>
  @import '../../assets/scss/_base.scss';

  .publish {
    .user-list, .topic-list {
      width: 275px;
      height: 317px;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.05);
      li {
        display: flex;
        align-items: center;
        height: 47px;
        padding: 0 16px;
        font-size: 16px;
        color: $h1Color;
      }
    }
  }
</style>
