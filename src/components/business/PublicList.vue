<template>
  <ul class="public-list">
    <li v-for="(vitem, vindex) in list" :key="vindex">
      <single-list :vitem="vitem"></single-list>
    </li>
  </ul>
</template>
<script>
  import {SingleList} from './index.js';

  export default {
    props: ['list'],
    components: {SingleList}
  };
</script>
<style lang="scss">
  .public-list li:last-child{
    .single-list {
      margin-bottom: 0;
    }
  }
</style>
