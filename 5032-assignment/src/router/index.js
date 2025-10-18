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
import ClientRating from '../components/Client/ClientRating.vue' // ⭐ 新增评分页面导入

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

  // 📈 教练进度页面
  {
    path: '/coach/progress',
    name: 'coachProgress',
    component: CoachProgress,
    meta: { requiresRole: 'coach' },
  },

  // 💪 客户主页面（Dashboard）
  {
    path: '/client',
    name: 'client',
    component: ClientPage,
    meta: { requiresRole: 'client' },
  },

  // 📋 客户课程页面
  {
    path: '/classes',
    name: 'clientClasses',
    component: ClientClasses,
    meta: { requiresRole: 'client' },
  },

  // 🧭 客户地图页面
  {
    path: '/customer-map',
    name: 'customerMap',
    component: CustomerMap,
    meta: { requiresRole: 'client' },
  },

  // ⭐ 客户评分页面（新加）
  {
    path: '/rating',
    name: 'clientRating',
    component: ClientRating,
    meta: { requiresRole: 'client' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Firebase 角色鉴权导航守卫
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const db = getFirestore()

  // 没有要求角色的页面（如 login/register）直接放行
  if (!to.meta.requiresRole) return next()

  // 等待用户加载完成
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  // 未登录 → 回登录页
  if (!user) {
    alert('⚠️ Please login first.')
    return next('/login')
  }

  try {
    // 检查 Firestore 中的用户角色
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