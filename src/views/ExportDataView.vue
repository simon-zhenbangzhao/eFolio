<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Firestore instance
const db = getFirestore()

// Data state
const firestoreBooks = ref([])
const sampleBooks = ref([
  { id: 1, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance", pages: 432, isbn: "978-0141439518" },
  { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian", pages: 328, isbn: "978-0452284234" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", pages: 324, isbn: "978-0061120084" },
  { id: 4, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction", pages: 180, isbn: "978-0743273565" },
  { id: 5, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", year: 1997, genre: "Fantasy", pages: 223, isbn: "978-0439708180" },
  { id: 6, title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951, genre: "Fiction", pages: 277, isbn: "978-0316769488" },
  { id: 7, title: "Animal Farm", author: "George Orwell", year: 1945, genre: "Satire", pages: 112, isbn: "978-0452284244" },
  { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy", pages: 310, isbn: "978-0547928227" },
  { id: 9, title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "Dystopian", pages: 268, isbn: "978-0060850524" },
  { id: 10, title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, genre: "Fantasy", pages: 1178, isbn: "978-0544003415" }
])

// Export settings
const dataSource = ref('sample') // 'sample' or 'firestore'
const exportFormat = ref('csv')
const selectedFields = ref(['title', 'author', 'year', 'genre', 'pages', 'isbn'])
const includeHeaders = ref(true)
const filterGenre = ref('all')
const isLoading = ref(false)
const exportMessage = ref('')
const exportStats = ref({
  totalRecords: 0,
  exportedRecords: 0,
  fileSize: 0
})

// Available fields for export
const availableFields = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'year', label: 'Year' },
  { key: 'genre', label: 'Genre' },
  { key: 'pages', label: 'Pages' },
  { key: 'isbn', label: 'ISBN' }
]

// Available genres for filtering
const availableGenres = computed(() => {
  const genres = new Set()
  const books = dataSource.value === 'firestore' ? firestoreBooks.value : sampleBooks.value
  books.forEach(book => {
    if (book.genre) genres.add(book.genre)
  })
  return Array.from(genres).sort()
})

// Get filtered data based on current settings
const getFilteredData = () => {
  let books = dataSource.value === 'firestore' ? firestoreBooks.value : sampleBooks.value
  
  // Apply genre filter
  if (filterGenre.value !== 'all') {
    books = books.filter(book => book.genre === filterGenre.value)
  }
  
  return books
}

// Fetch books from Firestore
const fetchFirestoreBooks = async () => {
  try {
    isLoading.value = true
    const querySnapshot = await getDocs(collection(db, 'books'))
    firestoreBooks.value = []
    querySnapshot.forEach((doc) => {
      firestoreBooks.value.push({
        id: doc.id,
        ...doc.data()
      })
    })
    exportMessage.value = `Loaded ${firestoreBooks.value.length} books from Firestore`
  } catch (error) {
    console.error('Error fetching books:', error)
    exportMessage.value = 'Error loading Firestore data. Using sample data instead.'
    dataSource.value = 'sample'
  } finally {
    isLoading.value = false
  }
}

// Export to CSV
const exportToCSV = () => {
  const books = getFilteredData()
  
  if (books.length === 0) {
    exportMessage.value = 'No data to export'
    return
  }

  // Build CSV content
  let csv = ''
  
  // Add headers if enabled
  if (includeHeaders.value) {
    const headers = selectedFields.value.map(field => {
      const fieldObj = availableFields.find(f => f.key === field)
      return fieldObj ? fieldObj.label : field
    })
    csv += headers.join(',') + '\n'
  }
  
  // Add data rows
  books.forEach(book => {
    const row = selectedFields.value.map(field => {
      let value = book[field] || ''
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csv += row.join(',') + '\n'
  })
  
  // Create download
  downloadFile(csv, `books-export-${Date.now()}.csv`, 'text/csv')
  
  // Update stats
  exportStats.value = {
    totalRecords: books.length,
    exportedRecords: books.length,
    fileSize: new Blob([csv]).size
  }
  
  exportMessage.value = `Successfully exported ${books.length} records to CSV`
}

// Export to PDF
const exportToPDF = () => {
  const books = getFilteredData()
  
  if (books.length === 0) {
    exportMessage.value = 'No data to export'
    return
  }

  // Create new PDF document
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(18)
  doc.text('Books Collection Export', 14, 20)
  
  // Add metadata
  doc.setFontSize(10)
  doc.text(`Export Date: ${new Date().toLocaleString()}`, 14, 30)
  doc.text(`Total Records: ${books.length}`, 14, 36)
  if (filterGenre.value !== 'all') {
    doc.text(`Filter: Genre = ${filterGenre.value}`, 14, 42)
  }
  
  // Prepare table data
  const headers = selectedFields.value.map(field => {
    const fieldObj = availableFields.find(f => f.key === field)
    return fieldObj ? fieldObj.label : field
  })
  
  const data = books.map(book => 
    selectedFields.value.map(field => book[field] || '')
  )
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: data,
    startY: filterGenre.value !== 'all' ? 48 : 42,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [39, 95, 218], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 10 }
  })
  
  // Save PDF
  doc.save(`books-export-${Date.now()}.pdf`)
  
  // Update stats
  const pdfBlob = doc.output('blob')
  exportStats.value = {
    totalRecords: books.length,
    exportedRecords: books.length,
    fileSize: pdfBlob.size
  }
  
  exportMessage.value = `Successfully exported ${books.length} records to PDF`
}

// Export to JSON
const exportToJSON = () => {
  const books = getFilteredData()
  
  if (books.length === 0) {
    exportMessage.value = 'No data to export'
    return
  }

  // Filter fields
  const filteredBooks = books.map(book => {
    const filteredBook = {}
    selectedFields.value.forEach(field => {
      if (book[field] !== undefined) {
        filteredBook[field] = book[field]
      }
    })
    return filteredBook
  })
  
  // Create JSON
  const json = JSON.stringify({
    exportDate: new Date().toISOString(),
    totalRecords: books.length,
    filter: filterGenre.value !== 'all' ? { genre: filterGenre.value } : null,
    data: filteredBooks
  }, null, 2)
  
  // Download
  downloadFile(json, `books-export-${Date.now()}.json`, 'application/json')
  
  // Update stats
  exportStats.value = {
    totalRecords: books.length,
    exportedRecords: books.length,
    fileSize: new Blob([json]).size
  }
  
  exportMessage.value = `Successfully exported ${books.length} records to JSON`
}

// Export to Excel (XLSX format using CSV with UTF-8 BOM)
const exportToExcel = () => {
  const books = getFilteredData()
  
  if (books.length === 0) {
    exportMessage.value = 'No data to export'
    return
  }

  // Build CSV content with UTF-8 BOM for Excel compatibility
  let csv = '\uFEFF' // UTF-8 BOM
  
  // Add headers
  if (includeHeaders.value) {
    const headers = selectedFields.value.map(field => {
      const fieldObj = availableFields.find(f => f.key === field)
      return fieldObj ? fieldObj.label : field
    })
    csv += headers.join(',') + '\n'
  }
  
  // Add data rows
  books.forEach(book => {
    const row = selectedFields.value.map(field => {
      let value = book[field] || ''
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csv += row.join(',') + '\n'
  })
  
  // Create download
  downloadFile(csv, `books-export-${Date.now()}.xlsx`, 'text/csv')
  
  exportStats.value = {
    totalRecords: books.length,
    exportedRecords: books.length,
    fileSize: new Blob([csv]).size
  }
  
  exportMessage.value = `Successfully exported ${books.length} records to Excel`
}

// Generic file download helper
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

// Handle export based on selected format
const handleExport = () => {
  exportMessage.value = ''
  
  switch (exportFormat.value) {
    case 'csv':
      exportToCSV()
      break
    case 'pdf':
      exportToPDF()
      break
    case 'json':
      exportToJSON()
      break
    case 'excel':
      exportToExcel()
      break
    default:
      exportMessage.value = 'Invalid export format'
  }
}

// Toggle field selection
const toggleField = (fieldKey) => {
  const index = selectedFields.value.indexOf(fieldKey)
  if (index > -1) {
    selectedFields.value.splice(index, 1)
  } else {
    selectedFields.value.push(fieldKey)
  }
}

// Select all fields
const selectAllFields = () => {
  selectedFields.value = availableFields.map(f => f.key)
}

// Deselect all fields
const deselectAllFields = () => {
  selectedFields.value = []
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Component mounted
onMounted(() => {
  // Load sample data by default
  exportStats.value.totalRecords = sampleBooks.value.length
})
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">Data Export</h1>
        <p class="text-center text-muted">
          Export book collection data in various formats
        </p>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Left Panel - Configuration -->
      <div class="col-md-6">
        <!-- Export Format Selection -->
        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">Export Format</h5>
          </div>
          <div class="card-body">
            <select class="form-select" v-model="exportFormat">
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </div>

        <!-- Field Selection -->
        <div class="card mb-3">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Select Fields</h5>
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-primary" @click="selectAllFields">All</button>
              <button class="btn btn-outline-secondary" @click="deselectAllFields">None</button>
            </div>
          </div>
          <div class="card-body">
            <div v-for="field in availableFields" :key="field.key" class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                :id="'field-' + field.key"
                :value="field.key"
                :checked="selectedFields.includes(field.key)"
                @change="toggleField(field.key)"
              />
              <label class="form-check-label" :for="'field-' + field.key">
                {{ field.label }}
              </label>
            </div>
          </div>
        </div>

        <!-- Filter Options -->
        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">Filters</h5>
          </div>
          <div class="card-body">
            <label class="form-label">Genre:</label>
            <select class="form-select" v-model="filterGenre">
              <option value="all">All Genres</option>
              <option v-for="genre in availableGenres" :key="genre" :value="genre">
                {{ genre }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Right Panel - Export Action -->
      <div class="col-md-6">
        <!-- Export Button -->
        <div class="card mb-3">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">Export Data</h5>
          </div>
          <div class="card-body">
            <button
              class="btn btn-success btn-lg w-100 mb-3"
              @click="handleExport"
              :disabled="selectedFields.length === 0"
            >
              Export as {{ exportFormat.toUpperCase() }}
            </button>
            
            <div v-if="exportMessage" class="alert" :class="{
              'alert-success': exportMessage.includes('Success'),
              'alert-danger': exportMessage.includes('Error')
            }">
              {{ exportMessage }}
            </div>

            <div v-if="selectedFields.length === 0" class="alert alert-warning">
              Please select at least one field to export
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">Export Summary</h5>
          </div>
          <div class="card-body">
            <div class="stat-item">
              <strong>Records to Export:</strong>
              <span>{{ getFilteredData().length }}</span>
            </div>
            <div class="stat-item">
              <strong>Selected Fields:</strong>
              <span>{{ selectedFields.length }}</span>
            </div>
            <div class="stat-item" v-if="exportStats.exportedRecords > 0">
              <strong>Last Export:</strong>
              <span class="text-success">{{ exportStats.exportedRecords }} records</span>
            </div>
            <div class="stat-item" v-if="exportStats.fileSize > 0">
              <strong>File Size:</strong>
              <span>{{ formatFileSize(exportStats.fileSize) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #275fda;
  color: white;
}

.card-header.bg-success {
  background-color: #28a745 !important;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.format-info {
  font-size: 0.85rem;
  line-height: 1.5;
}

.preview-sample pre {
  max-height: 150px;
  overflow-y: auto;
  font-size: 0.75rem;
  margin-bottom: 0;
}

.form-check-input:checked {
  background-color: #275fda;
  border-color: #275fda;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

/* Keyboard navigation styles */
.form-check-input:focus,
.form-select:focus,
button:focus {
  outline: 2px solid #275fda;
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .preview-sample pre {
    font-size: 0.7rem;
  }
}
</style>

