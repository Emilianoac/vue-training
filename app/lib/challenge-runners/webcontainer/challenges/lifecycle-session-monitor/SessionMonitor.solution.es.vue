<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const isSessionActive = ref(false);
const secondsOnline = ref(0);
const viewportWidth = ref(0);

let intervalId;

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth;
}

function startSession() {
  isSessionActive.value = true;
  updateViewportWidth();
  window.addEventListener("resize", updateViewportWidth);

  intervalId = setInterval(() => {
    secondsOnline.value++;
  }, 1000);
}

function stopSession() {
  clearInterval(intervalId);
  window.removeEventListener("resize", updateViewportWidth);
}

onMounted(startSession);
onUnmounted(stopSession);
</script>

<template>
  <!-- Por favor no elimines los atributos data-testid: los tests del challenge los usan para validar tu solución. -->
  <section class="session-monitor">
    <span class="eyebrow">Monitor de sesión</span>

    <h2>Estado del componente</h2>

    <dl class="metrics">
      <div class="metric">
        <dt>Estado</dt>
        <dd data-testid="status" :data-active="isSessionActive">
          {{ isSessionActive ? "Sesión activa" : "Sesión inactiva" }}
        </dd>
      </div>

      <div class="metric">
        <dt>Tiempo activo</dt>
        <dd data-testid="seconds-online">{{ secondsOnline }}s</dd>
      </div>

      <div class="metric">
        <dt>Ancho de pantalla</dt>
        <dd data-testid="viewport-width">{{ viewportWidth }}px</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.session-monitor {
  display: grid;
  gap: 1rem;
  max-width: 30rem;
  margin: 2.5rem auto 0;
  padding: 1.5rem;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.eyebrow {
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  color: var(--foreground);
  font-size: 1.35rem;
}

.metrics {
  display: grid;
  gap: 0.75rem;
  margin: 0;
}

.metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

dt {
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

dd {
  margin: 0;
  color: var(--foreground);
  font-weight: 700;
}
</style>
