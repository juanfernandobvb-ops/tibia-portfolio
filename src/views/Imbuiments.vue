<template>
  <div class="imbuiments-layout">
    <div class="content-area">
      <h2 class="page-title">Imbuements</h2>
      
      <div class="imbuements-grid">
      <!-- Strike -->
      <div class="imbuement-card" :class="{ active: selectedImbuement === 'strike' }" @click="selectImbuement('strike')">
        <div class="imbuement-header">
          <img src="../assets/images/strike/strike-3.webp" alt="Strike" class="imbuement-icon" />
          <div class="imbuement-info">
            <h3 class="imbuement-name">Strike</h3>
            <span class="imbuement-type">Dano Crítico</span>
          </div>
        </div>
        <div class="materials-list">
          <div class="material-item">
            <img src="../assets/images/strike/protective-charm.webp" alt="Protective Charm" class="material-icon" />
            <span class="material-quantity">20</span>
            <span class="material-name">Protective Charm</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/strike/sabretooth.webp" alt="Sabretooth" class="material-icon" />
            <span class="material-quantity">25</span>
            <span class="material-name">Sabretooth</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/strike/vexclaw-talon.gif" alt="Vexclaw Talon" class="material-icon" />
            <span class="material-quantity">5</span>
            <span class="material-name">Vexclaw Talon</span>
          </div>
        </div>
      </div>

      <!-- Vampirism -->
      <div class="imbuement-card" :class="{ active: selectedImbuement === 'vampirism' }" @click="selectImbuement('vampirism')">
        <div class="imbuement-header">
          <img src="../assets/images/vampirism/vampirism-3.webp" alt="Vampirism" class="imbuement-icon" />
          <div class="imbuement-info">
            <h3 class="imbuement-name">Vampirism</h3>
            <span class="imbuement-type">Roubo de Vida</span>
          </div>
        </div>
        <div class="materials-list">
          <div class="material-item">
            <img src="../assets/images/vampirism/vampire-teeth.gif" alt="Vampire Teeth" class="material-icon" />
            <span class="material-quantity">25</span>
            <span class="material-name">Vampire Teeth</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/vampirism/bloody-pincers.webp" alt="Bloody Pincers" class="material-icon" />
            <span class="material-quantity">15</span>
            <span class="material-name">Bloody Pincers</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/vampirism/piece-of-dead-brain.webp" alt="Piece of Dead Brain" class="material-icon" />
            <span class="material-quantity">5</span>
            <span class="material-name">Piece of Dead Brain</span>
          </div>
        </div>
      </div>

      <!-- Void -->
      <div class="imbuement-card" :class="{ active: selectedImbuement === 'void' }" @click="selectImbuement('void')">
        <div class="imbuement-header">
          <img src="../assets/images/void/void-3.webp" alt="Void" class="imbuement-icon" />
          <div class="imbuement-info">
            <h3 class="imbuement-name">Void</h3>
            <span class="imbuement-type">Roubo de Mana</span>
          </div>
        </div>
        <div class="materials-list">
          <div class="material-item">
            <img src="../assets/images/void/rope-belt.webp" alt="Rope Belt" class="material-icon" />
            <span class="material-quantity">25</span>
            <span class="material-name">Rope Belt</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/void/silencer-claws.gif" alt="Silencer Claw" class="material-icon" />
            <span class="material-quantity">25</span>
            <span class="material-name">Silencer Claw</span>
          </div>
          <div class="material-item">
            <img src="../assets/images/void/some-grimeleech-wings.webp" alt="Some Grimeleech Wings" class="material-icon" />
            <span class="material-quantity">5</span>
            <span class="material-name">Some Grimeleech Wings</span>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Calculator Sidebar -->
    <aside class="calculator-sidebar">
      <div v-if="selectedImbuement" class="calculator-header">
        <img :src="currentIcon" :alt="calculatorTitle" class="calculator-icon" />
        <h3 class="calculator-title">{{ calculatorTitle }}</h3>
      </div>
      <h3 v-else class="calculator-title">{{ calculatorTitle }}</h3>
      
      <div v-if="selectedImbuement" class="calculator-inputs">
        <div class="input-group">
          <div class="input-label">
            <img :src="currentMaterialIcons[0]" :alt="currentMaterials[0]" class="material-input-icon" />
            <label :for="'material1'">{{ currentMaterials[0] }}:</label>
          </div>
          <input type="number" id="material1" v-model.number="material1" placeholder="0" min="0" />
        </div>
        <div class="input-group">
          <div class="input-label">
            <img :src="currentMaterialIcons[1]" :alt="currentMaterials[1]" class="material-input-icon" />
            <label :for="'material2'">{{ currentMaterials[1] }}:</label>
          </div>
          <input type="number" id="material2" v-model.number="material2" placeholder="0" min="0" />
        </div>
        <div class="input-group">
          <div class="input-label">
            <img :src="currentMaterialIcons[2]" :alt="currentMaterials[2]" class="material-input-icon" />
            <label :for="'material3'">{{ currentMaterials[2] }}:</label>
          </div>
          <input type="number" id="material3" v-model.number="material3" placeholder="0" min="0" />
        </div>
        <div class="input-group input-separator">
          <div class="input-label">
            <img :src="goldTokenIcon" alt="Gold Token" class="material-input-icon" />
            <label for="goldToken">Gold Token:</label>
          </div>
          <input type="number" id="goldToken" v-model.number="goldToken" placeholder="0" min="0" />
        </div>
      </div>
      <div v-else class="no-selection">
        <p>Selecione um imbuement para calcular</p>
      </div>
      <div v-if="selectedImbuement" class="calculator-result">
        <button class="calc-button" @click="calculate">Calcular</button>
        <div v-if="result !== null" class="result-container">
          <div class="best-option">
            <h4>Melhor Opção:</h4>
            <div class="option-name">{{ result.bestOption }}</div>
            <div class="option-cost">{{ result.cost.toLocaleString('pt-BR') }} gold</div>
          </div>
          <div class="all-scenarios">
            <h5>Todos os Cenários:</h5>
            <div v-for="scenario in result.allScenarios" :key="scenario.name" class="scenario-item" :class="{ cheapest: scenario.name === result.bestOption }">
              <div class="scenario-name">{{ scenario.name }}</div>
              <div class="scenario-cost">{{ scenario.cost.toLocaleString('pt-BR') }} gold</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'Imbuiments',
  data() {
    return {
      selectedImbuement: null,
      material1: 0,
      material2: 0,
      material3: 0,
      goldToken: 0,
      result: null,
      goldTokenIcon: new URL('../assets/images/general/gold-token.webp', import.meta.url).href,
      imbuementData: {
        strike: {
          name: 'Strike',
          icon: new URL('../assets/images/strike/strike-3.webp', import.meta.url).href,
          materials: ['Protective Charm', 'Sabretooth', 'Vexclaw Talon'],
          quantities: [20, 25, 5],
          materialIcons: [
            new URL('../assets/images/strike/protective-charm.webp', import.meta.url).href,
            new URL('../assets/images/strike/sabretooth.webp', import.meta.url).href,
            new URL('../assets/images/strike/vexclaw-talon.gif', import.meta.url).href
          ]
        },
        vampirism: {
          name: 'Vampirism',
          icon: new URL('../assets/images/vampirism/vampirism-3.webp', import.meta.url).href,
          materials: ['Vampire Teeth', 'Bloody Pincers', 'Piece of Dead Brain'],
          quantities: [25, 15, 5],
          materialIcons: [
            new URL('../assets/images/vampirism/vampire-teeth.gif', import.meta.url).href,
            new URL('../assets/images/vampirism/bloody-pincers.webp', import.meta.url).href,
            new URL('../assets/images/vampirism/piece-of-dead-brain.webp', import.meta.url).href
          ]
        },
        void: {
          name: 'Void',
          icon: new URL('../assets/images/void/void-3.webp', import.meta.url).href,
          materials: ['Rope Belt', 'Silencer Claw', 'Some Grimeleech Wings'],
          quantities: [25, 25, 5],
          materialIcons: [
            new URL('../assets/images/void/rope-belt.webp', import.meta.url).href,
            new URL('../assets/images/void/silencer-claws.gif', import.meta.url).href,
            new URL('../assets/images/void/some-grimeleech-wings.webp', import.meta.url).href
          ]
        }
      }
    }
  },
  computed: {
    calculatorTitle() {
      if (!this.selectedImbuement) {
        return 'Imbuement Calculator'
      }
      return `${this.imbuementData[this.selectedImbuement].name} Calculator`
    },
    currentIcon() {
      if (!this.selectedImbuement) return ''
      return this.imbuementData[this.selectedImbuement].icon
    },
    currentMaterials() {
      if (!this.selectedImbuement) return []
      return this.imbuementData[this.selectedImbuement].materials
    },
    currentMaterialIcons() {
      if (!this.selectedImbuement) return []
      return this.imbuementData[this.selectedImbuement].materialIcons
    }
  },
  methods: {
    selectImbuement(type) {
      this.selectedImbuement = type
      this.material1 = 0
      this.material2 = 0
      this.material3 = 0
      this.goldToken = 0
      this.result = null
    },
    calculate() {
      const data = this.imbuementData[this.selectedImbuement]
      const quantities = data.quantities
      
      // Calcular os 4 cenários
      const scenarios = [
        {
          name: '0 Gold Tokens (100% Market)',
          tokens: 0,
          cost: (this.material1 * quantities[0]) + (this.material2 * quantities[1]) + (this.material3 * quantities[2])
        },
        {
          name: '2 Gold Tokens + Market',
          tokens: 2,
          cost: (this.goldToken * 2) + (this.material2 * quantities[1]) + (this.material3 * quantities[2])
        },
        {
          name: '4 Gold Tokens + Market',
          tokens: 4,
          cost: (this.goldToken * 4) + (this.material3 * quantities[2])
        },
        {
          name: '6 Gold Tokens (100% Tokens)',
          tokens: 6,
          cost: (this.goldToken * 6)
        }
      ]
      
      // Encontrar o cenário mais barato
      const cheapest = scenarios.reduce((min, scenario) => 
        scenario.cost < min.cost ? scenario : min
      )
      
      this.result = {
        bestOption: cheapest.name,
        cost: cheapest.cost,
        tokens: cheapest.tokens,
        allScenarios: scenarios
      }
    }
  }
}
</script>

