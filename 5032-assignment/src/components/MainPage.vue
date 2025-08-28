<template>
  <div class="mainpage">
    <h1>🏋️ Welcome to Community Gym</h1>
    <p>This is the main dashboard after login.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

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