import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import SendEmailView from '../views/SendEmailView.vue'
import AuthorsTableView from '../views/AuthorsTableView.vue'
import BooksTableView from '../views/BooksTableView.vue'
import MapView from '../views/MapView.vue'
import ExportDataView from '../views/ExportDataView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/firebase-signin',
    name: 'FirebaseSignin',
    component: FirebaseSigninView
  },
  {
    path: '/firebase-register',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/add-book',
    name: 'AddBook',
    component: AddBookView,
    meta: { requiresAuth: true }
  },
  {
    path: '/get-book-count',
    name: 'GetBookCount',
    component: GetBookCountView,
    meta: { requiresAuth: true }
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/send-email',
    name: 'SendEmail',
    component: SendEmailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/authors-table',
    name: 'AuthorsTable',
    component: AuthorsTableView
  },
  {
    path: '/books-table',
    name: 'BooksTable',
    component: BooksTableView
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/export',
    name: 'Export',
    component: ExportDataView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if route requires auth and user is not authenticated
    next('/firebase-signin')
  } else {
    next()
  }
})

export default router
