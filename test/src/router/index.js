/*
 * @Author: your name
 * @Date: 2019-08-22 09:12:18
 * @LastEditTime: 2019-11-13 14:58:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /my-login/test/src/router/index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/Login/login'
import myLogin from "../pages/Login/myLogin"
import Authredirect from '../pages/Login/authredirect'
import Personal from '../pages/Personal/personal'
import ConctWchat from '../pages/Login/conctWchat'
import Test from '../pages/Test/Test'
Vue.use(Router)

const router =  new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: Login
    // },
    {
      path: '/',
      name: 'myLogin',
      component: myLogin
    },
    {
      path: '/authredirect',
      name: 'Authredirect',
      component: Authredirect 
    },
    // {
    //   path: '/wchat',
    //   name: 'WxConct',
    //   component: WxConct
    // },
    {
      path: '/personal',
      name: 'Personal',
      component:Personal
    },
    {
      path:"/test",
      name:"Test",
      component:Test
    },
    // {
    //   path: '/auth',
    //   name: 'Login',
    //   component: Auth
    // },
    {
      path: '/conctWchat',
      name: 'ConctWchat',
      component: ConctWchat
    }
  ]
})
export default router