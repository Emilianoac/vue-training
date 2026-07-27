<template>
  <!-- Por favor no elimines los atributos data-testid: los tests los usan para validar tu solución. -->
  <section class="panel">
    <header data-testid="panel-header" class="panel-header">
      <!-- TODO: añade un slot header con el titulo "Panel" como contenido de respaldo. -->
    </header>

    <div data-testid="panel-content" class="panel-content">
      <!-- TODO: añade el slot por defecto. -->
    </div>

    <footer data-testid="panel-actions" class="panel-actions">
      <!-- TODO: añade un slot actions. -->
    </footer>
  </section>
</template>

<style scoped>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.panel {
  overflow: hidden;
  color: var(--card-foreground);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.panel-header,
.panel-content,
.panel-actions {
  padding: 1.25rem;
}

.panel-header {
  border-bottom: 1px solid var(--border);
}

.panel-content {
  min-height: 7rem;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: var(--muted);
  border-top: 1px solid var(--border);
}
</style>
