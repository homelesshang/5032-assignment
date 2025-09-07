<!-- src/pages/LoginPage.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
        <h2 class="text-center mb-4">Community Gym Login</h2>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <form @submit.prevent="signin" novalidate>
          <!-- email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="text"
              class="form-control"
              :class="{'is-invalid': emailError}"
            />
            <div v-if="emailError" class="invalid-feedback">Email is required</div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              :class="{'is-invalid': passwordError}"
            />
            <div v-if="passwordError" class="invalid-feedback">Password is required</div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Login</button>
            <router-link to="/register" class="btn btn-secondary">Create one</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
const router = useRouter()
const auth = getAuth()

const email = ref('')
const password = ref('')

const emailError = ref(false)
const passwordError = ref(false)
const errorMessage = ref('')

const signin = () => {
  emailError.value = !email.value
  passwordError.value = !password.value
  errorMessage.value = ''

  if (emailError.value || passwordError.value) return

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Login Successful!", data.user?.uid)
      
      router.push("/main")
      
      console.log("Current User:", auth.currentUser)
    })
    .catch((error) => {
      console.log("Login error:", error.code, error.message)
      errorMessage.value = error.message
    })
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