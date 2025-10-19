<template>
  <div>

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


    <div class="container mt-5">
      <h2 class="mb-3">⭐ Coach Ratings Overview</h2>
      <p class="text-muted">View all client feedback stored in Firestore.</p>


      <div class="mb-3">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Search by coach name..."
        />
      </div>


      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading coach ratings from Firestore...</p>
      </div>


      <table v-else class="table table-striped table-hover">
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
            <td>{{ coach.avgRating ? coach.avgRating.toFixed(1) : '0.0' }}</td>
            <td>{{ coach.totalRatings }}</td>
            <td>{{ coach.uniqueStudents }}</td>
          </tr>
        </tbody>
      </table>


      <div v-if="!loading" class="d-flex justify-content-between align-items-center mt-3">
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


const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}


const coaches = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    console.log("🔥 ...")
    const snapshot = await getDocs(collection(db, "coachRatings"))
    console.log("📦 :", snapshot.size)

    const coachMap = {}

    snapshot.forEach((doc) => {
      const data = doc.data()
      const coachId = data.coachId || "unknown"
      const coachName = data.coachName || "Unknown Coach"
      const ratingNum = Number(data.rating)
      const userId = data.userId || "unknown"

      if (!coachMap[coachId]) {
        coachMap[coachId] = {
          coachId,
          coachName,
          ratings: [],
          users: new Set(),
        }
      }

      if (!isNaN(ratingNum)) coachMap[coachId].ratings.push(ratingNum)
      coachMap[coachId].users.add(userId)
    })


    coaches.value = Object.values(coachMap).map((c) => ({
      coachId: c.coachId,
      coachName: c.coachName,
      avgRating:
        c.ratings.length > 0
          ? c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length
          : 0,
      totalRatings: c.ratings.length,
      uniqueStudents: c.users.size,
    }))

    console.log("✅ :", coaches.value)
  } catch (err) {
    console.error("🔥 Firestore :", err)
    alert("❌ Failed to load data from Firestore.")
  } finally {
    loading.value = false
  }
})


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


th {
  cursor: pointer;
}
th:hover {
  text-decoration: underline;
  color: #007bff;
}
</style>
