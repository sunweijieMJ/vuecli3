const os = (u = window.navigator.userAgent) => {

  return {
    // 不同浏览器及终端
    isMobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/),
    isWechat: !!u.match(/MicroMessenger/i),
    isQQ: !!u.match(/QQ/i),
    isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    isAndroid: !!u.match(/(Android);?[\s/]+([\d.]+)?/),
    isiPhone: !!u.match(/(iPhone\sOS)\s([\d_]+)/),
    isSafari: !!u.match(/Safari/),
    isFirefox: !!u.match(/Firefox/),
    isOpera: !!u.match(/Opera/),
    isChrome: u.match(/Chrome/i) !== null && u.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) === null ? true : false,
    isDeskTop: (() => {
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod', 'okhttp/3.9.1'];
      let flag = true;
      for (let i = 0, LEN = Agents.length; i < LEN; i++) {
        if (u.indexOf(Agents[i]) !== -1) {
          flag = false;
          break;
        }
      }
      return flag;
    })()
  };
};

export {
  os
};
