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
              <router-link class="nav-link px-3 fs-5" to="/client">🏠 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5 active" to="/classes">📋 Classes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/customer-map">🧭 Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/rating">⭐ Rate Coach</router-link>
            </li>
          </ul>

          <button class="btn btn-outline-light btn-lg px-4" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>

    
    <div class="container mt-5">
      <h2 class="mb-3">🏋️ Available Fitness Classes</h2>
      <p class="text-muted">Browse, search and sort through our latest fitness programs.</p>

      
      <div class="mb-3">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Search by class name or level..."
        />
      </div>

      
      <table class="table table-striped table-hover" v-if="filteredClasses.length">
        <thead class="table-dark">
          <tr>
            <th @click="sortBy('name')">Class Name</th>
            <th @click="sortBy('trainer')">Trainer</th>
            <th @click="sortBy('duration')">Duration</th>
            <th @click="sortBy('level')">Level</th>
            <th @click="sortBy('price')">Price ($)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in paginatedClasses" :key="c.id">
            <td>{{ c.name }}</td>
            <td>{{ c.trainer }}</td>
            <td>{{ c.duration }}</td>
            <td>{{ c.level }}</td>
            <td>{{ c.price }}</td>
          </tr>
        </tbody>
      </table>

      
      <div v-else class="text-center text-muted mt-4">
        <p>No classes found.</p>
      </div>

      
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="filteredClasses.length">
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


const db = getFirestore()


const router = useRouter()
const classes = ref([])
const searchTerm = ref("")
const sortKey = ref("")
const sortAsc = ref(true)
const loading = ref(true)


onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, "classes"))
    classes.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    console.log("✅ Classes loaded:", classes.value)
  } catch (err) {
    console.error("🔥 Firestore error:", err)
    alert("Failed to load classes from Firebase.")
  } finally {
    loading.value = false
  }
})


const filteredClasses = computed(() => {
  let data = classes.value.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      c.level.toLowerCase().includes(searchTerm.value.toLowerCase())
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
const totalPages = computed(() => Math.ceil(filteredClasses.value.length / perPage))
const paginatedClasses = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredClasses.value.slice(start, start + perPage)
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


const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
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
