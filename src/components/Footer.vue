<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">&copy; 2025 Projeto Tibia. Todos os direitos reservados.</p>
      <div class="footer-links">
        <a href="#" class="footer-link">Privacidade</a>
        <a href="#" class="footer-link">Termos</a>
        <a href="#" class="footer-link">Suporte</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding: 1.5rem 2rem;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
  z-index: 50;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--accent-gold);
}
</style>
