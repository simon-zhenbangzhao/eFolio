<script setup>
import { ref } from 'vue'
import InteractiveTable from '../components/InteractiveTable.vue'
import authorsData from '../assets/json/authors.json'

// Add more sample authors for better demonstration
const authors = ref([
  ...authorsData,
  {
    id: 4,
    name: "J.K. Rowling",
    birthYear: 1965,
    genres: ["Fantasy", "Young Adult"],
    famousWorks: [
      { title: "Harry Potter and the Philosopher's Stone", year: 1997 },
      { title: "Harry Potter and the Chamber of Secrets", year: 1998 }
    ]
  },
  {
    id: 5,
    name: "Ernest Hemingway",
    birthYear: 1899,
    genres: ["Fiction", "Non-fiction"],
    famousWorks: [
      { title: "The Old Man and the Sea", year: 1952 },
      { title: "A Farewell to Arms", year: 1929 }
    ]
  },
  {
    id: 6,
    name: "Virginia Woolf",
    birthYear: 1882,
    genres: ["Modernist", "Fiction"],
    famousWorks: [
      { title: "Mrs Dalloway", year: 1925 },
      { title: "To the Lighthouse", year: 1927 }
    ]
  },
  {
    id: 7,
    name: "Mark Twain",
    birthYear: 1835,
    genres: ["Fiction", "Satire"],
    famousWorks: [
      { title: "The Adventures of Tom Sawyer", year: 1876 },
      { title: "Adventures of Huckleberry Finn", year: 1884 }
    ]
  },
  {
    id: 8,
    name: "Charles Dickens",
    birthYear: 1812,
    genres: ["Fiction", "Social commentary"],
    famousWorks: [
      { title: "A Tale of Two Cities", year: 1859 },
      { title: "Great Expectations", year: 1861 }
    ]
  },
  {
    id: 9,
    name: "William Shakespeare",
    birthYear: 1564,
    genres: ["Drama", "Poetry"],
    famousWorks: [
      { title: "Hamlet", year: 1603 },
      { title: "Romeo and Juliet", year: 1597 }
    ]
  },
  {
    id: 10,
    name: "Leo Tolstoy",
    birthYear: 1828,
    genres: ["Fiction", "Philosophy"],
    famousWorks: [
      { title: "War and Peace", year: 1869 },
      { title: "Anna Karenina", year: 1877 }
    ]
  },
  {
    id: 11,
    name: "F. Scott Fitzgerald",
    birthYear: 1896,
    genres: ["Fiction", "Jazz Age"],
    famousWorks: [
      { title: "The Great Gatsby", year: 1925 },
      { title: "Tender Is the Night", year: 1934 }
    ]
  },
  {
    id: 12,
    name: "Harper Lee",
    birthYear: 1926,
    genres: ["Fiction", "Southern Gothic"],
    famousWorks: [
      { title: "To Kill a Mockingbird", year: 1960 },
      { title: "Go Set a Watchman", year: 2015 }
    ]
  }
])

// Define table columns
const columns = [
  { key: 'id', label: 'ID', sortable: true, searchable: false },
  { key: 'name', label: 'Author Name', sortable: true, searchable: true },
  { key: 'birthYear', label: 'Birth Year', sortable: true, searchable: true },
  { key: 'genres', label: 'Genres', sortable: false, searchable: true }
]
</script>

<template>
  <div class="container mt-5">
    <div class="header-section mb-4">
      <h2>
        <i class="bi bi-people-fill"></i> Authors Library
      </h2>
      <p class="text-muted">
        Browse and search through our collection of renowned authors. 
        Click on column headers to sort, use search boxes to filter results.
      </p>
    </div>

    <InteractiveTable :columns="columns" :data="authors" :rows-per-page="10">
      <!-- Custom cell for genres to show as badges -->
      <template #cell-genres="{ value }">
        <span 
          v-for="(genre, index) in value.split(', ')" 
          :key="index"
          class="badge bg-primary me-1"
        >
          {{ genre }}
        </span>
      </template>
    </InteractiveTable>

    <!-- Statistics card -->
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Total Authors</h5>
            <p class="card-text display-6">{{ authors.length }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Oldest Author</h5>
            <p class="card-text display-6">
              {{ Math.min(...authors.map(a => a.birthYear)) }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title">Most Recent</h5>
            <p class="card-text display-6">
              {{ Math.max(...authors.map(a => a.birthYear)) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-section {
  text-align: center;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}
</style>

