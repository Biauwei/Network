import ax from '../axios';

//视频课程列表
export function queryVideoLessonList(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/lesson/queryVideoLessonList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除视频
export function deleteVideoLesson(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/lesson/deleteVideoLesson.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改视频详情
export function updateVideoLesson(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/lesson/updateVideoLesson.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//添加课程视频详情
export function addVideoLesson(params, config) {
  return ax.post('/action/mod-xiaojiao/weixin/lesson/addVideoLesson.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
