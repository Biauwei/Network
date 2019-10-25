import ax from '../axios';

//学生作品查询--审核列表
export function queryWorksCollection(params, config) {
  return ax.post('/action/mod-xiaojiao/works/queryWorksCollection.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作品集详情查询
export function queryWorksDetailList(params, config) {
  return ax.post('/action/mod-xiaojiao/works/queryWorksDetailList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作品详情
export function queryWorksDetail(params, config) {
  return ax.post('/action/mod-xiaojiao/works/queryWorksDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作品上传
export function uploadWorks(params, config) {
  return ax.post('/action/mod-xiaojiao/works/uploadWorks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作品审核
export function checkWorks(params, config) {
  return ax.post('/action/mod-xiaojiao/works/checkWorks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//作品推荐
export function recommendWorks(params, config) {
  return ax.post('/action/mod-xiaojiao/works/recommendWorks.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//上传文件
export function uploadFile(params, config) {
  return ax.post('/action/mod-xiaojiao/works/uploadFile.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学生作品上传列表
export function querySchoolCollection(params, config) {
  return ax.post('/action/mod-xiaojiao/works/querySchoolCollection.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除作品
export function deleteDetail(params, config) {
  return ax.post('/action/mod-xiaojiao/works/deleteDetail.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
