<template>
    <div class="content-container">
        <div class="page-header">
            <h2 class="page-title">Finais GT/FR</h2>
            <button v-if="!isEditMode" @click="requestEditMode" class="edit-btn">
                Editar Listas
            </button>
            <button v-if="isEditMode" @click="exitEditMode" class="exit-edit-btn">
                Sair da Edição
            </button>
        </div>

        <div class="bosses-container">
            <!-- GT Section -->
            <div class="boss-section">
                <div class="boss-header">
                    <img src="../assets/images/general/World_Devourer.gif" alt="GT" class="boss-icon" />
                    <h3>Gravedigger Team ({{ gtParticipants.length }}/15)</h3>
                </div>

                <div class="registration-form">
                    <div class="form-inputs">
                        <input v-model="gtForm.nickname" type="text" placeholder="Nickname" class="input-field" />
                        <select v-model="gtForm.vocation" class="input-field">
                            <option value="">Vocação</option>
                            <option value="EK">EK</option>
                            <option value="ED">ED</option>
                            <option value="Shooter">Shooter</option>
                        </select>
                        <button @click="addParticipant('gt')" :disabled="!canAddParticipant('gt')" class="add-btn">
                            Adicionar
                        </button>
                        <button @click="openBatchModal('gt')" class="batch-modal-btn">
                            📝 Lote
                        </button>
                    </div>
                </div>

                <div class="participants-list">
                    <div v-if="sortedGTParticipants.length === 0" class="empty-list">
                        Nenhum participante registrado
                    </div>
                    <div v-for="(participant, index) in sortedGTParticipants" :key="participant.id" class="participant-card">
                        <span class="participant-number">{{ index + 1 }}.</span>
                        <span class="nickname">{{ participant.nickname }}</span>
                        <span class="vocation">{{ participant.vocation }}</span>
                        <button v-if="isEditMode" @click="removeParticipant('gt', participant.id)" class="remove-btn">×</button>
                    </div>
                </div>
            </div>

            <!-- Ferumbras Section -->
            <div class="boss-section">
                <div class="boss-header">
                    <img src="../assets/images/general/Ferumbrasgif.gif" alt="Ferumbras" class="boss-icon" />
                    <h3>Ferumbras Team ({{ ferumbrasParticipants.length }}/15)</h3>
                </div>

                    <div class="registration-form">
                        <div class="form-inputs">
                            <input v-model="ferumbrasForm.nickname" type="text" placeholder="Nickname"
                                class="input-field" />
                            <select v-model="ferumbrasForm.vocation" class="input-field">
                                <option value="">Vocação</option>
                                <option value="EK">EK</option>
                                <option value="ED">ED</option>
                                <option value="Shooter">Shooter</option>
                            </select>
                            <button @click="addParticipant('ferumbras')" :disabled="!canAddParticipant('ferumbras')"
                                class="add-btn">
                                Adicionar
                            </button>
                            <button @click="openBatchModal('ferumbras')" class="batch-modal-btn">
                                📝 Lote
                            </button>
                        </div>
                    </div>

                    <div class="participants-list">
                        <div v-if="sortedFerumbrasParticipants.length === 0" class="empty-list">
                            Nenhum participante registrado
                        </div>
                        <div v-for="(participant, index) in sortedFerumbrasParticipants" :key="participant.id"
                            class="participant-card">
                            <span class="participant-number">{{ index + 1 }}.</span>
                            <span class="nickname">{{ participant.nickname }}</span>
                            <span class="vocation">{{ participant.vocation }}</span>
                            <button v-if="isEditMode" @click="removeParticipant('ferumbras', participant.id)"
                                class="remove-btn">×</button>
                        </div>
                    </div>
                </div>
            </div>

        <!-- Modal de Senha -->
        <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
            <div class="password-modal" @click.stop>
                <h3>Digite a senha para editar</h3>
                <input 
                    v-model="passwordInput" 
                    type="password" 
                    placeholder="Senha"
                    class="password-input"
                    @keyup.enter="validatePassword"
                    ref="passwordField"
                />
                <div class="modal-buttons">
                    <button @click="validatePassword" class="confirm-btn">Confirmar</button>
                    <button @click="closePasswordModal" class="cancel-btn">Cancelar</button>
                </div>
                <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
            </div>
        </div>

        <!-- Batch Modal -->
        <div v-if="showBatchModal" class="modal-overlay" @click="closeBatchModal">
            <div class="modal-content batch-modal" @click.stop>
                <div class="modal-header">
                    <h2>📝 Adicionar Múltiplos - {{ currentBatchBoss === 'gt' ? 'GT' : 'Ferumbras' }}</h2>
                    <button class="modal-close" @click="closeBatchModal">✕</button>
                </div>
                
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nomes dos Participantes:</label>
                        <textarea 
                            v-model="batchForm.nicknames" 
                            placeholder="Digite os nomes separados por vírgula ou linha
