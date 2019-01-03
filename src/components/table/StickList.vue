<template>
  <ul>
    <li class="stick-list" v-for="(vitem, vindex) in list" :key="vindex">
      <single-stick :item="vitem" @move="move" @cancelSuccess="cancelSuccess"></single-stick>
    </li>
  </ul>
</template>
<script>
  import {SingleStick} from './index.js';

  export default {
    components: {SingleStick},
    props: ['list'],
    methods: {
      move(data) {
        this.$emit('move', data);
      },
      cancelSuccess(thinksId) {
        this.$emit('cancelSuccesss', thinksId);
      }
    }
  };
</script>
