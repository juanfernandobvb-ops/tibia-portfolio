<template>
  <div class="black-panthers-page">
    <div class="split-container">
      <div class="left-half">
        <h2>Membros Online</h2>
        <div v-if="loading" class="loading-msg">Carregando membros online...</div>
        <div v-else>
          <ul v-if="onlineMembers.length">
            <li v-for="member in onlineMembers" :key="member.name">
              <span class="status-dot online"></span>
              <strong>{{ member.name }}</strong> <span class="level">(Level {{ member.level }})</span> <span class="vocation">- {{ member.vocation }}</span>
            </li>
          </ul>
          <div v-else class="no-online">Nenhum membro online no momento.</div>
        </div>
      </div>
      <div class="right-half">
        <h2>Mortes Recentes</h2>
        <div class="death-console">
          <div v-if="deathsLoading">Carregando mortes...</div>
          <template v-else>
            <div v-if="deaths.length">
              <div v-for="death in deaths" :key="death.id" class="death-line">
                <span class="death-time">[{{ death.time }}]</span>
                <span class="death-msg">{{ death.msg }}</span>
              </div>
            </div>
            <div v-else class="no-deaths">Nenhuma morte recente encontrada.</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlackPanthers',
  data() {
    return {
      onlineMembers: [],
      loading: true,
      world: 'Inabra',
      guild: 'Black Panthers',
      deaths: [],
      deathsLoading: true,
    }
  },
  mounted() {
    this.fetchOnlineMembers()
    this.fetchDeaths()
    this._interval = setInterval(() => {
      this.fetchOnlineMembers()
      this.fetchDeaths()
    }, 60000)
  },
  beforeUnmount() {
    clearInterval(this._interval)
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
        this.onlineMembers = []
      }
      this.loading = false
    },
    async fetchDeaths() {
      this.deathsLoading = true
      try {
        // Buscar membros da guild
        const guildRes = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(this.guild)}`)
        const guildData = await guildRes.json()
        const members = (guildData.guild && Array.isArray(guildData.guild.members)) ? guildData.guild.members : []
        // Buscar mortes de cada membro (limite para evitar excesso de requisições)
        const maxMembers = 10 // Limite para evitar flood
        const deathsArr = []
        for (let i = 0; i < Math.min(members.length, maxMembers); i++) {
          const member = members[i]
          const charRes = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(member.name)}`)
          const charData = await charRes.json()
          const deaths = (charData.character && charData.character.deaths) ? charData.character.deaths : []
          deaths.forEach(d => {
            deathsArr.push({
              id: member.name + d.time + d.level,
              time: d.time,
              msg: `${member.name} (Lv${d.level}) morreu para ${d.reason}`
            })
          })
        }
        // Ordenar por data/hora decrescente
        deathsArr.sort((a, b) => new Date(b.time) - new Date(a.time))
        this.deaths = deathsArr.slice(0, 30) // Mostra só as 30 mais recentes
      } catch (e) {
        this.deaths = []
      }
      this.deathsLoading = false
    }
  }
}
</script>

<style scoped>
.black-panthers-page {
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
.left-half ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.left-half li {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #23232b;
  border-bottom: 1px solid #29293a;
  padding: 0.7rem 0.2rem;
  font-size: 1.08rem;
  transition: background 0.18s;
}
.left-half li:last-child {
  border-bottom: none;
}
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.4em;
  background: #22c55e;
}
.level {
  color: #fbbf24;
  font-weight: 600;
}
.vocation {
  color: #a3a3a3;
}
.loading-msg, .no-online {
  color: #888;
  margin-top: 1.2rem;
}
.death-console {
  background: #18181b;
  color: #e5e5e5;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 1.01rem;
  border-radius: 8px;
  padding: 1.2rem 1rem;
  min-height: 220px;
  max-height: 60vh;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0 1px 6px rgba(0,0,0,0.10);
}
.death-line {
  margin-bottom: 0.3rem;
  white-space: pre-line;
}
.death-time {
  color: #fbbf24;
  margin-right: 0.7em;
}
.death-msg {
  color: #e5e5e5;
}
.no-deaths {
  color: #888;
  margin-top: 1.2rem;
}
@media (max-width: 900px) {
  .split-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  .left-half, .right-half {
    padding: 1.2rem 0.7rem;
  }
}
</style>
