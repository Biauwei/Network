import ax from '../axios'

//查询学校门户网站
export function queryPortalWeb(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryPortalWeb.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//查询学校门户网站菜单
export function queryPortalWebMenu(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryPortalWebMenu.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//查询学校门户网站菜单内容
export function queryPortalWebInfo(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryPortalWebInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//保存学校门户网站菜单内容
export function savePortalWebInfo(params, config) {
  return ax.post('/action/mod-xiaojiao/portal/savePortalWebInfo.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//删除学校门户网站菜单
export function deletePortalWeb(params) {
  return ax.post('/action/mod-xiaojiao/portal/deletePortalWeb.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//修改学校门户网站菜单内容
export function updatePortalWeb(params, config) {
  return ax.post('/action/mod-xiaojiao/portal/updatePortalWeb.do', params, config)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//审核-所有学校的门户
export function queryCheckPortalWeb(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryCheckPortalWeb.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//审核-学校的门户内容
export function queryCheckPortalWebInfo(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryCheckPortalWebInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//审核-学校门户
export function checkPortalWeb(params) {
  return ax.post('/action/mod-xiaojiao/portal/checkPortalWeb.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//审核-学校门户
export function queryPortalWebAllInfo(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryPortalWebAllInfo.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
//查询学校门户网站url
export function queryPortalWebUrl(params) {
  return ax.post('/action/mod-xiaojiao/portal/queryPortalWebUrl.do', params)
    .then(res => res.data)
    .catch(e => console.log(e))
}
