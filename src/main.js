import { createApp } from 'vue'
import MainPage from './views/MainPage.vue'
import router from './router'
import './assets/styles/main.css'

createApp(MainPage).use(router).mount('#app')
