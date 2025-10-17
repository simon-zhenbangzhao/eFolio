<script setup>
import { ref } from 'vue'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import BookList from '@/components/BookList.vue'

const isbn = ref('')
const name = ref('')
const message = ref('')
const bookListRef = ref(null)

const db = getFirestore()

const addBook = async () => {
  try {
    await addDoc(collection(db, 'books'), {
      isbn: parseInt(isbn.value),
      name: name.value
    })
    message.value = 'Book added successfully!'
    // Clear form
    isbn.value = ''
    name.value = ''
    // Refresh book list
    if (bookListRef.value) {
      bookListRef.value.fetchBooks()
    }
  } catch (error) {
    console.error('Error adding book:', error)
    message.value = 'Error adding book: ' + error.message
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Add Book</h1>
        
        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label for="isbn" class="form-label">ISBN</label>
            <input 
              type="number" 
              class="form-control" 
              id="isbn" 
              v-model="isbn"
              required
            >
          </div>
          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="name" 
              v-model="name"
              required
            >
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Add Book</button>
          </div>
        </form>
        
        <div v-if="message" class="alert alert-info mt-3 text-center">
          {{ message }}
        </div>
      </div>
    </div>
    
    <!-- BookList Component -->
    <BookList ref="bookListRef" />
  </div>
</template>

<style scoped>
/* Simple styles */
</style>
