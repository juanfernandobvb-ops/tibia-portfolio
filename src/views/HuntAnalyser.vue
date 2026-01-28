<template>
  <div class="huntanalyser-page">
    <h1>Hunt Analyser</h1>

    <!-- Tabs -->
    <div v-if="user" class="tabs-container">
      <button :class="['tab-btn', { active: activeTab === 'solo' }]" @click="activeTab = 'solo'">Hunt Solo</button>
      <button :class="['tab-btn', { active: activeTab === 'party' }]" @click="activeTab = 'party'">Hunt Party</button>
    </div>

    <!-- Hunt Solo Tab -->
    <div v-if="activeTab === 'solo'">
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
          <button v-if="selectedCharacter" @click="removeCharacter(selectedCharacter)" class="remove-char-btn">Remover</button>
        </div>
        <div v-if="selectedCharacter">
          <!-- Input e sessões solo para o personagem selecionado -->
            <div class="input-section">
              <button @click="showSoloModal = true">Adicionar Nova Sessão</button>
            </div>
        <div v-if="showSoloModal" class="modal-overlay">
          <div class="modal-box">
            <h2 style="margin-bottom: 1.2rem;">Adicionar Nova Sessão Solo</h2>
            <textarea v-model="sessionInput" placeholder="Cole aqui o texto do Hunt Analyser" style="margin-bottom: 1.2rem; width: 100%;"></textarea>
            <div style="display: flex; gap: 0.7rem; width: 100%;">
              <button @click="addSessionSolo">Salvar Sessão</button>
              <button @click="showSoloModal = false" class="close-modal-btn">Cancelar</button>
            </div>
            <div v-if="inputError" class="input-error">{{ inputError }}</div>
          </div>
        </div>
          <div class="sessions-by-day">
            <h2>Sessões de {{ selectedCharacter }}</h2>
            <div v-for="(sessions, day) in sessionsByDaySolo" :key="day" class="day-group">
              <h3>{{ day }}</h3>
              <div class="sessions-list">
                <div v-for="session in sessions" :key="session.id" class="session-card">
                  <div class="session-header">
                    <span><strong>Início:</strong> {{ session.startTime }}</span>
                    <span><strong>Fim:</strong> {{ session.endTime }}</span>
                    <button class="delete-btn" @click="deleteSession(session)">Excluir</button>
                    <button class="expand-btn" @click="toggleExpand(session)">
                      {{ expandedSession === session.id ? 'Fechar' : 'Expandir' }}
                    </button>
                  </div>
                  <div class="session-stats">
                    <div><strong>XP:</strong> {{ session.xpGain?.toLocaleString() }}</div>
                    <div><strong>Balance:</strong> {{ session.balance?.toLocaleString() }}</div>
                    <div><strong>Duração:</strong> {{ session.duration }}</div>
                  </div>
                  <div v-if="expandedSession === session.id" class="expanded-input">
                    <h4>Input Completo</h4>
                    <pre>{{ session.rawInput }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Hunt Party Tab -->
    <div v-if="activeTab === 'party'">
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
          <div v-for="(sessions, day) in sessionsByDayParty" :key="day" class="day-group">
            <h3>{{ day }}</h3>
            <div class="sessions-list">
              <div v-for="session in sessions" :key="session.id" class="session-card">
                <div class="session-header">
                  <span><strong>Início:</strong> {{ session.startTime }}</span>
                  <span><strong>Fim:</strong> {{ session.endTime }}</span>
                  <button class="delete-btn" @click="deleteSession(session)">Excluir</button>
                  <button class="expand-btn" @click="toggleExpand(session)">
                    {{ expandedSession === session.id ? 'Fechar' : 'Expandir' }}
                  </button>
                </div>
                <div class="session-stats">
                  <div><strong>Tipo de Loot:</strong> {{ session.lootType }}</div>
                  <div><strong>Loot Total:</strong> {{ session.loot?.toLocaleString() }}</div>
                  <div><strong>Supplies Total:</strong> {{ session.supplies?.toLocaleString() }}</div>
                  <div><strong>Balance Total:</strong> {{ session.balance?.toLocaleString() }}</div>
                  <div><strong>Duração:</strong> {{ session.duration }}</div>
                </div>
                <div class="party-players-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Personagem</th>
                        <th>Líder</th>
                        <th>Loot</th>
                        <th>Supplies</th>
                        <th>Balance</th>
                        <th>Damage</th>
                        <th>Healing</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="player in session.players" :key="player.name">
                        <td>{{ player.name }}</td>
                        <td>{{ player.isLeader ? 'Sim' : '' }}</td>
                        <td>{{ player.loot.toLocaleString() }}</td>
                        <td>{{ player.supplies.toLocaleString() }}</td>
                        <td>{{ player.balance.toLocaleString() }}</td>
                        <td>{{ player.damage.toLocaleString() }}</td>
                        <td>{{ player.healing.toLocaleString() }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-if="expandedSession === session.id" class="expanded-input">
                  <h4>Input Completo</h4>
                  <pre>{{ session.rawInput }}</pre>
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
  const xpGain = getNum(/XP Gain: ([\d,]+)/);
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
  data() {
    return {
      user: null,
      activeTab: 'solo',
      characters: [],
      selectedCharacter: '',
      newCharacterName: '',
      sessionInput: '',
      sessionInputParty: '',
      inputError: '',
      inputErrorParty: '',
      allSessions: [],
      expandedSession: null,
      showSoloModal: false
    };
  },
  computed: {
    sessionsByDaySolo() {
      // Agrupa sessões solo por dia para o personagem selecionado
      const grouped = {}
      this.allSessions.filter(s => s.type === 'solo' && s.characterName === this.selectedCharacter).forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = []
        grouped[s.date].push(s)
      })
      return grouped
    },
    sessionsByDayParty() {
      // Agrupa sessões party por dia
      const grouped = {}
      this.allSessions.filter(s => s.type === 'party').forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = []
        grouped[s.date].push(s)
      })
      return grouped
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
    }
  }
}
</script>

<style scoped>
.tabs-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  justify-content: flex-start;
  align-items: flex-start;
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
.add-char-btn, .remove-char-btn {
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
.add-char-btn:hover, .remove-char-btn:hover {
  background: var(--accent-secondary);
}
.huntanalyser-page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
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
}
.day-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}
.sessions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
}
.session-card {
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 1rem;
  min-width: 220px;
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: border 0.2s;
}
.session-card.selected {
  border: 2px solid var(--accent-gold);
}
.session-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}
.session-stats {
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
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
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-box {
  background: var(--bg-primary, #18181b);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  padding: 2rem 2.5rem;
  min-width: 350px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
