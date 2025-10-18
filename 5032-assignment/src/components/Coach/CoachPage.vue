<template>
  <div>
    <!-- ✅ 顶部导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid px-5">
        <!-- 左侧 Logo -->
        <a class="navbar-brand fw-bold fs-4 text-white" href="#">🏋️ Community Gym</a>

        <!-- 手机端折叠菜单按钮 -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 菜单项 -->
        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/coach">🏠 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/coach/progress">📊 Progress</router-link>
            </li>
            
          </ul>

          <!-- 右侧登出 -->
          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ✅ 页面主体内容 -->
    <div class="container mt-5">
      <h2>Welcome Coach</h2>
      <p>You can manage your classes and view ratings from clients.</p>

      <div class="card mt-4 p-3">
        <h4>Fitness Class: Yoga Training</h4>
        <p v-if="avgRating">⭐ Current Average Rating: {{ avgRating.toFixed(1) }}/5</p>
        <p v-else>No ratings yet</p>
      </div>

      <div class="mt-4">
        <button class="btn btn-secondary" @click="goBack">← Back to Login</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const avgRating = ref(null)
const router = useRouter()

// 载入学员评分
onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) avgRating.value = parseFloat(saved)
})

// 登出逻辑
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}

const goBack = () => {
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
.navbar-nav .nav-link {
  transition: color 0.2s, background-color 0.2s;
  border-radius: 10px;
}

.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}

.navbar {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.5px;
}

.card {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 10px;
  max-width: 500px;
  margin: auto;
  text-align: center;
}
</style>