Exemplo:
Player1, Player2, Player3

Ou:
Player1
Player2
Player3"
                            class="batch-textarea"
                            rows="5"
                        ></textarea>
                        <small class="form-help">Separe os nomes por vírgula ou quebra de linha</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Vocação para Todos:</label>
                        <select v-model="batchForm.vocation" class="input-field">
                            <option value="">Selecione a vocação</option>
                            <option value="EK">EK</option>
                            <option value="ED">ED</option>
                            <option value="Shooter">Shooter</option>
                        </select>
                    </div>
                    
                    <div v-if="batchPreview.length > 0" class="batch-preview">
                        <h4>Preview ({{ batchPreview.length }} participantes):</h4>
                        <div class="preview-list">
                            <span v-for="name in batchPreview" :key="name" class="preview-item">{{ name }}</span>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button @click="closeBatchModal" class="btn-secondary">Cancelar</button>
                    <button 
                        @click="processBatchAddition" 
                        :disabled="!canProcessBatch"
                        class="btn-primary"
                    >
                        Adicionar {{ batchPreview.length }} Participante(s)
                    </button>
                </div>
            </div>
        </div>
        </div>
    </template>
<script>
import { FinaisService } from '../services/finaisService.js'

export default {
    name: 'Finais',
    data() {
        return {
            gtForm: {
                nickname: '',
                vocation: ''
            },
            ferumbrasForm: {
                nickname: '',
                vocation: ''
            },
            gtParticipants: [],
            ferumbrasParticipants: [],
            loading: false,
            gtUnsubscribe: null,
            ferumbrasUnsubscribe: null,
            isEditMode: false,
            showPasswordModal: false,
            passwordInput: '',
            passwordError: '',
            correctPassword: 'xanxan',
            // Modal de adição em lote
            showBatchModal: false,
            currentBatchBoss: null,
            batchForm: {
                nicknames: '',
                vocation: ''
            }
        }
    },
    computed: {
        sortedGTParticipants() {
            return this.sortParticipantsByVocation(this.gtParticipants)
        },
        sortedFerumbrasParticipants() {
            return this.sortParticipantsByVocation(this.ferumbrasParticipants)
        },
        batchPreview() {
            return this.parseNicknames(this.batchForm.nicknames)
        },
        canProcessBatch() {
            const nicknames = this.batchPreview
            const list = this.currentBatchBoss === 'gt' ? this.gtParticipants : this.ferumbrasParticipants
            
            return nicknames.length > 0 && 
                   this.batchForm.vocation && 
                   (list.length + nicknames.length) <= 15
        }
    },
    async mounted() {
        await this.loadParticipants()
        this.setupRealtimeListeners()
    },
    beforeUnmount() {
        // Cleanup listeners
        if (this.gtUnsubscribe) {
            this.gtUnsubscribe()
        }
        if (this.ferumbrasUnsubscribe) {
            this.ferumbrasUnsubscribe()
        }
    },
    methods: {
        async loadParticipants() {
            this.loading = true
            try {
                const [gtParticipants, ferumbrasParticipants] = await Promise.all([
                    FinaisService.getGTParticipants(),
                    FinaisService.getFerumbrasParticipants()
                ])
                
                this.gtParticipants = gtParticipants
                this.ferumbrasParticipants = ferumbrasParticipants
            } catch (error) {
                console.error('Error loading participants:', error)
            } finally {
                this.loading = false
            }
        },

        setupRealtimeListeners() {
            // Listen to GT participants
            this.gtUnsubscribe = FinaisService.listenToGTParticipants((participants) => {
                this.gtParticipants = participants
            })

            // Listen to Ferumbras participants  
            this.ferumbrasUnsubscribe = FinaisService.listenToFerumbrasParticipants((participants) => {
                this.ferumbrasParticipants = participants
            })
        },

        async addParticipant(boss) {
            const form = boss === 'gt' ? this.gtForm : this.ferumbrasForm
            
            if (this.canAddParticipant(boss) && this.isFormValid(form)) {
                this.loading = true
                try {
                    const participantData = {
                        nickname: form.nickname.trim(),
                        vocation: form.vocation
                    }

                    if (boss === 'gt') {
                        await FinaisService.addGTParticipant(participantData)
                    } else {
                        await FinaisService.addFerumbrasParticipant(participantData)
                    }

                    this.clearForm(boss)
                } catch (error) {
                    console.error('Error adding participant:', error)
                    alert('Erro ao adicionar participante. Tente novamente.')
                } finally {
                    this.loading = false
                }
            }
        },

        async removeParticipant(boss, id) {
            this.loading = true
            try {
                if (boss === 'gt') {
                    await FinaisService.removeGTParticipant(id)
                } else {
                    await FinaisService.removeFerumbrasParticipant(id)
                }
            } catch (error) {
                console.error('Error removing participant:', error)
                alert('Erro ao remover participante. Tente novamente.')
            } finally {
                this.loading = false
            }
        },

        canAddParticipant(boss) {
            const list = boss === 'gt' ? this.gtParticipants : this.ferumbrasParticipants;
            return list.length < 15;
        },

        isFormValid(form) {
            return form.nickname.trim() && form.vocation;
        },

        parseNicknames(nicknamesText) {
            if (!nicknamesText || !nicknamesText.trim()) return [];
            
            // Divide por vírgula ou quebra de linha e limpa espaços
            return nicknamesText
                .split(/[,\n]/)
                .map(name => name.trim())
                .filter(name => name.length > 0);
        },

        clearForm(boss) {
            if (boss === 'gt') {
                this.gtForm = { nickname: '', vocation: '' };
            } else {
                this.ferumbrasForm = { nickname: '', vocation: '' };
            }
        },

        sortParticipantsByVocation(participants) {
            const vocationOrder = {
                'EK': 1,
                'ED': 2,
                'Shooter': 3
            }
            
            return [...participants].sort((a, b) => {
                const aOrder = vocationOrder[a.vocation] || 999
                const bOrder = vocationOrder[b.vocation] || 999
                
                // Primeiro ordena por vocação
                if (aOrder !== bOrder) {
                    return aOrder - bOrder
                }
                
                // Se mesma vocação, ordena por data de registro (mais antigos primeiro)
                if (a.registeredAt && b.registeredAt) {
                    return a.registeredAt.toDate() - b.registeredAt.toDate()
                }
                
                return 0
            })
        },

        requestEditMode() {
            this.showPasswordModal = true
            this.passwordInput = ''
            this.passwordError = ''
            this.$nextTick(() => {
                if (this.$refs.passwordField) {
                    this.$refs.passwordField.focus()
                }
            })
        },

        validatePassword() {
            if (this.passwordInput === this.correctPassword) {
                this.isEditMode = true
                this.closePasswordModal()
            } else {
                this.passwordError = 'Senha incorreta!'
                this.passwordInput = ''
            }
        },

        closePasswordModal() {
            this.showPasswordModal = false
            this.passwordInput = ''
            this.passwordError = ''
        },

        exitEditMode() {
            this.isEditMode = false
        },

        openBatchModal(boss) {
            this.currentBatchBoss = boss
            this.showBatchModal = true
            this.batchForm = { nicknames: '', vocation: '' }
        },

        closeBatchModal() {
            this.showBatchModal = false
            this.currentBatchBoss = null
            this.batchForm = { nicknames: '', vocation: '' }
        },

        async processBatchAddition() {
            if (!this.canProcessBatch) return

            try {
                this.loading = true
                const nicknames = this.batchPreview
                const successCount = []
                const errors = []

                for (const nickname of nicknames) {
                    try {
                        const participantData = {
                            nickname: nickname,
                            vocation: this.batchForm.vocation
                        }

                        if (this.currentBatchBoss === 'gt') {
                            await FinaisService.addGTParticipant(participantData)
                        } else {
                            await FinaisService.addFerumbrasParticipant(participantData)
                        }
                        
                        successCount.push(nickname)
                    } catch (error) {
                        console.error(`Erro ao adicionar ${nickname}:`, error)
                        errors.push(nickname)
                    }
                }

                this.closeBatchModal()

                // Feedback
                if (successCount.length > 0) {
                    alert(`✅ ${successCount.length} participante(s) adicionado(s) com sucesso!`)
                }
                if (errors.length > 0) {
                    alert(`❌ Erro ao adicionar: ${errors.join(', ')}`)
                }

            } catch (error) {
                console.error('Erro na adição em lote:', error)
                alert('Erro ao processar adição em lote!')
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    color: var(--accent-gold);
    font-size: 1.8rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--accent-primary);
    font-weight: 600;
    margin: 0;
}

.edit-btn, .exit-edit-btn {
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.exit-edit-btn {
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

.edit-btn:hover, .exit-edit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.bosses-container {
    display: flex !important;
    flex-direction: row !important;
    gap: 2rem !important;
    width: 100%;
    align-items: flex-start;
}

.boss-section {
    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    flex: 1;
    min-width: 0;
}

.boss-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.boss-icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.boss-header h3 {
    color: var(--accent-gold);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
}

.registration-form {
    margin-bottom: 2rem;
}

.form-inputs {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
}

.input-field {
    background-color: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    color: var(--text-primary);
    font-size: 0.9rem;
    transition: all 0.3s ease;
    min-width: 120px;
}

.input-field:focus {
    outline: none;
    border-color: var(--accent-gold);
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.input-field::placeholder {
    color: var(--text-secondary);
}

.add-btn {
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.add-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.add-btn:disabled {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.batch-modal-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.85rem;
}

.batch-modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Batch Modal Styles */
.batch-modal {
    max-width: 600px;
    width: 90%;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: var(--bg-secondary);
    border-radius: 16px;
    border: 2px solid var(--border-color);
    box-shadow: var(--shadow-xl);
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-bottom: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-header h2 {
    margin: 0;
    color: var(--accent-gold);
    font-size: 1.3rem;
}

.modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.modal-body {
    padding: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 600;
}

.batch-textarea {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
    width: 100%;
    min-height: 120px;
    transition: all 0.3s ease;
}

.batch-textarea:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.batch-textarea::placeholder {
    color: var(--text-secondary);
    opacity: 0.8;
}

.form-help {
    display: block;
    margin-top: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.batch-preview {
    background: var(--bg-tertiary);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
}

.batch-preview h4 {
    margin: 0 0 0.75rem 0;
    color: var(--accent-blue);
    font-size: 1rem;
}

.preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.preview-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    color: var(--text-primary);
}

.modal-footer {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-top: 2px solid var(--border-color);
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: var(--bg-secondary);
    transform: translateY(-1px);
}

.btn-primary {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:disabled {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: not-allowed;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Remove old batch form styles that are not needed */
.batch-form,
.batch-title,
.batch-inputs,
.batch-btn {
    display: none !important;
}

.participants-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}

.empty-list {
    grid-column: 1 / -1;
    text-align: center;
    color: var(--text-secondary);
    padding: 2rem;
    font-style: italic;
}

.participant-card {
    background-color: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.participant-card:hover {
    border-color: var(--accent-gold);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
}

.participant-number {
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.9rem;
    min-width: 20px;
    text-align: left;
}

.nickname {
    color: var(--accent-gold);
    font-weight: 600;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.vocation {
    color: var(--text-primary);
    font-size: 0.9rem;
    flex: 1;
    text-align: center;
}

.level {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
}

.remove-btn {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
}

.remove-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    border-color: rgba(239, 68, 68, 0.5);
    transform: scale(1.1);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .content-container {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .bosses-container {
    flex-direction: column !important;
    }

    .boss-section {
        padding: 1.5rem;
    }

    .boss-header {
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
    }

    .boss-icon {
        width: 48px;
        height: 48px;
    }

    .boss-header h3 {
        font-size: 1.3rem;
    }

    .form-inputs {
        flex-direction: column;
        align-items: stretch;
    }

    .batch-inputs {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .batch-textarea {
        flex: none;
    }

    .input-field {
        width: 100%;
    }

    .participants-list {
        grid-template-columns: 1fr;
    }

    .participant-card {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        gap: 0.5rem;
    }

    .nickname,
    .vocation {
        text-align: center;
    }

    .remove-btn {
        align-self: center;
    }
}

@media (max-width: 480px) {
    .content-container {
        padding: 0.5rem;
    }

    .bosses-container {
        gap: 1rem;
    }

    .boss-section {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.3rem;
    }

    .boss-header h3 {
        font-size: 1.2rem;
    }
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.password-modal {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.password-modal h3 {
    color: var(--accent-gold);
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
}

.password-input {
    width: 100%;
    background-color: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem;
    color: var(--text-primary);
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.password-input:focus {
    outline: none;
    border-color: var(--accent-gold);
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.confirm-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.confirm-btn {
    background: linear-gradient(135deg, var(--accent-gold), #d97706);
    color: white;
}

.cancel-btn {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}

.confirm-btn:hover, .cancel-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.error-message {
    color: #ef4444;
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
}
</style>