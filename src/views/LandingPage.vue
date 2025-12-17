<template>
  <div class="landing-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Bem-vindo ao Projeto Tibia</h1>
        <p class="hero-subtitle">Sua fonte completa de informações e ferramentas para o mundo de Tibia</p>
        <button class="cta-button" @click="goToMenu">Explorar Projeto</button>
      </div>
    </div>

    <section class="about-section">
      <div class="container">
        <h2 class="section-title">Sobre o Projeto</h2>
        <div class="about-grid">
          <div class="about-card">
            <h3>Nossa Missão</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          <div class="about-card">
            <h3>O que Oferecemos</h3>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <div class="about-card">
            <h3>Comunidade</h3>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Principais Funcionalidades</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">⚔️</div>
            <h3>Calculadora de Imbuements</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum in pellentesque facilisi congue nunc.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🗺️</div>
            <h3>Guias de Quests</h3>
            <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h3>Ferramentas Avançadas</h3>
            <p>Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam vehicula.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🏆</div>
            <h3>Conquistas</h3>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Pronto para Começar?</h2>
        <p>Explore todas as funcionalidades que preparamos para você melhorar sua experiência em Tibia.</p>
        <button class="cta-button secondary" @click="goToMenu">Acessar Ferramentas</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    goToMenu() {
      this.$router.push('/menu')
    }
  }
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--gradient-dark);
}

.hero-section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid var(--border-accent);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  z-index: 2;
  position: relative;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.cta-button {
  background: var(--gradient-primary);
  color: white;
  border: 2px solid transparent;
  padding: 1.2rem 3rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
  border-color: var(--accent-secondary);
}

.cta-button.secondary {
  background: var(--gradient-gold);
  border-color: transparent;
}

.cta-button.secondary:hover {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  border-color: var(--accent-gold-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--accent-primary);
  font-weight: 600;
}

.about-section,
.features-section {
  padding: 6rem 0;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.about-card {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.about-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-lg);
}

.about-card h3 {
  color: var(--accent-gold);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.about-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-item {
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

.feature-item:hover {
  transform: translateY(-4px);
  border-color: var(--accent-secondary);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.feature-item h3 {
  color: var(--accent-secondary);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.feature-item p {
  color: var(--text-secondary);
  line-height: 1.5;
}

.cta-section {
  padding: 6rem 0;
  text-align: center;
  background: var(--bg-secondary);
  border-top: 2px solid var(--border-accent);
  position: relative;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.cta-section p {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .about-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>