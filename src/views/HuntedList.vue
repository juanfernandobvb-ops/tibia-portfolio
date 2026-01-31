<template>
  <div class="hunted-list-page">
    <h1>Hunted List</h1>
    <div class="add-player-box">
      <input v-model="newNick" @keyup.enter="addPlayer" placeholder="Adicionar nick do jogador..." />
      <button @click="addPlayer">Adicionar</button>
    </div>
    <div class="lists-container">
      <div class="hunted-list">
        <h2>Todos os Hunteds</h2>
        <ul>
          <li v-for="player in players" :key="player.name">
            <span>{{ player.name }}</span> |
            <span>Level: {{ player.level }}</span> |
            <span>Vocação: {{ player.vocation }}</span> |
            <span :class="{ online: player.online, offline: !player.online }">
              {{ player.online ? 'Online' : 'Offline' }}
            </span>
            <button @click="removePlayer(player.name)">Remover</button>
          </li>
        </ul>
      </div>
      <div class="hunted-online-list">
        <h2>Hunteds Online</h2>
        <ul>
          <li v-for="player in onlinePlayers" :key="player.name">
            <span>{{ player.name }}</span> |
            <span>Level: {{ player.level }}</span> |
            <span>Vocação: {{ player.vocation }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HuntedList',
  data() {
    return {
      newNick: '',
      players: [], // { name, level, vocation, online }
      world: 'Inabra'
    }
  },
  created() {
    const saved = localStorage.getItem('hunted_players')
    if (saved) {
      try {
        this.players = JSON.parse(saved)
      } catch {}
    }
  },
  computed: {
    onlinePlayers() {
      return this.players.filter(p => p.online)
    }
  },
  mounted() {
    this.startAutoUpdate()
  },
  beforeUnmount() {
    clearInterval(this._huntedInterval)
  },
  methods: {
    async addPlayer() {
      const nick = this.newNick.trim()
      if (!nick || this.players.find(p => p.name.toLowerCase() === nick.toLowerCase())) return
      try {
        const response = await fetch(`https://api.tibiadata.com/v4/character/${encodeURIComponent(nick)}`)
        const data = await response.json()
        if (data.character && data.character.character) {
          const char = data.character.character
          // O campo correto é online_status
          const isOnline = (char.online_status && char.online_status.toLowerCase() === 'online')
          this.players.push({
            name: char.name,
            level: char.level,
            vocation: char.vocation,
            online: isOnline
          })
          this.savePlayers()
          this.newNick = ''
        }
      } catch (e) {
        // Pode exibir erro se quiser
      }
    },
    removePlayer(name) {
      this.players = this.players.filter(p => p.name !== name)
      this.savePlayers()
    },
    savePlayers() {
      localStorage.setItem('hunted_players', JSON.stringify(this.players))
    },
    async updatePlayersStatus() {
      // Busca todos os online do mundo Inabra
      let onlineNames = []
      try {
        const response = await fetch(`https://api.tibiadata.com/v4/world/${this.world}`)
        const data = await response.json()
        console.log('Resposta completa da API:', data)
        if (data.world) {
          console.log('Chaves de data.world:', Object.keys(data.world))
          for (const key of Object.keys(data.world)) {
            if (Array.isArray(data.world[key])) {
              console.log(`data.world['${key}'] (array):`, data.world[key])
            }
          }
        }
        console.log('data.world.players_online:', data.world && data.world.players_online)
        console.log('Array.isArray(data.world.players_online):', data.world && Array.isArray(data.world.players_online))
        if (data.world && Array.isArray(data.world.online_players)) {
          onlineNames = data.world.online_players.map(p => p.name)
        } else {
          console.warn('Estrutura inesperada:', data)
        }
      } catch (e) {
        console.error('Erro ao buscar online:', e)
      }
      // Função para normalizar nomes (case-insensitive, sem espaços, sem acentos)
      const normalize = str => str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, '') // remove todos os espaços
        .replace(/[^a-zA-Z0-9]/g, '') // remove tudo que não for letra ou número
        .toLowerCase()
      // Log para debug
      console.log('Hunteds salvos:', this.players.map(p => p.name))
      console.log('Online no mundo:', onlineNames)
      console.log('Online normalizado:', onlineNames.map(n => normalize(n)))
      // Atualiza status dos hunteds
      for (let i = 0; i < this.players.length; i++) {
        const huntedNorm = normalize(this.players[i].name)
        const found = onlineNames.find(n => normalize(n) === huntedNorm)
        this.players[i].online = !!found
        console.log(`Comparando: '${this.players[i].name}' (${huntedNorm}) => ${found ? 'ONLINE' : 'offline'}`)
      }
      this.savePlayers()
    },
    startAutoUpdate() {
      this.updatePlayersStatus()
      this._huntedInterval = setInterval(() => {
        this.updatePlayersStatus()
      }, 60000) // 60 segundos
    }
  }
}
</script>

<style scoped>
.hunted-list-page {
  padding: 2rem;
}
.add-player-box {
  margin-bottom: 1.5rem;
}
.lists-container {
  display: flex;
  gap: 2rem;
}
.hunted-list, .hunted-online-list {
  flex: 1;
}
.online { color: green; font-weight: bold; }
.offline { color: #888; }
</style>
