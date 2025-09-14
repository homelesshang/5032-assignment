import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import MainPage from '../components/MainPage.vue'
import CoachPage from '../components/Coach/CoachPage.vue'
import ClientPage from '../components/Client/ClientPage.vue'


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage }, 
  { path: '/main', name: 'main', component: MainPage },
  { path: '/coach', name: 'coach', component: CoachPage, meta: { requiresRole: 'coach' } },
  { path: '/client', name: 'client', component: ClientPage, meta: { requiresRole: 'client' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("role")

  if (to.meta.requiresRole && role !== to.meta.requiresRole) {
    alert("⛔ No permission to access this page")
    return next("/login")
  }

  next()
})

export default router