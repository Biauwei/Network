import ax from '../axios'

//查询学校列表
export function showSchoolList(params) {
  return ax.post('/action/mod-xiaojiao/region/showSchoolList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//新增学校
export function addSchool(params, config) {
  return ax.post('/action/mod-xiaojiao/region/addSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑学校
export function updateSchool(params, config) {
  return ax.post('/action/mod-xiaojiao/region/updateSchool.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除学校
export function deleteSchool(params) {
  return ax.post('/action/mod-xiaojiao/region/deleteSchool.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校信息
export function querySchoolInfo(params) {
  return ax.post('/action/mod-xiaojiao/region/querySchoolInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询区域
export function queryRegion(params) {
  return ax.post('/action/mod-xiaojiao/region/queryRegion.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据区域ID查询省市
export function findRegion(params) {
  return ax.post('/action/mod-xiaojiao/region/findRegion.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据学校Id查询区域
export function queryProvinceCityRegionBySchoolId(params) {
  return ax.post('/action/mod-xiaojiao/region/queryProvinceCityRegionBySchoolId.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询省市区所有数据
export function findAll(params) {
  return ax.post('/action/mod-xiaojiao/region/findAll.do', params)
    .then(res => res.data)
    .catch(e => {
      console.log(e);
    });
}
//查询标签信息
export function queryLabel(params) {
  return ax.post('/action/mod-xiaojiao/region/queryLabel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增标签
export function addLabel(params) {
  return ax.post('/action/mod-xiaojiao/region/addLabel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除标签
export function deleteLabel(params) {
  return ax.post('/action/mod-xiaojiao/region/deleteLabel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校类别
export function querySchoolCategory(params) {
  return ax.post('/action/mod-xiaojiao/region/querySchoolCategory.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//上传图片
export function addImage(params) {
  return ax.post('/action/mod-xiaojiao/region/addImage.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除学校图片
export function deleteSchoolPicture(params) {
  return ax.post('/action/mod-xiaojiao/region/deleteSchoolPicture.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
