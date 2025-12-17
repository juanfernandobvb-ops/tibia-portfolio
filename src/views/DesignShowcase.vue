<template>
  <div class="design-showcase">
    <div class="showcase-header">
      <h1>Design System Showcase</h1>
      <p>Demonstração da nova paleta de cores Dark Gaming Theme</p>
    </div>

    <!-- Color Palette Section -->
    <section class="color-section card card-hover">
      <h2>🎨 Paleta de Cores</h2>
      
      <div class="color-group">
        <h3>Backgrounds</h3>
        <div class="color-grid">
          <div class="color-item">
            <div class="color-box bg-primary"></div>
            <span>Primary (#0a0a0a)</span>
          </div>
          <div class="color-item">
            <div class="color-box bg-secondary"></div>
            <span>Secondary (#141318)</span>
          </div>
          <div class="color-item">
            <div class="color-box bg-tertiary"></div>
            <span>Tertiary (#1e1c2a)</span>
          </div>
          <div class="color-item">
            <div class="color-box bg-hover"></div>
            <span>Hover (#252238)</span>
          </div>
        </div>
      </div>

      <div class="color-group">
        <h3>Accent Colors</h3>
        <div class="color-grid">
          <div class="color-item">
            <div class="color-box accent-primary"></div>
            <span>Primary Purple (#8b5cf6)</span>
          </div>
          <div class="color-item">
            <div class="color-box accent-gold"></div>
            <span>Gold (#f59e0b)</span>
          </div>
          <div class="color-item">
            <div class="color-box accent-blue"></div>
            <span>Mana Blue (#3b82f6)</span>
          </div>
          <div class="color-item">
            <div class="color-box accent-green"></div>
            <span>Health Green (#10b981)</span>
          </div>
          <div class="color-item">
            <div class="color-box accent-red"></div>
            <span>Danger Red (#ef4444)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Components Section -->
    <section class="components-section card card-hover">
      <h2>🧩 Componentes</h2>
      
      <div class="component-group">
        <h3>Botões</h3>
        <div class="button-showcase">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary Button</button>
          <button class="btn-primary glow-effect">Primary com Glow</button>
        </div>
      </div>

      <div class="component-group">
        <h3>Cards & Containers</h3>
        <div class="card-showcase">
          <div class="demo-card card">
            <h4>Card Simples</h4>
            <p>Este é um card básico usando as variáveis CSS.</p>
          </div>
          
          <div class="demo-card card card-hover">
            <h4>Card com Hover</h4>
            <p>Este card tem efeitos de hover interativos.</p>
          </div>

          <div class="demo-card quest-style">
            <h4 class="text-gold">⚔️ Quest Card</h4>
            <p>Estilo especial para quests e conquistas.</p>
            <div class="quest-meta">
              <span><strong>Level:</strong> 100+</span>
              <span><strong>Reward:</strong> <span class="text-gold">5000 gold</span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="component-group">
        <h3>Typography</h3>
        <div class="typography-showcase">
          <h1>Heading 1 - <span class="text-gold">Golden Text</span></h1>
          <h2>Heading 2 - Purple Theme</h2>
          <h3>Heading 3 - Regular</h3>
          <p>Texto normal em branco primário para máxima legibilidade.</p>
          <p class="text-muted">Texto secundário em cinza para informações menos importantes.</p>
        </div>
      </div>
    </section>

    <!-- Gaming Elements -->
    <section class="gaming-section card card-hover">
      <h2>🎮 Elementos Gaming</h2>
      
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-label">HP</span>
          <div class="stat-bar">
            <div class="stat-fill health" style="width: 75%"></div>
          </div>
          <span class="stat-value">750/1000</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">MP</span>
          <div class="stat-bar">
            <div class="stat-fill mana" style="width: 60%"></div>
          </div>
          <span class="stat-value">600/1000</span>
        </div>
        
        <div class="stat-item">
          <span class="stat-label">EXP</span>
          <div class="stat-bar">
            <div class="stat-fill experience" style="width: 45%"></div>
          </div>
          <span class="stat-value">4500/10000</span>
        </div>
      </div>

      <div class="achievement-showcase">
        <div class="achievement">
          <div class="achievement-icon">🏆</div>
          <div class="achievement-content">
            <h4>Quest Master</h4>
            <p class="text-muted">Complete 100 quests</p>
          </div>
        </div>
        
        <div class="achievement unlocked">
          <div class="achievement-icon">⚔️</div>
          <div class="achievement-content">
            <h4 class="text-gold">Legendary Warrior</h4>
            <p class="text-muted">Reach level 200</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tibia Specific -->
    <section class="tibia-section card card-hover">
      <h2>🐺 Elementos Tibia</h2>
      
      <div class="npc-dialogue-demo">
        <div class="npc-dialogue-box">
          <p><span class="npc-name">Eremo:</span> Greetings, young adventurer! Are you ready for a <span class="dialogue-keyword">quest</span>?</p>
          <p><span class="player-name">Player:</span> Yes, I am ready!</p>
          <p><span class="npc-name">Eremo:</span> Excellent! Travel to the <span class="dialogue-keyword">ancient temple</span> and retrieve the sacred artifact.</p>
        </div>
      </div>

      <div class="creature-showcase">
        <div class="creature-card">
          <h4>⚔️ Dragon Lord</h4>
          <div class="creature-stats">
            <span class="hp">HP: 2100</span>
            <span class="exp">EXP: 2000</span>
            <span class="danger">Muito Perigoso</span>
          </div>
        </div>
        
        <div class="creature-card">
          <h4>🏹 Elf Scout</h4>
          <div class="creature-stats">
            <span class="hp">HP: 75</span>
            <span class="exp">EXP: 35</span>
            <span class="easy">Fácil</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DesignShowcase',
  mounted() {
    console.log('🎨 Design Showcase carregado - demonstrando nova paleta dark gaming theme')
  }
}
</script>

<style scoped>
.design-showcase {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  min-height: 100vh;
}

.showcase-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--gradient-dark);
  border-radius: 16px;
  border: 2px solid var(--border-accent);
}

.showcase-header h1 {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.showcase-header p {
  color: var(--text-secondary);
  font-size: 1.2rem;
}

/* Color Showcase */
.color-section h2,
.components-section h2,
.gaming-section h2,
.tibia-section h2 {
  color: var(--accent-primary);
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.color-group {
  margin-bottom: 2rem;
}

.color-group h3 {
  color: var(--accent-gold);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.color-item {
  text-align: center;
}

.color-box {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 2px solid var(--border-color);
}

.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-tertiary { background-color: var(--bg-tertiary); }
.bg-hover { background-color: var(--bg-hover); }
.accent-primary { background-color: var(--accent-primary); }
.accent-gold { background-color: var(--accent-gold); }
.accent-blue { background-color: var(--accent-blue); }
.accent-green { background-color: var(--accent-green); }
.accent-red { background-color: var(--accent-red); }

/* Components Showcase */
.component-group {
  margin-bottom: 3rem;
}

.component-group h3 {
  color: var(--accent-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.button-showcase {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.card-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.demo-card {
  padding: 1.5rem;
  border-radius: 12px;
}

.demo-card h4 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.quest-style {
  background: var(--gradient-dark);
  border: 2px solid var(--accent-gold);
  position: relative;
}

.quest-style::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-gold);
}

.quest-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.quest-meta span {
  background: var(--bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
}

/* Typography Showcase */
.typography-showcase h1 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.typography-showcase h2 {
  color: var(--accent-secondary);
  margin-bottom: 0.8rem;
}

.typography-showcase h3 {
  color: var(--text-primary);
  margin-bottom: 0.6rem;
}

.typography-showcase p {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

/* Gaming Elements */
.stats-bar {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.stat-item {
  display: grid;
  grid-template-columns: 50px 1fr 100px;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-weight: 600;
  color: var(--text-primary);
}

.stat-bar {
  height: 20px;
  background: var(--bg-tertiary);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.stat-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.stat-fill.health { background: linear-gradient(90deg, var(--accent-green), #22c55e); }
.stat-fill.mana { background: linear-gradient(90deg, var(--accent-blue), #60a5fa); }
.stat-fill.experience { background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-dark)); }

.stat-value {
  text-align: right;
  font-family: monospace;
  color: var(--text-secondary);
}

/* Achievements */
.achievement-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  opacity: 0.6;
}

.achievement.unlocked {
  opacity: 1;
  border-color: var(--accent-gold);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-content h4 {
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

/* Tibia Elements */
.npc-dialogue-demo {
  margin-bottom: 2rem;
}

.creature-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.creature-card {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.creature-card h4 {
  color: var(--accent-gold);
  margin-bottom: 0.5rem;
}

.creature-stats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.creature-stats span {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.creature-stats .hp {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
}

.creature-stats .exp {
  background: rgba(245, 158, 11, 0.2);
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold);
}

.creature-stats .danger {
  background: rgba(239, 68, 68, 0.2);
  color: var(--accent-red);
  border: 1px solid var(--accent-red);
}

.creature-stats .easy {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
}

/* Responsive Design */
@media (max-width: 768px) {
  .design-showcase {
    padding: 1rem;
  }
  
  .showcase-header h1 {
    font-size: 2rem;
  }
  
  .color-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .button-showcase {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-showcase {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    grid-template-columns: 40px 1fr 80px;
    gap: 0.5rem;
  }
}
</style>