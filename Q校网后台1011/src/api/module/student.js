import ax from '../axios';

//查询学生列表（微信端）
export function queryStudent(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/queryStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//录入学生信息（微信端）
export function addStudent(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/addStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑学生信息（微信端）
export function updateStudent(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/updateStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除学生信息（微信端）
export function deleteStudent(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/deleteStudent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//批量导入学生（微信端）
export function studentDownloadExcelTemp(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/downloadExcelTemp.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//批量导入学生（微信端）
export function batchStudents(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/batchStudents.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询学生nfcId列表（微信端）20191005
export function queryNfcList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/queryNfcList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 解绑学生nfcId（微信端）20191005
export function deleteNfcId(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/deleteNfcId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 绑定学生nfcId（微信端）20191005
export function addNfc(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/student/addNfc.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 绑定学生IBEACONId   --wei
export function addBeacon(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/addBeacon.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 解绑学生IBEACONId   --wei
export function deleteStudentBeaconMac(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/deleteStudentBeaconMac.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 查询学生IBEACONId  --wei
export function queryBeaconByStudentId(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/queryBeaconByStudentId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 查询Beacon库   --wei
export function queryBeaconAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/queryBeaconAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//添加Beacon库   --wei
export function beaconAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/beaconAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

// 修改Beacon库   --wei
export function updateBeaconAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/updateBeaconAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 删除Beacon库   --wei
export function deleteBeaconALL(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/deleteBeaconALL.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//设备ap列表插 --wei
export function deviceBindingAp(params, config) {
  return ax.post('/action/mod-xiaojiao/ap/deviceBindingAp.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//设备ap列表查询  --wei
export function deviceApList(params, config) {
  return ax.post('/action/mod-xiaojiao/ap/deviceApList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示设备列表查询学校班牌设备  --wei
export function querySchoolDevice(params, config) {
  return ax.post('/action/mod-xiaojiao/device/querySchoolDevice.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//设备ap删除  --wei
export function deleteDeviceAp(params, config) {
  return ax.post('/action/mod-xiaojiao/ap/deleteDeviceAp.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//设备ap编辑  --wei
export function updateDeviceAp(params, config) {
  return ax.post('/action/mod-xiaojiao/ap/updateDeviceAp.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
// 设备ap详情查询(编辑)
export function queryApInfo(params, config) {
  return ax.post('/action/mod-xiaojiao/ap/queryApInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
