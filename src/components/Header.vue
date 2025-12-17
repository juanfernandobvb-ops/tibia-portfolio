<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo" @click="goHome">
          <h1>Projeto Tibia</h1>
        </div>
      </div>
      <nav class="nav">
        <a href="#" class="nav-link" @click="goHome">Home</a>
        <a href="#" class="nav-link" @click="goToMenu">Menu</a>
        <a href="#" class="nav-link" @click="openDeveloperModal">Sobre o Desenvolvedor</a>
      </nav>
    </div>
    
    <!-- Modal -->
    <DeveloperModal :visible="showDeveloperModal" @close="closeDeveloperModal" />
  </header>
</template>

<script>
import DeveloperModal from './DeveloperModal.vue'

export default {
  name: 'Header',
  components: {
    DeveloperModal
  },
  data() {
    return {
      showDeveloperModal: false
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    goToMenu() {
      this.$router.push('/menu')
    },
    openDeveloperModal() {
      this.showDeveloperModal = true
    },
    closeDeveloperModal() {
      this.showDeveloperModal = false
    }
  }
}
</script>

<style scoped>
.header {
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
}

.header-content {
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo h1 {
  color: var(--accent-gold);
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  color: var(--accent-secondary);
  background-color: var(--bg-hover);
  box-shadow: var(--shadow-sm);
}
</style>
