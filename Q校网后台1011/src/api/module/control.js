import ax from '../axios';

// 显示列表数据
export function queryClassCardList(params) {
  return ax.post('/action/mod-xiaojiao/device/queryClassCardList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
// 查询设备开关机时间
export function deviceOnAndOff(params) {
  return ax.post('/action/mod-xiaojiao/device/deviceOnAndOff.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}

// 设置班牌开/关机时间
export function saveOrUpdateCard(params) {
  return ax.post('/action/mod-xiaojiao/device/saveOrUpdateCard.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
// 批量设置班牌开/关机时间
export function batchSetUp(params) {
  return ax.post('/action/mod-xiaojiao/device/batchSetUp.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
