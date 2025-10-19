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
      <h2 class="mb-3">👋 Welcome, {{ coachName || "Coach" }}!</h2>
      <p class="text-muted">Manage your personal profile and keep track of your coaching performance.</p>

    
      <div class="card shadow-sm p-4 mt-4">
        <h4 class="mb-3 text-primary">🏋️‍♂️ Coach Profile</h4>
        <p><strong>Full Name:</strong> {{ coachName || "N/A" }}</p>
        <p><strong>Role:</strong> Fitness Coach</p>
        <p><strong>Experience:</strong> 5+ years</p>
        <p><strong>Specialties:</strong> Strength Training, HIIT, Endurance</p>
      </div>

   
      <div class="card shadow-sm p-4 mt-4">
        <h4 class="mb-3 text-success">💡 Our Gym Philosophy</h4>
        <ul class="mb-0">
          <li>🔥 Train with passion, not just routine</li>
          <li>💬 Encourage and support every client</li>
          <li>🎯 Focus on progress, not perfection</li>
          <li>🤝 Build a strong, supportive community</li>
        </ul>
      </div>

 
      <div class="mt-5 text-center text-secondary fst-italic">
        "The body achieves what the mind believes."
        <div class="fw-bold text-primary">— Community Gym Motto</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const router = useRouter()
const coachName = ref("")

onMounted(() => {
  const user = getAuth().currentUser
  coachName.value = user?.displayName || "Coach"
})

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


.card {
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 6px;
}
</style>
