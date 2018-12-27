/**
 * axios基础构建
 * @date 2018-12-19
 */

import axios from 'axios';
import linsign from '../utils/signFun';
import ApiUrl from '../config/apiConfig';
import storeApi from '../utils/storage';
import router from '../router';
// const baseURL = 'http://mockapi.release.weiheinc.com/mock/5c2083a8903de30736b5b9f8/pgs';
const baseURL = process.env.VUE_APP_BaseURL;

// axios 配置
const Axios = axios.create({
  timeout: 6000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
});
class Abstract {
  /**
   * 构造函数，单例模式，只会调用一次
   */
  constructor() {
    this.ApiUrl = ApiUrl;
    this.linsign = linsign;
  }

  apiAxios(method, url, params) {
    let that = this;
    let _Url = url.split('.');
    url = that.ApiUrl.getUrl(_Url[0], _Url[1]);
    // 签名加密
    if (method === 'POST') {
      url = url + `${url.indexOf('?') === -1 ? '?' : '&'}pgs_authinfo=${encodeURIComponent(storeApi('cookie').get('pgs_authinfo'))}&pgs_authinfo=${storeApi('cookie').get('pgs_authinfo')}`;
      url = url + `&sign=${that.linsign.resignHash(url, params)}`;
    } else {
      params.pgs_authinfo = storeApi('cookie').get('pgs_authinfo');
      params.sign = that.linsign.signHash(url, params);
    }

    return new Promise((resolve, reject) => {
      Axios({
        baseURL,
        method,
        url,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        data: method === 'POST' || method === 'PUT' ? params : null
      }).then((res) => {
        if (res.data.status) {
          resolve({status: true, message: 'success', data: res.data.data});
        } else if (res.data.status === -1) {
          router.push({name: 'InitPage'});
        } else {
          resolve({status: false, message: res.data.message, data: null});
        }
      }).catch((err) => {
        if (err) console.warn(err);
        reject({status: false, message: '接口异常', data: null});
      });
    });
  }

  /**
   * GET类型的网络请求
   */
  getReq(url, params) {
    return this.apiAxios('GET', url, params);
  }

  /**
   * POST类型的网络请求
   */
  postReq(url, params) {
    return this.apiAxios('POST', url, params);
  }

}

export default Abstract;
