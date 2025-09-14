<template>
  <div class="container mt-5">
    <h2>Welcome Client</h2>
    <p>You can view available gym classes and rate them.</p>

    <div class="card mt-4 p-3">
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

    <div class="mt-4">
      <button class="btn btn-secondary" @click="goBack">← Back to Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
const myRating = ref(0)
const router = useRouter()
onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) myRating.value = parseInt(saved)
})

const rate = (score) => {
  myRating.value = score
  localStorage.setItem("clientRating", score)
}

const goBack = () => {
  localStorage.removeItem("role")
  localStorage.removeItem("email")
  router.push("/login")
}
</script>

<style scoped>
.star {
  font-size: 30px;
  cursor: pointer;
  color: grey;
}
.star.active {
  color: orange;
}
</style>