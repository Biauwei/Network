import ax from '../axios';

//查询栏目
export function queryChannel(params) {
  return ax.post('/action/mod-xiaojiao/channel/queryChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询栏目all
export function queryChannelAll(params) {
  return ax.post('/action/mod-xiaojiao/channel/queryChannelAll.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增栏目
export function addChannel(params) {
  return ax.post('/action/mod-xiaojiao/channel/addChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑栏目
export function updateChannel(params) {
  return ax.post('/action/mod-xiaojiao/channel/updateChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除栏目
export function deleteChannel(params) {
  return ax.post('/action/mod-xiaojiao/channel/deleteChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询栏目模板
export function queryChannelTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/queryChannelTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询栏目模板(不带参数)
export function queryChannelTemplateAll(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/queryChannelTemplateAll.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//栏目模板详细预览
export function previewChannelTemplateDetail(params) {
  return ax.post('/action/mod-xiaojiao/channel/templateDetail/previewChannelTemplateDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增栏目模板
export function addChannelTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/addChannelTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询栏目模板详细
export function queryChannelTemplateDetail(params) {
  return ax.post('/action/mod-xiaojiao/channel/templateDetail/queryChannelTemplateDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑栏目模板
export function updateChannelTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/updateChannelTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增栏目模板详细项
export function addChannelTemplateDetail(params) {
  return ax.post('/action/mod-xiaojiao/channel/templateDetail/addChannelTemplateDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//修改栏目模板详细项
export function updateChannelTemplateDetail(params) {
  return ax.post('/action/mod-xiaojiao/channel/templateDetail/updateChannelTemplateDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除栏目模板详细项
export function deleteChannelTemplateDetail(params) {
  return ax.post('/action/mod-xiaojiao/channel/templateDetail/deleteChannelTemplateDetail.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//设置默认栏目模板
export function updateDefaultTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/updateDefaultTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除栏目模板
export function deleteChannelTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/template/deleteChannelTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校全屏播放内容
export function querySchoolPlayChannel(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/querySchoolPlayChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校滚动播放内容
export function querySchoolScroolContent(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/querySchoolScroolContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑滚动内容
export function updateScroolContent(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/updateScroolContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除滚动内容
export function deleteScroolContent(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/deleteScroolContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询学校列表
export function schoolList(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/schoolList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//更新表单播放列表
export function updatePlayList(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/updatePlayList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增学校播放频道
export function addSchoolPlayChannel(params, config) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/addSchoolPlayChannel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询频道对应内容列表
export function queryPlayContent(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/queryPlayContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//新增播放列表对应内容
export function queryPlayContentList(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/queryPlayContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//根据关键字查询学校名称
export function selectSchoolNameLike(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/selectSchoolNameLike.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑学校播放频道
export function updateSchoolPlayChannel(params, config) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/updateSchoolPlayChannel.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除学校播放频道
export function deleteSchoolPlayChannel(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/deleteSchoolPlayChannel.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询频道对应内容列表
export function queryChannelContent(params) {
  return ax.post('/action/mod-xiaojiao/channel/queryChannelContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询新增栏目播放内容
export function queryChannelContents(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolPlay/queryChannelContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//查询上传列表审核节点
export function queryCheckNode(params) {
  return ax.post('/action/mod-xiaojiao/content/check/queryCheckNode.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询我的上传列表
export function queryContentList(params) {
  return ax.post('/action/mod-xiaojiao/channel/content/queryContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询滚动通知列表
export function queryRollContent(params) {
  return ax.post('/action/mod-xiaojiao/channel/content/queryRollContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
export function updateRollContent(params, config) {
  return ax.post('/action/mod-xiaojiao/channel/content/updateRollContent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//上传图片
export function filesUpload(params, config) {
  return ax.post('/action/mod-xiaojiao/image/filesUpload.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除我的上传内容
export function deleteContent(params) {
  return ax.post('/action/mod-xiaojiao/channel/content/deleteContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//上传内容
export function uploadContent(params, config) {
  return ax.post('/action/mod-xiaojiao/channel/content/uploadContent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//删除图片
export function deletePicture(params) {
  return ax.post('/action/mod-xiaojiao/image/deletePicture.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询编辑内容
export function queryContentByContentId(params, config) {
  return ax.post('/action/mod-xiaojiao/channel/content/queryContentByContentId.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//编辑上传内容
export function updateContent(params, config) {
  return ax.post('/action/mod-xiaojiao/channel/content/updateContent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询栏目模板时间段
export function querySchoolPlayListTime(params) {
  return ax.post('/action/mod-xiaojiao/channel/content/querySchoolPlayListTime.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//显示内容模板列表
export function queryContentTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/content/queryContentTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//保存模板
export function addContentTemplate(params) {
  return ax.post('/action/mod-xiaojiao/channel/addContentTemplate.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询审核内容列表
export function queryCheckContentList(params) {
  return ax.post('/action/mod-xiaojiao/content/check/queryCheckContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//审核内容
export function checkContent(params) {
  return ax.post('/action/mod-xiaojiao/content/check/checkContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//进行内容预发布
export function prepublishContent(params, config) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/prepublishContent.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//内容发布（待发布）学校信息
export function queryPrePublishSchoolInfo(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/queryPrePublishSchoolInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//内容发布（已发布）学校信息
export function queryPublishSchoolInfo(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/queryPublishSchoolInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询终审通过内容
export function queryCheckedContent(params) {
  return ax.post('/action/mod-xiaojiao/content/queryCheckedContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//进行内容正式发布
export function publishContent(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/publishContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询待发布内容列表
export function queryPublishContentList(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/queryPublishContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//查询预发布内容列表
export function queryPrepublishContentList(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/queryPrepublishContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学校待审核内容列表
export function schoolCheckQueryPrepublishContentList(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolCheck/queryPrepublishContentList.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//学校审核
export function schoolCheckContent(params) {
  return ax.post('/action/mod-xiaojiao/content/schoolCheck/schoolCheckContent.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}

//2018-11-27
//获取上传人的区域
export function findPublishScope(params) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/findPublishScope.do', params)
    .then(res => res.data)
    .catch(e => console.log(e));
}
//预发布学校展示
export function preshowSchoolList(params, config) {
  return ax.post('/action/mod-xiaojiao/content/prePublish/showSchoolList.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e));
}
