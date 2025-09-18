<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const email = ref('')
const password = ref('')
const message = ref('')
const auth = getAuth()

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    console.log('User registered:', userCredential.user)
    message.value = 'Registration successful!'
  } catch (error) {
    console.error('Registration error:', error)
    message.value = 'Registration failed: ' + error.message
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Firebase Registration</h1>
        
        <form @submit.prevent="register">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              id="email" 
              v-model="email"
              required
            >
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              v-model="password"
              required
            >
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-success">Register</button>
          </div>
        </form>
        
        <div v-if="message" class="alert alert-info mt-3 text-center">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simple styles */
</style>
