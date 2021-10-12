import { createRouter, createWebHistory } from 'vue-router';

import Main from './components/Main.vue';
import Authorization from './components/Authorization.vue'; 
import NotFound from './components/NotFound.vue';

const routes = [
  { path: '/main', component: Main, name: 'main-page', meta: { requiresAuth: true } },
  { path: '/', component: Authorization, name: 'auth' },
  { path: '/error', component: NotFound, name: 'not-found' },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]




const router = createRouter({
  history: createWebHistory(),
  routes
});

router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href // '/not/found'

router.beforeEach((to, _, next) => {
  let isLoggedIn = localStorage.getItem("loggedIn");
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/')
  } else {
    next();
  }
});

export default router;