import Vue from 'vue';
import Router from 'vue-router';
import layout from '@/views/layout';

Vue.use(Router);

export const constantRouterMap = [{
    path: '/login',
    component: () =>
      import('@/views/login'),
  },
  {
    path: '/',
    component: layout,
    redirect: '/home',
    children: [{
        path: '/home',
        name: 'home',
        component: () =>
          import('@/views/home'),
        meta: {
          title: "首页"
        }
      },
      // {
      //   path: '/demo1',
      //   comment: 'demo1',
      //   component: () =>
      //     import('@/views/demo1'),
      //   meta: {
      //     title: '虚拟键盘'

      //   }
      // }
    ]
  },
  {
    path: '*',
    component: layout,
    redirect: '/home',
  }
]

export default new Router({
  //mode: 'history', //取消导航中的 # 
  routes: constantRouterMap
});
