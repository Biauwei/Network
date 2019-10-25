import lazy from './lazyLoading';

//这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
//所以这里要做一些转换
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      route.component = lazy(route.component);
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  })
  return accessedRouters;
}

export default filterAsyncRouter
