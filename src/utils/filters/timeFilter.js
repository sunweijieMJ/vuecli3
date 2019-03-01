import fillZero from './fillZero';

// 时间过滤
let timeFilter = (time) => {
  if (!time) return;
  if (!isNaN(+time)) time = +time;
  if (typeof time === 'number' && time.toString().length === 10) time = time * 1000;
  // Safari只支持yyyy/mm/dd
  if (typeof time === 'string') time = time.split('-').join('/');
  const old = new Date(time).getTime();
  const cur = new Date().getTime();
  const space = (cur - old);
  // 获取
  const cur_year = new Date().getFullYear();
  const year = new Date(old).getFullYear();
  const month = new Date(old).getMonth() + 1;
  const date = new Date(old).getDate();
  const hours = new Date(old).getHours();
  const minutes = new Date(old).getMinutes();

  const getDateStr = (AddDayCount) => {
    const dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();
    return y + '-' + m + '-' + d;
  };
  // 时间分界点
  const JUST_NOW = 1000 * 60; // ETC 1分钟
  const HOUR = 1000 * 60 * 60; // ETC 1小时
  const TODAY = 1000 * 60 * 60 * 24; // ETC 1天
  const YESTERDAY = getDateStr(-1) === `${year}-${month}-${date}`; // ETC 昨天

  const THIS_YEAY = year === cur_year; // ETC 今年
  const LAST_YEAY = year !== cur_year; // ETC 非今年

  switch (true) {
    case space < JUST_NOW:
      return '刚刚';
      break;
    case space >= JUST_NOW && space < HOUR:
      return `${Math.floor(space / (60 * 1000))}分钟之前`;
      break;
    case space >= HOUR && space < TODAY:
      return `${Math.floor(space / (60 * 60 * 1000))}小时之前`;
      break;
    case space >= TODAY && YESTERDAY:
      return `昨天 ${fillZero(hours)}:${fillZero(minutes)}`;
      break;
    case !YESTERDAY && THIS_YEAY:
      return `${month}月${date}日 ${fillZero(hours)}:${fillZero(minutes)}`;
      break;
    case LAST_YEAY:
      return `${year}年${month}月${date}日 ${fillZero(hours)}:${fillZero(minutes)}`;
      break;
    default:
      break;
  }
};

export default timeFilter;
