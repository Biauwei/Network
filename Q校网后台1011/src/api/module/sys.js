import ax from '../axios';

//角色列表
export function queryRoleList(params) {
  return ax.post('/action/mod-xiaojiao/role/queryRoleList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增角色
export function addRole(params, config) {
  return ax.post('/action/mod-xiaojiao/role/addRole.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑角色
export function updateRole(params, config) {
  return ax.post('/action/mod-xiaojiao/role/updateRole.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除角色
export function deleteRole(params) {
  return ax.post('/action/mod-xiaojiao/role/deleteRole.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//权限列表
export function querySystemMenu(params) {
  return ax.post('/action/mod-xiaojiao/permit/querySystemMenu.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//系统菜单
export function querySystemMenus(params) {
  return ax.post('/action/mod-xiaojiao/system/querySystemMenu.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增权限
export function addPermit(params) {
  return ax.post('/action/mod-xiaojiao/permit/addPermit.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除权限
export function deletePermit(params) {
  return ax.post('/action/mod-xiaojiao/permit/deletePermit.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除权限
export function updatePermit(params) {
  return ax.post('/action/mod-xiaojiao/permit/updatePermit.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
