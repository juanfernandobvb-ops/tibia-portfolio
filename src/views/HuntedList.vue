<template>
  <div class="hunted-list-page">
    <h1>Guild Nexus - Inabra</h1>
    <div class="split-container">
      <div class="left-half">
        <h2>Membros Online</h2>
        <div v-if="loading" class="loading-msg">Carregando membros online...</div>
        <div v-else>
          <template v-if="onlineByVocation.length">
            <div v-for="group in onlineByVocation" :key="group.vocation" class="vocation-group">
              <h3 class="vocation-title">{{ group.vocation }}</h3>
              <ul>
                <li v-for="member in group.members" :key="member.name">
                  <span class="status-dot online"></span>
                  <strong>{{ member.name }}</strong> <span class="level">(Level {{ member.level }})</span>
                  <span class="rank">{{ member.rank }}</span>
                </li>
              </ul>
            </div>
          </template>
          <div v-else class="no-online">Nenhum membro online no momento.</div>
        </div>
      </div>
      <div class="right-half">
        <h2>Todos os Membros</h2>
        <div class="all-members-section">
          <div v-if="allMembersLoading">Carregando membros...</div>
          <template v-else>
            <div v-if="allMembersByVocation.length">
              <div v-for="group in allMembersByVocation" :key="group.vocation" class="vocation-group">
                <h3 class="vocation-title">{{ group.vocation }} ({{ group.members.length }})</h3>
                <ul>
                  <li v-for="member in group.members" :key="member.name" :class="{ online: member.status && member.status.toLowerCase() === 'online' }">
                    <span :class="['status-dot', member.status && member.status.toLowerCase() === 'online' ? 'online' : 'offline']"></span>
                    <strong>{{ member.name }}</strong> 
                    <span class="level">(Level {{ member.level }})</span>
                    <span class="rank">{{ member.rank }}</span>
                    <span v-if="member.status && member.status.toLowerCase() === 'online'" class="online-status">Online</span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="no-members">Nenhum membro encontrado.</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HuntedList',
  data() {
    return {
      onlineMembers: [],
      allMembers: [],
      loading: true,
      allMembersLoading: true,
      world: 'Inabra',
      guild: 'Nexus'
    }
  },

  computed: {
    onlineByVocation() {
      // Agrupa membros online por vocação
      const groups = {}
      for (const m of this.onlineMembers) {
        if (!groups[m.vocation]) groups[m.vocation] = []
        groups[m.vocation].push(m)
      }
      // Retorna array de objetos { vocation, members }
      return Object.entries(groups).map(([vocation, members]) => ({ vocation, members }))
    },
    allMembersByVocation() {
      // Agrupa todos os membros por vocação
      const groups = {}
      for (const m of this.allMembers) {
        if (!groups[m.vocation]) groups[m.vocation] = []
        groups[m.vocation].push(m)
      }
      // Retorna array de objetos { vocation, members } ordenado por vocação
      return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([vocation, members]) => ({ 
          vocation, 
          members: members.sort((a, b) => b.level - a.level) // Ordena por level decrescente
        }))
    }
  },
  mounted() {
    this.fetchOnlineMembers()
    this.fetchAllMembers()
    this._intervalOnline = setInterval(() => {
      this.fetchOnlineMembers()
    }, 120000) // 2 minutos
    this._intervalAll = setInterval(() => {
      this.fetchAllMembers()
    }, 300000) // 5 minutos
  },
  beforeUnmount() {
    clearInterval(this._intervalOnline)
    clearInterval(this._intervalAll)
  },
  methods: {
    async fetchOnlineMembers() {
      this.loading = true
      try {
        const guildRes = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(this.guild)}`)
        const guildData = await guildRes.json()
        const members = (guildData.guild && Array.isArray(guildData.guild.members)) ? guildData.guild.members : []
        this.onlineMembers = members.filter(m => m.status && m.status.toLowerCase() === 'online')
      } catch (e) {
        console.error('Erro ao buscar membros online:', e)
        this.onlineMembers = []
      }
      this.loading = false
    },
    async fetchAllMembers() {
      this.allMembersLoading = true
      try {
        const guildRes = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(this.guild)}`)
        const guildData = await guildRes.json()
        this.allMembers = (guildData.guild && Array.isArray(guildData.guild.members)) ? guildData.guild.members : []
      } catch (e) {
        console.error('Erro ao buscar todos os membros:', e)
        this.allMembers = []
      }
      this.allMembersLoading = false
    }
  }
}
</script>

<style scoped>
.hunted-list-page {
  padding: 2rem;
  min-height: 100vh;
  background: #18181b;
}
.split-container {
  display: flex;
  gap: 2rem;
  min-height: 60vh;
}
.left-half, .right-half {
  flex: 1 1 0;
  background: #23232b;
  border-radius: 14px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.right-half {
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;
}
h1 {
  color: #fbbf24;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
}
h2 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.35rem;
  color: #fbbf24;
  letter-spacing: 0.5px;
}
.vocation-title {
  color: #6366f1;
  font-size: 1.1rem;
  margin: 1.2rem 0 0.8rem 0;
  font-weight: 600;
}
.vocation-group:first-child .vocation-title {
  margin-top: 0;
}
.left-half ul, .right-half ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.left-half li, .right-half li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #23232b;
  border-bottom: 1px solid #29293a;
  padding: 0.7rem 0.2rem;
  font-size: 1.08rem;
  transition: background 0.18s;
}
.left-half li:last-child, .right-half li:last-child {
  border-bottom: none;
}
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.4em;
}
.status-dot.online {
  background: #22c55e;
}
.status-dot.offline {
  background: #888;
}
.level {
  color: #fbbf24;
  font-weight: 600;
}
.rank {
  color: #a3a3a3;
  font-size: 0.95rem;
  margin-left: auto;
}
.online-status {
  color: #22c55e;
  font-weight: bold;
  font-size: 0.9rem;
  margin-left: auto;
}
.loading-msg, .no-online, .no-members {
  color: #888;
  margin-top: 1.2rem;
}
.all-members-section {
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}
.all-members-section::-webkit-scrollbar {
  width: 6px;
}
.all-members-section::-webkit-scrollbar-track {
  background: #18181b;
  border-radius: 3px;
}
.all-members-section::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 3px;
}
.all-members-section::-webkit-scrollbar-thumb:hover {
  background: #4f46e5;
}
@media (max-width: 900px) {
  .split-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  .hunted-list-page {
    padding: 1rem;
  }
}
</style>
