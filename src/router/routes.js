
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../pages/Login/login.vue'),
    children: [
      {
        path: '/login', component: () => import('../components/Login/login.vue')
      },
      {
        path: '/login/create-login', component: () => import('../components/Login/create-account.vue')
      }
    ]
  },
  {
    path: '/movimentation',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/movimentation', component: () => import('../pages/movimentations/MovimentationPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
