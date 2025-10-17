<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiData = ref(null)

const getBookCountAPI = async () => {
  try {
    const response = await axios.get('https://countbooks-ii2rmiuzca-uc.a.run.app')
    apiData.value = response.data
  } catch (err) {
    apiData.value = { error: err.message }
  }
}

onMounted(() => {
  getBookCountAPI()
})
</script>

<template>
  <div class="container mt-5">
    <pre v-if="apiData">{{ JSON.stringify(apiData, null, 2) }}</pre>
  </div>
</template>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}
</style>

