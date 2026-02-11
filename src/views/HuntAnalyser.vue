<template>
  <div class="huntanalyser-page">
    <div class="huntanalyser-header-fixed">
      <!-- Exemplo de dados exibidos, substitua conforme necessário -->
      <div class="header-content">
        <span v-if="selectedCharacter"><strong>Personagem:</strong> {{ selectedCharacter }}</span>
        <span><strong>Total XP:</strong> {{ totalXp.toLocaleString() }}</span>
        <span><strong>Total Balance:</strong> {{ totalBalance.toLocaleString() }}</span>
        <span v-if="activeTab === 'solo' && sessionsByDaySolo && Object.keys(sessionsByDaySolo).length">
          <strong>Total Dias Solo:</strong> {{ Object.keys(sessionsByDaySolo).length }}
        </span>
        <span v-if="activeTab === 'party' && sessionsByDayParty && Object.keys(sessionsByDayParty).length">
          <strong>Total Dias Party:</strong> {{ Object.keys(sessionsByDayParty).length }}
        </span>
      </div>
    </div>
    <h1>Hunt Analyser</h1>

    <CenterModal v-if="showSessionModal" @close="showSessionModal = false" :style="{ zIndex: showDayModal ? 10001 : 9999 }">
      <h2 style="margin-bottom: 1.2rem;">Input Completo</h2>
      <pre style="max-height: 60vh; overflow:auto;">{{ sessionModalContent }}</pre>
    </CenterModal>

    <!-- Modal de Itens Entregáveis -->
    <CenterModal v-if="showItemsModal" @close="closeItemsModal">
      <div class="items-modal-content">
        <h2 style="margin-bottom: 1.5rem; color: var(--accent-gold);">Itens Entregáveis Encontrados</h2>
        
        <div v-if="foundItems.length === 0" class="no-items-found">
          <p>Nenhum item entregável foi encontrado nas sessões analisadas.</p>
        </div>
        
        <div v-else>
          <div class="items-summary">
            <p><strong>{{ foundItems.length }}</strong> itens entregáveis encontrados em <strong>{{ analyzedSessions }}</strong> sessões</p>
          </div>
          
          <div class="found-items-grid">
            <div v-for="item in foundItems" :key="item.name" class="found-item-simple">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-quantity">{{ item.totalQuantity.toLocaleString() }}x</div>
            </div>
          </div>
        </div>
      </div>
    </CenterModal>
    
    <!-- Modal de Sessões do Dia -->
    <CenterModal v-if="showDayModal" @close="closeDayModal">
      <div class="day-modal-content">
        <h2 style="margin-bottom: 1.2rem;">Sessões de {{ formatDateBR(selectedDayData?.day) }}</h2>
        
        <!-- Sessões Solo -->
        <div v-if="selectedDayData?.type === 'solo'" class="day-sessions">
          <div v-for="session in selectedDayData.sessions" :key="session.id" class="modal-session-card">
            <div class="modal-session-stats">
              <div class="modal-stats-info">
                <div class="modal-stat">
                  <span class="stat-label">Exp:</span>
                  <span class="stat-value">{{ session.xpGain?.toLocaleString() }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Balance:</span>
                  <span class="stat-value">{{ session.balance?.toLocaleString() }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Duração:</span>
                  <span class="stat-value">{{ session.duration }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Horário:</span>
                  <span class="stat-value">{{ session.startTime }} - {{ session.endTime }}</span>
                </div>
              </div>
              <div class="modal-session-actions">
                <button class="delete-btn" @click="deleteSession(session)">Excluir</button>
                <button class="expand-btn" @click="openSessionModal(session.rawInput)">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sessões Party -->
        <div v-if="selectedDayData?.type === 'party'" class="day-sessions">
          <div v-for="session in selectedDayData.sessions" :key="session.id" class="modal-session-card party">
            <div class="modal-session-header">
              <span><strong>{{ session.startTime }}</strong> - <strong>{{ session.endTime }}</strong></span>
              <span><strong>Duração:</strong> {{ session.duration }}</span>
            </div>
            <div class="modal-session-stats">
              <div class="modal-stats-grid">
                <div class="modal-stat">
                  <span class="stat-label">Loot:</span>
                  <span class="stat-value">{{ session.loot?.toLocaleString() }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Supplies:</span>
                  <span class="stat-value">{{ session.supplies?.toLocaleString() }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Balance:</span>
                  <span class="stat-value">{{ session.balance?.toLocaleString() }}</span>
                </div>
                <div class="modal-stat">
                  <span class="stat-label">Tipo:</span>
                  <span class="stat-value">{{ session.lootType }}</span>
                </div>
              </div>
              <div class="modal-session-actions">
                <button class="delete-btn" @click="deleteSession(session)">Excluir</button>
                <button class="expand-btn" @click="openSessionModal(session.rawInput)">
                  Ver Detalhes
                </button>
              </div>
            </div>
            
            <!-- Players Table -->
            <div class="party-players-modal" v-if="session.players?.length">
              <h4>Participantes</h4>
              <table class="players-table">
                <thead>
                  <tr>
                    <th>Personagem</th>
                    <th>Loot</th>
                    <th>Supplies</th>
                    <th>Balance</th>
                    <th>Damage</th>
                    <th>Healing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in session.players" :key="player.name">
                    <td>{{ player.name }}{{ player.isLeader ? ' (L)' : '' }}</td>
                    <td>{{ player.loot.toLocaleString() }}</td>
                    <td>{{ player.supplies.toLocaleString() }}</td>
                    <td>{{ player.balance.toLocaleString() }}</td>
                    <td>{{ player.damage.toLocaleString() }}</td>
                    <td>{{ player.healing.toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CenterModal>

    <!-- Tabs -->
    <div v-if="user" class="tabs-container">
      <button :class="['tab-btn', { active: activeTab === 'solo' }]" @click="activeTab = 'solo'">Hunt Solo</button>
      <button :class="['tab-btn', { active: activeTab === 'party' }]" @click="activeTab = 'party'">Hunt Party</button>
      <button class="search-items-btn" @click="searchDeliverableItems">🔍 Buscar Entregáveis</button>
    </div>

    <!-- Filtro por Mês -->
    <div v-if="user && availableMonths.length > 0" class="month-filter-container">
      <label>Filtrar por Mês:</label>
      <select v-model="selectedMonth" class="month-filter-select">
        <option value="">Todos os Meses</option>
        <option v-for="month in availableMonths" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>

    <!-- Hunt Solo Tab -->
    <div v-if="activeTab === 'solo'" class="tab-content">
      <div v-if="!user" class="login-required-msg">
        <p>Faça login para acessar o Hunt Analyser.</p>
      </div>
      <template v-else>
        <div class="character-select-box">
          <label>Personagem:</label>
          <select v-model="selectedCharacter">
            <option v-for="char in characters" :key="char" :value="char">{{ char }}</option>
          </select>
          <input v-model="newCharacterName" placeholder="Novo personagem" class="char-input" />
          <button @click="addCharacter" class="add-char-btn">Adicionar</button>
          <button v-if="selectedCharacter" @click="removeCharacter(selectedCharacter)"
            class="remove-char-btn">Remover</button>
        </div>
        <div v-if="selectedCharacter">
          <!-- Input e sessões solo para o personagem selecionado -->
          <div class="input-section">
            <button @click="showSoloModal = true">Adicionar Nova Sessão</button>
          </div>
          <div v-if="showSoloModal" class="modal-overlay">
            <div class="modal-box">
              <h2 style="margin-bottom: 1.2rem;">Adicionar Nova Sessão Solo</h2>
              <textarea v-model="sessionInput" placeholder="Cole aqui o texto do Hunt Analyser"
                style="margin-bottom: 1.2rem; width: 100%;"></textarea>
              <div style="display: flex; gap: 0.7rem; width: 100%;">
                <button @click="addSessionSolo">Salvar Sessão</button>
                <button @click="showSoloModal = false" class="close-modal-btn">Cancelar</button>
              </div>
              <div v-if="inputError" class="input-error">{{ inputError }}</div>
            </div>
          </div>
          <div class="sessions-by-day">
            <h2>Sessões de {{ selectedCharacter }}</h2>
            <div class="days-grid">
              <div 
                v-for="(sessions, day) in sessionsByDaySolo" 
                :key="day" 
                class="day-card"
                @click="openDayModal(day, 'solo')"
              >
                <div class="day-card-header">
                  <h3>{{ formatDateBR(day) }}</h3>
                  <span class="session-count">{{ dayTotalsSolo[day]?.count || 0 }} sessões</span>
                </div>
                <div class="day-card-stats">
                  <div class="stat-item">
                    <span class="stat-label">XP</span>
                    <span class="stat-value">{{ (dayTotalsSolo[day]?.xp || 0).toLocaleString() }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Balance</span>
                    <span class="stat-value">{{ (dayTotalsSolo[day]?.balance || 0).toLocaleString() }}</span>
                  </div>
                  <div class="stat-item" v-if="dayTotalsSolo[day]?.duration">
                    <span class="stat-label">Tempo</span>
                    <span class="stat-value">{{ formatMinutes(dayTotalsSolo[day].duration) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Hunt Party Tab -->
    <div v-if="activeTab === 'party'" class="tab-content">
      <div v-if="!user" class="login-required-msg">
        <p>Faça login para acessar o Hunt Analyser.</p>
      </div>
      <template v-else>
        <div class="input-section">
          <h2>Adicionar Nova Sessão Party</h2>
          <textarea v-model="sessionInputParty" placeholder="Cole aqui o texto do Hunt Analyser"></textarea>
          <button @click="addSessionParty">Adicionar Sessão</button>
          <div v-if="inputErrorParty" class="input-error">{{ inputErrorParty }}</div>
        </div>
        <div class="sessions-by-day">
          <h2>Sessões Party</h2>
          <div class="days-grid">
            <div 
              v-for="(sessions, day) in sessionsByDayParty" 
              :key="day" 
              class="day-card party-card"
              @click="openDayModal(day, 'party')"
            >
              <div class="day-card-header">
                <h3>{{ formatDateBR(day) }}</h3>
                <span class="session-count">{{ dayTotalsParty[day]?.count || 0 }} sessões</span>
              </div>
              <div class="day-card-stats">
                <div class="stat-item">
                  <span class="stat-label">Loot</span>
                  <span class="stat-value">{{ (dayTotalsParty[day]?.loot || 0).toLocaleString() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Balance</span>
                  <span class="stat-value">{{ (dayTotalsParty[day]?.balance || 0).toLocaleString() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Supplies</span>
                  <span class="stat-value">{{ (dayTotalsParty[day]?.supplies || 0).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { auth, googleProvider, db } from '../services/firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import CenterModal from '../components/CenterModal.vue'
import itemsData from '../data/items.json'

function parseSession(input) {
  // Solo parser (mantido para sessões solo)
  // ...existing code...
  const get = (regex, def = '') => {
    const m = input.match(regex);
    return m ? m[1].replace(/,/g, '').replace(/\s/g, '') : def;
  };
  const getNum = (regex, def = 0) => {
    const m = input.match(regex);
    return m ? Number(m[1].replace(/,/g, '').replace(/\s/g, '')) : def;
  };
  const dateMatch = input.match(/From (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2}) to (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';
  const startTime = dateMatch ? dateMatch[2] : '';
  const endTime = dateMatch ? dateMatch[4] : '';
  const duration = get(/Session: ([\d:]+h)/);
  const rawXpGain = getNum(/^Raw XP Gain: ([\d,]+)/m);
  const xpGain = getNum(/^XP Gain: ([\d,]+)/m);
  const loot = getNum(/Loot: ([\d,]+)/);
  const supplies = getNum(/Supplies: ([\d,]+)/);
  const balance = getNum(/Balance: ([\d,]+)/);
  const damage = getNum(/Damage: ([\d,]+)/);
  const healing = getNum(/Healing: ([\d,]+)/);
  // ...existing code...
  return {
    id: Date.now() + Math.random(),
    date,
    startTime,
    endTime,
    duration,
    xpGain,
    rawXpGain,
    loot,
    supplies,
    balance,
    damage,
    healing
  };
}

function parsePartySession(input) {
  // Extrai dados gerais
  const dateMatch = input.match(/From (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2}) to (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';
  const startTime = dateMatch ? dateMatch[2] : '';
  const endTime = dateMatch ? dateMatch[4] : '';
  const durationMatch = input.match(/Session: ([\d:]+h)/);
  const duration = durationMatch ? durationMatch[1] : '';
  const lootTypeMatch = input.match(/Loot Type: (.+)/);
  const lootType = lootTypeMatch ? lootTypeMatch[1].trim() : '';
  const lootMatch = input.match(/Loot: ([\d,]+)/);
  const loot = lootMatch ? Number(lootMatch[1].replace(/,/g, '')) : 0;
  const suppliesMatch = input.match(/Supplies: ([\d,]+)/);
  const supplies = suppliesMatch ? Number(suppliesMatch[1].replace(/,/g, '')) : 0;
  const balanceMatch = input.match(/Balance: ([\d,]+)/);
  const balance = balanceMatch ? Number(balanceMatch[1].replace(/,/g, '')) : 0;

  // Extrai blocos de personagens
  const playerBlocks = [];
  const playerRegex = /([\w\s]+)\s*\((Leader)?\)\n([\s\S]*?)(?=\n[\w\s]+\s*\(|$)/g;
  let match;
  while ((match = playerRegex.exec(input)) !== null) {
    const name = match[1].trim();
    const isLeader = !!match[2];
    const block = match[3];
    const loot = (block.match(/Loot: ([\d,]+)/) || [])[1];
    const supplies = (block.match(/Supplies: ([\d,]+)/) || [])[1];
    const balance = (block.match(/Balance: ([\d,]+)/) || [])[1];
    const damage = (block.match(/Damage: ([\d,]+)/) || [])[1];
    const healing = (block.match(/Healing: ([\d,]+)/) || [])[1];
    playerBlocks.push({
      name,
      isLeader,
      loot: loot ? Number(loot.replace(/,/g, '')) : 0,
      supplies: supplies ? Number(supplies.replace(/,/g, '')) : 0,
      balance: balance ? Number(balance.replace(/,/g, '')) : 0,
      damage: damage ? Number(damage.replace(/,/g, '')) : 0,
      healing: healing ? Number(healing.replace(/,/g, '')) : 0
    });
  }

  return {
    id: Date.now() + Math.random(),
    date,
    startTime,
    endTime,
    duration,
    lootType,
    loot,
    supplies,
    balance,
    players: playerBlocks
  };
}

const COLLECTION_NAME = 'hunt-analyser-sessions'

export default {
  name: 'HuntAnalyser',
  components: {
    CenterModal,
  },
  data() {
    return {
      user: null,
      activeTab: 'solo',
      characters: [],
      selectedCharacter: '',
      newCharacterName: '',
      selectedMonth: '',
      sessionInput: '',
      sessionInputParty: '',
      inputError: '',
      inputErrorParty: '',
      allSessions: [],
      expandedSession: null,
      showSoloModal: false,
      showSessionModal: false,
      sessionModalContent: '',
      expandedDays: {}, // Controla quais dias estão expandidos
      showDayModal: false, // Modal para sessões de um dia específico
      selectedDayData: null, // Dados do dia selecionado para o modal
      showItemsModal: false, // Modal de itens entregáveis
      foundItems: [], // Lista de itens entregáveis encontrados
      analyzedSessions: 0, // Número de sessões analisadas
    };
  },
  computed: {
    availableMonths() {
      const months = new Set()
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ]
      
      this.allSessions.forEach(session => {
        if (session.date) {
          const date = new Date(session.date + 'T00:00:00')
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
          months.add(JSON.stringify({ value: monthKey, label: monthLabel }))
        }
      })
      
      return Array.from(months)
        .map(m => JSON.parse(m))
        .sort((a, b) => a.value.localeCompare(b.value))
    },
    sessionsByDaySolo() {
      // Agrupa sessões solo por dia para o personagem selecionado
      const grouped = {}
      let filteredSessions = this.allSessions.filter(s => s.type === 'solo' && s.characterName === this.selectedCharacter)
      
      // Filtrar por mês se selecionado
      if (this.selectedMonth) {
        filteredSessions = filteredSessions.filter(s => {
          if (!s.date) return false
          const date = new Date(s.date + 'T00:00:00')
          const sessionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          return sessionMonth === this.selectedMonth
        })
      }
      
      filteredSessions.forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = []
        grouped[s.date].push(s)
      })
      return grouped
    },
    sessionsByDayParty() {
      // Agrupa sessões party por dia
      const grouped = {}
      let filteredSessions = this.allSessions.filter(s => s.type === 'party')
      
      // Filtrar por mês se selecionado
      if (this.selectedMonth) {
        filteredSessions = filteredSessions.filter(s => {
          if (!s.date) return false
          const date = new Date(s.date + 'T00:00:00')
          const sessionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          return sessionMonth === this.selectedMonth
        })
      }
      
      filteredSessions.forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = []
        grouped[s.date].push(s)
      })
      return grouped
    },
    totalXp() {
      // Soma XP apenas das sessões do personagem selecionado, filtrado por mês se aplicável
      let total = 0;
      for (const s of this.allSessions) {
        if (s.type === 'solo' && s.characterName === this.selectedCharacter && typeof s.xpGain === 'number') {
          // Filtrar por mês se selecionado
          if (this.selectedMonth && s.date) {
            const date = new Date(s.date + 'T00:00:00')
            const sessionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (sessionMonth !== this.selectedMonth) continue
          }
          total += s.xpGain;
        }
      }
      return total;
    },
    totalBalance() {
      // Soma Balance apenas das sessões do personagem selecionado, filtrado por mês se aplicável
      let total = 0;
      for (const s of this.allSessions) {
        if (s.type === 'solo' && s.characterName === this.selectedCharacter && typeof s.balance === 'number') {
          // Filtrar por mês se selecionado
          if (this.selectedMonth && s.date) {
            const date = new Date(s.date + 'T00:00:00')
            const sessionMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (sessionMonth !== this.selectedMonth) continue
          }
          total += s.balance;
        }
      }
      return total;
    },
    dayTotalsSolo() {
      // Calcula totais por dia para sessões solo
      const totals = {};
      Object.keys(this.sessionsByDaySolo).forEach(day => {
        const sessions = this.sessionsByDaySolo[day];
        totals[day] = {
          count: sessions.length,
          xp: sessions.reduce((sum, s) => sum + (s.xpGain || 0), 0),
          balance: sessions.reduce((sum, s) => sum + (s.balance || 0), 0),
          duration: sessions.reduce((sum, s) => {
            const match = s.duration?.match(/(\d+):(\d+):(\d+)h/);
            if (match) {
              return sum + (parseInt(match[1]) * 60 + parseInt(match[2]));
            }
            return sum;
          }, 0)
        };
      });
      return totals;
    },
    dayTotalsParty() {
      // Calcula totais por dia para sessões party
      const totals = {};
      Object.keys(this.sessionsByDayParty).forEach(day => {
        const sessions = this.sessionsByDayParty[day];
        totals[day] = {
          count: sessions.length,
          loot: sessions.reduce((sum, s) => sum + (s.loot || 0), 0),
          balance: sessions.reduce((sum, s) => sum + (s.balance || 0), 0),
          supplies: sessions.reduce((sum, s) => sum + (s.supplies || 0), 0)
        };
      });
      return totals;
    }
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user
      if (user) {
        this.fetchSessions()
        this.loadCharacters()
      } else {
        this.allSessions = []
        this.characters = []
        this.selectedCharacter = ''
      }
    })
  },
  methods: {
    addCharacter() {
      const name = this.newCharacterName.trim()
      if (name && !this.characters.includes(name)) {
        this.characters.push(name)
        this.selectedCharacter = name
        this.saveCharacters()
        this.newCharacterName = ''
      }
    },
    removeCharacter(name) {
      this.characters = this.characters.filter(c => c !== name)
      if (this.selectedCharacter === name) this.selectedCharacter = ''
      this.saveCharacters()
    },
    saveCharacters() {
      if (this.user) {
        localStorage.setItem(`huntanalyser_chars_${this.user.uid}`, JSON.stringify(this.characters))
      }
    },
    loadCharacters() {
      if (this.user) {
        const chars = localStorage.getItem(`huntanalyser_chars_${this.user.uid}`)
        this.characters = chars ? JSON.parse(chars) : []
        if (this.characters.length > 0) this.selectedCharacter = this.characters[0]
      }
    },
    async fetchSessions() {
      if (!this.user) return
      const q = query(
        collection(db, COLLECTION_NAME),
        where('uid', '==', this.user.uid),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      this.allSessions = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id // Garante que o id é sempre o do Firestore
        }
      })
    },
    async addSessionSolo() {
      if (!this.user || !this.selectedCharacter) return
      try {
        const session = parseSession(this.sessionInput)
        if (!session.date) throw new Error('Data inválida ou formato incorreto.')
        session.rawInput = this.sessionInput
        const docToSave = {
          ...session,
          uid: this.user.uid,
          type: 'solo',
          characterName: this.selectedCharacter,
          createdAt: Timestamp.now()
        }
        await addDoc(collection(db, COLLECTION_NAME), docToSave)
        this.sessionInput = ''
        this.inputError = ''
        await this.fetchSessions()
      } catch (e) {
        this.inputError = e.message || 'Erro ao processar sessão.'
      }
    },
    async addSessionParty() {
      if (!this.user) return
      try {
        const session = parsePartySession(this.sessionInputParty)
        if (!session.date) throw new Error('Data inválida ou formato incorreto.')
        session.rawInput = this.sessionInputParty
        const docToSave = {
          ...session,
          uid: this.user.uid,
          type: 'party',
          createdAt: Timestamp.now()
        }
        await addDoc(collection(db, COLLECTION_NAME), docToSave)
        this.sessionInputParty = ''
        this.inputErrorParty = ''
        await this.fetchSessions()
      } catch (e) {
        this.inputErrorParty = e.message || 'Erro ao processar sessão.'
      }
    },
    async deleteSession(session) {
      if (!this.user) return
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, session.id))
        this.expandedSession = null
        this.inputError = ''
        await this.fetchSessions()
      } catch (e) {
        this.inputError = 'Erro ao excluir sessão: ' + (e && e.message ? e.message : String(e))
      }
    },
    toggleExpand(session) {
      this.expandedSession = this.expandedSession === session.id ? null : session.id
    },
    openSessionModal(content) {
      this.sessionModalContent = content;
      this.showSessionModal = true;
    },
    toggleDay(day) {
      this.expandedDays[day] = !this.expandedDays[day];
    },
    isDayExpanded(day) {
      return this.expandedDays[day] !== false; // Expandido por padrão
    },
    formatMinutes(minutes) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins.toString().padStart(2, '0')}m`;
    },
    formatDateBR(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString + 'T00:00:00'); // Evita problemas de timezone
      const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      const dayName = weekdays[date.getDay()];
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${dayName} ${day}/${month}`;
    },
    openDayModal(day, type) {
      const sessions = type === 'solo' ? this.sessionsByDaySolo[day] : this.sessionsByDayParty[day];
      const totals = type === 'solo' ? this.dayTotalsSolo[day] : this.dayTotalsParty[day];
      this.selectedDayData = {
        day,
        type,
        sessions,
        totals
      };
      this.showDayModal = true;
    },
    closeDayModal() {
      this.showDayModal = false;
      this.selectedDayData = null;
    },
    closeItemsModal() {
      this.showItemsModal = false;
      this.foundItems = [];
      this.analyzedSessions = 0;
    },
    searchDeliverableItems() {
      // Lista de itens do JSON
      const targetItems = itemsData.items.map(item => item.item.toLowerCase());
      
      // Objeto para armazenar itens encontrados
      const itemsFound = {};
      let sessionsAnalyzed = 0;
      
      // Analisar todas as sessões
      this.allSessions.forEach(session => {
        if (!session.rawInput) return;
        
        // Extrair seção "Looted Items:"
        const lootedItemsMatch = session.rawInput.match(/Looted Items:(.*?)(?=\n\n|\n[A-Z]|$)/s);
        if (!lootedItemsMatch) return;
        
        sessionsAnalyzed++;
        
        const lootedItemsSection = lootedItemsMatch[1];
        
        // Extrair itens individuais (formato: "123x item name")
        const itemMatches = lootedItemsSection.match(/^\s*(\d+)x (.+)$/gm);
        if (!itemMatches) return;
        
        itemMatches.forEach(itemMatch => {
          const match = itemMatch.match(/^\s*(\d+)x (.+)$/);
          if (!match) return;
          
          const quantity = parseInt(match[1]);
          const itemName = match[2].trim().replace(/^an? /, '').toLowerCase(); // Remove "a " ou "an "
          
          // Verificar se o item está na lista de entregáveis
          if (targetItems.includes(itemName)) {
            if (!itemsFound[itemName]) {
              itemsFound[itemName] = {
                name: match[2].trim(), // Nome original com artigo
                totalQuantity: 0
              };
            }
            
            itemsFound[itemName].totalQuantity += quantity;
          }
        });
      });
      
      // Converter objeto para array e ordenar por quantidade total (descendente)
      this.foundItems = Object.values(itemsFound)
        .sort((a, b) => b.totalQuantity - a.totalQuantity);
      
      this.analyzedSessions = sessionsAnalyzed;
      this.showItemsModal = true;
    }
  }
}
</script>

<style scoped>
.huntanalyser-header-fixed {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  z-index: 89;
  /* menor que o z-index da sidebar (90) */
  background: linear-gradient(90deg, #23232b 0%, #18181b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
  border-bottom: 3px solid var(--accent-gold, #fbbf24);
  padding: 1.1rem 0 1.1rem 0;
  margin-bottom: 1.5rem;
  transition: left 0.2s, width 0.2s, top 0.2s;
}

@media (max-width: 1024px) {
  .huntanalyser-header-fixed {
    left: 215px;
    width: calc(100vw - 215px);
  }
}

@media (max-width: 768px) {
  .huntanalyser-header-fixed {
    left: 0;
    width: 100vw;
    top: 64px;
  }
}

.huntanalyser-header-fixed .header-content {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  max-width: 1100px;
  margin: 0 auto;
  color: var(--text-primary, #fff);
  padding-left: 1rem;
}

.tabs-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.month-filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-accent);
}

.month-filter-container label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.month-filter-select {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-accent);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  min-width: 200px;
  cursor: pointer;
}

.month-filter-select:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.2);
}

.tab-content {
  width: 100%;
  box-sizing: border-box;
}

.tab-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tab-btn.active {
  background: var(--accent-gold);
  color: #fff;
}

.search-items-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-items-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.character-select-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
}

.char-input {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-accent);
  font-size: 1rem;
}

.add-char-btn,
.remove-char-btn {
  background: var(--accent-gold);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-char-btn:hover,
.remove-char-btn:hover {
  background: var(--accent-secondary);
}

.huntanalyser-page {
  padding-top: 110px;
  /* espaço para o header fixo */
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: left 0.2s, width 0.2s, padding-left 0.2s;
}

@media (max-width: 1024px) {
  .huntanalyser-page {
    left: 215px;
    width: calc(100vw - 215px);
    padding-left: 1rem;
  }
}

@media (max-width: 768px) {
  .huntanalyser-page {
    left: 0;
    width: 100vw;
    padding-left: 1rem;
  }
}

.summary-box {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.summary-stats {
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
}

.input-section {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.input-section textarea {
  width: 100%;
  min-height: 120px;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-accent);
  padding: 0.75rem;
  font-size: 1rem;
  resize: vertical;
}

.input-section button {
  background: var(--accent-gold);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
}

.input-error {
  color: #e53e3e;
  margin-top: 0.5rem;
}

.sessions-by-day {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  h2{
    color: #e53e3e;
    border-bottom: 1px solid #e53e3e;
    margin-bottom: 1rem;
  }
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.day-card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a2a35 100%);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.day-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-gold);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.15);
}

