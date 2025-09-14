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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const avgRating = ref(null)

onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) {
    avgRating.value = parseInt(saved)
  }
})
</script>