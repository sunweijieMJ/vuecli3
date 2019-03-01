<template>
  <div id="app">
    <router-view/>
    <show-image></show-image>
  </div>
</template>
<script>
  import ShowImage from './components/popup/ShowImage.vue';

  export default {
    name: 'APP',
    components: {ShowImage},
    created() {
      let that = this;
      window.addEventListener('pageshow', that.removeScrollWidth, false);
      window.addEventListener('resize', that.removeScrollWidth, false);
    },
    methods: {
      // 获取滚动条宽度
      getScrollbarWidth() {
        let odiv = document.createElement('div');
        let styles = {
          width: '100px',
          height: '100px',
          overflowY: 'scroll'
        };
        let i;
        let scrollbarWidth;
        for (i in styles) odiv.style[i] = styles[i];
        document.body.appendChild(odiv);
        scrollbarWidth = odiv.offsetWidth - odiv.clientWidth;
        odiv.remove();
        return scrollbarWidth;
      },
      // 去除滚动条宽度
      removeScrollWidth() {
        const innerWidth = window.innerWidth - this.getScrollbarWidth();
        document.querySelector('.header-box .header').style.width = document.body.style.width = innerWidth + 'px';
      }
    }
  };
</script>
<style lang="scss">
  @import '../src/assets/scss/_reset.scss';
  @import '../src/assets/scss/component/_element.scss';

  html, body, #app {
    background-color: $backColor;
  }
</style>
