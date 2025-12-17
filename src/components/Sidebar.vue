<template>
  <aside class="sidebar" :class="{ visible: visible }">
    <div class="sidebar-header">
      <h3>Menu</h3>
      <button class="close-button" @click="closeSidebar">
        ✕
      </button>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/imbuiments" class="sidebar-link">
        <img src="../assets/images/general/imbuiment.gif" alt="Imbuiments" class="icon-img" />
        <span>Imbuiments</span>
      </router-link>
      <router-link to="/quests" class="sidebar-link">
        <img src="../assets/images/general/quest.gif" alt="Quests" class="icon-img" />
        <span>Quests</span>
      </router-link>
      <a href="#" class="sidebar-link">
        <span class="icon">🐉</span>
        <span>Teste 3</span>
      </a>
      <a href="#" class="sidebar-link">
        <span class="icon">🏆</span>
        <span>Teste 4</span>
      </a>
      <a href="#" class="sidebar-link">
        <span class="icon">🗺️</span>
        <span>Teste 5</span>
      </a>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  background-color: var(--bg-secondary);
  border-right: 2px solid var(--border-color);
  width: 250px;
  height: 100vh;
  padding: 1.5rem 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
  z-index: 99;
  transition: left 0.3s ease;
}

.sidebar.visible {
  left: 0;
}

.sidebar-header {
  padding: 0 1.5rem 1rem;
  border-bottom: 2px solid var(--accent-primary);
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: var(--accent-gold);
  background-color: var(--bg-tertiary);
}

.sidebar-header h3 {
  color: var(--accent-gold);
  font-size: 1.1rem;
  font-weight: 600;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.sidebar-link:hover {
  background-color: var(--bg-tertiary);
  color: var(--accent-secondary);
  border-left-color: var(--accent-gold);
}

.sidebar-link.active,
.sidebar-link.router-link-active {
  background-color: var(--bg-tertiary);
  color: var(--accent-gold);
  border-left-color: var(--accent-gold);
  font-weight: 600;
}

.icon {
  font-size: 1.2rem;
}

.icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
