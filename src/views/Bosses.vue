<template>
  <div class="bosses-page">
    <div class="bosses-header-fixed">
      <div class="header-content">
        <span v-if="user"><strong>Meus Bosses:</strong> {{ bosses.length }} cadastrados</span>
        <span v-if="filteredBosses.length !== bosses.length">
          <strong>Exibindo:</strong> {{ filteredBosses.length }}
        </span>
      </div>
    </div>

    <h1>Meus Bosses</h1>

    <!-- Modal de Adicionar/Editar Boss -->
    <div v-if="showBossModal" class="modal-overlay">
      <div class="modal-box">
        <h2 style="margin-bottom: 1.5rem;">{{ editingBoss ? 'Editar Boss' : 'Adicionar Novo Boss' }}</h2>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Nome do Boss *</label>
            <input v-model="bossForm.name" placeholder="Ex: Ferumbras, Orshabaal..." />
          </div>
          
          <div class="form-group">
            <label>Data *</label>
            <input v-model="bossForm.date" type="date" />
          </div>
          
          <div class="form-group">
            <label>Horário *</label>
            <input v-model="bossForm.time" type="time" />
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="saveBoss" :disabled="!bossForm.name || !bossForm.date || !bossForm.time">
            {{ editingBoss ? 'Atualizar' : 'Salvar' }}
          </button>
          <button @click="closeBossModal" class="cancel-btn">Cancelar</button>
        </div>
        
        <div v-if="inputError" class="input-error">{{ inputError }}</div>
      </div>
    </div>

    <div v-if="!user" class="login-required-msg">
      <p>Faça login para gerenciar sua lista pessoal de bosses.</p>
    </div>

    <template v-else>
      <!-- Controles -->
      <div class="controls-section">
        <button @click="openAddBossModal" class="add-boss-btn">
          ➕ Adicionar Boss
        </button>
        
        <div class="filters">
          <input 
            v-model="searchFilter" 
            placeholder="Buscar por nome, data ou horário..." 
            class="search-input"
          />
        </div>
      </div>

      <!-- Lista de Bosses -->
      <div v-if="filteredBosses.length === 0 && bosses.length === 0" class="empty-state">
        <p>Você ainda não cadastrou nenhum boss.</p>
        <p>Clique em "Adicionar Boss" para começar!</p>
      </div>

      <div v-else-if="filteredBosses.length === 0" class="empty-filtered">
        <p>Nenhum boss encontrado com os filtros aplicados.</p>
      </div>

      <div v-else class="bosses-grid">
        <div v-for="boss in filteredBosses" :key="boss.id" class="boss-card">
          <div class="boss-header">
            <h3>{{ boss.name }}</h3>
            <div class="boss-actions">
              <button @click="editBoss(boss)" class="edit-btn">✏️</button>
              <button @click="deleteBoss(boss)" class="delete-btn">🗑️</button>
            </div>
          </div>
          
          <div class="boss-details">
            <div class="detail-item">
              <span class="label">Data:</span>
              <span class="value">{{ formatDateBR(boss.date) }}</span>
            </div>
            
            <div class="detail-item">
              <span class="label">Horário:</span>
              <span class="value">{{ boss.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { auth, db } from '../services/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy, Timestamp, updateDoc } from 'firebase/firestore'

const COLLECTION_NAME = 'boss-lists'

export default {
  name: 'Bosses',
  data() {
    return {
      user: null,
      bosses: [],
      showBossModal: false,
      editingBoss: null,
      inputError: '',
      searchFilter: '',
      bossForm: {
        name: '',
        date: '',
        time: ''
      }
    }
  },
  computed: {
    filteredBosses() {
      let filtered = this.bosses;
      
      if (this.searchFilter) {
        const search = this.searchFilter.toLowerCase();
        filtered = filtered.filter(boss => 
          boss.name.toLowerCase().includes(search) ||
          (boss.date && boss.date.includes(search)) ||
          (boss.time && boss.time.includes(search))
        );
      }
      
      return filtered.sort((a, b) => {
        // Ordenar por data e depois por horário
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateA - dateB;
      });
    }
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      if (user) {
        this.fetchBosses();
      } else {
        this.bosses = [];
      }
    });
  },
  methods: {
    async fetchBosses() {
      if (!this.user) return;
      
      try {
        const q = query(
          collection(db, COLLECTION_NAME),
          where('uid', '==', this.user.uid)
        );
        const querySnapshot = await getDocs(q);
        this.bosses = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
      } catch (e) {
        this.inputError = 'Erro ao carregar bosses: ' + e.message;
      }
    },
    
    openAddBossModal() {
      this.editingBoss = null;
      this.bossForm = {
        name: '',
        date: '',
        time: ''
      };
      this.inputError = '';
      this.showBossModal = true;
    },
    
    editBoss(boss) {
      this.editingBoss = boss;
      this.bossForm = {
        name: boss.name || '',
        date: boss.date || '',
        time: boss.time || ''
      };
      this.inputError = '';
      this.showBossModal = true;
    },
    
    closeBossModal() {
      this.showBossModal = false;
      this.editingBoss = null;
      this.inputError = '';
    },
    
    async saveBoss() {
      if (!this.user || !this.bossForm.name.trim() || !this.bossForm.date || !this.bossForm.time) {
        this.inputError = 'Nome do boss, data e horário são obrigatórios.';
        return;
      }
      
      try {
        const bossData = {
          name: this.bossForm.name.trim(),
          date: this.bossForm.date,
          time: this.bossForm.time,
          uid: this.user.uid
        };
        
        if (this.editingBoss) {
          // Atualizar boss existente
          await updateDoc(doc(db, COLLECTION_NAME, this.editingBoss.id), {
            ...bossData,
            updatedAt: Timestamp.now()
          });
        } else {
          // Criar novo boss
          await addDoc(collection(db, COLLECTION_NAME), {
            ...bossData,
            createdAt: Timestamp.now()
          });
        }
        
        this.closeBossModal();
        await this.fetchBosses();
      } catch (e) {
        this.inputError = 'Erro ao salvar boss: ' + e.message;
      }
    },
    
    async deleteBoss(boss) {
      if (!confirm(`Tem certeza que deseja excluir "${boss.name}"?`)) return;
      
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, boss.id));
        await this.fetchBosses();
      } catch (e) {
        this.inputError = 'Erro ao excluir boss: ' + e.message;
      }
    },
    
    formatDateBR(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR');
    }
  }
}
</script>

