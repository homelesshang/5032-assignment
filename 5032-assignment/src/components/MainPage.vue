<template>
  <div class="mainpage container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1 class="h4 mb-1">🏋️ Welcome to Community Gym</h1>
        <p class="text-muted mb-0">This is the main dashboard after login.</p>
      </div>
      <button class="btn btn-outline-secondary btn-sm" @click="logout">Logout</button>
    </div>

    <Card class="shadow-sm">
      <template #title>Our Gyms</template>
      <template #content>
        <DataTable :value="gyms" dataKey="id" paginator :rows="5" class="w-100">
          <Column field="id" header="#" style="width: 70px" />
          <Column field="name" header="Name" />
          <Column field="suburb" header="Suburb" />
          <Column header="Amenities">
            <template #body="{ data }">
              <span class="pi pi-check-circle me-2" v-for="a in data.amenities" :key="a">{{ ' ' + a }}</span>
            </template>
          </Column>
          <Column field="open" header="Open" style="width: 110px" />
          <Column field="close" header="Close" style="width: 110px" />
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'


import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Card from 'primevue/card'


import gyms from '@/assets/gyms.json'

const router = useRouter()
function logout() {
  router.push('/login')
}
</script>

<style scoped>
.mainpage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
  font-family: Arial, sans-serif;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>