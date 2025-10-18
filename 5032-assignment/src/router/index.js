import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import CoachPage from '../components/Coach/CoachPage.vue'
import ClientPage from '../components/Client/ClientPage.vue'
import ClientClasses from '../components/Client/ClientClasses.vue'
import CoachProgress from '../components/Coach/CoachProgress.vue'
import CustomerMap from '../components/Client/CustomerMap.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },

  // 👨‍🏫 教练页面
  {
    path: '/coach',
    name: 'coach',
    component: CoachPage,
    meta: { requiresRole: 'coach' },
  },

  // 💪 客户首页
  {
    path: '/client',
    name: 'client',
    component: ClientPage,
    meta: { requiresRole: 'client' },
  },

  // 📋 客户课程表页面
  {
    path: '/classes',
    name: 'clientClasses',
    component: ClientClasses,
    meta: { requiresRole: 'client' },
  },

  // 🗺️ 顾客地图页面（新加的）
  {
    path: '/customer-map',
    name: 'customerMap',
    component: CustomerMap,
    meta: { requiresRole: 'client' },
  },

  // 📈 教练进度页面
  {
    path: '/coach/progress',
    name: 'coachProgress',
    component: CoachProgress,
    meta: { requiresRole: 'coach' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ 导航守卫（无需修改）
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const db = getFirestore()

  if (!to.meta.requiresRole) return next()

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  if (!user) {
    alert('⚠️ Please login first.')
    return next('/login')
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const role = userDoc.exists() ? userDoc.data().role : null
    console.log('👤 Current user role:', role)

    if (to.meta.requiresRole && role !== to.meta.requiresRole) {
      alert('⛔ No permission to access this page.')
      return next('/login')
    }

    next()
  } catch (err) {
    console.error('🔥 Error checking role:', err)
    alert('❌ Failed to verify role.')
    next('/login')
  }
})

export default router