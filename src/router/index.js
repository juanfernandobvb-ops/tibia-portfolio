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
    path: '/party-finder',
    name: 'PartyFinder',
    component: () => import('../views/PartyFinder.vue')
  }
  ,{
    path: '/finais',
    name: 'Finais',
    component: () => import('../views/Finais.vue')
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
    ,{
      path: '/delivery',
      name: 'Delivery',
      component: () => import('../views/Delivery.vue')
    },
    {
      path: '/huntanalyser',
      name: 'HuntAnalyser',
      component: () => import('../views/HuntAnalyser.vue')
    },
    {
      path: '/huntedlist',
      name: 'HuntedList',
      component: () => import('../views/HuntedList.vue')
    },
    {
      path: '/blackpanthers',
      name: 'BlackPanthers',
      component: () => import('../views/BlackPanthers.vue')
    },
    {
      path: '/bosses',
      name: 'Bosses',
      component: () => import('../views/Bosses.vue')
    },
    {
      path: '/tsdesc',
      name: 'tsDescription',
      component: () => import('../views/tsDescription.vue')
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
