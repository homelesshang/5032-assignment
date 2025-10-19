import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// 页面组件导入
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'

// 👨‍🏫 教练端
import CoachPage from '../components/Coach/CoachPage.vue'
import CoachRating from '../components/Coach/CoachRating.vue'

// 💪 客户端
import ClientPage from '../components/Client/ClientPage.vue'
import ClientClasses from '../components/Client/ClientClasses.vue'
import CustomerMap from '../components/Client/CustomerMap.vue'
import ClientRating from '../components/Client/ClientRating.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },

  // 👨‍🏫 教练主页
  {
    path: '/coach',
    name: 'coachDashboard',
    component: CoachPage,
    meta: { requiresRole: 'coach' },
  },

  // ⭐ 教练查看评分页
  {
    path: '/coach/rating',
    name: 'coachRating',
    component: CoachRating,
    meta: { requiresRole: 'coach' },
  },

  // 💪 客户主页（Dashboard）
  {
    path: '/client',
    name: 'clientDashboard',
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

  // ⭐ 客户评分页面
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

  // 无需角色权限的页面（login/register）直接放行
  if (!to.meta.requiresRole) return next()

  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

  // 未登录
  if (!user) {
    alert('⚠️ Please login first.')
    return next('/login')
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const role = userDoc.exists() ? userDoc.data().role : null
    console.log('👤 Current user role:', role)

    // 若访问页面与角色不匹配
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