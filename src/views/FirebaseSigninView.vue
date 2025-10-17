<script setup>
import { ref } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const message = ref('')
const isLoading = ref(false)
const auth = getAuth()
const router = useRouter()

// Login function with navigation
const login = async () => {
  if (!email.value || !password.value) {
    message.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    // Redirect to home page after successful login
    router.push('/')
  } catch (error) {
    message.value = 'Login failed: ' + error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body p-5">
            <h2 class="text-center mb-4">Sign In</h2>
            
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email"
                  placeholder="Enter your email"
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password"
                  placeholder="Enter your password"
                  required
                  :disabled="isLoading"
                >
              </div>
              
              <div v-if="message" class="alert alert-danger" role="alert">
                {{ message }}
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">Signing in...</span>
                  <span v-else>Sign In</span>
                </button>
              </div>
            </form>
            
            <div class="text-center mt-3">
              <p class="text-muted">
                Don't have an account? 
                <router-link to="/firebase-register" class="text-decoration-none">Register here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 10px;
}
</style>
