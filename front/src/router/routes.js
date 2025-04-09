import { LocalStorage } from 'quasar';
import { route } from 'quasar/wrappers';
import router from '.';

// Function to get account_status (account type) from local storage
const getAccountStatus = () => {
  const user = LocalStorage.getItem('user'); // Retrieves the user as a string
  if (user) {
    const parsedUser = JSON.parse(user); // Parse the string into a JavaScript object
    return parsedUser.account_type; // Return the account type
  }
  return null; // Return null if no user is found
};

// Function to check if the route is allowed based on account type
const isRouteAllowed = (routePath) => {
  const accountStatus = getAccountStatus();

  // Make sure accountStatus is a number for comparison
  const accountType = parseInt(accountStatus, 10);

  // Restrict access to applicant routes if account type is not 6 (Applicant)
  if (routePath.startsWith('/applicant') && accountType !== 6) {
    return false;
  }

  // Restrict access to employer routes if account type is not 5 (Employer)
  if (routePath.startsWith('/employer') && accountType !== 5) {
    return false;
  }

  return true;
};

// Define routes
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to, from, next) => {
      if (isRouteAllowed(to.path)) {
        next();
      } else {
        next('/Login'); // Redirect to login or another page if access is denied
      }
    },
    children: [
      // Applicant routes (for users with account_status 6)
      { path: '/', component: () => import('pages/applicant/Dashboard.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/Dashboard2', component: () => import('pages/applicant/Dashboard2.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/Profile', component: () => import('pages/applicant/UserProfile.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/Map', component: () => import('pages/applicant/Map.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/MapMarker', component: () => import('pages/applicant/MapMarker.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/TreeTable', component: () => import('pages/applicant/TreeTable.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/StreetView', component: () => import('pages/applicant/StreetView.vue'), meta: { requiresAuth: true } },
      { path: '/Cards', component: () => import('pages/applicant/Cards.vue'), meta: { requiresAuth: true } },
      { path: '/Contact', component: () => import('pages/applicant/Contact.vue'), meta: { requiresAuth: true } },
      { path: '/Checkout', component: () => import('pages/applicant/Checkout.vue'), meta: { requiresAuth: true } },
      { path: '/Ecommerce', component: () => import('pages/applicant/ProductCatalogues.vue'), meta: { requiresAuth: true } },
      { path: '/Pagination', component: () => import('pages/applicant/Pagination.vue'), meta: { requiresAuth: true } },
      { path: '/Charts', component: () => import('pages/applicant/Charts.vue'), meta: { requiresAuth: true } },
      { path: '/Calendar', component: () => import('pages/applicant/Calendar.vue'), meta: { requiresAuth: true } },
      { path: '/Directory', component: () => import('pages/applicant/Directory.vue'), meta: { requiresAuth: true } },
      { path: '/Footer', component: () => import('pages/applicant/Footer.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/CardHeader', component: () => import('pages/applicant/CardHeader.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/CreateResume', component: () => import('pages/applicant/CreateResume.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/Resume', component: () => import('pages/applicant/DisplayResume.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/AddVideo', component: () => import('pages/applicant/SubmitVideo.vue'), meta: { requiresAuth: true } },
      { path: '/applicant/videos', component: () => import('pages/applicant/VideoList.vue'), meta: { requiresAuth: true } },
      { path: '/records', component: () => import('pages/applicant/ControllerData.vue'), meta: { requiresAuth: true } },
      


      // Employer routes (for users with account_status 5)
      { path: '/employer/dashboard', component: () => import('pages/employer/Dashboard.vue'), meta: { requiresAuth: true } },
      { path: '/employer/dashboard2', component: () => import('pages/employer/Dashboard2.vue'), meta: { requiresAuth: true } },
      { path: '/employer/profile', component: () => import('pages/employer/UserProfile.vue'), meta: { requiresAuth: true } },
      { path: '/employer/map', component: () => import('pages/employer/Map.vue'), meta: { requiresAuth: true } },
      { path: '/employer/mapmarker', component: () => import('pages/employer/MapMarker.vue'), meta: { requiresAuth: true } },
      { path: '/employer/treetable', component: () => import('pages/employer/TreeTable.vue'), meta: { requiresAuth: true } },
      { path: '/employer/streetview', component: () => import('pages/employer/StreetView.vue'), meta: { requiresAuth: true } },
      { path: '/employer/cards', component: () => import('pages/employer/Cards.vue'), meta: { requiresAuth: true } },
      { path: '/employer/contact', component: () => import('pages/employer/Contact.vue'), meta: { requiresAuth: true } },
      { path: '/employer/checkout', component: () => import('pages/employer/Checkout.vue'), meta: { requiresAuth: true } },
      { path: '/employer/ecommerce', component: () => import('pages/employer/ProductCatalogues.vue'), meta: { requiresAuth: true } },
      { path: '/employer/pagination', component: () => import('pages/employer/Pagination.vue'), meta: { requiresAuth: true } },
      { path: '/employer/charts', component: () => import('pages/employer/Charts.vue'), meta: { requiresAuth: true } },
      { path: '/employer/calendar', component: () => import('pages/employer/Calendar.vue'), meta: { requiresAuth: true } },
      { path: '/employer/directory', component: () => import('pages/employer/Directory.vue'), meta: { requiresAuth: true } },
      { path: '/employer/footer', component: () => import('pages/employer/Footer.vue'), meta: { requiresAuth: true } },
      { path: '/employer/cardheader', component: () => import('pages/employer/CardHeader.vue'), meta: { requiresAuth: true } },
      { path: '/employer/create-resume', component: () => import('pages/employer/CreateResume.vue'), meta: { requiresAuth: true } },
      { path: '/employer/resume', component: () => import('pages/employer/DisplayResume.vue'), meta: { requiresAuth: true } },
      { path: '/employer/add-video', component: () => import('pages/employer/SubmitVideo.vue'), meta: { requiresAuth: true } },
      { path: '/employer/videos', component: () => import('pages/employer/VideoList.vue'), meta: { requiresAuth: true } },
      { path: '/employer/applicants-status', component: () => import('pages/employer/HiredApplicant.vue'), meta: { requiresAuth: true } },
      { path: '/global-chat', component: () => import('pages/employer/GlobalChat.vue'), meta: { requiresAuth: true } },

      //newroutes
      { path: '/employer/reels', component: () => import('pages/employer/VideoReels.vue'), meta: { requiresAuth: true } }
    ]
  },
  // Other global routes
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/employer/Error404.vue')
  },
  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Maintenance',
    component: () => import('pages/applicant/Maintenance.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Pricing',
    component: () => import('pages/applicant/Pricing.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Login',
    component: () => import('pages/Login-1.vue')
  },
  {
    path: '/socket',
    component: () => import('pages/employer/default.vue')
  },
  {
    path: '/sucket',
    component: () => import('pages/applicant/default.vue')
  },
  {
    path: '/ResetPassword', 
    component: () => import('pages/ResetPassword.vue')
  },  
  {
    path: '/ForgotPassword',
    component: () => import('pages/ForgotPassword.vue')
  },
  
  {
    path: '/Lock',
    component: () => import('pages/applicant/LockScreen.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/Lock-2',
    component: () => import('pages/applicant/LockScreen-2.vue'),
    meta: { requiresAuth: true }
  }
];

export default routes;