<style scoped>
.bosses-page {
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  transition: left 0.2s, width 0.2s, padding-left 0.2s;
}

.bosses-header-fixed {
  position: relative;
  width: 100%;
  background: linear-gradient(90deg, #23232b 0%, #18181b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
  border-bottom: 3px solid var(--accent-gold, #fbbf24);
  padding: 1.1rem 0;
  margin-bottom: 1.5rem;
  z-index: 89;
}

.header-content {
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

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.add-boss-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-boss-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input, .server-filter {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--border-accent);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.95rem;
}

.search-input {
  min-width: 200px;
}

.server-filter {
  min-width: 150px;
}

.bosses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.boss-card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, #2a2a35 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.boss-card:hover {
  border-color: var(--accent-gold);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(251, 191, 36, 0.15);
}

.boss-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-accent);
  padding-bottom: 0.75rem;
}

.boss-header h3 {
  margin: 0;
  color: var(--accent-gold);
  font-size: 1.2rem;
  font-weight: 600;
}

.boss-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.boss-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.detail-item.notes {
  flex-direction: column;
  align-items: flex-start;
}

.detail-item .label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  flex-shrink: 0;
}

.detail-item .value {
  color: var(--text-primary);
  font-size: 0.95rem;
  text-align: right;
  word-break: break-word;
}

.detail-item.notes .value {
  text-align: left;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
}

.empty-state, .empty-filtered {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.login-required-msg {
  text-align: center;
  padding: 3rem 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  margin-top: 2rem;
}

.login-required-msg p {
  font-size: 1.2rem;
  color: var(--text-primary);
  margin: 0;
}

/* Modal */
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
  background: var(--bg-primary);
  border-radius: 18px;
  padding: 2.5rem;
  min-width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border-accent);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.95rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.7rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.modal-actions button:first-child {
  background: var(--accent-gold);
  color: #18181b;
}

.modal-actions button:first-child:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-accent);
}

.input-error {
  color: #ef4444;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>