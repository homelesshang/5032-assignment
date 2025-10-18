<template>
  <div class="container mt-5">
    <h2 class="mb-3">🏋️ Available Fitness Classes</h2>
    <p class="text-muted">Browse, search and sort through our latest fitness programs.</p>

    <!-- 搜索栏 -->
    <div class="mb-3">
      <input
        v-model="searchTerm"
        type="text"
        class="form-control"
        placeholder="Search by class name or level..."
      />
    </div>

    <!-- 交互表格 -->
    <table class="table table-striped table-hover">
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
        <tr v-for="c in paginatedClasses" :key="c.name">
          <td>{{ c.name }}</td>
          <td>{{ c.trainer }}</td>
          <td>{{ c.duration }}</td>
          <td>{{ c.level }}</td>
          <td>{{ c.price }}</td>
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
</template>

<script setup>
import { ref, computed } from "vue"

// 模拟健身课程数据
const classes = ref([
  { name: "Yoga Basics", trainer: "Alice", duration: "45 mins", level: "Beginner", price: 15 },
  { name: "Cardio Blast", trainer: "Ben", duration: "30 mins", level: "Intermediate", price: 20 },
  { name: "HIIT Challenge", trainer: "Cara", duration: "25 mins", level: "Advanced", price: 25 },
  { name: "Pilates Core", trainer: "Dylan", duration: "50 mins", level: "Intermediate", price: 18 },
  { name: "Strength Training", trainer: "Eva", duration: "40 mins", level: "Advanced", price: 22 },
  { name: "Balance Focus", trainer: "Frank", duration: "35 mins", level: "Beginner", price: 16 },
  { name: "Fat Burn Express", trainer: "Gina", duration: "30 mins", level: "Intermediate", price: 20 },
  { name: "Mobility Flow", trainer: "Henry", duration: "40 mins", level: "Beginner", price: 17 },
  { name: "Endurance Build", trainer: "Ivy", duration: "55 mins", level: "Advanced", price: 26 },
  { name: "Relax Stretch", trainer: "Jack", duration: "30 mins", level: "All Levels", price: 14 },
  // 额外几条用于分页
  { name: "Zumba Energy", trainer: "Kate", duration: "35 mins", level: "Intermediate", price: 19 },
  { name: "Spin Cycle", trainer: "Leo", duration: "45 mins", level: "Advanced", price: 24 },
])

// 搜索与排序
const searchTerm = ref("")
const sortKey = ref("")
const sortAsc = ref(true)

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

// 分页逻辑
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

// 点击表头排序
const sortBy = (key) => {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}
</script>

<style scoped>
th {
  cursor: pointer;
}
th:hover {
  text-decoration: underline;
  color: #007bff;
}
</style>