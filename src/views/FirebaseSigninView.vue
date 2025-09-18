<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const email = ref('')
const password = ref('')
const user = ref(null)
const message = ref('')
const auth = getAuth()

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    user.value = userCredential.user
    message.value = 'Login successful!'
  } catch (error) {
    message.value = 'Login failed: ' + error.message
  }
}

// Monitor authentication state
onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
    if (currentUser) {
      console.log('Current user:', currentUser)
    }
  })
})

const logout = async () => {
  try {
    await auth.signOut()
    user.value = null
    message.value = 'Logged out successfully'
  } catch (error) {
    message.value = 'Logout failed: ' + error.message
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Firebase Sign In</h1>
        
        <div v-if="user" class="text-center">
          <h3>Welcome, {{ user.email }}!</h3>
          <button @click="logout" class="btn btn-danger">Logout</button>
        </div>
        
        <div v-else>
          <form @submit.prevent>
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
              <button @click="login" class="btn btn-primary">Sign In</button>
            </div>
          </form>
        </div>
        
        <div v-if="message" class="alert alert-info mt-3 text-center">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 简单样式 */
</style>
