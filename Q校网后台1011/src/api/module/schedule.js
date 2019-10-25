import ax from '../axios';

//班级课表列表展示
export function queryScheduleList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/queryScheduleList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校课表模板
export function queryScheduleTemplateAll(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/queryScheduleTemplateAll.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询课表模板详情
export function queryScheduleTemplateDetail(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/queryScheduleTemplateDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增模板
export function addScheduleTemplate(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/addScheduleTemplate.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增课表
export function addSchedule(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/addSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改课表
export function updateSchedule(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/updateSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除课表
export function deteleSchedule(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/deteleSchedule.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询默认时间模板
export function queryTeplateDefault(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/schedule/queryTeplateDefault.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
