import ax from '../axios';

//考试阶段列表查询
export function queryScoreStageList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/queryScoreStageList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级查询
export function queryStudentClass(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/queryStudentClass.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//班级学生测试科目成绩录入查询
export function studentStageScoreList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/studentStageScoreList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除阶段年级
export function deleteStageScore(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/deleteStageScore.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//成绩录入
export function addStage(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/addStage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//录入学生成绩
export function addStageScore(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/addStageScore.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//考试单元
export function queryExamStage(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/score/queryExamStage.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
