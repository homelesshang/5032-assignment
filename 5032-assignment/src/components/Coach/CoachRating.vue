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
              <router-link class="nav-link px-3 fs-5" to="/coach">👨‍🏫 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5 active" to="/coach/rating">⭐ Ratings</router-link>
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
      <p class="text-muted">View aggregated feedback from clients, with search and sorting.</p>

      <!-- 搜索栏 -->
      <div class="mb-3">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Search by coach name..."
        />
      </div>

      <!-- 教练评分表 -->
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th @click="sortBy('coachName')">Coach Name</th>
            <th @click="sortBy('avgRating')">Average Rating ★</th>
            <th @click="sortBy('totalRatings')">Total Ratings</th>
            <th @click="sortBy('uniqueStudents')">Unique Students</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="coach in paginatedCoaches" :key="coach.coachId">
            <td>{{ coach.coachName }}</td>
            <td>{{ coach.avgRating.toFixed(1) }}</td>
            <td>{{ coach.totalRatings }}</td>
            <td>{{ coach.uniqueStudents }}</td>
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
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, collection, getDocs } from "firebase/firestore"

const router = useRouter()
const db = getFirestore()

/* 🚪 登出功能 */
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}

/* 🧩 Firestore 数据加载 */
const coaches = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, "coachRatings"))
    const ratingsMap = {}

    snapshot.forEach((doc) => {
      const data = doc.data()
      const coachId = data.coachId || "unknown"
      const coachName = data.coachName || "Unknown Coach"

      if (!ratingsMap[coachId]) {
        ratingsMap[coachId] = {
          coachId,
          coachName,
          ratings: [],
          users: new Set(),
        }
      }

      ratingsMap[coachId].ratings.push(data.rating)
      ratingsMap[coachId].users.add(data.userId)
    })

    // 🔢 计算每个教练的平均评分等统计信息
    coaches.value = Object.values(ratingsMap).map((c) => ({
      coachId: c.coachId,
      coachName: c.coachName,
      avgRating:
        c.ratings.length > 0
          ? c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length
          : 0,
      totalRatings: c.ratings.length,
      uniqueStudents: c.users.size,
    }))

    loading.value = false
    console.log("✅ Ratings loaded:", coaches.value)
  } catch (err) {
    console.error("🔥 Error loading ratings:", err)
    alert("❌ Failed to load ratings from Firestore.")
  }
})

/* 🔍 搜索、排序、分页 */
const searchTerm = ref("")
const sortKey = ref("coachName")
const sortAsc = ref(true)

const filteredCoaches = computed(() => {
  let data = coaches.value.filter((c) =>
    c.coachName.toLowerCase().includes(searchTerm.value.toLowerCase())
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