<template>
  <div id="app">
    <router-view/>
    <show-image></show-image>
  </div>
</template>
<script>
  import ShowImage from './components/popup/ShowImage';

  export default {
    name: 'APP',
    components: {ShowImage},
    created() {
      let that = this;
      window.addEventListener('pageshow', that.removeScrollWidth, false);
      window.addEventListener('resize', that.removeScrollWidth, false);

      const UserActions = require('./utils/business/action.js').default();
      window.document.addEventListener('DOMContentLoaded', () => {
        const extra = {
          params: that.$route.params,
          query: that.$route.query,
          request_url: window.document.URL,
          referrer: window.document.referrer
        };
        UserActions.entry(that.$route.name, extra);
      }, false);
      window.addEventListener('beforeunload', () => {
        const extra = {
          params: that.$route.params,
          query: that.$route.query,
          request_url: window.document.URL,
          referrer: window.document.referrer
        };
        UserActions.leave(that.$route.name, extra);
      }, false);
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
    },
    watch: {
      $route(to, from) {
        const UserActions = require('./utils/business/action.js').default();
        const extra = {
          params: to.params,
          query: to.query,
          request_url: `${window.location.origin}${to.fullPath}`,
          referrer: `${window.location.origin}${from.fullPath}`
        };
        UserActions.entry(to.name, extra);
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
