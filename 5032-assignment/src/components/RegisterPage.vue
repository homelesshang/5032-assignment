<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
        <h2 class="text-center mb-4">Create Your Gym Account</h2>

       
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

        <form @submit.prevent="handleRegister" novalidate>
          <!-- Full name -->
          <div class="mb-3">
            <label for="fullName" class="form-label">Full name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              class="form-control"
              :class="{'is-invalid': fullNameError}"
            />
            <div v-if="fullNameError" class="invalid-feedback">Full name is required</div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control"
              :class="{'is-invalid': emailError}"
            />
            <div v-if="emailError" class="invalid-feedback">Valid email is required</div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': passwordError || (password && !passwordStrong) }"
            />
            <div v-if="passwordError" class="invalid-feedback">Password is required</div>
            <div v-else-if="password && !passwordStrong" class="invalid-feedback">
              Password must be at least 8 characters and include letters and numbers
            </div>
          </div>

          <!-- Confirm password -->
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="form-control"
              :class="{'is-invalid': confirmPasswordError}"
            />
            <div v-if="confirmPasswordError" class="invalid-feedback">Passwords must match</div>
          </div>

          <!-- Terms -->
          <div class="form-check mb-3">
            <input id="agreeTerms" v-model="agreeTerms" type="checkbox" class="form-check-input" />
            <label for="agreeTerms" class="form-check-label">I agree to the Terms</label>
          </div>
          <div v-if="!agreeTerms" class="text-danger small">You must agree to the terms</div>

          <!-- Buttons -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Create account</button>
            <router-link to="/login" class="btn btn-secondary">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

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

const passwordStrong = computed(() =>
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password.value)
)

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
   const hasStrengthIssue = Boolean(password.value && !passwordStrong.value)

  if (
    fullNameError.value ||
    emailError.value ||
    passwordError.value ||
    confirmPasswordError.value ||
    errorMessage.value
  ) {
    return
  }


  register()
}


const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

const register = () => {
  errorMessage.value = ""
  createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    .then((data) => {
      console.log("Firebase Register Successful!", data.user?.uid)
      router.push("/login") 
    })
    .catch((error) => {
      console.log(error.code, error.message)
      errorMessage.value = error.message
      
    })
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