<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref(null)

const getBookCount = async () => {
  try {
    const response = await axios.get('https://us-central1-week7-zhenbang-zhao.cloudfunctions.net/countBooks')
    count.value = response.data.count
    error.value = null
  } catch (err) {
    error.value = err.message
    count.value = null
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Book Counter</h1>
        <div class="text-center mt-4">
          <button class="btn btn-primary" @click="getBookCount">Get Book Count</button>
        </div>
        <div class="mt-4 text-center">
          <h3 v-if="count !== null">Total number of books: {{ count }}</h3>
          <h3 v-else-if="error" class="text-danger">Error: {{ error }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