.day-card.party-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.day-card.party-card:hover {
  border-color: #60a5fa;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.day-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.day-card-header h3 {
  margin: 0;
  color: var(--accent-gold);
  font-size: 1.1rem;
  font-weight: 600;
}

.party-card .day-card-header h3 {
  color: #bfdbfe;
}

.session-count {
  background: rgba(251, 191, 36, 0.2);
  color: var(--accent-gold);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.party-card .session-count {
  background: rgba(191, 219, 254, 0.2);
  color: #bfdbfe;
}

.day-card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Modal de Dia */
.day-modal-content {
  max-height: 70vh;
  overflow-y: auto;
  width: 100%;
  max-width: 900px;
}

.day-sessions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-session-card {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--border-accent);
}

.modal-session-card.party {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  border-color: #3b82f6;
}

.modal-session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.modal-session-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.modal-stats-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.modal-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  flex: 1;
}

.modal-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.modal-stat .stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.modal-stat .stat-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-session-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.party-players-modal {
  margin-top: 1.5rem;
}

.party-players-modal h4 {
  margin: 0 0 1rem 0;
  color: var(--accent-gold);
}

.players-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.players-table th,
.players-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-accent);
}

.players-table th {
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-secondary);
  font-weight: 600;
}

.players-table td {
  color: var(--text-primary);
}

