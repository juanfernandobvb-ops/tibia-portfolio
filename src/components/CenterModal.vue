<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-box">
      <button class="close-modal-btn" @click="close">&times;</button>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CenterModal',
  emits: ['close'],
  methods: {
    close() {
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
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-box {
  background: var(--bg-primary, #18181b);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.32);
  padding: 2.5rem 3.5rem;
  min-width: 320px;
  max-width: 98vw;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}
.close-modal-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  color: #fff;
  font-size: 2rem;
  border: none;
  cursor: pointer;
}
</style>
