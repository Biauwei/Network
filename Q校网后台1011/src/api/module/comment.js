import ax from '../axios';

//添加学生点评
export function addComment(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/addComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生点评列表
export function queryCommentList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/queryCommentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生列表
export function queryStudentList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/queryStudentList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改学生点评
export function updateComment(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/updateComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除学生点评
export function deleteComment(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/deleteComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学生点评（单条）
export function queryComment(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/comment/queryComment.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