<style scoped>
.imbuiments-layout {
  display: flex;
  position: relative;
  min-height: calc(100vh - 150px); /* Descontando header + footer */
  padding-bottom: 70px; /* Espaço para o footer */
}

.content-area {
  flex: 1;
  min-width: 0;
  margin-right: 300px;
  padding: 2rem;
  padding-top: 1rem; /* Reduzindo padding superior já que não precisa mais compensar header */
}

.page-title {
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--accent-primary);
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Calculator Sidebar */
.calculator-sidebar {
  position: fixed;
  top: 80px; /* Altura aproximada do header */
  right: 0;
  bottom: 70px; /* Altura aproximada do footer */
  width: 300px;
  background: var(--bg-secondary);
  border-left: 2px solid var(--accent-primary);
  border-top: 2px solid var(--accent-primary);
  border-bottom: 2px solid var(--accent-primary);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  overflow-y: auto;
  z-index: 40;
  backdrop-filter: blur(10px);
}

.calculator-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.calculator-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.calculator-title {
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  flex: 1;
}

.calculator-sidebar > .calculator-title {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.calculator-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.material-input-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.input-group label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.input-separator {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.input-group input {
  background-color: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  padding: 0.75rem;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.input-group input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

.calculator-result {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calc-button {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 6px;
  padding: 0.875rem 1.5rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(157, 78, 221, 0.4);
  width: 100%;
}

.calc-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(157, 78, 221, 0.6);
}

.calc-button:active {
  transform: translateY(0);
}

.result-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.best-option {
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(157, 78, 221, 0.2) 100%);
  padding: 1rem;
  border-radius: 6px;
  border-left: 4px solid var(--accent-gold);
  text-align: center;
}

.best-option h4 {
  color: var(--accent-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.option-name {
  color: var(--text-primary);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.option-cost {
  color: var(--accent-gold);
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.all-scenarios {
  background-color: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 6px;
}

.all-scenarios h5 {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scenario-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  border-left: 2px solid var(--border-color);
}

.scenario-item.cheapest {
  border-left-color: var(--accent-gold);
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.1) 0%, var(--bg-secondary) 100%);
}

.scenario-name {
  color: var(--text-primary);
  font-size: 0.85rem;
}

.scenario-cost {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.scenario-item.cheapest .scenario-cost {
  color: var(--accent-gold);
}

.no-selection {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
  font-style: italic;
}

.imbuements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
  padding: 1.5rem 0;
  max-width: 1400px;
}

.imbuement-card {
  background: var(--gradient-dark);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.imbuement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.imbuement-card:hover {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-4px);
}

.imbuement-card:hover::before {
  opacity: 1;
}

.imbuement-card.active {
  border-color: var(--accent-gold);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.4), var(--shadow-lg);
  background: var(--bg-secondary);
}

.imbuement-card.active::before {
  background: var(--gradient-gold);
  opacity: 1;
}

.imbuement-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 2rem 1.5rem 2rem;
  background: var(--bg-tertiary);
  margin: 0;
  border-bottom: 1px solid var(--border-accent);
  position: relative;
}

.imbuement-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 2rem;
  right: 2rem;
  height: 1px;
  background: var(--gradient-primary);
  opacity: 0.3;
}

.imbuement-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  border-radius: 12px;
  padding: 8px;
  background: var(--bg-hover);
  border: 2px solid var(--border-accent);
  transition: all 0.3s ease;
}

