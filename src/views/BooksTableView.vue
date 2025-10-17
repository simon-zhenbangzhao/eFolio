<script setup>
import { ref } from 'vue'
import InteractiveTable from '../components/InteractiveTable.vue'

// Sample books data
const books = ref([
  { id: 1, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance", pages: 432, isbn: "978-0141439518" },
  { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian", pages: 328, isbn: "978-0452284234" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", pages: 324, isbn: "978-0061120084" },
  { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction", pages: 180, isbn: "978-0743273565" },
  { id: 5, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", year: 1997, genre: "Fantasy", pages: 223, isbn: "978-0439708180" },
  { id: 6, title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951, genre: "Fiction", pages: 277, isbn: "978-0316769488" },
  { id: 7, title: "Animal Farm", author: "George Orwell", year: 1945, genre: "Satire", pages: 112, isbn: "978-0452284244" },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy", pages: 310, isbn: "978-0547928227" },
  { id: 9, title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "Dystopian", pages: 268, isbn: "978-0060850524" },
  { id: 10, title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, genre: "Fantasy", pages: 1178, isbn: "978-0544003415" },
  { id: 11, title: "Murder on the Orient Express", author: "Agatha Christie", year: 1934, genre: "Mystery", pages: 256, isbn: "978-0062693662" },
  { id: 12, title: "Sense and Sensibility", author: "Jane Austen", year: 1811, genre: "Romance", pages: 409, isbn: "978-0141439662" },
  { id: 13, title: "War and Peace", author: "Leo Tolstoy", year: 1869, genre: "Fiction", pages: 1225, isbn: "978-0140447934" },
  { id: 14, title: "The Old Man and the Sea", author: "Ernest Hemingway", year: 1952, genre: "Fiction", pages: 127, isbn: "978-0684801223" },
  { id: 15, title: "A Tale of Two Cities", author: "Charles Dickens", year: 1859, genre: "Fiction", pages: 489, isbn: "978-0141439600" }
])

// Define table columns
const columns = [
  { key: 'id', label: 'ID', sortable: true, searchable: false },
  { key: 'title', label: 'Book Title', sortable: true, searchable: true },
  { key: 'author', label: 'Author', sortable: true, searchable: true },
  { key: 'year', label: 'Year', sortable: true, searchable: true },
  { key: 'genre', label: 'Genre', sortable: true, searchable: true },
  { key: 'pages', label: 'Pages', sortable: true, searchable: false }
]
</script>

<template>
  <div class="container mt-5">
    <div class="header-section mb-4">
      <h2>
        <i class="bi bi-book-fill"></i> Books Collection
      </h2>
      <p class="text-muted">
        Explore our extensive book collection. Sort by any column, search by title, author, year, or genre.
        Each page displays 10 books for easy navigation.
      </p>
    </div>

    <InteractiveTable :columns="columns" :data="books" :rows-per-page="10">
      <!-- Custom cell for title with icon -->
      <template #cell-title="{ value }">
        <i class="bi bi-book text-primary"></i>
        <strong>{{ value }}</strong>
      </template>
      
      <!-- Custom cell for genre with colored badge -->
      <template #cell-genre="{ value }">
        <span 
          class="badge"
          :class="{
            'bg-danger': value === 'Dystopian',
            'bg-info': value === 'Fiction',
            'bg-success': value === 'Fantasy',
            'bg-warning': value === 'Mystery',
            'bg-primary': value === 'Romance',
            'bg-secondary': value === 'Satire'
          }"
        >
          {{ value }}
        </span>
      </template>
    </InteractiveTable>

    <!-- Statistics cards -->
    <div class="row mt-4">
      <div class="col-md-3">
        <div class="card text-center stats-card">
          <div class="card-body">
            <i class="bi bi-collection display-4 text-primary"></i>
            <h5 class="card-title mt-2">Total Books</h5>
            <p class="card-text display-6">{{ books.length }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center stats-card">
          <div class="card-body">
            <i class="bi bi-calendar-event display-4 text-success"></i>
            <h5 class="card-title mt-2">Oldest Book</h5>
            <p class="card-text display-6">
              {{ Math.min(...books.map(b => b.year)) }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center stats-card">
          <div class="card-body">
            <i class="bi bi-journal-text display-4 text-info"></i>
            <h5 class="card-title mt-2">Total Pages</h5>
            <p class="card-text display-6">
              {{ books.reduce((sum, b) => sum + b.pages, 0).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center stats-card">
          <div class="card-body">
            <i class="bi bi-star-fill display-4 text-warning"></i>
            <h5 class="card-title mt-2">Genres</h5>
            <p class="card-text display-6">
              {{ new Set(books.map(b => b.genre)).size }}
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

.stats-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}
</style>

