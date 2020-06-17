import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import DomainList from "./components/DomainList.vue";
import DomainView from "./components/DomainView.vue";
import Vuex from "vuex";

Vue.use(VueRouter);
Vue.use(Vuex);
// store é responsavel pelo gerenciamento de estado 
const store = new Vuex.Store({
  state: {
    items: {
      prefix: [],
      sufix: []
    },
    domains: []
  },
  
});

const router = new VueRouter({
  routes: [
    {
      path:"/domains",
      component: DomainList
    },
    {
      path: "/domains/:domain",
      component: DomainView,
      props: true
    },
    {
      path: "/",
      redirect: "/domains"
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
