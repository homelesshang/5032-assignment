<!-- RegisterPage.vue -->
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
            <input id="fullName" v-model="fullName" type="text" class="form-control" />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input id="email" v-model="email" type="email" class="form-control" />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input id="password" v-model="password" type="password" class="form-control" />
          </div>

          <!-- Confirm Password -->
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input id="confirmPassword" v-model="confirmPassword" type="password" class="form-control" />
          </div>

          <!-- ✅ Role selection -->
          <div class="mb-3">
            <label class="form-label">Select Role</label>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="roleClient"
                value="client"
                v-model="role"
              />
              <label class="form-check-label" for="roleClient">Client</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                id="roleCoach"
                value="coach"
                v-model="role"
              />
              <label class="form-check-label" for="roleCoach">Coach</label>
            </div>
          </div>

          <!-- Terms -->
          <div class="form-check mb-3">
            <input id="agreeTerms" v-model="agreeTerms" type="checkbox" class="form-check-input" />
            <label for="agreeTerms" class="form-check-label">I agree to the Terms</label>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">Create Account</button>
          </div>
        </form>
      </div>
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

const fullName = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const role = ref("") 
const agreeTerms = ref(false)
const errorMessage = ref("")
const functions = getFunctions()
const sendEmailFn = httpsCallable(functions, "sendEmailWithAttachment")


const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value || password.value !== confirmPassword.value || !agreeTerms.value || !role.value) {
    errorMessage.value = "Please fill all fields correctly."
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    await updateProfile(user, { displayName: fullName.value })

    
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName.value,
      email: email.value,
      role: role.value,
      createdAt: serverTimestamp(),
    })

    await sendEmailFn({
      to: email.value,
      subject: "Welcome to Community Gym!",
      message: `Hi ${fullName.value}, welcome to the Community Gym! Your role is ${role.value}. Please find the attached CSV guide.`,
    })

    console.log("📧 Welcome email sent successfully!")

    alert("Account created successfully! Please log in.")
    router.push("/login")
  } catch (error) {
    errorMessage.value = error.message
  }
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