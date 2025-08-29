<template>
  <div class="loginpage">
    <div class="card">
      <h2 class="title">Community Gym Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" placeholder="Username" />
        </div>
        <div class="form-group">
          <input type="password" placeholder="Password" />
        </div>
        <button type="submit" class="btn">Login</button>
      </form>
      <p class="foot">
        Don't have an account?
        <router-link class="link" to="/register">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function handleLogin() {
  
  router.push('/main')
}
</script>

<style scoped>
.loginpage {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 320px;
  text-align: center;
}

.title {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn {
  width: 100%;
  padding: 0.6rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover {
  background: #45a049;
}
</style>