.sessions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.compare-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
}

.compare-cards {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.compare-card {
  background: var(--bg-primary);
  border-radius: 10px;
  padding: 1rem 1.5rem;
  min-width: 300px;
  box-shadow: var(--shadow-sm);
}

.delete-btn {
  background: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  margin-left: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #b91c1c;
}

.expand-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  margin-left: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.expand-btn:hover {
  background: #3730a3;
}

.expanded-input {
  background: #18181b;
  color: #e5e7eb;
  border-radius: 8px;
  margin-top: 1rem;
  padding: 1rem;
  font-size: 0.95rem;
  overflow-x: auto;
}

.login-required-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  background: var(--bg-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  margin: 3rem auto 2rem auto;
  max-width: 500px;
  padding: 2.5rem 2rem;
  text-align: center;
}

.login-required-box p {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.login-required-box .login-btn {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  padding: 0.7rem 2.2rem;
}

/* Modal Overlay e Box - global, fora do scoped */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: var(--bg-primary, #18181b);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.32);
  padding: 2.5rem 3.5rem;
  min-width: 480px;
  max-width: 98vw;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.modal-box textarea {
  min-height: 220px;
  font-size: 1.15rem;
  border-radius: 10px;
  border: 1.5px solid var(--border-accent, #6366f1);
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  background: #23232b;
  color: #fff;
  resize: vertical;
}

.modal-box button {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
  color: #18181b;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 2.5rem;
  font-size: 1.12rem;
  font-weight: 700;
  margin-right: 0.7rem;
  margin-bottom: 0.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.modal-box button:hover {
  background: linear-gradient(90deg, #f59e42 0%, #fbbf24 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
}

/* Modal de Itens Entregáveis */
.items-modal-content {
  max-height: 80vh;
  overflow-y: auto;
  width: 100%;
  max-width: 1000px;
  padding: 0.5rem;
}

.no-items-found {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.items-summary {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--accent-gold);
}

.items-summary p {
  margin: 0;
  font-size: 1.05rem;
  color: var(--text-primary);
}

.found-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.found-item-simple {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a2a35 100%);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-accent);
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.found-item-simple:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-gold);
}

.item-name {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
  flex: 1;
}

.item-quantity {
  background: rgba(251, 191, 36, 0.15);
  color: var(--accent-gold);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  flex-shrink: 0;
  margin-left: 1rem;
}
</style>
