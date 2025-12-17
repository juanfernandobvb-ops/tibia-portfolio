<template>
  <div class="party-finder">
    <div class="page-header">
      <h1 class="page-title">Party Finder</h1>
      <p class="page-subtitle">Cadastre sua disponibilidade e encontre outros jogadores para formar party</p>
    </div>

    <div class="party-finder-content">
      <!-- Player Registration Section -->
      <div class="registration-section">
        <div class="section-header">
          <h2>Cadastrar Disponibilidade</h2>
          <button class="btn-primary" @click="openRegistrationModal">
            ➕ Cadastrar Disponibilidade
          </button>
        </div>
        <p class="section-description">Cadastre-se para aparecer na lista de jogadores disponíveis e encontrar party
          mais facilmente!</p>
      </div>

      <!-- Available Players Section -->
      <div class="players-section">
        <div class="section-header">
          <h2>Jogadores Disponíveis</h2>
          <div class="section-stats">
            <span v-if="loadingPlayers">🔄 Carregando...</span>
            <span v-else-if="firebaseConnected">🟢 {{ filteredPlayers.length }} jogador(es) online</span>
            <span v-else>🔴 Modo offline - {{ filteredPlayers.length }} jogador(es)</span>
          </div>
        </div>

        <div class="filters">
          <div class="filter-group">
            <select v-model="filters.server" class="filter-select">
              <option value="">Todos os Servidores</option>
              <option v-for="server in uniqueServers" :key="server" :value="server">{{ server }}</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.vocation" class="filter-select">
              <option value="">Todas as Vocações</option>
              <option value="Elite Knight">Elite Knight</option>
              <option value="Royal Paladin">Royal Paladin</option>
              <option value="Elder Druid">Elder Druid</option>
              <option value="Master Sorcerer">Master Sorcerer</option>
            </select>
          </div>

          <div class="filter-group">
            <select v-model="filters.timeRange" class="filter-select">
              <option value="">Todos os Horários</option>
              <option value="morning">Manhã (06h-12h)</option>
              <option value="afternoon">Tarde (12h-18h)</option>
              <option value="evening">Noite (18h-24h)</option>
            </select>
          </div>
        </div>

        <div class="players-grid">
          <div v-for="player in filteredPlayers" :key="player.id" class="player-card">
            <div class="player-header">
              <div class="player-basic-info">
                <h3>{{ player.name }}</h3>
                <div class="player-details">
                  <span class="level">Level {{ player.level }}</span>
                  <span class="vocation">{{ player.vocation }}</span>
                </div>
              </div>
              <div class="player-status">
                <span class="status-badge online">Online</span>
                <span class="server-badge">{{ player.world }}</span>
              </div>
            </div>

            <div v-if="player.guild" class="guild-info">
              <span class="icon">🏰</span>
              <span>{{ player.guild.name }} - {{ player.guild.rank }}</span>
            </div>

            <div class="availability-section">
              <h4>Disponibilidade:</h4>
              <div class="availability-tags">
                <span v-for="period in player.availability" :key="period" class="time-tag">
                  {{ period }}
                </span>
              </div>
            </div>

            <div v-if="player.notes" class="notes-section">
              <p>{{ player.notes }}</p>
            </div>

            <div class="player-footer">
              <div class="contact-info">
                <span class="icon">💬</span>
                <span>{{ player.contactInfo || 'Contato in-game' }}</span>
              </div>

              <div class="player-actions">
                <button class="btn-primary btn-small" @click="contactPlayer(player)">
                  Entrar em Contato
                </button>
                <button 
                  v-if="canRemovePlayer(player)" 
                  class="btn-danger btn-small" 
                  @click="removePlayer(player)"
                >
                  Remover
                </button>
                <span class="registered-time">{{ formatTime(player.registeredAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPlayers.length === 0" class="empty-state">
            <span class="empty-icon">👥</span>
            <h3>Nenhum jogador disponível</h3>
            <p>Seja o primeiro a se cadastrar ou ajuste os filtros!</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Registration Modal -->
  <div v-if="showRegistrationModal" class="modal-overlay" @click="closeRegistrationModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Cadastrar Disponibilidade</h2>
        <button class="modal-close" @click="closeRegistrationModal">✕</button>
      </div>

      <div class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label for="characterName">Nome do Personagem</label>
            <div class="input-group">
              <input type="text" id="characterName" v-model="newPlayer.characterName" placeholder="Ex: Dark Wizard"
                class="form-input" :disabled="loading" />
              <button type="button" @click="fetchCharacterData" class="btn-secondary"
                :disabled="!newPlayer.characterName || loading">
                {{ loading ? '⏳' : '🔍' }} Buscar
              </button>
            </div>
            <small v-if="characterError" class="error-text">{{ characterError }}</small>
          </div>
        </div>

        <div v-if="characterData" class="character-preview">
          <h4>Dados do Personagem:</h4>
          <div class="character-info">
            <div class="info-item">
              <span class="icon">👤</span>
              <span>{{ characterData.name }}</span>
            </div>
            <div class="info-item">
              <span class="icon">📊</span>
              <span>Level {{ characterData.level }}</span>
            </div>
            <div class="info-item">
              <span class="icon">🌍</span>
              <span>{{ characterData.world }}</span>
            </div>
            <div class="info-item">
              <span class="icon">⚔️</span>
              <span>{{ characterData.vocation }}</span>
            </div>
            <div v-if="characterData.guild" class="info-item">
              <span class="icon">🏰</span>
              <span>{{ characterData.guild.name }} ({{ characterData.guild.rank }})</span>
            </div>
          </div>
        </div>

        <div v-if="characterData" class="form-group">
          <label>Disponibilidade de Horário</label>
          <div class="schedule-grid">
            <div v-for="period in availablePeriods" :key="period.id" class="schedule-item">
              <input type="checkbox" :id="'period-' + period.id" :value="period.value" v-model="newPlayer.availability"
                class="schedule-checkbox" />
              <label :for="'period-' + period.id" class="schedule-label">{{ period.label }}</label>
            </div>
          </div>
        </div>

        <div v-if="characterData" class="form-group">
          <label for="contactInfo">Contato (Discord/WhatsApp) - Opcional</label>
          <input type="text" id="contactInfo" v-model="newPlayer.contactInfo"
            placeholder="Ex: Discord#1234, WhatsApp, in-game message..." class="form-input" />
        </div>

        <div v-if="characterData" class="form-group">
          <label for="notes">Observações (Opcional)</label>
          <textarea id="notes" v-model="newPlayer.notes"
            placeholder="Especifique horários específicos (ex: 14h às 16h), tipo de hunt preferida, level mínimo, etc..."
            class="form-textarea" rows="3"></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" @click="closeRegistrationModal" class="btn-secondary">Cancelar</button>
        <button type="button" @click="registerPlayer" class="btn-primary"
          :disabled="!characterData || newPlayer.availability.length === 0">
          Cadastrar Disponibilidade
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { PartyFinderService } from '../services/partyFinderService.js'

export default {
  name: 'PartyFinder',
  data() {
    return {
      showRegistrationModal: false,
      loadingPlayers: true,
      firebaseConnected: false,
      loading: false,
      characterError: '',
      characterData: null,
      unsubscribeFromFirebase: null,
      loading: false,
      characterError: '',
      characterData: null,
      newPlayer: {
        characterName: '',
        availability: [],
        contactInfo: '',
        notes: ''
      },
      filters: {
        server: '',
        vocation: '',
        timeRange: ''
      },
      availablePeriods: [
        { id: 'morning', label: 'Manhã (06h-12h)', value: 'Manhã' },
        { id: 'afternoon', label: 'Tarde (12h-18h)', value: 'Tarde' },
        { id: 'evening', label: 'Noite (18h-24h)', value: 'Noite' }
      ],
      players: []
    }
  },
  computed: {
    filteredPlayers() {
      let filtered = this.players

      if (this.filters.server) {
        filtered = filtered.filter(player => player.world === this.filters.server)
      }

      if (this.filters.vocation) {
        filtered = filtered.filter(player => player.vocation === this.filters.vocation)
      }

      if (this.filters.timeRange) {
        const timeRanges = {
          morning: 'Manhã',
          afternoon: 'Tarde',
          evening: 'Noite'
        }

        const targetPeriod = timeRanges[this.filters.timeRange]
        filtered = filtered.filter(player =>
          player.availability.includes(targetPeriod)
        )
      }

      return filtered.sort((a, b) => b.registeredAt - a.registeredAt)
    },

    uniqueServers() {
      return [...new Set(this.players.map(player => player.world))].sort()
    }
  },
  async mounted() {
    await this.initializeFirebase()
  },
  beforeUnmount() {
    if (this.unsubscribeFromFirebase) {
      this.unsubscribeFromFirebase()
    }
  },
  methods: {
    async initializeFirebase() {
      try {
        this.loadingPlayers = true
        
        // Set up real-time listener
        this.unsubscribeFromFirebase = PartyFinderService.onPlayersChange((players) => {
          this.players = players
          this.firebaseConnected = true
          this.loadingPlayers = false
        })
        
      } catch (error) {
        console.error('Firebase connection failed, using localStorage fallback:', error)
        this.firebaseConnected = false
        this.loadingPlayers = false
        this.loadPlayersFromStorage() // Fallback to localStorage
      }
    },
    loadPlayersFromStorage() {
      try {
        const savedPlayers = localStorage.getItem('partyFinderPlayers')
        if (savedPlayers) {
          const parsedPlayers = JSON.parse(savedPlayers)
          // Convert registeredAt back to Date objects and filter old entries
          const now = new Date()
          const validPlayers = parsedPlayers
            .map(player => ({
              ...player,
              registeredAt: new Date(player.registeredAt)
            }))
            .filter(player => {
              // Remove players older than 24 hours
              const hoursDiff = (now - player.registeredAt) / (1000 * 60 * 60)
              return hoursDiff < 24
            })
          
          this.players = validPlayers
          // Save cleaned list back to storage
          this.savePlayersToStorage()
        }
      } catch (error) {
        console.error('Error loading players from storage:', error)
        this.players = []
      }
    },

    savePlayersToStorage() {
      try {
        localStorage.setItem('partyFinderPlayers', JSON.stringify(this.players))
      } catch (error) {
        console.error('Error saving players to storage:', error)
      }
    },
    openRegistrationModal() {
      this.showRegistrationModal = true
    },

    closeRegistrationModal() {
      this.showRegistrationModal = false
      this.resetForm()
    },

    toggleRegistrationForm() {
      this.showRegistrationForm = !this.showRegistrationForm
      if (!this.showRegistrationForm) {
        this.resetForm()
      }
    },

    async fetchCharacterData() {
      if (!this.newPlayer.characterName) return

      this.loading = true
      this.characterError = ''
      this.characterData = null

      try {
        const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(this.newPlayer.characterName)}`)
        const data = await response.json()

        if (data.character && data.character.character) {
          this.characterData = {
            name: data.character.character.name,
            level: data.character.character.level,
            vocation: data.character.character.vocation,
            world: data.character.character.world,
            guild: data.character.character.guild
          }
        } else {
          this.characterError = 'Personagem não encontrado ou não existe.'
        }
      } catch (error) {
        this.characterError = 'Erro ao buscar dados do personagem. Tente novamente.'
        console.error('Error fetching character data:', error)
      } finally {
        this.loading = false
      }
    },

    async registerPlayer() {
      if (!this.characterData || this.newPlayer.availability.length === 0) {
        alert('Por favor, busque um personagem válido e selecione ao menos um período de disponibilidade.')
        return
      }

      // Check if character is already registered
      const existingPlayer = this.players.find(p => p.name.toLowerCase() === this.characterData.name.toLowerCase())
      if (existingPlayer) {
        alert('Este personagem já está cadastrado!')
        return
      }

      const player = {
        name: this.characterData.name,
        level: this.characterData.level,
        vocation: this.characterData.vocation,
        world: this.characterData.world,
        guild: this.characterData.guild,
        availability: [...this.newPlayer.availability].sort(),
        contactInfo: this.newPlayer.contactInfo || null,
        notes: this.newPlayer.notes || null
      }

      try {
        this.loading = true
        
        if (this.firebaseConnected) {
          // Use Firebase
          await PartyFinderService.addPlayer(player)
        } else {
          // Fallback to localStorage
          const playerWithId = { 
            id: Date.now(), 
            ...player, 
            registeredAt: new Date() 
          }
          this.players.unshift(playerWithId)
          this.savePlayersToStorage()
          
          const myPlayers = JSON.parse(localStorage.getItem('myRegisteredPlayers') || '[]')
          myPlayers.push(playerWithId.id)
          localStorage.setItem('myRegisteredPlayers', JSON.stringify(myPlayers))
        }
        
        this.resetForm()
        this.showRegistrationModal = false
        alert('Disponibilidade cadastrada com sucesso!')
        
      } catch (error) {
        console.error('Error registering player:', error)
        alert('Erro ao cadastrar. Tente novamente!')
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.newPlayer = {
        characterName: '',
        availability: [],
        contactInfo: '',
        notes: ''
      }
      this.characterData = null
      this.characterError = ''
    },

    contactPlayer(player) {
      alert(`Entrando em contato com ${player.name}!\nContato: ${player.contactInfo}`)
    },

    canRemovePlayer(player) {
      if (this.firebaseConnected) {
        return PartyFinderService.canRemovePlayer(player.id)
      } else {
        // Fallback to localStorage
        const myPlayers = JSON.parse(localStorage.getItem('myRegisteredPlayers') || '[]')
        return myPlayers.includes(player.id)
      }
    },

    async removePlayer(player) {
      if (!confirm(`Remover ${player.name} da lista de disponíveis?`)) {
        return
      }
      
      try {
        if (this.firebaseConnected) {
          // Use Firebase
          await PartyFinderService.removePlayer(player.id)
        } else {
          // Fallback to localStorage
          this.players = this.players.filter(p => p.id !== player.id)
          this.savePlayersToStorage()
          
          const myPlayers = JSON.parse(localStorage.getItem('myRegisteredPlayers') || '[]')
          const updatedMyPlayers = myPlayers.filter(id => id !== player.id)
          localStorage.setItem('myRegisteredPlayers', JSON.stringify(updatedMyPlayers))
        }
        
        alert('Disponibilidade removida!')
        
      } catch (error) {
        console.error('Error removing player:', error)
        alert('Erro ao remover. Tente novamente!')
      }
    },

    formatTime(date) {
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 60) {
        return `${diffMins}min atrás`
      } else {
        const diffHours = Math.floor(diffMins / 60)
        return `${diffHours}h atrás`
      }
    }
  }
}
</script>

<style scoped>
.party-finder {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-primary);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.party-finder-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.registration-section,
.players-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.5rem;
  margin: 0;
}

.section-stats {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.section-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-top: 1rem;
  text-align: center;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--border-color);
  background: var(--bg-tertiary);
  border-radius: 14px 14px 0 0;
}

.modal-header h2 {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.3rem;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  line-height: 1;
}

.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid var(--border-color);
  background: var(--bg-tertiary);
  border-radius: 0 0 14px 14px;
}

.registration-form {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1rem;
  border: 1px solid var(--border-color);
}

.form-row,
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  display: block;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.form-input,
.form-select,
.form-textarea {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex: 1;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.error-text {
  color: var(--accent-red);
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.character-preview {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid var(--accent-gold);
}

.character-preview h4 {
  color: var(--accent-gold);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.character-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-item .icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.schedule-item {
  display: flex;
  align-items: center;
}

.schedule-checkbox {
  margin-right: 0.5rem;
  accent-color: var(--accent-gold);
}

.schedule-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  border-color: var(--accent-gold);
  color: var(--text-primary);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 2px solid #ef4444;
}

.btn-danger:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--text-primary);
  min-width: 150px;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.player-card {
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.player-card:hover {
  border-color: var(--accent-gold);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.player-basic-info h3 {
  color: var(--accent-gold);
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.player-details {
  display: flex;
  gap: 1rem;
}

.level {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.vocation {
  background: rgba(245, 158, 11, 0.2);
  color: var(--accent-gold);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.player-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.online {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  border: 1px solid var(--accent-green);
}

.server-badge {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.guild-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.availability-section {
  margin-bottom: 1rem;
}

.availability-section h4 {
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.availability-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.time-tag {
  background: var(--gradient-primary);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.notes-section {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 3px solid var(--accent-primary);
}

.notes-section p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.player-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.player-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.registered-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .party-finder {
    padding: 1rem;
  }

  .players-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .player-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .input-group {
    flex-direction: column;
  }

  .schedule-grid {
    grid-template-columns: 1fr;
  }
}
</style>