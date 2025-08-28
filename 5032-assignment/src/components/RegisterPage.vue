<!-- src/pages/RegisterPage.vue -->
<template>
  <div class="registerpage">
    <div class="card">
      <h2 class="title">Create Your Gym Account</h2>

      <form>
        <div class="form-group">
          <input type="text" placeholder="Full name" />
        </div>

        <div class="form-group">
          <input type="email" placeholder="Email" />
        </div>

        <div class="form-group">
          <input type="password" placeholder="Password" />
        </div>

        <div class="form-group">
          <input type="password" placeholder="Confirm password" />
        </div>

        <label class="agree">
          <input type="checkbox" />
          <span>I agree to the Terms</span>
        </label>

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