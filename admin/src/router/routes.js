import { LocalStorage } from 'quasar'; // Assuming you're storing the token in local storage

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Dashboard.vue'), meta: { requiresAuth: true } },
      { path: '/Dashboard2', component: () => import('pages/Dashboard2.vue'), meta: { requiresAuth: true } },
      { path: '/Profile', component: () => import('pages/UserProfile.vue'), meta: { requiresAuth: true } },
      { path: '/Map', component: () => import('pages/Map.vue'), meta: { requiresAuth: true } },
      { path: '/MapMarker', component: () => import('pages/MapMarker.vue'), meta: { requiresAuth: true } },
      { path: '/TreeTable', component: () => import('pages/TreeTable.vue'), meta: { requiresAuth: true } },
      { path: '/StreetView', component: () => import('pages/StreetView.vue'), meta: { requiresAuth: true } },
      { path: '/Cards', component: () => import('pages/Cards.vue'), meta: { requiresAuth: true } },
      { path: '/RequestAccounts', component: () => import('src/pages/RequestAccounts.vue'), meta: { requiresAuth: true } },
      { path: '/AllAccounts', component: () => import('src/pages/AllAccounts.vue'), meta: { requiresAuth: true } },
      { path: '/SchoolAccounts', component: () => import('src/pages/SchoolAccounts.vue'), meta: { requiresAuth: true } },
      { path: '/HiringApproval', component: () => import('src/pages/HiringApproval.vue'), meta: { requiresAuth: true } },
      { path: '/Contact', component: () => import('pages/Contact.vue'), meta: { requiresAuth: true } },
      { path: '/Checkout', component: () => import('pages/Checkout.vue'), meta: { requiresAuth: true } },
      { path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue'), meta: { requiresAuth: true } },
      { path: '/Pagination', component: () => import('pages/Pagination.vue'), meta: { requiresAuth: true } },
      { path: '/Charts', component: () => import('pages/Charts.vue'), meta: { requiresAuth: true } },
      { path: '/Calendar', component: () => import('pages/Calendar.vue'), meta: { requiresAuth: true } },
      { path: '/Directory', component: () => import('pages/Directory.vue'), meta: { requiresAuth: true } },
      { path: '/Footer', component: () => import('pages/Footer.vue'), meta: { requiresAuth: true } },
      { path: '/CardHeader', component: () => import('pages/CardHeader.vue'), meta: { requiresAuth: true } },
      // Add other routes as needed...
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Maintenance',
    component: () => import('pages/Maintenance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Login',
    component: () => import('pages/Login-1.vue')
  },
  {
    path: '/Lock',
    component: () => import('pages/LockScreen.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue'),
    meta: { requiresAuth: true }
  }
];

export default routes;
