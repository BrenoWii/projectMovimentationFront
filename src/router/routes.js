
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/dashboard',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard', component: () => import('../pages/dashboard/DashboardPage.vue')
      }
    ]
  },
  {
    path: '/plan-of-bills',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/plan-of-bills', component: () => import('../pages/plan-of-bills/PlanOfBillsPage.vue')
      }
    ]
  },
  {
    path: '/users',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/users', component: () => import('../pages/users/UsersPage.vue')
      }
    ]
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
  {
    path: '/classification',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/classification', component: () => import('../pages/classification/ClassificationPage.vue')
      }
    ]
  },
  {
    path: '/import',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/import', component: () => import('../pages/import/ImportPage.vue')
      }
    ]
  },
  {
    path: '/mappings',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/mappings', component: () => import('../pages/import/MappingsPage.vue')
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
