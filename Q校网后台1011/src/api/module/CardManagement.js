import ax from '../axios';
// 批量导入Beacon库
export function beaconBatch(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/beaconBatch.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 导出考勤
export function querySchoolGrade(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/querySchoolGrade.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 导出考勤
export function punchTable(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/punchTable.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// nfc卡库列表查询===========================
export function queryNfcAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/queryNfcAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}


// nfc卡库列表删除
export function deleteNfc(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/deleteNfc.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// nfc卡库列表编辑
export function updateNfc(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/updateNfc.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// nfc卡库添加
export function addNfcAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/addNfcAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// nfc卡库导入
export function nfcBatch(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/nfcBatch.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
