<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
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
    toggleSidebar() {
      this.$emit('toggle-sidebar')
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
  gap: 1rem;
}

.sidebar-toggle {
  background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
  border: 2px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 44px;
  height: 52px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--accent-gold);
  box-shadow: var(--shadow-glow);
  background-color: var(--bg-hover);
}

.sidebar-toggle:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background-color: var(--accent-gold);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover .hamburger-line {
  background-color: var(--accent-secondary);
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
