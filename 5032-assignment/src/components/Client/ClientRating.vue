<template>
  <div>
    <!-- ✅ 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div class="container-fluid px-5">
        <a class="navbar-brand fw-bold fs-4 text-white" href="#">🏋️ Community Gym</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/client">🏠 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/classes">📋 Classes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/customer-map">🧭 Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5 active" to="/rating">⭐ Rate Coach</router-link>
            </li>
          </ul>

          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ✅ 教练评分主区域 -->
    <div class="container mt-5">
      <h2 class="mb-3">⭐ Rate Your Coach</h2>
      <p class="text-muted">Share your feedback and help improve our coaching service.</p>

      <!-- 教练下拉列表 -->
      <div class="mb-3">
        <label class="form-label fw-bold">Select a Coach:</label>
        <select v-model="selectedCoach" class="form-select">
          <option disabled value="">-- Please select --</option>
          <option v-for="c in coaches" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- 星级评分 -->
      <div class="mb-3">
        <label class="form-label fw-bold">Your Rating:</label>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ active: n <= rating }"
            @click="setRating(n)"
          >
            ★
          </span>
        </div>
        <p v-if="rating" class="mt-2">You rated: {{ rating }}/5</p>
      </div>

      <!-- 评论输入 -->
      <div class="mb-3">
        <label class="form-label fw-bold">Feedback (optional):</label>
        <textarea
          v-model="feedback"
          class="form-control"
          rows="3"
          placeholder="Write your comments here..."
        ></textarea>
      </div>

      <!-- 提交按钮 -->
      <button
        class="btn btn-success btn-lg"
        @click="submitRating"
        :disabled="!selectedCoach || !rating || isSubmitting"
      >
        {{ isSubmitting ? "Submitting..." : "✅ Submit Rating" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore"

const router = useRouter()
const db = getFirestore()

// ✅ 从 Firestore 或硬编码中加载教练列表
// （可以 later 替换为 getDocs(collection(db, "coaches"))）
const coaches = [
  { id: "coach1", name: "Alice Johnson" },
  { id: "coach2", name: "Ben Smith" },
  { id: "coach3", name: "Cara Williams" },
]

const selectedCoach = ref("")
const rating = ref(0)
const feedback = ref("")
const isSubmitting = ref(false)

function setRating(value) {
  rating.value = value
}

// ✅ 提交评分并存入 Firestore
async function submitRating() {
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      alert("⚠️ Please log in first.")
      return router.push("/login")
    }

    isSubmitting.value = true

    // 获取用户信息（名字或邮箱）
    const userName = user.displayName || user.email || "Anonymous"

    await addDoc(collection(db, "coachRatings"), {
      coachId: selectedCoach.value,
      coachName: coaches.find((c) => c.id === selectedCoach.value)?.name || "Unknown Coach",
      userId: user.uid,
      userName,
      rating: rating.value,
      feedback: feedback.value || "(No feedback)",
      createdAt: Timestamp.now(),
    })

    alert("✅ Rating submitted successfully!")
    rating.value = 0
    feedback.value = ""
    selectedCoach.value = ""
  } catch (err) {
    console.error("🔥 Error submitting rating:", err)
    alert("❌ Failed to submit rating.")
  } finally {
    isSubmitting.value = false
  }
}

// 🚪 登出逻辑
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}
</script>

<style scoped>
/* ✅ 导航栏样式统一 */
.navbar-nav .nav-link {
  transition: color 0.2s, background-color 0.2s;
  border-radius: 10px;
}
.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}
.navbar {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 0.5px;
}

/* ⭐ 星星样式 */
.stars {
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
}
.star.active {
  color: gold;
}
</style>