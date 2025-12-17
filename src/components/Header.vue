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
      showDeveloperModal: false,
      mobileMenuOpen: false
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
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      this.$emit('toggle-mobile-menu')
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

.mobile-menu-btn {
  display: none;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0.75rem 1rem;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
  
  .nav {
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem 0.75rem;
    flex-wrap: wrap;
  }
  
  .logo h1 {
    font-size: 1.2rem;
  }
  
  .nav {
    gap: 0.5rem;
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .nav-link {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
  
  .mobile-menu-btn {
    order: 2;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0.75rem 1rem;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
  
  .nav {
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0.5rem 0.75rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo h1 {
    font-size: 1.2rem;
  }
  
  .nav {
    gap: 0.5rem;
    justify-content: center;
  }
  
  .nav-link {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
