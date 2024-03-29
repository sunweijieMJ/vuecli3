import md5 from 'js-md5';
import storage from './storage';
import interceptorConf from '../config/Global';

// 参数排序
function objKeySort(arys) {
  let newkey = Object.keys(arys).sort();
  let newObj = {};
  for (let i = 0, LEN = newkey.length; i < LEN; i++) {
    newObj[newkey[i]] = arys[newkey[i]];
  }
  return newObj;
}

// get签名
function signHash(url, oldparams) {
  let _oldparams = JSON.parse(JSON.stringify(oldparams));
  _oldparams.sign = '';
  try {
    _oldparams.pgs_authinfo = decodeURIComponent(storage('cookie').get('pgs_authinfo') || '');
  } catch (error) {
    _oldparams.pgs_authinfo = '';
  }

  let params = objKeySort(_oldparams);
  let arr = [];
  let _params = '';
  let locks = '';
  for (let key in params) {
    _params = params[key];
    if (Array.isArray(_params)) {
      let a = _params.reduce((l, r) => {
        return JSON.stringify(l) + JSON.stringify(r);
      });
      arr.push(a);
    } else {
      arr.push(_params);
    }
  }
  locks = arr.join('') + interceptorConf.sign_key;
  return md5(locks);
}

// post签名
function resignHash(url, data) {
  // url解析
  let response = {};
  if (url.indexOf('?') !== -1) {
    url = url.split('?')[1];
    const strs = url.split('&');
    for (let i = 0, LEN = strs.length; i < LEN; i++) {
      response[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  // url排序
  let params = objKeySort(response);
  let arr = [];
  let _params = '';
  for (let key in params) {
    _params = params[key];
    if (Array.isArray(_params)) {
      let a = _params.reduce((l, r) => {
        return JSON.stringify(l) + JSON.stringify(r);
      });
      arr.push(a);
    } else {
      arr.push(_params);
    }
  }

  let locks = JSON.stringify(data) + arr.join('') + interceptorConf.sign_key;
  return md5(locks);
}

// url解析
function urlConcat(data) {
  let url = '';
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += '&' + k + '=' + encodeURIComponent(value);
  }
  return url ? url.substring(1) : '';
}

export default {signHash, resignHash, urlConcat};
