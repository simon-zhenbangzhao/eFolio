<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// AMap API Configuration
const AMAP_KEY = '298fb4f2f437654e34e67d2a1385df9e'

// Map instance and related objects
const map = ref(null)
const userMarker = ref(null)
const driving = ref(null)
const userLocation = ref(null)
const selectedStore = ref(null)
const routeInfo = ref(null)
const isCalculatingRoute = ref(false)

// Bookstore location data (POI data)
const bookstores = ref([
  {
    id: 1,
    name: 'State Library Victoria',
    address: '328 Swanston St, Melbourne VIC 3000',
    location: [144.9631, -37.8136],
    description: 'Melbourne\'s largest public library'
  },
  {
    id: 2,
    name: 'Readings Bookstore',
    address: '309 Lygon St, Carlton VIC 3053',
    location: [144.9667, -37.8010],
    description: 'Famous independent bookstore in Melbourne'
  },
  {
    id: 3,
    name: 'Books at Manic',
    address: '22 Greville St, Prahran VIC 3181',
    location: [145.0017, -37.8511],
    description: 'Stylish boutique bookstore and cafe'
  },
  {
    id: 4,
    name: 'The Hill of Content',
    address: '86 Bourke St, Melbourne VIC 3000',
    location: [144.9707, -37.8136],
    description: 'Historic bookstore in Melbourne CBD'
  }
])

const markers = ref([])
const searchKeyword = ref('')
const filteredStores = ref([...bookstores.value])

