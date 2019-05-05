import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome,
      meta: {
        requiresGuest: true
      }
    },
    {
      path:'/home',
      name:'home',
      component: Home,
      meta:{
        requiresAuth:true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged   
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  }else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/home',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});
export default router;
