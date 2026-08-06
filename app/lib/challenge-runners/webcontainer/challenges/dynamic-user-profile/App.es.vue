<template>
  <main class="directory-page">
    <header class="page-heading">
      <span class="eyebrow">Directorio</span>
      <h1>Personas que hicieron historia</h1>
      <p>Cambia de perfil sin recargar la aplicación.</p>
    </header>

    <nav class="profile-nav" aria-label="Perfiles">
      <RouterLink :to="{ name: 'user', params: { id: 'ada' } }">Ada</RouterLink>
      <RouterLink :to="{ name: 'user', params: { id: 'grace' } }">Grace</RouterLink>
      <RouterLink :to="{ name: 'user', params: { id: 'margaret' } }">Margaret</RouterLink>
      <RouterLink :to="{ name: 'user', params: { id: 'unknown' } }">Desconocido</RouterLink>
    </nav>

    <RouterView />
  </main>
</template>

<style>
/* Por favor no edites estos estilos por ahora: solo dan forma al preview del challenge. */
.directory-page { display: grid; gap: 1.5rem; width: min(100% - 2rem, 44rem); margin: min(10vh, 4rem) auto; color: var(--foreground); }
.page-heading { display: grid; gap: 0.3rem; }
.page-heading h1, .page-heading p, .profile-card h2, .profile-card p, .not-found p { margin: 0; }
.page-heading p, .profile-card p, .not-found p { color: var(--muted-foreground); }
.eyebrow { color: var(--muted-foreground); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.profile-nav { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.profile-nav a { padding: 0.5rem 0.75rem; color: var(--foreground); text-decoration: none; background: var(--background); border: 1px solid var(--border); border-radius: 0.375rem; }
.profile-nav a.router-link-active { color: var(--primary-foreground); background: var(--primary); border-color: var(--primary); }
.profile-card, .not-found { display: grid; gap: 0.5rem; min-height: 10rem; padding: 1.5rem; align-content: center; background: var(--card); border: 1px solid var(--border); border-radius: 0.5rem; }
.user-id { color: var(--muted-foreground); font-family: monospace; font-size: 0.75rem; text-transform: uppercase; }
</style>
