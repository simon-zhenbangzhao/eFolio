<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const isLoading = ref(false)
const auth = getAuth()
const router = useRouter()

// Register function with validation and navigation
const register = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    message.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    message.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  message.value = ''

  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    // Redirect to sign in page after successful registration
    router.push('/firebase-signin')
  } catch (error) {
    console.error('Registration error:', error)
    message.value = 'Registration failed: ' + error.message
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
            <h2 class="text-center mb-4">Create Account</h2>
            
            <form @submit.prevent="register">
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
                  placeholder="Enter your password (min 6 characters)"
                  required
                  :disabled="isLoading"
                >
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  placeholder="Confirm your password"
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
                  class="btn btn-success btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading">Creating account...</span>
                  <span v-else>Register</span>
                </button>
              </div>
            </form>
            
            <div class="text-center mt-3">
              <p class="text-muted">
                Already have an account? 
                <router-link to="/firebase-signin" class="text-decoration-none">Sign in here</router-link>
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
