<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="registerpage">
    <div class="card">
      <h2 class="title">Create Your Gym Account</h2>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <form @submit.prevent="handleRegister" >
        <div class="form-group">
          <input
            v-model="fullName"
            type="text"
            placeholder="Full name"
            :class="{'input-error': fullNameError}"
            required
          />
          <span v-if="fullNameError" class="error-text">Full name is required</span>
        </div>

        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            :class="{'input-error': emailError}"
            required
          />
          <span v-if="emailError" class="error-text">Valid email is required</span>
        </div>

        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            :class="{'input-error': passwordError}"
            required
          />
          <span v-if="passwordError" class="error-text">Password is required</span>
        </div>

        <div class="form-group">
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            :class="{'input-error': confirmPasswordError}"
            required
          />
          <span v-if="confirmPasswordError" class="error-text">Passwords must match</span>
        </div>

        <label class="agree">
          <input v-model="agreeTerms" type="checkbox" />
          <span>I agree to the Terms</span>
        </label>
        <span v-if="!agreeTerms" class="error-text">You must agree to the terms</span>

        <button type="submit" class="btn">Create account</button>
      </form>

      <p class="foot">
        Already have an account?
        <router-link class="link" to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)

const fullNameError = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const confirmPasswordError = ref(false)
const errorMessage = ref('')


const handleRegister = () => {

  fullNameError.value = false
  emailError.value = false
  passwordError.value = false
  confirmPasswordError.value = false
  errorMessage.value = ''

  if (!fullName.value) {
    fullNameError.value = true
  }
  if (!email.value || !validateEmail(email.value)) {
    emailError.value = true
  }
  if (!password.value) {
    passwordError.value = true
  }
  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = true
  }
  if (!agreeTerms.value) {
    errorMessage.value = 'You must agree to the terms.'
  }


  if (
    fullNameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmPasswordError.value ||
    errorMessage.value
  ) {
    return
  }


  console.log('Registration successful')
  // 可以在这里提交数据到后端，例如通过 API 注册用户
}


const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
</script>

<style scoped>
.registerpage {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
  padding: 24px;
}

.card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 340px;
  text-align: center;
}

.title {
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: 0.9rem;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #d2d6dc;
  outline: none;
}

input:focus {
  border-color: #7aa7ff;
  box-shadow: 0 0 0 3px rgba(122,167,255,0.2);
}

.agree {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  margin: 0.4rem 0 0.9rem;
  text-align: left;
}

.btn {
  width: 100%;
  padding: 0.7rem;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover {
  background: #43a047;
}

.foot {
  margin-top: 0.9rem;
  font-size: 0.9rem;
}

.link {
  color: #3b82f6;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}



</style>