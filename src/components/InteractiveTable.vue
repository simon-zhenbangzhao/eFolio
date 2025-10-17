<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
    // Format: [{ key: 'name', label: 'Name', sortable: true, searchable: true }]
  },
  data: {
    type: Array,
    required: true
  },
  rowsPerPage: {
    type: Number,
    default: 10
  }
})

// State management
const currentPage = ref(1)
const sortColumn = ref(null)
const sortDirection = ref('asc')
const searchQueries = ref({})

// Initialize search queries for searchable columns
props.columns.forEach(col => {
  if (col.searchable) {
    searchQueries.value[col.key] = ''
  }
})

// Filtered data based on search queries
const filteredData = computed(() => {
  let result = [...props.data]
  
  // Apply search filters for each column
  Object.keys(searchQueries.value).forEach(key => {
    const query = searchQueries.value[key].toLowerCase().trim()
    if (query) {
      result = result.filter(item => {
        const value = String(item[key] || '').toLowerCase()
        return value.includes(query)
      })
    }
  })
  
  return result
})

// Sorted data
const sortedData = computed(() => {
  if (!sortColumn.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const aVal = a[sortColumn.value]
    const bVal = b[sortColumn.value]
    
    let comparison = 0
    if (aVal > bVal) comparison = 1
    if (aVal < bVal) comparison = -1
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.rowsPerPage
  const end = start + props.rowsPerPage
  return sortedData.value.slice(start, end)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / props.rowsPerPage)
})

// Sort handler
const handleSort = (columnKey) => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }
  currentPage.value = 1 // Reset to first page when sorting
}

// Clear all searches
const clearSearch = () => {
  Object.keys(searchQueries.value).forEach(key => {
    searchQueries.value[key] = ''
  })
  currentPage.value = 1
}

// Pagination handlers
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Get value for display (handles nested objects and arrays)
const getValue = (item, key) => {
  const value = item[key]
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return value
}
</script>

<template>
  <div class="interactive-table">
    <!-- Search filters -->
    <div class="search-section mb-3">
      <div class="row g-2">
        <div 
          v-for="column in columns.filter(col => col.searchable)" 
          :key="column.key"
          class="col-md-3 col-sm-6"
        >
          <div class="input-group input-group-sm">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              v-model="searchQueries[column.key]"
              :placeholder="`Search ${column.label}`"
            />
          </div>
        </div>
        <div class="col-md-auto col-sm-6">
          <button 
            class="btn btn-sm btn-outline-secondary"
            @click="clearSearch"
            v-if="Object.values(searchQueries).some(q => q)"
          >
            <i class="bi bi-x-circle"></i> Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-primary">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              :class="{ 'sortable': column.sortable }"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              {{ column.label }}
              <span v-if="column.sortable && sortColumn === column.key">
                <i :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              </span>
              <span v-else-if="column.sortable" class="sort-icon">
                <i class="bi bi-arrow-down-up"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :item="item" :value="getValue(item, column.key)">
                {{ getValue(item, column.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="text-center text-muted">
              No data found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-section d-flex justify-content-between align-items-center">
      <div class="pagination-info text-muted">
        Showing {{ ((currentPage - 1) * rowsPerPage) + 1 }} 
        to {{ Math.min(currentPage * rowsPerPage, sortedData.length) }} 
        of {{ sortedData.length }} entries
      </div>
      <nav aria-label="Table pagination">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li 
            v-for="page in totalPages" 
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.interactive-table {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-section {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.sort-icon {
  opacity: 0.3;
  font-size: 0.75rem;
  margin-left: 4px;
}

.sortable:hover .sort-icon {
  opacity: 0.6;
}

.pagination-info {
  font-size: 0.875rem;
}

.page-link {
  color: #275fda;
}

.page-item.active .page-link {
  background-color: #275fda;
  border-color: #275fda;
}
</style>

