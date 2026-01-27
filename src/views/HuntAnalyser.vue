<template>
  <div class="huntanalyser-page">
    <h1>Hunt Analyser</h1>

    <!-- Login/Logout -->
    <div class="auth-box">
      <template v-if="!user">
        <button class="login-btn" @click="loginWithGoogle">Login com Google</button>
      </template>
      <template v-else>
        <div class="user-info">
          <img :src="user.photoURL" v-if="user.photoURL" class="user-avatar" />
          <span>Logado como <strong>{{ user.displayName || user.email }}</strong></span>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </template>
    </div>

    <div v-if="user">
      <!-- Resumo Global -->
      <div class="summary-box">
        <h2>Resumo Geral</h2>
        <div class="summary-stats">
          <div><strong>Total XP:</strong> {{ typeof totalXP === 'number' ? totalXP.toLocaleString() : 0 }}</div>
          <div><strong>Total Balance:</strong> {{ typeof totalBalance === 'number' ? totalBalance.toLocaleString() : 0 }}</div>
          <div><strong>Total Sessões:</strong> {{ allSessions.length }}</div>
        </div>
      </div>

      <!-- Input de Sessão -->
      <div class="input-section">
        <h2>Adicionar Nova Sessão</h2>
        <textarea v-model="sessionInput" placeholder="Cole aqui o texto do Hunt Analyser"></textarea>
        <button @click="addSession">Adicionar Sessão</button>
        <div v-if="inputError" class="input-error">{{ inputError }}</div>
      </div>

      <!-- Agrupamento por Dia -->
      <div class="sessions-by-day">
        <h2>Sessões por Dia</h2>
        <div v-for="(sessions, day) in sessionsByDay" :key="day" class="day-group">
          <h3>{{ day }}</h3>
          <div class="sessions-list">
            <div v-for="(session, idx) in sessions" :key="session.id" class="session-card" :class="{ selected: isSelected(session) }">
              <div class="session-header">
                <span><strong>Início:</strong> {{ session.startTime }}</span>
                <span><strong>Fim:</strong> {{ session.endTime }}</span>
                <button @click="toggleCompare(session)">
                  {{ isSelected(session) ? 'Remover Comparação' : 'Comparar' }}
                </button>
                <button class="delete-btn" @click="deleteSession(session)">Excluir</button>
                <button class="expand-btn" @click="toggleExpand(session)">
                  {{ expandedSession === session.id ? 'Fechar' : 'Expandir' }}
                </button>
              </div>
              <div class="session-stats">
                <div><strong>XP:</strong> {{ session.xpGain.toLocaleString() }}</div>
                <div><strong>Balance:</strong> {{ session.balance.toLocaleString() }}</div>
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

      <!-- Comparação de Sessões -->
      <div v-if="compareSessions.length === 2" class="compare-section">
        <h2>Comparação de Sessões</h2>
        <div class="compare-cards">
          <div v-for="session in compareSessions" :key="session.id" class="compare-card">
            <h3>{{ session.date }} ({{ session.startTime }} - {{ session.endTime }})</h3>
            <div><strong>XP:</strong> {{ session.xpGain.toLocaleString() }}</div>
            <div><strong>Balance:</strong> {{ session.balance.toLocaleString() }}</div>
            <div><strong>Duração:</strong> {{ session.duration }}</div>
            <div><strong>Loot:</strong> {{ session.loot.toLocaleString() }}</div>
            <div><strong>Supplies:</strong> {{ session.supplies.toLocaleString() }}</div>
            <div><strong>Damage:</strong> {{ session.damage.toLocaleString() }}</div>
            <div><strong>Healing:</strong> {{ session.healing.toLocaleString() }}</div>
            <div><strong>Monstros Mortos:</strong>
              <ul>
                <li v-for="m in session.killedMonsters" :key="m.name">{{ m.count }}x {{ m.name }}</li>
              </ul>
            </div>
            <div><strong>Itens Lootados:</strong>
              <ul>
                <li v-for="i in session.lootedItems" :key="i.name">{{ i.count }}x {{ i.name }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, googleProvider, db } from '../services/firebase.js'
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp } from 'firebase/firestore'

