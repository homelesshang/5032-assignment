<template>
  <div class="container mt-5">
    <h2 class="mb-4 text-center">📈 Trainee Progress Tracker</h2>
    <p class="text-muted text-center">
      View and compare body progress of your clients.
    </p>

    <!-- 学员列表 -->
    <div class="card p-3 shadow-sm mb-4">
      <h5>👥 Select a Trainee:</h5>
      <select v-model="selectedClient" class="form-select mt-2">
        <option disabled value="">Choose...</option>
        <option v-for="client in clients" :key="client.id" :value="client.id">
          {{ client.name }}
        </option>
      </select>
    </div>

    <!-- 如果没选 -->
    <div v-if="!selectedClient" class="alert alert-info">
      Please select a trainee to view their progress.
    </div>

    <!-- 图表展示 -->
    <div v-else class="card p-4 shadow">
      <h5 class="mb-3">
        {{ selectedClientData.name }}'s Fitness Progress
      </h5>
      <canvas id="progressChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue"
import Chart from "chart.js/auto"

// 模拟学员数据（你可以后面改成 Firestore 读取）
const clients = ref([
  {
    id: "c1",
    name: "Alice",
    progress: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      weight: [70, 68.5, 67.8, 66.9],
      bmi: [24.5, 24.0, 23.7, 23.5],
      fat: [25, 23, 22, 21],
    },
  },
  {
    id: "c2",
    name: "Ben",
    progress: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      weight: [85, 84, 83.5, 82.8],
      bmi: [27.5, 27.2, 26.9, 26.5],
      fat: [28, 26, 25, 24],
    },
  },
])

const selectedClient = ref("")
const chart = ref(null)
const selectedClientData = ref({})

watch(selectedClient, (newId) => {
  if (newId) {
    selectedClientData.value = clients.value.find((c) => c.id === newId)
    renderChart()
  }
})

function renderChart() {
  if (!selectedClientData.value.progress) return
  const ctx = document.getElementById("progressChart").getContext("2d")

  // 如果已有图表，先销毁
  if (chart.value) chart.value.destroy()

  chart.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: selectedClientData.value.progress.labels,
      datasets: [
        {
          label: "Weight (kg)",
          data: selectedClientData.value.progress.weight,
          borderColor: "#007bff",
          tension: 0.3,
          fill: false,
        },
        {
          label: "BMI",
          data: selectedClientData.value.progress.bmi,
          borderColor: "#28a745",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Body Fat (%)",
          data: selectedClientData.value.progress.fat,
          borderColor: "#dc3545",
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  })
}
</script>

<style scoped>
.card {
  border-radius: 12px;
}
canvas {
  max-height: 380px;
}
</style>