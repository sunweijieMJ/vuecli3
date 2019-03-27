/**
 * axios基础构建
 * @date 2018-12-19
 */

import axios from 'axios';
import store from '../store/index';
import linsign from '../utils/signFun';
import ApiUrl from '../config/apiConfig';
import storage from '../utils/storage';
import interceptor from '../config/Global';
let baseURL = process.env.VUE_APP_BaseURL;

// axios 配置
const Axios = axios.create({
  timeout: 6000,
  responseType: 'json',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
});

// 添加响应拦截器
Axios.interceptors.response.use((response) => {
  if (interceptor.submit_request.includes(response.config.url.split('?')[0].split(baseURL)[1])) {
    store.dispatch('setSendFlag', false);
  }
  // 对响应数据做点什么
  return response;
}, (error) => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

class Abstract {
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
      url = url + `${url.indexOf('?') === -1 ? '?' : '&'}pgs_authinfo=${encodeURIComponent(storage('cookie').get('pgs_authinfo'))}`;
      url = url + `&sign=${that.linsign.resignHash(url, params)}`;
    } else {
      params.pgs_authinfo = encodeURIComponent(storage('cookie').get('pgs_authinfo'));
      params.sign = that.linsign.signHash(url, params);
    }
    return new Promise((resolve, reject) => {
      // 埋点请求更换baseURL
      if (interceptor.action_request.includes(url.split('?')[0])) {
        baseURL = process.env.VUE_APP_ActionURL;
      } else {
        baseURL = process.env.VUE_APP_BaseURL;
      }
      // 终止重复请求
      console.log(url)
      console.log(url.split('?')[0])
      console.log(interceptor.submit_request)
      if (interceptor.submit_request.includes(url.split('?')[0])) {
        if (store.state.send_flag) {
          resolve({status: false, message: '重复请求终止', data: null});
          return;
        }
        store.dispatch('setSendFlag', true);
      }
      Axios({
        baseURL,
        method,
        url,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        data: method === 'POST' || method === 'PUT' ? params : null
      }).then((res) => {
        if (res.data.status === 1) {
          resolve({status: true, message: 'success', data: res.data.data});
        } else if (res.data.status === -1) {
          storage('cookie').remove('pgs_authinfo');
          storage('cookie').remove('pgs_userId');
          window.location.replace('/system/login');
          resolve({status: false, message: res.data.message, data: null});
        } else if (res.data.status === -2) {
          resolve({status: false, message: res.data.message, data: null});
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