function parseSession(input) {
  // Regex helpers
  const get = (regex, def = '') => {
    const m = input.match(regex);
    return m ? m[1].replace(/,/g, '').replace(/\s/g, '') : def;
  };
  const getNum = (regex, def = 0) => {
    const m = input.match(regex);
    return m ? Number(m[1].replace(/,/g, '').replace(/\s/g, '')) : def;
  };
  // Dates
  const dateMatch = input.match(/From (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2}) to (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2}:\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';
  const startTime = dateMatch ? dateMatch[2] : '';
  const endTime = dateMatch ? dateMatch[4] : '';
  // Stats
  const duration = get(/Session: ([\d:]+h)/);
  const xpGain = getNum(/XP Gain: ([\d,]+)/);
  const loot = getNum(/Loot: ([\d,]+)/);
  const supplies = getNum(/Supplies: ([\d,]+)/);
  const balance = getNum(/Balance: ([\d,]+)/);
  const damage = getNum(/Damage: ([\d,]+)/);
  const healing = getNum(/Healing: ([\d,]+)/);
  // Killed Monsters
  const killedMonsters = [];
  const monstersMatch = input.match(/Killed Monsters:\n([\s\S]*?)\nLooted Items:/);
  if (monstersMatch) {
    monstersMatch[1].split('\n').forEach(line => {
      const m = line.match(/(\d+)x (.+)/);
      if (m) killedMonsters.push({ count: Number(m[1]), name: m[2] });
    });
  }
  // Looted Items
  const lootedItems = [];
  const itemsMatch = input.match(/Looted Items:\n([\s\S]*)/);
  if (itemsMatch) {
    itemsMatch[1].split('\n').forEach(line => {
      const m = line.match(/(\d+)x (.+)/);
      if (m) lootedItems.push({ count: Number(m[1]), name: m[2] });
    });
  }
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
    healing,
    killedMonsters,
    lootedItems
  };
}

const COLLECTION_NAME = 'hunt-analyser-sessions'

export default {
  name: 'HuntAnalyser',
  data() {
    return {
      user: null,
      sessionInput: '',
      inputError: '',
      allSessions: [],
      compareSessions: [],
      expandedSession: null,
      loadingSessions: false
    };
  },
  computed: {
    sessionsByDay() {
      // Agrupa sessões por data
      const grouped = {};
      this.allSessions.forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = [];
        grouped[s.date].push(s);
      });
      return grouped;
    },
    totalXP() {
      return this.allSessions.reduce((sum, s) => sum + (s.xpGain || 0), 0);
    },
    totalBalance() {
      return this.allSessions.reduce((sum, s) => sum + (s.balance || 0), 0);
    }
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user
      if (user) {
        this.fetchSessions()
      } else {
        this.allSessions = []
      }
    })
  },
  methods: {
    async loginWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (e) {
        alert('Erro ao fazer login: ' + e.message)
      }
    },
    async logout() {
      await signOut(auth)
    },
    async fetchSessions() {
      if (!this.user) return
      this.loadingSessions = true
      const q = query(
        collection(db, COLLECTION_NAME),
        where('uid', '==', this.user.uid),
        orderBy('createdAt', 'asc')
      )
      const querySnapshot = await getDocs(q)
      this.allSessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.data().uid,
        // Adiciona todos os campos do documento diretamente
        ...doc.data()
      }))
      this.loadingSessions = false
    },
    async addSession() {
      if (!this.user) return
      try {
        const session = parseSession(this.sessionInput)
        if (!session.date) throw new Error('Data inválida ou formato incorreto.')
        session.rawInput = this.sessionInput
        // Cria explicitamente o objeto a ser salvo
        const docToSave = {
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          duration: session.duration,
          xpGain: session.xpGain,
          loot: session.loot,
          supplies: session.supplies,
          balance: session.balance,
          damage: session.damage,
          healing: session.healing,
          killedMonsters: session.killedMonsters,
          lootedItems: session.lootedItems,
          rawInput: session.rawInput,
          uid: this.user.uid,
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
    async deleteSession(session) {
      if (!this.user) return
      try {
        // O id pode ser string ou number, garantir string
        const docId = String(session.id)
        await deleteDoc(doc(db, COLLECTION_NAME, docId))
        this.compareSessions = this.compareSessions.filter(s => s.id !== session.id)
        await this.fetchSessions()
        this.inputError = ''
      } catch (e) {
        this.inputError = 'Erro ao excluir sessão: ' + (e.message || '')
      }
    },
    toggleCompare(session) {
      const idx = this.compareSessions.findIndex(s => s.id === session.id);
      if (idx !== -1) {
        this.compareSessions.splice(idx, 1);
      } else if (this.compareSessions.length < 2) {
        this.compareSessions.push(session);
      } else {
        this.compareSessions = [session];
      }
    },
    isSelected(session) {
      return this.compareSessions.some(s => s.id === session.id);
    },
    toggleExpand(session) {
      this.expandedSession = this.expandedSession === session.id ? null : session.id;
    }
  }
}
</script>

<style scoped>
.huntanalyser-page {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
.auth-box {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.login-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.login-btn:hover {
  background: #3730a3;
}
.logout-btn {
  background: #e53e3e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #b91c1c;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--accent-gold);
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
}
.day-group {
  margin-bottom: 1.5rem;
}
.sessions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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
</style>
