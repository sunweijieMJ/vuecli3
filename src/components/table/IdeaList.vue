<template>
  <ul>
    <li class="idea-list" v-for="(vitem, vindex) in list" :key="vindex">
      <single-idea :item="vitem" @stickSuccess="stickSuccess" @deleteSuccess="deleteSuccess"></single-idea>
    </li>
  </ul>
</template>
<script>
  import {SingleIdea} from './index.js';

  export default {
    components: {SingleIdea},
    props: ['list'],
    methods: {
      stickSuccess(thinksId) {
        this.$emit('stickSuccess', thinksId);
      },
      deleteSuccess(thinksId) {
        this.$emit('deleteSuccess', thinksId);
      }
    }
  };
</script>
