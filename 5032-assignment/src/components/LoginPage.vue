<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="login-card shadow-lg p-4">
      <!-- 标志与标题 -->
      <div class="text-center mb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2964/2964514.png"
          alt="Gym Logo"
          class="gym-logo mb-3"
        />
        <h2 class="fw-bold text-white">🏋️‍♂️ Community Gym</h2>
        <p class="text-secondary">Train. Transform. Triumph.</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="alert alert-danger py-2 text-center">
        {{ errorMessage }}
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="signin" class="mt-3" novalidate>
        <!-- 邮箱 -->
        <div class="mb-3">
          <label for="email" class="form-label text-light">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="e.g. user@example.com"
            :class="{ 'is-invalid': emailError }"
          />
          <div v-if="emailError" class="invalid-feedback">Email is required</div>
        </div>

        <!-- 密码 -->
        <div class="mb-3">
          <label for="password" class="form-label text-light">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            :class="{ 'is-invalid': passwordError }"
          />
          <div v-if="passwordError" class="invalid-feedback">Password is required</div>
        </div>

        <!-- 登录按钮 -->
        <div class="text-center mt-4">
          <button type="submit" class="btn btn-warning w-100 py-2 fw-bold shadow-sm">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
          <router-link to="/register" class="btn btn-outline-light w-100 py-2 mt-2">
            Create an Account
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const email = ref("")
const password = ref("")
const emailError = ref(false)
const passwordError = ref(false)
const errorMessage = ref("")
const loading = ref(false)

const signin = async () => {
  emailError.value = !email.value
  passwordError.value = !password.value
  errorMessage.value = ""
  if (emailError.value || passwordError.value) return

  loading.value = true
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value.trim()
    )
    const user = userCredential.user
    console.log("✅ Firebase Login Successful:", user.uid)

    const userDocRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userDocRef)

    if (userDoc.exists()) {
      const role = userDoc.data().role || "client"
      if (role === "coach") router.push("/coach")
      else router.push("/client")
    } else {
      errorMessage.value = "User data not found in Firestore."
    }
  } catch (error) {
    console.error("❌ Login error:", error)
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage.value = "Invalid email format."
        break
      case "auth/user-not-found":
        errorMessage.value = "Account not found. Please register."
        break
      case "auth/wrong-password":
        errorMessage.value = "Incorrect password. Try again."
        break
      default:
        errorMessage.value = "Login failed. Please try again."
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 🔥 背景样式 */
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0c10, #1f2833);
  background-image: url("https://images.unsplash.com/photo-1598970434795-0c54fe7c0649?auto=format&fit=crop&w=1920&q=80");
  background-size: cover;
  background-position: center;
}

/* 💪 登录卡片 */
.login-card {
  background: rgba(0, 0, 0, 0.75);
  border-radius: 16px;
  width: 380px;
  max-width: 90%;
  color: #fff;
  backdrop-filter: blur(10px);
}

/* 🏋️ Logo */
.gym-logo {
  width: 70px;
  filter: drop-shadow(0 0 6px rgba(255, 193, 7, 0.8));
}

/* 🧩 输入框美化 */
.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}
.form-control:focus {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.7);
}
::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* ⚡ 按钮样式 */
.btn-warning {
  background: linear-gradient(45deg, #ffb300, #ff8800);
  border: none;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
.btn-warning:hover {
  background: linear-gradient(45deg, #ffa000, #ff6f00);
}

/* 📱 响应式 */
@media (max-width: 576px) {
  .login-card {
    width: 90%;
    padding: 2rem 1rem;
  }
}
</style>
