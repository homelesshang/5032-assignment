<template>
  <div class="register-wrapper d-flex align-items-center justify-content-center">
    <div class="register-card shadow-lg p-4">
      <!-- Logo & 标题 -->
      <div class="text-center mb-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2964/2964514.png"
          alt="Gym Logo"
          class="gym-logo mb-3"
        />
        <h2 class="fw-bold text-white">🏋️ Community Gym</h2>
        <p class="text-secondary">Join the movement. Train smarter.</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="alert alert-danger text-center py-2">
        {{ errorMessage }}
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" novalidate>
        <!-- 全名 -->
        <div class="mb-3">
          <label for="fullName" class="form-label text-light">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            class="form-control"
            placeholder="e.g. Alex Johnson"
          />
        </div>

        <!-- 邮箱 -->
        <div class="mb-3">
          <label for="email" class="form-label text-light">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="e.g. alex@gmail.com"
          />
        </div>

        <!-- 密码 -->
        <div class="mb-3">
          <label for="password" class="form-label text-light">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter a strong password"
          />
        </div>

        <!-- 确认密码 -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label text-light">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-control"
            placeholder="Re-enter your password"
          />
        </div>

        <!-- 选择角色 -->
        <div class="mb-4">
          <label class="form-label text-light fw-bold">Select Role</label>
          <div class="d-flex justify-content-around">
            <div>
              <input
                class="form-check-input"
                type="radio"
                id="roleClient"
                value="client"
                v-model="role"
              />
              <label for="roleClient" class="ms-1">Client</label>
            </div>
            <div>
              <input
                class="form-check-input"
                type="radio"
                id="roleCoach"
                value="coach"
                v-model="role"
              />
              <label for="roleCoach" class="ms-1">Coach</label>
            </div>
          </div>
        </div>

        <!-- 同意条款 -->
        <div class="form-check mb-3">
          <input id="agreeTerms" v-model="agreeTerms" type="checkbox" class="form-check-input" />
          <label for="agreeTerms" class="form-check-label text-light">
            I agree to the Terms and Conditions
          </label>
        </div>

        <!-- 按钮 -->
        <div class="text-center">
          <button type="submit" class="btn btn-warning w-100 py-2 fw-bold shadow-sm">
            {{ loading ? "Creating Account..." : "Create Account" }}
          </button>

          <router-link to="/login" class="btn btn-outline-light w-100 py-2 mt-2">
            Already have an account? Login
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { getFunctions, httpsCallable } from "firebase/functions"

const router = useRouter()
const auth = getAuth()
const db = getFirestore()
const functions = getFunctions()
const sendEmailFn = httpsCallable(functions, "sendEmailWithAttachment")

// 表单字段
const fullName = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const role = ref("")
const agreeTerms = ref(false)
const errorMessage = ref("")
const loading = ref(false)

// 注册逻辑
const handleRegister = async () => {
  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    password.value !== confirmPassword.value ||
    !agreeTerms.value ||
    !role.value
  ) {
    errorMessage.value = "⚠️ Please fill all fields correctly."
    return
  }

  try {
    loading.value = true
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await updateProfile(user, { displayName: fullName.value })

    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName.value,
      email: email.value,
      role: role.value,
      createdAt: serverTimestamp(),
    })

    // 发送欢迎邮件
    await sendEmailFn({
      to: email.value,
      subject: "Welcome to Community Gym!",
      message: `Hi ${fullName.value}, welcome to Community Gym! You're registered as a ${role.value}.`,
    })

    alert("🎉 Account created successfully! Please log in.")
    router.push("/login")
  } catch (error) {
    console.error("❌ Registration error:", error)
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 🏋️ 背景 */
.register-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0b0c10, #1f2833);
  background-image: url("https://images.unsplash.com/photo-1571019613914-85f342c55f77?auto=format&fit=crop&w=1920&q=80");
  background-size: cover;
  background-position: center;
}

/* 📦 注册卡片 */
.register-card {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16px;
  width: 400px;
  max-width: 90%;
  color: #fff;
  backdrop-filter: blur(10px);
}

/* 💪 Logo */
.gym-logo {
  width: 70px;
  filter: drop-shadow(0 0 6px rgba(255, 193, 7, 0.8));
}

/* 表单 */
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

/* 按钮 */
.btn-warning {
  background: linear-gradient(45deg, #ffb300, #ff8800);
  border: none;
  font-size: 1.05rem;
  letter-spacing: 0.4px;
}
.btn-warning:hover {
  background: linear-gradient(45deg, #ffa000, #ff6f00);
}

/* 响应式 */
@media (max-width: 576px) {
  .register-card {
    width: 90%;
    padding: 2rem 1rem;
  }
}
</style>
