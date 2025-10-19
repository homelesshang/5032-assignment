<template>
  <div class="client-page">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 fixed-top">
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


    <header class="hero-section text-white text-center d-flex flex-column justify-content-center">
      <div class="container">
        <h1 class="fw-bold display-4 mb-3 animate__animated animate__fadeInDown">
          Welcome to <span class="text-warning">Community Gym</span>
        </h1>
        <p class="lead animate__animated animate__fadeInUp">
          Empower • Inspire • Transform
        </p>
        
      </div>
    </header>

    <div class="container my-5 text-center">
      <h2 class="fw-bold mb-4 text-dark">🔥 Why You'll Love Training Here</h2>
      <div class="row g-4">
        <div class="col-md-4" v-for="(item, i) in gymHighlights" :key="i">
          <div class="card border-0 shadow-lg h-100 hover-card p-3">
            <img :src="item.url" class="card-img-top rounded" />
            <div class="card-body">
              <h5 class="card-title fw-bold">{{ item.title }}</h5>
              <p class="card-text text-muted">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <section class="trainers-section py-5 text-center bg-light">
      <div class="container">
        <h2 class="fw-bold mb-5 text-dark">💪 Meet Our Expert Trainers</h2>
        <div class="row g-4 justify-content-center">
          <div
            class="col-md-4"
            v-for="(coach, index) in coaches"
            :key="index"
          >
            <div class="card coach-card border-0 shadow-sm p-4">
              <img
                :src="coach.photo"
                class="rounded-circle mx-auto mb-3 border border-3 border-warning"
                width="130"
                height="130"
                alt="coach"
              />
              <h5 class="fw-bold">{{ coach.name }}</h5>
              <p class="text-warning fw-semibold">{{ coach.specialty }}</p>
              <p class="text-muted small">{{ coach.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quote-section text-center py-5 bg-dark text-white">
      <blockquote class="fs-4 fst-italic">
        "Your body can stand almost anything — it’s your mind you have to convince."
      </blockquote>
      <p class="text-warning fw-bold mt-2">— Community Gym Spirit</p>
    </section>


    <footer class="footer py-3 bg-black text-center text-secondary">
      <small>© 2025 Community Gym | Empowering Strength & Confidence 💪</small>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"

const router = useRouter()
const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  localStorage.clear()
  router.push("/login")
}


const gymHighlights = [
  {
    title: "Modern Equipment",
    desc: "Top-tier fitness machines to power your progress.",
    url: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Energetic Classes",
    desc: "Join HIIT, Yoga, and Spin sessions led by our top coaches.",
    url: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Friendly Atmosphere",
    desc: "A positive, motivating community that supports your goals.",
    url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=900&q=80",
  },
]


const coaches = [
  {
    name: "Ben Smith",
    specialty: "Strength & Conditioning",
    desc: "Helping clients achieve their goals through smart, effective training.",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Alice Johnson",
    specialty: "Yoga & Flexibility",
    desc: "Find your balance — physically and mentally — with guided sessions.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Henry Kim",
    specialty: "CrossFit & Endurance",
    desc: "Push your limits with high-intensity workouts and motivation.",
    photo: "https://randomuser.me/api/portraits/men/70.jpg",
  },
]
</script>

<style scoped>
/* 🌆 Hero Section */
.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1920&q=80")
      center/cover no-repeat;
  height: 90vh;
}


.card img {
  object-fit: cover;
  height: 220px;
  border-radius: 10px;
}
.hover-card:hover {
  transform: translateY(-8px);
  transition: all 0.4s ease;
}


.coach-card {
  border-radius: 16px;
  background-color: white;
  transition: 0.3s;
}
.coach-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}


.quote-section {
  background: radial-gradient(circle at top, #111 0%, #000 80%);
  font-family: "Georgia", serif;
}


.navbar-nav .nav-link {
  transition: 0.3s;
  border-radius: 10px;
}
.navbar-nav .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #fff !important;
}
</style>
