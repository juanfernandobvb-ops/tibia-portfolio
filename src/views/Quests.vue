<template>
  <div class="quests-page">
    <div class="page-header">
      <h1>📜 Quest Archive</h1>
      <p class="page-subtitle">Explore epic adventures and legendary quests</p>
    </div>

    <div class="quest-grid">
      <div class="quest-card card card-hover">
        <div class="quest-header">
          <h3 class="quest-title">The Order of the Stag</h3>
        </div>
        <router-link to="/quests/the-order-of-the-stag" class="quest-link">
          <div class="quest-icon">
            <img 
              src="../assets/images/quests/the-order-of-the-stag/theOrderStagQuest.gif" 
              alt="The Order of the Stag" 
              class="quest-image" 
            />
          </div>
          <div class="quest-content">
            <p class="quest-description">Join the legendary order and face ancient challenges</p>
          </div>
          <div class="quest-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>
      </div>

      <div class="quest-card card card-hover">
        <div class="quest-header">
          <h3 class="quest-title">The New Frontier</h3>
        </div>
        <router-link to="/quests/the-new-frontier" class="quest-link">
          <div class="quest-icon">
            <img 
              src="../assets/images/general/quest.gif" 
              alt="The New Frontier" 
              class="quest-image" 
            />
          </div>
          <div class="quest-content">
            <p class="quest-description">Discover new lands and uncharted territories</p>
          </div>
          <div class="quest-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </router-link>
      </div>

      <!-- Placeholder cards para futuras quests -->
      <div class="quest-card card coming-soon">
        <div class="quest-header">
          <h3 class="quest-title">Blood Brothers Quest</h3>
        </div>
        <div class="quest-icon placeholder">
          <div class="placeholder-icon">🔒</div>
        </div>
        <div class="quest-content">
          <p class="quest-description">Coming soon...</p>
        </div>
      </div>

      <div class="quest-card card coming-soon">
        <div class="quest-header">
          <h3 class="quest-title">Demon Oak Quest</h3>
        </div>
        <div class="quest-icon placeholder">
          <div class="placeholder-icon">🔒</div>
        </div>
        <div class="quest-content">
          <p class="quest-description">Coming soon...</p>
        </div>
      </div>
    </div>

    <div class="stats-section card">
      <h2>Quest Statistics</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">2</div>
          <div class="stat-label">Available Quests</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">4</div>
          <div class="stat-label">Total Planned</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">∞</div>
          <div class="stat-label">Adventure Awaits</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quests'
}
</script>

<style scoped>
.quests-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--gradient-dark);
  border-radius: 16px;
  border: 2px solid var(--border-accent);
}

.page-header h1 {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin: 0;
}

/* Quest Grid */
.quest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Quest Cards */
.quest-card {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 0;
  border: 2px solid var(--border-color);
  overflow: hidden;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 200px; /* Fixed height for consistent cards */
}

.quest-card:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-4px);
}

.quest-card.coming-soon {
  opacity: 0.7;
  pointer-events: none;
  justify-content: flex-start;
}

.quest-card.coming-soon:hover {
  transform: none;
  box-shadow: var(--shadow-md);
  border-color: var(--border-accent);
}

/* Quest Header - Fixed at top */
.quest-header {
  background: var(--gradient-dark);
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--border-accent);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.quest-header .quest-title {
  color: var(--accent-gold);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  text-align: center;
}

/* Quest Link */
.quest-link {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

/* Quest Icon */
.quest-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.quest-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.quest-icon.placeholder {
  background: var(--gradient-dark);
  border: 2px solid var(--border-color);
}

.placeholder-icon {
  font-size: 2rem;
  opacity: 0.5;
}

/* Quest Content */
.quest-content {
  flex-grow: 1;
  min-width: 0;
}

.quest-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.4;
}

/* Quest Arrow */
.quest-arrow {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: var(--accent-secondary);
  transition: transform 0.3s ease;
}

.quest-card:hover .quest-arrow {
  transform: translateX(4px);
  color: var(--accent-primary);
}

/* Stats Section */
.stats-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-md);
}

.stats-section h2 {
  color: var(--accent-primary);
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 0.5rem;
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quests-page {
    padding: 1rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .quest-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .quest-link {
    padding: 1rem;
    gap: 0.75rem;
  }
  
  .quest-icon {
    width: 60px;
    height: 60px;
  }
  
  .quest-header {
    padding: 0.75rem 1rem;
  }
  
  .quest-header .quest-title {
    font-size: 1rem;
  }
  
  /* Coming Soon Cards Mobile */
  .quest-card.coming-soon .quest-link {
    display: none;
  }

  .quest-card.coming-soon {
    padding: 1rem;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: auto;
  }

  .quest-card.coming-soon .quest-icon {
    margin: 1rem 0;
    width: 60px;
    height: 60px;
  }

  .quest-card.coming-soon .quest-content {
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .quest-link {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }
  
  .quest-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
  }
  
  .quest-arrow {
    display: none;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
