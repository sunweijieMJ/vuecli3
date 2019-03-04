<template>
  <div class="okr-logs">
    <div class="container">
      <div class="header">
        <h3>日志</h3>
        <span>共{{loglist.length}}条</span>
      </div>
      <ul class="log-list">
        <li v-for="(vitem, vindex) in loglist" :key="vindex" :class="`anchor${vitem.mao_id}`">
          <single-log :vitem="vitem"></single-log>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import NoticeApi from '../../../api/Notice.js';
  import {SingleLog} from '../../../components/business';

  export default {
    components: {SingleLog},
    data() {
      return {
        loglist: []
      };
    },
    created() {
      let that = this;
      const business_type = that.$route.query.log_type;
      const business_id = that.$route.query.log_id;
      this.getLogList(business_type, business_id);
      this.$nextTick(() => {
        let observer = new MutationObserver(() => {
          const anchor = this.$route.query.anchor;
          const view = document.querySelector(`.anchor${anchor}`);
          if(view) {
            view.querySelector('.header i').style.color = '#22d7a0';
            view.scrollIntoView({block: 'center', behavior: 'smooth'});
          }
        });

        const options = {
          'childList': true,
          'subtree': true
        };
        observer.observe(document.querySelector('.okr-logs'), options);
      });
    },
    methods: {
      getLogList(business_type, business_id) {
        let that = this;
        NoticeApi().getLogList({business_type, business_id, pages: 50}).then(res => {
          if(res.status) {
            const loglist = res.data.list;
            const user_infos = res.data.user_infos;
            const parter_infos = res.data.parter_infos;
            // 数据整理
            for(let i = 0, ILEN = loglist.length; i < ILEN; i++) {
              // 用户整理
              loglist[i].user_info = user_infos[loglist[i].user_id];
              loglist[i].origin.parter_infos = [];
              for(let j = 0, JLEN = loglist[i].origin.parter.length; j < JLEN; j++) {
                loglist[i].origin.parter_infos.push(parter_infos[loglist[i].origin.parter[j]]);
              }
            }
            that.loglist = loglist;
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .okr-logs {
    background-color: #fff;
    .container {
      width: 1040px;
      margin: auto;
      .header {
        display: flex;
        align-items: flex-end;
        width: 750px;
        padding: 40px 0;
        border-bottom: 1px solid $lineColor;
        h3 {
          font-size: 30px;
          font-weight: $h1Weight;
          line-height: 1;
          color: $themeColor;
        }
        span {
          margin-left: 10px;
          font-size: $h3Font;
          line-height: 1;
          color: $h1Color;
        }
      }
      .log-list li {
        &:last-child .single-log{
          border-bottom: 0;
        }
      }
    }
  }
</style>

