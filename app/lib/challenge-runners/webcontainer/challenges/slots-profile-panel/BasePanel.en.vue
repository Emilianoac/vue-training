<template>
  <!-- Please do not remove the data-testid attributes: the tests use them to validate your solution. -->
  <section class="panel">
    <header data-testid="panel-header" class="panel-header">
      <!-- TODO: add a header slot with "Panel" as its fallback title. -->
    </header>

    <div data-testid="panel-content" class="panel-content">
      <!-- TODO: add the default slot. -->
    </div>

    <footer data-testid="panel-actions" class="panel-actions">
      <!-- TODO: add an actions slot. -->
    </footer>
  </section>
</template>

<style scoped>
/* Please do not edit these styles for now: they only shape the challenge preview. */
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
