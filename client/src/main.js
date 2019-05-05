import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase';
import './components/firebaseInit';
import VeeValidate from 'vee-validate';


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VeeValidate);
Vue.use(BootstrapVue);
Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});


