import Cookies from 'js-cookie';

//获取Authorization
export function getToken() {
  return Cookies.get('Authorization');
}

//设置Authorization
export function setToken(token) {
  return Cookies.set('Authorization', token);
}

//移除Authorization
export function removeToken() {
  return Cookies.remove('Authorization');
}
