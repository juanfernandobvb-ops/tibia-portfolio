<template>
  <div class="content-container">
    <h2 class="page-title">Tópicos Importantes</h2>
    <div class="topics-grid">
      <div class="topic-card" @click="navigateTo('imbuiments')">
        <img src="../assets/images/general/imbuiment.gif" alt="Imbuiments" class="topic-icon-img" />
        <div class="topic-name">Imbuiments</div>
      </div>
      <div class="topic-card" @click="navigateTo('quests')">
        <img src="../assets/images/general/quest.gif" alt="Quests" class="topic-icon-img" />
        <div class="topic-name">Quests</div>
      </div>
      <div class="topic-card" @click="navigateTo('party-finder')">
        <img src="../assets/images/general/party.gif" alt="Party Finder" class="topic-icon-img" />
        <div class="topic-name">Party Finder</div>
      </div>
      <div class="topic-card" @click="navigateTo('finais')">
        <img src="../assets/images/general/Tibian_Shield.gif" alt="Finais GT/FR" class="topic-icon-img" />
        <div class="topic-name">Finais GT/FR</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateTo(page) {
      this.$router.push(`/${page}`)
    }
  }
}
</script>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  color: var(--accent-gold);
  font-size: 1.8rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--accent-primary);
  font-weight: 600;
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .topics-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    padding: 0.5rem 0;
  }
  
  .topic-card {
    padding: 1rem 0.75rem;
  }
  
  .topic-icon {
    font-size: 2rem;
  }
  
  .topic-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  
  .topics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .topic-card {
    padding: 0.75rem 0.5rem;
  }
  
  .topic-icon {
    font-size: 1.8rem;
  }
  
  .topic-name {
    font-size: 0.8rem;
  }
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
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  background-color: var(--bg-tertiary);
}

.topic-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.topic-icon-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.topic-name {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}
</style>
