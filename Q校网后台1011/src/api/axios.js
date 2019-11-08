import store from '@/store';
import axios from 'axios';
import qs from 'qs';
import {
  MessageBox
} from 'element-ui';

import {
  getToken
} from '@/utils/auth';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000,
  withCredentials: true //允许携带cookie
});

//请求拦截器
service.interceptors.request.use(config => {
  console.log('请求配置', config);
  if (store.getters.token) {
    config.headers['Authorization'] = getToken();
  }
  if (config.headers['Content-Type'] === "application/json") {
    //...
  } else if (config.headers['Content-Type'] === "multipart/form-data") {
    //...
  } else {
    config.data = qs.stringify(config.data, {
      indices: false
    });
  }
  return config;
}, error => {
  return Promise.reject(error);
});


// 响应拦截器
service.interceptors.response.use(config => {
  const res = config.data;
  if (res.errorCode === -1 && res.errorMsg === "用户未登录，请登录！") {
    MessageBox.alert("请重新登陆", "提示", {
      type: 'error',
      showClose: false,
      showCancelButton: false,
    }).then(() => {
      store.dispatch("qxuser/qxLogout").then(res => {
        if (res.errorCode === 0) {
          location.reload();
        }
      });
    });
    return Promise.reject('error');
  } else {
    return config;
  }
}, error => {
  console.log('err' + error) // for debug
  return Promise.reject(error);
});


export default service;
