<script setup>
// import JSONLab from './components/JSONLab.vue'
import BHeader from './components/BHeader.vue'
// import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
</script>

<template>
  <header>
    <BHeader />
  </header>

  <main>
    <router-view></router-view>
    <!-- <JSONLab /> -->
  </main>
</template>

<style>
/* Global styles for the application */
.container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

/* Form styles */
.form {
  text-align: center;
  margin-top: 50px;
}

/* Card styles */
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
}

/* Focus styles */
#username:focus,
#password:focus,
#isAustralian:focus {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
