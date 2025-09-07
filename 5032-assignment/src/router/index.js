import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import MainPage from '../components/MainPage.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage }, 
  { path: '/main', name: 'main', component: MainPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router