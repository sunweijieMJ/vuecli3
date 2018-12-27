<template>
  <ul class="public-list">
    <li v-for="(vitem, vindex) in list" :key="vindex">
      <single-list :vitem="vitem" @thumpSuccess="$emit('thumpSuccess')"></single-list>
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
