<template>
  <div class="container mt-5">
    <h2>Welcome Coach</h2>
    <p>You can manage your classes and view ratings from clients.</p>

    <div class="card mt-4 p-3">
      <h4>Fitness Class: Yoga Training</h4>
      <p v-if="avgRating">
        Current Average Rating: {{ avgRating.toFixed(1) }}/5
      </p>
      <p v-else>No ratings yet</p>
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary" @click="goBack">← Back to Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
const avgRating = ref(null)
const router = useRouter()

onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) {
    avgRating.value = parseInt(saved)
  }
})

const goBack = () => {
  
  localStorage.removeItem("role")
  localStorage.removeItem("email")
  router.push("/login")
}
</script>