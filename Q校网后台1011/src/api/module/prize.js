import ax from '../axios';

//查询所有奖项
export function queryPrizeDefual(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/prize/queryPrizeDefual.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑奖项
export function updatePrize(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/prize/updatePrize.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除奖项
export function deletePrize(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/prize/deletePrize.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增奖项
export function addPrize(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/prize/addPrize.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
