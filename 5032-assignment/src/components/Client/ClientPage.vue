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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"

const myRating = ref(0)

onMounted(() => {
  const saved = localStorage.getItem("clientRating")
  if (saved) myRating.value = parseInt(saved)
})

const rate = (score) => {
  myRating.value = score
  localStorage.setItem("clientRating", score)
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