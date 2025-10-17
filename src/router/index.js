import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import AddBookView from '../views/AddBookView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'

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
    component: AddBookView
  },
  {
    path: '/get-book-count',
    name: 'GetBookCount',
    component: GetBookCountView
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
