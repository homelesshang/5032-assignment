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
              <router-link class="nav-link px-3 fs-5" to="/client">🏠 Dashboard</router-link>
            </li>

            <!-- ✅ 改为 /classes 页面 -->
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/classes">📋 Classes</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/customer-map">🧭 Map</router-link>
            </li>
            
          </ul>

          <!-- 右侧登出 -->
          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ✅ 页面主体部分 -->
    <div class="container mt-5">
      <h2>Welcome Client</h2>
      <p>You can view available gym classes and rate them.</p>

      <!-- 用户评分卡片 -->
      <div class="card mt-4 p-3 shadow-sm">
        <h4>Fitness Class: Yoga Training</h4>
        <p>Please rate this class:</p>

        <div>
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ active: n <= myRating }"
            @click="rate(n)"
          >★</span>
        </div>

        <p v-if="myRating">You rated: {{ myRating }}/5</p>
        <p v-else>No rating yet</p>
      </div>

      <!-- 底部按钮区 -->
      <div class="mt-4 d-flex justify-content-between">
        <button class="btn btn-secondary" @click="goBack">← Back to Login</button>

        <!-- ✅ 新增“查看课程”快捷按钮 -->
        <router-link to="/classes" class="btn btn-primary">
          💪 View All Classes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const myRating = ref(0)
const router = useRouter()

onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) myRating.value = parseInt(saved)
})

// ⭐ 点击评分
const rate = (score) => {
  myRating.value = score
  localStorage.setItem("clientRating", score)
}

// 🚪 登出逻辑
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}

// 🔙 返回登录
const goBack = () => {
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
/* 星星评分样式 */
.star {
  font-size: 2rem;
  color: gray;
  cursor: pointer;
  transition: color 0.2s;
}
.star.active {
  color: orange;
}

/* 导航样式 */
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
</style>