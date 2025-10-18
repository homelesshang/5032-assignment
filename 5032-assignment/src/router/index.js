import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import CoachPage from '../components/Coach/CoachPage.vue'
import ClientPage from '../components/Client/ClientPage.vue'
import ClientClasses from '../components/Client/ClientClasses.vue'
import CoachProgress from '../components/Coach/CoachProgress.vue'

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
  {
  path: '/coach/progress',
  name: 'coachProgress',
  component: CoachProgress,
  meta: { requiresRole: 'coach' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * ✅ 修正版导航守卫
 * 解决重复 next() 导致页面空白的问题
 * 更清晰的流程控制 + 调试日志
 */
router.beforeEach(async (to, from, next) => {
  const auth = getAuth()
  const db = getFirestore()

  // 如果页面不需要验证权限 → 直接放行
  if (!to.meta.requiresRole) return next()

  // 等待 Firebase 获取当前登录状态
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  // 🚫 未登录
  if (!user) {
    alert('⚠️ Please login first.')
    return next('/login')
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const role = userDoc.exists() ? userDoc.data().role : null
    console.log('👤 Current user role:', role)

    // 🚫 权限不匹配
    if (to.meta.requiresRole && role !== to.meta.requiresRole) {
      alert('⛔ No permission to access this page.')
      return next('/login')
    }

    // ✅ 验证通过
    next()
  } catch (err) {
    console.error('🔥 Error checking role:', err)
    alert('❌ Failed to verify role.')
    next('/login')
  }
})

export default router