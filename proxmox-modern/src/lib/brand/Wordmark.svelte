<script>
  import Logo from './Logo.svelte';
  export let size = 28;
  export let dark = false;
</script>

<a href="/" class="inline-flex items-center gap-2.5" aria-label="Proxmox home">
  <Logo {size} color="#E57000" />
  <span
    class="font-display tracking-tight"
    style="font-size: {size * 0.72}px; font-weight: 600; letter-spacing: -0.025em; color: {dark ? 'var(--color-night-text)' : 'var(--color-ink)'};"
  >
    Proxmox
  </span>
</a>
