import ax from '../axios';

//查询系统默认行为
export function queryAllAction(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/action/queryAllAction.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑系统默认行为
export function updateDefault(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/action/updateDefault.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除系统默认行为
export function deleteAction(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/action/deleteAction.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增系统默认行为
export function addAction(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/action/addAction.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
