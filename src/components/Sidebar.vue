<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <router-link to="/imbuiments" class="sidebar-link">
        <img src="../assets/images/general/imbuiment.gif" alt="Imbuiments" class="icon-img" />
        <span>Imbuiments</span>
      </router-link>
      <router-link to="/quests" class="sidebar-link">
        <img src="../assets/images/general/quest.gif" alt="Quests" class="icon-img" />
        <span>Quests</span>
      </router-link>
      <router-link to="/party-finder" class="sidebar-link">
        <img src="../assets/images/general/party.gif" alt="Party Finder" class="icon-img" />
        <span>Party Finder</span>
      </router-link>
      <router-link to="/finais" class="sidebar-link">
        <img src="../assets/images/general/Tibian_Shield.gif" alt="Finais GT/FR" class="icon-img" />
        <span>Finais GT/FR</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 130px;
  left: 15px;
  bottom: 110px;
  border-radius: 16px;
  width: 220px;
  padding: 0;
  z-index: 90;
  overflow: hidden;

}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.5rem 1rem; /* Centralizando padding aqui */
  height: 100%;
  overflow-y: auto;
  justify-content: flex-start; /* Alinhamento dos itens */
}

/* Custom Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--accent-gold);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--accent-secondary);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  margin: 0.125rem 0;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 500;
}

.sidebar-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-gold);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  border-radius: 0 3px 3px 0;
}

.sidebar-link:hover {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.1), 
    rgba(245, 158, 11, 0.05)
  );
  color: var(--accent-gold);
  transform: translateX(4px);
  box-shadow: 
    0 4px 12px rgba(245, 158, 11, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.sidebar-link:hover::before {
  transform: scaleY(1);
}

.sidebar-link.active,
.sidebar-link.router-link-active {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.15), 
    rgba(245, 158, 11, 0.08)
  );
  color: var(--accent-gold);
  font-weight: 600;
  transform: translateX(4px);
  box-shadow: 
    0 4px 12px rgba(245, 158, 11, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.sidebar-link.router-link-active::before {
  transform: scaleY(1);
}

.icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.3));
  transition: filter 0.3s ease;
}

.sidebar-link:hover .icon {
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.6));
}

.icon-img {
  width: 46px;
  height: 46px;
  object-fit: contain;
  filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.3));
  transition: all 0.3s ease;
}

.sidebar-link:hover .icon-img {
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.6));
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    gap: 0.75rem;
  }
  
  .nav-text {
    font-size: 0.9rem;
  }
  
  .nav-icon {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -250px;
    transition: left 0.3s ease;
    z-index: 1000;
    width: 250px;
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
  
  /* Overlay para fechar sidebar em mobile */
  .sidebar::before {
    content: '';
    position: fixed;
    top: 0;
    right: -100vw;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .sidebar.mobile-open::before {
    right: -250px;
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    left: -100%;
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
  
  .sidebar.mobile-open::before {
    right: 0;
  }
}

/* Adicionar animação de entrada */
@keyframes slideInFloat {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sidebar {
  animation: slideInFloat 0.5s ease-out;
}
</style>
