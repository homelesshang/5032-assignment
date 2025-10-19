<template>
  <div>
    <!-- ✅ 顶部导航栏 -->
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
              <router-link class="nav-link px-3 fs-5 active" to="/coach">👨‍🏫 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/coach/rating">⭐ Ratings</router-link>
            </li>
          </ul>

          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- ✅ 教练评分表部分 -->
    <div class="container mt-5">
      <h2 class="mb-3">⭐ Coach Ratings Overview</h2>
      <p class="text-muted">Search, sort and review performance of all trainers.</p>

      <!-- 搜索栏 -->
      <div class="mb-3">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Search by coach name or specialty..."
        />
      </div>

      <!-- 教练评分表 -->
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th @click="sortBy('name')">Coach Name</th>
            <th @click="sortBy('specialty')">Specialty</th>
            <th @click="sortBy('rating')">Rating ★</th>
            <th @click="sortBy('students')">Students</th>
            <th @click="sortBy('classes')">Classes</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="coach in paginatedCoaches" :key="coach.name">
            <td>{{ coach.name }}</td>
            <td>{{ coach.specialty }}</td>
            <td>{{ coach.rating.toFixed(1) }}</td>
            <td>{{ coach.students }}</td>
            <td>{{ coach.classes }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 分页控制 -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <button class="btn btn-outline-primary btn-sm" :disabled="page === 1" @click="prevPage">
          ← Prev
        </button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button
          class="btn btn-outline-primary btn-sm"
          :disabled="page === totalPages"
          @click="nextPage"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const router = useRouter()

/* 🚪 登出功能 */
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}

/* 🧑‍🏫 教练评分数据（可改为 Firestore 读取） */
const coaches = ref([
  { name: "Alice Johnson", specialty: "Yoga", rating: 4.8, students: 45, classes: 5 },
  { name: "Ben Carter", specialty: "HIIT", rating: 4.6, students: 38, classes: 4 },
  { name: "Cara Liu", specialty: "Pilates", rating: 4.9, students: 52, classes: 6 },
  { name: "Dylan Smith", specialty: "Strength", rating: 4.7, students: 41, classes: 5 },
  { name: "Eva Adams", specialty: "Cardio", rating: 4.5, students: 36, classes: 3 },
  { name: "Frank Zhang", specialty: "Balance", rating: 4.3, students: 30, classes: 3 },
  { name: "Grace Lee", specialty: "Stretching", rating: 4.9, students: 48, classes: 4 },
  { name: "Henry Kim", specialty: "CrossFit", rating: 4.4, students: 34, classes: 5 },
  { name: "Isabella Perez", specialty: "Endurance", rating: 4.7, students: 40, classes: 4 },
  { name: "Jack Thompson", specialty: "Spin", rating: 4.8, students: 46, classes: 5 },
])

/* 🔍 搜索、排序与分页 */
const searchTerm = ref("")
const sortKey = ref("")
const sortAsc = ref(true)

const filteredCoaches = computed(() => {
  let data = coaches.value.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
  if (sortKey.value) {
    data.sort((a, b) => {
      if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1
      if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1
      return 0
    })
  }
  return data
})

const page = ref(1)
const perPage = 5
const totalPages = computed(() => Math.ceil(filteredCoaches.value.length / perPage))

const paginatedCoaches = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredCoaches.value.slice(start, start + perPage)
})

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}
const prevPage = () => {
  if (page.value > 1) page.value--
}

const sortBy = (key) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
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

/* 表格样式 */
th {
  cursor: pointer;
}
th:hover {
  text-decoration: underline;
  color: #007bff;
}
</style>