.imbuement-card:hover .imbuement-icon {
  border-color: var(--accent-primary);
  transform: scale(1.05);
}

.imbuement-card.active .imbuement-icon {
  border-color: var(--accent-gold);
  background: rgba(245, 158, 11, 0.1);
}

.imbuement-info {
  flex: 1;
}

.imbuement-name {
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.imbuement-type {
  color: var(--accent-secondary);
  font-size: 0.9rem;
  font-style: italic;
}

.materials-list {
  padding: 1.5rem 2rem 2rem 2rem;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
}

.material-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--gradient-primary);
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.material-item:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  transform: translateX(4px);
}

.material-item:hover::before {
  opacity: 1;
}

.material-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  border-radius: 8px;
  background: var(--bg-secondary);
  padding: 4px;
  border: 1px solid var(--border-accent);
}

.material-quantity {
  background: var(--gradient-gold);
  color: var(--bg-primary);
  font-weight: 700;
  font-size: 1rem;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--accent-gold-dark);
}

.material-name {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 500;
  flex: 1;
  letter-spacing: 0.3px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .imbuiments-layout {
    flex-direction: column;
    min-height: auto;
    padding-bottom: 0;
  }
  
  .content-area {
    margin-right: 0;
    padding: 1rem;
  }
  
  .calculator-sidebar {
    position: relative;
    top: auto;
    bottom: auto;
    width: 100%;
    padding: 1.5rem;
    border-left: none;
    border-top: 2px solid var(--accent-primary);
    border-bottom: none;
    margin-bottom: 70px; /* Espaço para o footer em mobile */
  }
  
  .imbuements-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem 0;
  }
  
  .imbuement-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
    gap: 1rem;
  }
  
  .imbuement-header::after {
    left: 1.5rem;
    right: 1.5rem;
  }
  
  .imbuement-icon {
    width: 48px;
    height: 48px;
  }
  
  .imbuement-name {
    font-size: 1.3rem;
  }
  
  .materials-list {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
  
  .material-item {
    padding: 0.75rem;
    gap: 0.75rem;
  }
  
  .material-icon {
    width: 32px;
    height: 32px;
  }
  
  .material-quantity {
    min-width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
