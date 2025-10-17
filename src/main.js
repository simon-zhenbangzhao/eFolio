// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Initialize Firebase
import './firebase'
import { initAuthListener } from './services/authService'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

const app = createApp(App)
app.use(router)
app.use(PrimeVue, { theme: { preset: Aura } })

// Initialize authentication listener
initAuthListener()

// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')