// Load AMap script
const loadAMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Driving,AMap.Geocoder`
    script.async = true
    script.onload = () => resolve(window.AMap)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Initialize map
const initMap = async () => {
  try {
    const AMap = await loadAMapScript()

    // Create map instance (Melbourne center)
    map.value = new AMap.Map('map-container', {
      zoom: 13,
      center: [144.9631, -37.8136],
      mapStyle: 'amap://styles/light'
    })

    // Initialize driving route service
    driving.value = new AMap.Driving({
      map: map.value,
      panel: 'route-panel'
    })

    // Add bookstore markers
    addBookstoreMarkers()

    // Get user location
    getUserLocation()
  } catch (error) {
    console.error('Map loading failed:', error)
  }
}

// Add bookstore markers
const addBookstoreMarkers = () => {
  if (!window.AMap || !map.value) return

  bookstores.value.forEach((store) => {
    const marker = new window.AMap.Marker({
      position: store.location,
      title: store.name,
      icon: new window.AMap.Icon({
        size: new window.AMap.Size(32, 32),
        image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png',
        imageSize: new window.AMap.Size(32, 32)
      }),
      offset: new window.AMap.Pixel(-16, -32)
    })

    // Add click event
    marker.on('click', () => {
      selectStore(store)
    })

    marker.setMap(map.value)
    markers.value.push(marker)
  })
}

// Get user location
const getUserLocation = () => {
  if (!window.AMap || !map.value) return

  map.value.plugin('AMap.Geolocation', function () {
    const geolocation = new window.AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000
    })

    geolocation.getCurrentPosition((status, result) => {
      if (status === 'complete') {
        const { lng, lat } = result.position
        userLocation.value = [lng, lat]

        // Add user location marker
        if (userMarker.value) {
          userMarker.value.setPosition([lng, lat])
        } else {
          userMarker.value = new window.AMap.Marker({
            position: [lng, lat],
            icon: new window.AMap.Icon({
              size: new window.AMap.Size(36, 36),
              image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
              imageSize: new window.AMap.Size(36, 36)
            }),
            offset: new window.AMap.Pixel(-18, -36),
            title: 'My Location'
          })
          userMarker.value.setMap(map.value)
        }

        map.value.setCenter([lng, lat])
      } else {
        // If location retrieval fails, use default location (Melbourne CBD)
        userLocation.value = [144.9631, -37.8136]
      }
    })
  })
}

// Select store
const selectStore = (store) => {
  selectedStore.value = store
  routeInfo.value = null

  // Move map center to bookstore
  if (map.value) {
    map.value.setZoomAndCenter(15, store.location)
  }
}

// Plan route
const planRoute = () => {
  if (!selectedStore.value || !driving.value) {
    alert('Please select a bookstore first')
    return
  }

  if (!userLocation.value) {
    alert('Unable to get your location')
    return
  }

  isCalculatingRoute.value = true
  routeInfo.value = null

  // Clear previous route
  driving.value.clear()

  // Plan route
  driving.value.search(
    userLocation.value,
    selectedStore.value.location,
    (status, result) => {
      isCalculatingRoute.value = false

      if (status === 'complete' && result.routes && result.routes.length > 0) {
        const route = result.routes[0]
        routeInfo.value = {
          distance: (route.distance / 1000).toFixed(2) + ' km',
          duration: Math.round(route.time / 60) + ' min',
          tolls: route.tolls ? '$' + route.tolls : 'No tolls',
          steps: route.steps.length
        }
      } else {
        alert('Route planning failed, please try again')
      }
    }
  )
}

// Search stores
const searchStores = () => {
  if (!searchKeyword.value.trim()) {
    filteredStores.value = [...bookstores.value]
    return
  }

  const keyword = searchKeyword.value.toLowerCase()
  filteredStores.value = bookstores.value.filter(
    (store) =>
      store.name.toLowerCase().includes(keyword) ||
      store.address.toLowerCase().includes(keyword) ||
      store.description.toLowerCase().includes(keyword)
  )
}

// Locate to store
const locateStore = (store) => {
  selectStore(store)
}

// Clear route
const clearRoute = () => {
  if (driving.value) {
    driving.value.clear()
  }
  routeInfo.value = null
  selectedStore.value = null
}

// Component mounted
onMounted(() => {
  initMap()
})

// Component unmounted
onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">Bookstore Map Navigation</h1>
        <p class="text-center text-muted">
          Geolocation features powered by AMap API - Search bookstores, view locations, plan routes
        </p>
      </div>
    </div>

    <div class="row mt-4">
      <!-- Left Panel - Bookstore list and search -->
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">Search Bookstores</h5>
          </div>
          <div class="card-body">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Enter bookstore name or address..."
                v-model="searchKeyword"
                @input="searchStores"
              />
              <button class="btn btn-primary" @click="searchStores">Search</button>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">
            <h5 class="mb-0">Bookstore List ({{ filteredStores.length }})</h5>
          </div>
          <div class="card-body store-list">
            <div
              v-for="store in filteredStores"
              :key="store.id"
              class="store-item mb-3 p-3"
              :class="{ active: selectedStore?.id === store.id }"
              @click="locateStore(store)"
            >
              <h6 class="mb-2">{{ store.name }}</h6>
              <p class="mb-1 text-muted small">
                <i class="bi bi-geo-alt"></i> {{ store.address }}
              </p>
              <p class="mb-0 small">{{ store.description }}</p>
            </div>
            <div v-if="filteredStores.length === 0" class="text-center text-muted py-4">
              No matching bookstores found
            </div>
          </div>
        </div>

        <!-- Selected store information -->
        <div v-if="selectedStore" class="card mb-3">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">Selected Bookstore</h5>
          </div>
          <div class="card-body">
            <h6>{{ selectedStore.name }}</h6>
            <p class="text-muted small mb-3">{{ selectedStore.address }}</p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" @click="planRoute" :disabled="isCalculatingRoute">
                <span v-if="isCalculatingRoute">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Planning...
                </span>
                <span v-else>Plan Route</span>
              </button>
              <button class="btn btn-outline-secondary" @click="clearRoute">Clear Route</button>
            </div>
          </div>
        </div>

        <!-- Route information -->
        <div v-if="routeInfo" class="card mb-3">
          <div class="card-header bg-info text-white">
            <h5 class="mb-0">Route Information</h5>
          </div>
          <div class="card-body">
            <div class="route-info-item">
              <strong>Distance:</strong>
              <span>{{ routeInfo.distance }}</span>
            </div>
            <div class="route-info-item">
              <strong>Estimated Time:</strong>
              <span>{{ routeInfo.duration }}</span>
            </div>
            <div class="route-info-item">
              <strong>Tolls:</strong>
              <span>{{ routeInfo.tolls }}</span>
            </div>
            <div class="route-info-item">
              <strong>Route Steps:</strong>
              <span>{{ routeInfo.steps }} steps</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Map display -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-body p-0">
            <div id="map-container" style="height: 600px; width: 100%"></div>
          </div>
        </div>

        <!-- Route details panel -->
        <div v-if="routeInfo" class="card mt-3">
          <div class="card-header">
            <h5 class="mb-0">Detailed Route Instructions</h5>
          </div>
          <div class="card-body">
            <div id="route-panel" style="max-height: 300px; overflow-y: auto"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-list {
  max-height: 400px;
  overflow-y: auto;
}

.store-item {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.store-item:hover {
  border-color: #275fda;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.store-item.active {
  border-color: #275fda;
  background-color: #f0f4ff;
}

.route-info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.route-info-item:last-child {
  border-bottom: none;
}

.card-header {
  background-color: #275fda;
  color: white;
}

.card-header.bg-success {
  background-color: #28a745 !important;
}

.card-header.bg-info {
  background-color: #17a2b8 !important;
}

#route-panel {
  font-size: 14px;
}

#map-container {
  border-radius: 0 0 8px 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .store-list {
    max-height: 300px;
  }

  #map-container {
    height: 400px !important;
  }
}
</style>

