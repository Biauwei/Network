import ax from '../axios';

//查询老师列表（微信端）
export function queryTeachers(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/queryTeachers.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//录入老师信息（微信端）
export function addTeacher(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/addTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除老师信息（微信端）
export function deleteTeacher(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/deleteTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑老师信息（微信端）
export function updateTeacher(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/updateTeacher.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//下载Excel模板
export function teacherDownloadExcelTemp(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/downloadExcelTemp.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//批量导入老师（微信）
export function teacherBatchAdd(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/teacherBatchAdd.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据班级ID查询老师列表（微信端）
export function queryTeacherWithClassId(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/teacher/queryTeacherWithClassId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
