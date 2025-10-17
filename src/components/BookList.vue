<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'

const books = ref([])
const loading = ref(true)

const db = getFirestore()

const fetchBooks = async () => {
  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000))
    const querySnapshot = await getDocs(q)
    
    books.value = []
    querySnapshot.forEach((doc) => {
      books.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    loading.value = false
  } catch (error) {
    console.error('Error fetching books:', error)
    loading.value = false
  }
}

onMounted(() => {
  fetchBooks()
})

// Expose fetchBooks function for external use
defineExpose({
  fetchBooks
})
</script>

<template>
  <div class="mt-5">
    <h2 class="text-center">Book List (ISBN > 1000)</h2>
    
    <div v-if="loading" class="text-center">
      <p>Loading books...</p>
    </div>
    
    <div v-else>
      <div v-if="books.length === 0" class="text-center">
        <p>No books found with ISBN > 1000</p>
      </div>
      
      <div v-else class="row">
        <div class="col-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book.id">
                <td>{{ book.isbn }}</td>
                <td>{{ book.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simple styles */
</style>

