<template>
  <div class="ts-description-page">
    <h1>TS Description</h1>
    <form class="form-container">
      <div class="form-group">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="formData.nome" placeholder="Digite o nome" />
      </div>
      
      <div class="form-group">
        <label for="main">Main:</label>
        <input type="text" id="main" v-model="formData.main" placeholder="Digite o main" />
      </div>
      
      <div class="form-group-multiple">
        <div class="label-with-btn">
          <label>Maker:</label>
          <button type="button" class="btn-add" @click="addMaker">+</button>
        </div>
        <div v-for="(maker, index) in formData.maker" :key="`maker-${index}`" class="input-with-remove">
          <input type="text" v-model="formData.maker[index]" :placeholder="`Maker ${index + 1}`" />
          <button v-if="formData.maker.length > 1" type="button" class="btn-remove" @click="removeMaker(index)">−</button>
        </div>
      </div>
      
      <div class="form-group-multiple">
        <div class="label-with-btn">
          <label>Bomba:</label>
          <button type="button" class="btn-add" @click="addBomba">+</button>
        </div>
        <div v-for="(bomba, index) in formData.bomba" :key="`bomba-${index}`" class="input-with-remove">
          <input type="text" v-model="formData.bomba[index]" :placeholder="`Bomba ${index + 1}`" />
          <button v-if="formData.bomba.length > 1" type="button" class="btn-remove" @click="removeBomba(index)">−</button>
        </div>
      </div>

      <button type="button" class="btn-gerar" @click="gerarOutput">Gerar</button>
    </form>

    <div v-if="output" class="output-container">
      <h2>Resultado:</h2>
      <div class="output-box">
        {{ output }}
      </div>
      <button type="button" class="btn-copy" @click="copiarOutput">Copiar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tsDescription',
  data() {
    return {
      formData: {
        nome: '',
        main: '',
        maker: [''],
        bomba: ['']
      },
      output: ''
    }
  },
  methods: {
    addMaker() {
      this.formData.maker.push('')
    },
    removeMaker(index) {
      this.formData.maker.splice(index, 1)
    },
    addBomba() {
      this.formData.bomba.push('')
    },
    removeBomba(index) {
      this.formData.bomba.splice(index, 1)
    },
    gerarOutput() {
      const nome = this.formData.nome.trim()
      const main = this.formData.main.trim()
      const makers = this.formData.maker.filter(m => m.trim()).join(', ')
      const bombas = this.formData.bomba.filter(b => b.trim()).join(', ')

      if (!nome || !main) {
        alert('Por favor, preencha Nome e Main!')
        return
      }

      let output = `${nome} - Main: ${main}`

      if (makers) {
        output += ` | Maker: ${makers}`
      }

      if (bombas) {
        output += ` | Bomba: ${bombas}`
      }

      this.output = output
    },
    copiarOutput() {
      navigator.clipboard.writeText(this.output).then(() => {
        alert('Copiado para a área de transferência!')
      }).catch(() => {
        alert('Erro ao copiar!')
      })
    }
  }
}
</script>

<style scoped>
.ts-description-page {
  padding: 2rem;
  min-height: 100vh;
  background: #18181b;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

h1 {
  color: #fbbf24;
  font-size: 2.2rem;
  margin-bottom: 0;
}

h2 {
  color: #fbbf24;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  background: #23232b;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #fbbf24;
  font-weight: 600;
  font-size: 1rem;
}

.form-group input {
  padding: 0.75rem;
  background: #18181b;
  border: 1px solid #6366f1;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
}

.form-group input::placeholder {
  color: #888;
}

.form-group-multiple {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label-with-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.label-with-btn label {
  color: #fbbf24;
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
}

.btn-add {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: #4f46e5;
  transform: scale(1.1);
}

.input-with-remove {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.input-with-remove input {
  flex: 1;
  padding: 0.75rem;
  background: #18181b;
  border: 1px solid #6366f1;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-with-remove input:focus {
  outline: none;
  border-color: #fbbf24;
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
}

.btn-remove {
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

.btn-gerar {
  background: #22c55e;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-gerar:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.output-container {
  background: #23232b;
  padding: 2rem;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.13);
  max-width: 500px;
}

.output-box {
  background: #18181b;
  border: 1px solid #6366f1;
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  margin-bottom: 1rem;
}

.btn-copy {
  background: #6366f1;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-copy:hover {
  background: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
</style>
