<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { currentUser, isAuthenticated } from '../services/authService'

const router = useRouter()
const auth = getAuth()

// Logout function
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/firebase-signin')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page"
            >Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/add-book" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/get-book-count" class="nav-link" active-class="active">Book Count</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">Weather</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active">Book API</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/send-email" class="nav-link" active-class="active">Send Email</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/authors-table" class="nav-link" active-class="active">Authors</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/books-table" class="nav-link" active-class="active">Books</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/map" class="nav-link" active-class="active">Map</router-link>
        </li>
      </ul>

      <!-- User authentication section -->
      <div class="auth-section">
        <div v-if="isAuthenticated" class="user-info">
          <span class="user-email">{{ currentUser?.email }}</span>
          <button @click="handleLogout" class="btn btn-sm btn-outline-danger ms-2">Logout</button>
        </div>
        <div v-else class="auth-links">
          <router-link to="/firebase-signin" class="btn btn-sm btn-outline-primary me-2">Login</router-link>
          <router-link to="/firebase-register" class="btn btn-sm btn-primary">Register</router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-email {
  font-size: 0.9rem;
  color: #666;
}

.auth-links {
  display: flex;
  gap: 0.5rem;
}
</style>
