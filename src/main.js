
import { createApp } from 'vue'
import MainPage from './views/MainPage.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(MainPage)
app.use(router)
app.mount('#app')

// Google Analytics SPA pageview
router.afterEach((to) => {
	if (window.gtag) {
		window.gtag('event', 'page_view', {
			page_path: to.fullPath,
			page_title: document.title,
		});
	}
});
