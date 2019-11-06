import ax from '../axios';

//预录入号码（新增学校微信端）
export function addLeaderInit(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/school/addLeaderInit.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校列表
export function querySchoolList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/school/querySchoolList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据名称查询学校（微信端）
export function findSchool(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/school/findSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//编辑学校（微信端）
export function updateWxSchool(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/school/updateWxSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级列表（微信端）
export function querySchoolClass(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/class/querySchoolClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询班级列表（微信端）
export function queryClasses(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/class/queryClasses.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑班级信息（微信端）
export function updateClass(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/class/updateClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增班级信息（微信端）
export function addClass(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/class/addClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除班级信息（微信端）
export function deleteClass(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/class/deleteClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//用户统计
export function statistics(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/statistics/statistics.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级统计
export function classStatistics(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/statistics/classStatistics.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//打卡统计
export function queryPunchList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/punch/queryPunchList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
