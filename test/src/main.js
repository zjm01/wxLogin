// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import axios from './utils/http'
// index.js or main.js
import 'vuetify/dist/vuetify.min.css' 
Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
// axios.get('http://dashboard.belstar.com.cn/oauth/token?client_id=IMUnWDsfBT7L7Jq4jJTu0T9gfEDGCeAnlLO58u35&grant_type=refresh_token&refresh_token=bbece04069cd845ee82bec00c0624f21').then((response) => {
//   axios.defaults.headers.common['token'] = response.data.access_token
// }).then((xx) => {
//   new Vue({
//     el: '#app',
//     router,
//     store,
//     i18n,
//     render: h => h(App)
//   })
// })
new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })

