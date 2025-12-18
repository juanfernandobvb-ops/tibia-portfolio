<template>
  <div class="party-finder">
    <div class="page-header">
      <h1 class="page-title">Party Finder</h1>
      <p class="page-subtitle">Cadastre sua disponibilidade e encontre outros jogadores para formar party</p>
    </div>

    <div class="party-finder-content">
      <!-- Player Registration Section -->
      <div class="registration-section-compact">
        <div class="compact-content">
          <div class="compact-text">
            <h3>Cadastrar Disponibilidade</h3>
            <p>Apareça na lista de jogadores disponíveis</p>
          </div>
          <button class="btn-primary-compact" @click="openRegistrationModal">
            ➕ Cadastrar
          </button>
        </div>
      </div>

      <!-- Available Players Section -->
      <div class="players-section-compact">
        <div class="players-header-compact">
          <div class="players-title-section">
            <h2>👥 Jogadores Disponíveis</h2>
            <div class="section-stats-compact">
              <span v-if="loadingPlayers">🔄 Carregando...</span>
              <span v-else-if="firebaseConnected">🟢 {{ filteredPlayers.length }} online</span>
              <span v-else>🔴 {{ filteredPlayers.length }} offline</span>
            </div>
          </div>
        </div>
        
        <div class="party-search-compact">
          <div class="search-inline">
            <div class="search-input-group">
              <label for="myLevelInput">🔍 Buscar por Level:</label>
              <input 
                type="number" 
                id="myLevelInput"
                v-model.number="partySearch.myLevel" 
                placeholder="Ex: 130"
                class="level-input-compact"
                min="1"
                max="2000"
              />
            </div>
            
            <div class="vocations-inline">
              <span class="voc-label">Vocações:</span>
              <div class="vocation-checks-inline">
                <label class="voc-check">
                  <input type="checkbox" value="Elite Knight" v-model="partySearch.desiredVocations" />
                  <span>EK</span>
                </label>
                <label class="voc-check">
                  <input type="checkbox" value="Royal Paladin" v-model="partySearch.desiredVocations" />
                  <span>RP</span>
                </label>
                <label class="voc-check">
                  <input type="checkbox" value="Elder Druid" v-model="partySearch.desiredVocations" />
                  <span>ED</span>
                </label>
                <label class="voc-check">
                  <input type="checkbox" value="Master Sorcerer" v-model="partySearch.desiredVocations" />
                  <span>MS</span>
                </label>
                <label class="voc-check">
                  <input type="checkbox" value="Exalted Monk" v-model="partySearch.desiredVocations" />
                  <span>EM</span>
                </label>
              </div>
            </div>
            
            <div class="search-buttons-inline">
              <button 
                @click="applyPartySearch" 
                class="btn-search-compact" 
                :disabled="!partySearch.myLevel"
              >
                Buscar
              </button>
              <button 
                @click="clearPartySearch" 
                class="btn-clear-compact"
                v-if="isPartySearchActive"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div v-if="partySearch.applied && levelRange" class="search-results-compact">
            <span class="compatibility-text">Compatível: Level {{ levelRange.min }}-{{ levelRange.max }}</span>
            <span class="found-count-compact">{{ compatiblePlayersCount }} encontrado(s)</span>
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
              <option value="Exalted Monk">Exalted Monk</option>
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

        <div class="players-list" :class="{ 'search-active': isPartySearchActive }">
          <!-- Desktop Header -->
          <div class="list-header desktop-only">
            <div class="col-name">Personagem</div>
            <div class="col-level">Level</div>
            <div class="col-vocation">Vocação</div>
            <div class="col-server">Servidor</div>
            <div class="col-availability">Disponibilidade</div>
            <div class="col-actions">Ações</div>
          </div>
          
          <!-- Desktop Rows -->
          <div v-for="player in filteredPlayers" :key="player.id" class="player-row desktop-only">
            <div class="col-name">
              <div class="player-name">
                <span class="name">{{ player.name }}</span>
              </div>
            </div>
            <div class="col-level">
              <span class="level-badge" :class="{ 'compatible': isLevelCompatible(player.level) }">
                {{ player.level }}
                <span v-if="isLevelCompatible(player.level)" class="compatible-icon">✓</span>
              </span>
            </div>
            <div class="col-vocation">
              <span class="vocation-badge">{{ player.vocation }}</span>
            </div>
            <div class="col-server">
              <span class="server-badge">{{ player.world }}</span>
            </div>
            <div class="col-availability">
              <div class="availability-compact">
                <span v-for="period in player.availability" :key="period" class="period-tag">
                  {{ period }}
                </span>
              </div>
            </div>
            <div class="col-actions">
              <button class="btn-view" @click="openPlayerModal(player)">
                👁️ Ver
              </button>
              <button 
                v-if="canRemovePlayer(player)" 
                class="btn-remove" 
                @click="removePlayer(player)"
                title="Remover meu cadastro"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Mobile Cards -->
          <div v-for="player in filteredPlayers" :key="'mobile-' + player.id" class="player-card-mobile mobile-only">
            <div class="mobile-simple-layout">
              <div class="mobile-player-main">
                <h4 class="mobile-name">{{ player.name }}</h4>
                <span class="mobile-level" :class="{ 'compatible': isLevelCompatible(player.level) }">
                  Level {{ player.level }}
                  <span v-if="isLevelCompatible(player.level)" class="compatible-icon">✓</span>
                </span>
              </div>
              <div class="mobile-action">
                <button class="btn-view-simple" @click="openPlayerModal(player)">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPlayers.length === 0" class="empty-state-list">
            <span class="empty-icon">👥</span>
            <div class="empty-text">
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
                <input 
                  type="text" 
                  id="characterName" 
                  v-model="newPlayer.characterName" 
                  placeholder="Ex: Dark Wizard"
                  class="form-input"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  @click="fetchCharacterData" 
                  class="btn-secondary"
                  :disabled="!newPlayer.characterName || loading"
                >
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
                <input 
                  type="checkbox" 
                  :id="'period-' + period.id" 
                  :value="period.value" 
                  v-model="newPlayer.availability"
                  class="schedule-checkbox"
                />
                <label :for="'period-' + period.id" class="schedule-label">{{ period.label }}</label>
              </div>
            </div>
          </div>

          <div v-if="characterData" class="form-group">
            <label for="contactInfo">Contato (Discord/WhatsApp) - Opcional</label>
            <input 
              type="text" 
              id="contactInfo" 
              v-model="newPlayer.contactInfo" 
              placeholder="Ex: Discord#1234, WhatsApp, in-game message..."
              class="form-input"
            />
          </div>

          <div v-if="characterData" class="form-group">
            <label for="notes">Observações (Opcional)</label>
            <textarea 
              id="notes" 
              v-model="newPlayer.notes" 
              placeholder="Especifique horários específicos (ex: 14h às 16h), tipo de hunt preferida, level mínimo, etc..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button type="button" @click="closeRegistrationModal" class="btn-secondary">Cancelar</button>
          <button 
            type="button" 
            @click="registerPlayer" 
            class="btn-primary" 
            :disabled="!characterData || newPlayer.availability.length === 0"
          >
            Cadastrar Disponibilidade
          </button>
        </div>
      </div>
    </div>

    <!-- Player Details Modal -->
    <div v-if="showPlayerModal && selectedPlayer" class="modal-overlay" @click="closePlayerModal">
      <div class="modal-content player-modal" @click.stop>
        <div class="modal-header">
          <h2>Detalhes do Jogador</h2>
          <button class="modal-close" @click="closePlayerModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="player-details-complete">
            <div class="player-main-info">
              <h3 class="player-name-large">{{ selectedPlayer.name }}</h3>
              <div class="player-stats">
                <div class="stat-item">
                  <span class="icon">📊</span>
                  <span>Level {{ selectedPlayer.level }}</span>
                </div>
                <div class="stat-item">
                  <span class="icon">⚔️</span>
                  <span>{{ selectedPlayer.vocation }}</span>
                </div>
                <div class="stat-item">
                  <span class="icon">🌍</span>
                  <span>{{ selectedPlayer.world }}</span>
                </div>
                <div v-if="selectedPlayer.guild" class="stat-item">
                  <span class="icon">🏰</span>
                  <span>{{ selectedPlayer.guild.name }} ({{ selectedPlayer.guild.rank }})</span>
                </div>
              </div>
            </div>

            <div class="availability-section-modal">
              <h4>Disponibilidade de Horário:</h4>
              <div class="availability-tags-modal">
                <span v-for="period in selectedPlayer.availability" :key="period" class="time-tag-modal">
                  {{ period }}
                </span>
              </div>
            </div>

            <div v-if="selectedPlayer.contactInfo" class="contact-section">
              <h4>Contato:</h4>
              <div class="contact-info-modal">
                <span class="icon">💬</span>
                <span class="contact-text">{{ selectedPlayer.contactInfo }}</span>
              </div>
            </div>

            <div v-if="selectedPlayer.notes" class="notes-section-modal">
              <h4>Observações:</h4>
              <p class="notes-text">{{ selectedPlayer.notes }}</p>
            </div>

            <div class="registration-info">
              <span class="registered-time-modal">
                🕐 Cadastrado {{ formatTime(selectedPlayer.registeredAt) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            v-if="canRemovePlayer(selectedPlayer)" 
            class="btn-danger" 
            @click="removePlayerFromModal"
          >
            Remover Meu Cadastro
          </button>
          <button class="btn-secondary" @click="closePlayerModal">Fechar</button>
        </div>
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
      showPlayerModal: false,
      selectedPlayer: null,
      loadingPlayers: true,
      firebaseConnected: false,
      loading: false,
      characterError: '',
      characterData: null,
      unsubscribeFromFirebase: null,
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
      partySearch: {
        myLevel: null,
        desiredVocations: [],
        applied: false
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

      // Filter by party search (level compatibility and desired vocations)
      if (this.partySearch.applied && this.levelRange) {
        // Level compatibility filter
        filtered = filtered.filter(player => 
          player.level >= this.levelRange.min && player.level <= this.levelRange.max
        )
        
        // Desired vocations filter
        if (this.partySearch.desiredVocations.length > 0) {
          filtered = filtered.filter(player => 
            this.partySearch.desiredVocations.includes(player.vocation)
          )
        }
      }

      // Apply other filters
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
    },

    levelRange() {
      if (!this.partySearch.applied || !this.partySearch.myLevel || this.partySearch.myLevel < 1) return null
      
      const myLevel = this.partySearch.myLevel
      const minLevel = Math.max(1, Math.ceil(myLevel * (2/3)))
      const maxLevel = Math.floor(myLevel / (2/3))
      
      return {
        min: minLevel,
        max: maxLevel
      }
    },

    compatiblePlayersCount() {
      return this.filteredPlayers.length
    },

    isPartySearchActive() {
      return this.partySearch.applied
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

    openPlayerModal(player) {
      this.selectedPlayer = player
      this.showPlayerModal = true
    },

    closePlayerModal() {
      this.showPlayerModal = false
      this.selectedPlayer = null
    },

    async removePlayerFromModal() {
      if (this.selectedPlayer) {
        await this.removePlayer(this.selectedPlayer)
        this.closePlayerModal()
      }
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
    },

    clearLevelFilter() {
      this.filters.myLevel = null
    },

    applyPartySearch() {
      if (!this.partySearch.myLevel) return
      this.partySearch.applied = true
    },

    clearPartySearch() {
      this.partySearch = {
        myLevel: null,
        desiredVocations: [],
        applied: false
      }
    },

    isLevelCompatible(playerLevel) {
      if (!this.partySearch.applied || !this.levelRange) return false
      return playerLevel >= this.levelRange.min && playerLevel <= this.levelRange.max
    },

    getVocationShort(vocation) {
      const shorts = {
        'Elite Knight': 'EK',
        'Royal Paladin': 'RP',
        'Elder Druid': 'ED',
        'Master Sorcerer': 'MS',
        'Exalted Monk': 'EM'
      }
      return shorts[vocation] || vocation
    },

    getPeriodShort(period) {
      const shorts = {
        'Manhã': 'M',
        'Tarde': 'T', 
        'Noite': 'N'
      }
      return shorts[period] || period
    },

    getVocationShort(vocation) {
      const shorts = {
        'Elite Knight': 'EK',
        'Royal Paladin': 'RP',
        'Elder Druid': 'ED',
        'Master Sorcerer': 'MS',
        'Exalted Monk': 'EM'
      }
      return shorts[vocation] || vocation
    },

    getPeriodShort(period) {
      const shorts = {
        'Manhã': 'M',
        'Tarde': 'T', 
        'Noite': 'N'
      }
      return shorts[period] || period
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

.registration-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.registration-section-compact {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 2px solid var(--accent-gold);
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
}

.compact-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.compact-text h3 {
  color: var(--accent-gold);
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
}

.compact-text p {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 0;
}

.btn-primary-compact {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  white-space: nowrap;
}

.btn-primary-compact:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

@media (max-width: 768px) {
  .compact-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .btn-primary-compact {
    align-self: stretch;
    text-align: center;
  }
}

.players-section {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  min-height: 400px;
}

.players-section-compact {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

.players-header-compact {
  margin-bottom: 1.5rem;
}

.players-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.players-title-section h2 {
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.3rem;
  margin: 0;
}

.section-stats-compact {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}

/* Compact Search Styles */
.party-search-compact {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid #3b82f6;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.search-inline {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.search-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input-group label {
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
}

.level-input-compact {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.4rem 0.7rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  width: 80px;
}

.vocations-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.voc-label {
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.85rem;
  white-space: nowrap;
}

.vocation-checks-inline {
  display: flex;
  gap: 0.75rem;
}

.voc-check {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.voc-check input {
  accent-color: #3b82f6;
}

.voc-check span {
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 500;
}

.search-buttons-inline {
  display: flex;
  gap: 0.5rem;
}

.btn-search-compact {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-search-compact:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-search-compact:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-clear-compact {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-clear-compact:hover {
  background: #ef4444;
  color: white;
}

.search-results-compact {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compatibility-text {
  color: var(--accent-green);
  font-weight: 500;
  font-size: 0.85rem;
}

.found-count-compact {
  color: var(--accent-green);
  font-weight: 600;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .search-inline {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .search-input-group,
  .vocations-inline {
    justify-content: space-between;
  }
  
  .search-buttons-inline {
    justify-content: center;
  }
  
  .search-results-compact {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
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
.btn-secondary,
.btn-danger {
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

/* Compatibility Filter Styles */
.party-search-section {
  background: rgba(59, 130, 246, 0.05);
  border: 2px solid #3b82f6;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.search-title {
  color: #3b82f6;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-row {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .search-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .vocation-checkboxes {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .search-actions {
    flex-direction: column;
    align-items: center;
  }
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-field label {
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.9rem;
}

.level-input {
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 120px;
}

.level-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.vocations-field {
  flex: 1;
}

.vocation-checkboxes {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.vocation-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.vocation-checkbox:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.vocation-checkbox input[type="checkbox"] {
  accent-color: #3b82f6;
}

.vocation-checkbox span {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.85rem;
}

.search-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-search {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-search:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-search:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-clear-search {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 2px solid #ef4444;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-clear-search:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

.search-results-info {
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--accent-green);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compatibility-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.my-level,
.level-range,
.desired-vocations {
  color: var(--accent-green);
  font-weight: 600;
  font-size: 0.9rem;
}

.results-count {
  text-align: right;
}

.found-count {
  color: var(--accent-green);
  font-weight: 700;
  font-size: 1.1rem;
}

.level-badge.compatible {
  background: rgba(16, 185, 129, 0.3);
  border: 2px solid var(--accent-green);
  position: relative;
}

.compatible-icon {
  margin-left: 0.25rem;
  font-weight: bold;
  color: var(--accent-green);
}

/* Players List Styles */
.players-list {
  background: var(--bg-tertiary);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  overflow: visible;
  min-height: 200px;
}

.players-list.search-active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Desktop Table Styles */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.2fr 1.5fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 2px solid var(--border-color);
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.player-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1.2fr 1.5fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  align-items: center;
}

.player-row:hover {
  background: rgba(245, 158, 11, 0.05);
}

.player-row:last-child {
  border-bottom: none;
}

/* Mobile Card Styles - Simplified */
.player-card-mobile {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;
}

.player-card-mobile:hover {
  border-color: var(--accent-gold);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.mobile-simple-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.mobile-player-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-name {
  color: var(--accent-gold);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.mobile-level {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  border: 1px solid transparent;
}

.mobile-level.compatible {
  background: rgba(16, 185, 129, 0.3);
  border-color: var(--accent-green);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.mobile-action {
  flex-shrink: 0;
}

.btn-view-simple {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-view-simple:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.col-name {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.player-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.name {
  color: var(--accent-gold);
  font-weight: 600;
  font-size: 0.95rem;
}

.guild {
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-style: italic;
}

.level-badge {
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-green);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.vocation-badge {
  background: rgba(245, 158, 11, 0.2);
  color: var(--accent-gold);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.server-badge {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid var(--border-color);
}

.availability-compact {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.period-tag {
  background: var(--gradient-primary);
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-view {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view:hover {
  background: #3b82f6;
  color: white;
  transform: translateY(-1px);
}

.btn-remove {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

.empty-state-list {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.empty-state-list .empty-icon {
  font-size: 3rem;
}

.empty-text h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.empty-text p {
  color: var(--text-secondary);
  margin: 0;
}

/* Player Details Modal */
.player-modal {
  max-width: 600px;
}

.player-details-complete {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.player-main-info {
  text-align: center;
}

.player-name-large {
  color: var(--accent-gold);
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
}

.player-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.stat-item .icon {
  font-size: 1.2rem;
}

.availability-section-modal h4,
.contact-section h4,
.notes-section-modal h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.availability-tags-modal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.time-tag-modal {
  background: var(--gradient-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.contact-info-modal {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.contact-text {
  font-family: 'Courier New', monospace;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: var(--accent-gold);
  font-weight: 500;
}

.notes-text {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--accent-gold);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.registration-info {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.registered-time-modal {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .party-finder {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .list-header,
  .player-row {
    grid-template-columns: 1.8fr 0.8fr 1.2fr 1fr 1.3fr 0.9fr;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 768px) {
  .party-finder {
    padding: 1rem 0.5rem;
  }
  
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }
  
  .party-finder-content {
    gap: 2rem;
  }
  
  .players-section-compact {
    padding: 1rem;
  }
  
  .players-list {
    border-radius: 8px;
  }
  
  /* Switch to mobile cards */
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  /* Modal responsividade */
  .modal-content {
    max-width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem 1rem;
  }
  
  .player-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .character-info {
    grid-template-columns: 1fr;
  }
  
  .schedule-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .party-finder {
    padding: 0.75rem 0.25rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
    padding: 0 0.5rem;
  }
  
  .registration-section-compact,
  .players-section-compact {
    margin: 0 0.25rem;
    padding: 0.75rem;
  }
  
  .players-list {
    border-radius: 6px;
  }
  
  .player-card-mobile {
    margin: 0.25rem;
    padding: 0.75rem;
  }
  
  .mobile-simple-layout {
    gap: 0.75rem;
  }
  
  .mobile-name {
    font-size: 0.9rem;
  }
  
  .mobile-level {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
  
  .btn-view-simple {
    padding: 0.5rem 0.9rem;
    font-size: 0.8rem;
  }
  
  .modal-content {
    max-width: 98%;
    max-height: 95vh;
    margin: 0.5rem;
  }
  
  .modal-header h2 {
    font-size: 1.1rem;
  }
  
  .player-name-large {
    font-size: 1.4rem;
  }
}
</style>