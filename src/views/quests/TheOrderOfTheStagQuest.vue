<template>
  <div class="quest-detail">
    <div class="quest-header">
      <img 
        src="/src/assets/images/quests/the-order-of-the-stag/theOrderStagQuest.gif" 
        alt="The Order of the Stag Quest"
        class="quest-banner"
      >
      <h1>The Order of the Stag Quest</h1>
    </div>

    <div class="quest-meta">
      <div class="meta-row">
        <div>
          <strong>Nível Requerido:</strong>
          <span>100+</span>
        </div>
        <div>
          <strong>Tempo Estimado:</strong>
          <span>3-4 horas</span>
        </div>
        <div>
          <strong>Dificuldade:</strong>
          <span>Muito Difícil</span>
        </div>
        <div>
          <strong>Tipo:</strong>
          <span>Story Quest</span>
        </div>
      </div>

      <div class="meta-highlight">
        <span><strong>Recompensas:</strong> Acesso ao Hunting Ground, Title "Herald of the Stag"</span>
        <span><strong>Local:</strong> Isle of Ada via Bounac</span>
      </div>
    </div>

    <section class="quest-info">
      <h2>Descrição</h2>
      <p class="desc-text">
        Uma das quests mais desafiadoras e rewarding de Tibia, The Order of the Stag Quest 
        leva você através de uma jornada épica para ajudar a ordem de cavaleiros de Bounac. 
        Prepare-se para enfrentar inimigos poderosos e desvendar mistérios antigos nesta aventura emocionante.
      </p>
    </section>

    <div class="quest-requirements">
      <h2>Requerimentos</h2>
      <ul class="meta-list">
        <li>Ter finalizado a The Order of the Lion Quest</li>
        <li>Frozen Starlight</li>
        <li>Pick</li>
        <li>Obsidian Knife</li>
        <li>Uma arma física</li>
        <li><strong>Para missão opcional Supplies for the Steadfast:</strong></li>
        <li>20x Tender Venison</li>
        <li><strong>Para missão opcional Reparo do barco Emmanuelle:</strong></li>
        <li>30x Salvaged Iron Parts</li>
        <li>20x Salvaged Bronze Parts</li>
        <li>10x Salvaged Silver Parts</li>
      </ul>
    </div>

    <div class="quest-chapter">
      <h2>Order of the Stag</h2>
      <div class="chapter-warning">
        <span class="alert-icon">⚠️</span>
        O NPC Kesar The Younger só pode ser encontrado durante o dia. XX:15 até XX:45
      </div>
      <div class="chapter-content">
        <p>
          Para iniciar a quest, vá até Bounac e fale com o NPC <strong>Kesar The Younger</strong>.
        </p>
        <p class="npc-dialogue">
          Diga: <span class="dialogue-keyword">hi</span> - <span class="dialogue-keyword">help</span> para começar a missão.
        </p>
        <div class="npc-dialogue-box">
          <div class="dialogue-bubble">
            <p><span class="npc-name">Kesar the Younger:</span> Hail, what can I do for the hero of Bounac? The siege is finally under control, thanks to you. Meanwhile, another problem has left me in dismay.</p>
            <p><span class="player-name">Jogador:</span> Problem</p>
            <p><span class="npc-name">Kesar the Younger:</span> I have sent a party of my best men on a mission to a certain island to... investigate a royal matter. However, they have yet to send news from their quest.</p>
            <p><span class="npc-name">Kesar the Younger:</span> Hero of Bounac and royal advisor of the court, I am in need of your help once again.</p>
            <p><span class="player-name">Jogador:</span> Help</p>
            <p><span class="npc-name">Kesar the Younger:</span> My knights embarked on the Emmanuelle, our flagship. They were to set sail for the Isle of Ada to retrieve word from an old order of... knights, residing there.</p>
            <p><span class="npc-name">Kesar the Younger:</span> There is, however, another twist to this tale, I fear I cannot keep from you. A long kept Bounacean secret has is about to be lifted, all in due time.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="quest-chapter">
      <h2>Navegando para Isle of Ada</h2>
      <div class="chapter-content">
        <p>
          Após aceitar a missão, você deve se dirigir ao cais de Bounac e embarcar no navio que o 
          levará até Isle of Ada. Prepare-se adequadamente, pois a ilha está cheia de perigos.
        </p>
        <div class="chapter-warning">
          <span class="alert-icon">⚠️</span>
          Recomenda-se levar supplies suficientes e formar um grupo antes de partir.
        </div>
      </div>
    </div>

    <div class="quest-chapter">
      <h2>Explorando a Ilha</h2>
      <div class="chapter-content">
        <p>
          Na Isle of Ada, você encontrará diversos desafios e inimigos poderosos. 
          Siga as pistas deixadas pelos cavaleiros e desvende os mistérios da Order of the Stag.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheOrderOfTheStagQuest'
}
</script>

<style scoped>
.quest-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-primary);
}

.quest-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--gradient-dark);
  border-radius: 16px;
  border: 2px solid var(--border-accent);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.quest-header h1 {
  background: var(--gradient-gold);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.quest-banner {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--border-accent);
  transition: transform 0.3s ease;
}

.quest-banner:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-glow);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.quest-meta {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid var(--border-color);
}

.meta-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.meta-row > div {
  background: var(--bg-tertiary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.meta-row > div:hover {
  background: var(--bg-hover);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.meta-row strong {
  color: var(--accent-secondary);
  display: block;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.meta-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meta-list li {
  color: var(--text-secondary);
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--border-color);
}

.meta-list li:last-child {
  border-bottom: none;
}

.meta-highlight {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-tertiary);
  border-radius: 12px;
  border-left: 4px solid var(--accent-gold);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.meta-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-gold);
}

.meta-highlight span {
  color: var(--text-primary);
  font-weight: 500;
}

.meta-highlight strong {
  color: var(--accent-gold);
}

.quest-info, .quest-requirements, .quest-chapter {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.quest-info:hover, .quest-requirements:hover, .quest-chapter:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-lg);
}

.quest-info h2, .quest-requirements h2, .quest-chapter h2 {
  color: var(--accent-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--accent-primary);
}

.desc-text {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1.1rem;
}

.chapter-content {
  color: var(--text-secondary);
  line-height: 1.6;
}

.chapter-content p {
  margin-bottom: 1rem;
}

.chapter-warning {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--accent-red);
  border-radius: 12px;
  padding: 1rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.chapter-warning .alert-icon {
  color: var(--accent-red);
}

.alert-icon {
  font-size: 1.2rem;
}

.npc-dialogue {
  background-color: var(--bg-tertiary);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border-left: 4px solid var(--accent-secondary);
}

.dialogue-keyword {
  background-color: var(--accent-primary);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  margin: 0 0.25rem;
}

.npc-dialogue-box {
  background-color: var(--bg-tertiary);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border: 1px solid var(--border-color);
}

.dialogue-bubble p {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.dialogue-bubble p:last-child {
  margin-bottom: 0;
}

.npc-name {
  color: var(--accent-gold);
  font-weight: 600;
}

.player-name {
  color: var(--accent-secondary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .quest-detail {
    padding: 1rem;
  }
  
  .quest-header h1 {
    font-size: 2rem;
  }
  
  .meta-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .meta-highlight {
    grid-template-columns: 1fr;
  }
}
</style>