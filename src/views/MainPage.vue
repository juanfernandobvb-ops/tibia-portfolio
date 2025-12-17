<template>
  <div class="main-page">
    <Header />
    <div class="content-wrapper">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'

export default {
  name: 'MainPage',
  components: {
    Header,
    Sidebar,
    Footer
  }
}
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  display: flex;
  flex: 1;
  position: relative;
}

.main-content {
  flex: 1;
  margin-left: 250px; /* Espaço para sidebar flutuante */
  background: var(--bg-primary);
  padding: 2rem 2rem 6rem 2rem;
  overflow-y: auto;
  min-height: calc(100vh - 150px); /* Descontando header + footer */
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0; /* Sem sidebar em mobile */
    padding: 1rem 0.5rem;
    padding-bottom: 4rem; /* Mais espaço para footer em mobile */
  }
  
  .content-container {
    max-width: 100%;
    padding: 0 0.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
  
  .topics-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    padding: 0.5rem 0;
  }
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  background: linear-gradient(135deg, var(--accent-gold), var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--accent-primary);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.topic-card {
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.topic-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-gold);
  box-shadow: 0 4px 16px rgba(157, 78, 221, 0.4), 0 0 20px rgba(255, 215, 0, 0.2);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(157, 78, 221, 0.1) 100%);
}

.topic-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.topic-name {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}
</style>
