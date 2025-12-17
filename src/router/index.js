import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import LandingPage from '../views/LandingPage.vue'
import Imbuiments from '../views/Imbuiments.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/menu',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/imbuiments',
    name: 'Imbuiments',
    component: Imbuiments
  }
  ,{
    path: '/quests',
    name: 'Quests',
    component: () => import('../views/Quests.vue')
  }
  ,{
    path: '/quests/the-order-of-the-stag',
    name: 'TheOrderOfTheStagQuest',
    component: () => import('../views/quests/TheOrderOfTheStagQuest.vue')
  }
  ,{
    path: '/quests/the-new-frontier',
    name: 'TheNewFrontierQuest',
    component: () => import('../views/quests/TheNewFrontierQuest.vue')
  }
  ,{
    path: '/design-showcase',
    name: 'DesignShowcase',
    component: () => import('../views/DesignShowcase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
