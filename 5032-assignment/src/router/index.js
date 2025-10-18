import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import MainPage from '../components/MainPage.vue'
import CoachPage from '../components/Coach/CoachPage.vue'
import ClientPage from '../components/Client/ClientPage.vue'


import ClientClasses from '../components/Client/ClientClasses.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/main', name: 'main', component: MainPage },

  {
    path: '/coach',
    name: 'coach',
    component: CoachPage,
    meta: { requiresRole: 'coach' }
  },
  {
    path: '/client',
    name: 'client',
    component: ClientPage,
    meta: { requiresRole: 'client' }
  },


  {
    path: '/classes',
    name: 'clientClasses',
    component: ClientClasses,
    meta: { requiresRole: 'client' } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const db = getFirestore()


  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })


  if (to.meta.requiresRole) {
    if (!user) {
      alert("⚠️ Please login first.")
      return next('/login')
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const role = userDoc.exists() ? userDoc.data().role : null

      if (role === to.meta.requiresRole) {
        return next()
      } else {
        alert("⛔ No permission to access this page.")
        return next('/login')
      }
    } catch (error) {
      console.error("Error checking role:", error)
      alert("❌ Failed to verify role.")
      return next('/login')
    }
  }

  // 默认放行
  next()
})

export default router