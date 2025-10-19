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
              <router-link class="nav-link px-3 fs-5 active" to="/client">🏠 Dashboard</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3 fs-5" to="/classes">📋 Classes</router-link>
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


    <div class="dashboard container mt-5 text-center">
      <h2 class="fw-bold mb-3">Welcome back, {{ userName || "Guest" }}! 👋</h2>
      <p class="text-muted mb-4">
        Manage your fitness journey, explore classes, find gyms, and rate your coaches — all in one place.
      </p>

      <div class="row justify-content-center mt-4">
        <!-- 📋 Classes -->
        <div class="col-md-3 mb-3">
          <div class="card shadow-lg option-card" @click="goTo('/classes')">
            <div class="card-body">
              <h4>📋 View Classes</h4>
              <p class="text-muted">Explore available fitness programs.</p>
            </div>
          </div>
        </div>

        <!-- 🧭 Map -->
        <div class="col-md-3 mb-3">
          <div class="card shadow-lg option-card" @click="goTo('/customer-map')">
            <div class="card-body">
              <h4>🧭 Find Gyms</h4>
              <p class="text-muted">Locate gyms around your area.</p>
            </div>
          </div>
        </div>

        <!-- ⭐ Rate -->
        <div class="col-md-3 mb-3">
          <div class="card shadow-lg option-card" @click="goTo('/rating')">
            <div class="card-body">
              <h4>⭐ Rate Coaches</h4>
              <p class="text-muted">Share your feedback with us.</p>
            </div>
          </div>
        </div>
      </div>

      <p class="text-secondary mt-4">
        💪 Stay motivated — your consistency is your superpower!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const router = useRouter()
const userName = ref("")


onMounted(() => {
  const auth = getAuth()
  if (auth.currentUser) {
    const email = auth.currentUser.email
    userName.value = email ? email.split("@")[0] : "User"
  }
})


const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}


function goTo(path) {
  router.push(path)
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


.dashboard {
  animation: fadeIn 0.8s ease-in-out;
}
.option-card {
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.option-card:hover {
  transform: scale(1.05);
  background-color: #f8f9fa;
}
.option-card h4 {
  font-weight: 600;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
