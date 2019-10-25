import ax from '../axios';

//设备列表
export function showDeviceList(params) {
  return ax.post('/action/mod-xiaojiao/device/showDeviceList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增设备绑定
export function addDeviceBind(params) {
  return ax.post('/action/mod-xiaojiao/device/addDeviceBind.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑设备绑定
export function updateDeviceBind(params) {
  return ax.post('/action/mod-xiaojiao/device/updateDeviceBind.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除设备绑定
export function deleteDeviceBind(params) {
  return ax.post('/action/mod-xiaojiao/device/deleteDeviceBind.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示设备状态
//   http://120.77.233.111:8080/qxiao-cms/action/mod-xiaojiao/device/status/showDeviceStatus.do
///action/mod-xiaojiao/device/status/showDeviceStatus.do
export function showDeviceStatus(params) {
  return ax.post('/action/mod-xiaojiao/device/status/showDeviceStatus.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示设备运行日志
export function showDeviceRunlog(params) {
  return ax.post('/action/mod-xiaojiao/device/runlog/showDeviceRunlog.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//发送设备命令
export function sendDeviceCommand(params) {
  return ax.post('/action/mod-xiaojiao/command/sendDeviceCommand.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示设备详情
export function showDeviceDetail(params) {
  return ax.post('/action/mod-xiaojiao/device/runlog/showDeviceDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示检修列表
export function showRepairList(params) {
  return ax.post('/action/mod-xiaojiao/device/repair/showRepairList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增检修记录
export function addDeviceRepair(params) {
  return ax.post('/action/mod-xiaojiao/device/repair/addDeviceRepair.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑检修记录
export function updateDeviceRepair(params) {
  return ax.post('/action/mod-xiaojiao/device/repair/updateDeviceRepair.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除检修记录
export function deleteDeviceRepair(params) {
  return ax.post('/action/mod-xiaojiao/device/repair/deleteDeviceRepair.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
