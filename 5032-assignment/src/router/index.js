import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'


import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'


import CoachPage from '../components/Coach/CoachPage.vue'
import CoachRating from '../components/Coach/CoachRating.vue'


import ClientPage from '../components/Client/ClientPage.vue'
import ClientClasses from '../components/Client/ClientClasses.vue'
import CustomerMap from '../components/Client/CustomerMap.vue'
import ClientRating from '../components/Client/ClientRating.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },


  {
    path: '/coach',
    name: 'coachDashboard',
    component: CoachPage,
    meta: { requiresRole: 'coach' },
  },


  {
    path: '/coach/rating',
    name: 'coachRating',
    component: CoachRating,
    meta: { requiresRole: 'coach' },
  },


  {
    path: '/client',
    name: 'clientDashboard',
    component: ClientPage,
    meta: { requiresRole: 'client' },
  },


  {
    path: '/classes',
    name: 'clientClasses',
    component: ClientClasses,
    meta: { requiresRole: 'client' },
  },


  {
    path: '/customer-map',
    name: 'customerMap',
    component: CustomerMap,
    meta: { requiresRole: 'client' },
  },


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