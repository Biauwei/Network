import ax from '../axios';

//查询用户列表
export function queryAccountList(params) {
  return ax.post('/action/mod-xiaojiao/account/queryAccountList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查看用户信息
export function queryAccountInfo(params) {
  return ax.post('/action/mod-xiaojiao/account/queryAccountInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询用户列表（模糊查询）
export function queryFuzzy(params) {
  return ax.post('/action/mod-xiaojiao/account/queryFuzzy.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//检查用户名是否重复
export function queryAccountName(params) {
  return ax.post('/action/mod-xiaojiao/account/queryAccountName.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户-查询所有角色
export function queryRoleName(params) {
  return ax.post('/action/mod-xiaojiao/role/queryRoleName.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增用户账号
export function addAccount(params) {
  return ax.post('/action/mod-xiaojiao/account/addAccount.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//重置密码
export function resetPassword(params) {
  return ax.post('/action/mod-xiaojiao/account/resetPassword.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改账号状态
export function changeStatus(params) {
  return ax.post('/action/mod-xiaojiao/account/changeStatus.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户登录
export function login(params) {
  return ax.post('/action/mod-xiaojiao/user/login.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户登出
export function logout(params) {
  return ax.post('/action/mod-xiaojiao/user/logout.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//模板登陆1
export function QXLogin(params) {
  return ax.post('https://jsonplaceholder.typicode.com/posts', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//模板登陆2
export function QXLogin2(params) {
  return ax.get('http://localhost:9527/static/qx.json', {})
    .then(res => res.data)
    .catch(e => console.log(e));
}

//测试-查询用户
export function query(params) {
  return ax.post('/action/mod-xiaojiao/account/query.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
