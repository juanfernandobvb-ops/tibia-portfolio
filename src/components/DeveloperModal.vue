<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Sobre o Desenvolvedor</h2>
          <button class="modal-close" @click="closeModal">
            <span>&times;</span>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="developer-info">
            <div class="avatar-section">
              <div class="avatar-placeholder">
                👨‍💻
              </div>
              <h3 class="developer-name">Juan Fernando de Moraes Osti</h3>
              <p class="developer-title">Desenvolvedor Front-End</p>
            </div>
            
            <div class="info-section">
              <h4>Sobre Mim</h4>
              <p>
                Desenvolvedor Front-End Jr com experiência no desenvolvimento de soluções voltadas ao processamento inteligente de dados, utilizando Javascript, Vue 3, HTML e CSS. Atuei na criação e evolução de produtos internos focados na leitura, interpretação e extração automática de informações em documentos, aplicando técnicas de IA e automação.
              </p>
              <p>
                Também participei do desenvolvimento de um sistema de onboarding de informações para a ANS, contribuindo para interfaces, consumo de APIs e otimização de fluxos complexos de dados, garantindo precisão e eficiência nos processos.
              </p>
              <p>
                Minha trajetória em tecnologia começou em 2021, envolvendo atividades de controle e garantia de qualidade, organização de dados e uso avançado de ferramentas como Microsoft Excel. Atualmente, estou em busca de novas oportunidades para aplicar minhas habilidades em desenvolvimento frontend, integração de sistemas e automação.
              </p>
              
              <h4>Tecnologias</h4>
              <div class="tech-tags">
                <span class="tech-tag">Vue 3</span>
                <span class="tech-tag">Git</span>
                <span class="tech-tag">CSS</span>
                <span class="tech-tag">HTML5</span>
                <span class="tech-tag">SCSS</span>
                <span class="tech-tag">JavaScript</span>
                <span class="tech-tag">Bootstrap</span>
                <span class="tech-tag">Chart.js</span>
                <span class="tech-tag">Vue Router</span>
                <span class="tech-tag">API REST</span>
                <span class="tech-tag">Figma</span>
              </div>
              
              <h4>Contato</h4>
              <div class="contact-links">
                <a href="mailto:juanfernando.cdc@gmail.com" class="contact-link">
                  📧 juanfernando.cdc@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/juan-fernando-a46ab9182/" target="_blank" class="contact-link">
                  💼 LinkedIn
                </a>
                <a href="#" class="contact-link">
                  🔗 GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Fechar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'DeveloperModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
  border: 2px solid var(--border-color);
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(157, 78, 221, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.modal-title {
  color: var(--accent-gold);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background-color: var(--bg-tertiary);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.developer-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.avatar-section {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(157, 78, 221, 0.1), rgba(199, 125, 255, 0.05));
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.avatar-placeholder {
  font-size: 4rem;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--accent-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.developer-name {
  color: var(--accent-gold);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.developer-title {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.info-section h4 {
  color: var(--accent-secondary);
  font-size: 1.2rem;
  margin: 1.5rem 0 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.info-section h4:first-child {
  margin-top: 0;
}

.info-section p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tech-tags {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.tech-tag:hover {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
  transform: translateY(-1px);
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 8px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-link:hover {
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  background-color: rgba(255, 215, 0, 0.1);
  transform: translateX(5px);
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: var(--accent-primary);
  color: white;
  border: 2px solid var(--accent-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: transparent;
  color: var(--accent-primary);
  transform: translateY(-2px);
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.8) translateY(-50px);
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1.5rem;
  }
  
  .developer-info {
    gap: 1.5rem;
  }
  
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }
  
  .contact-links {
    gap: 0.5rem;
  }
}
</style>