/*
=========================================================
Muse - Vue Ant Design Dashboard - v1.0.0
=========================================================

Product Page: https://www.creative-tim.com/product/vue-ant-design-dashboard
Copyright 2021 Creative Tim (https://www.creative-tim.com)
Coded by Creative Tim

=========================================================
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
*/

import Vue from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import App from "./App.vue";
import DefaultLayout from "./layouts/Default.vue";
import DashboardLayout from "./layouts/Dashboard.vue";
import DashboardRTLLayout from "./layouts/DashboardRTL.vue";
import router from "./router";
import store from "./store";
import api from "./api";
// import './plugins/click-away'

import "./scss/app.scss";

Vue.use(Antd);

Vue.prototype.$http = api;
api.defaults.timeout = 10000;

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
