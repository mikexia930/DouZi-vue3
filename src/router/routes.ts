const routes: Array<any> = [
  {
    path: '/',
    name: 'none',
    component: () => import('@/views/none/None.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/index/Index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'none' }
  }
];

export default routes;
