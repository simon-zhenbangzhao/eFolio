// Authentication service to manage user state
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { ref } from 'vue'

// Global reactive user state
export const currentUser = ref(null)
export const isAuthenticated = ref(false)

// Initialize auth listener
export function initAuthListener() {
  const auth = getAuth()
  
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    isAuthenticated.value = !!user
  })
}

