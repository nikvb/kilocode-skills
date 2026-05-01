<script lang="ts">
  import { page } from '$app/stores';
  import { ArrowRight, Home, Boxes, BookOpen, MessageSquare } from 'lucide-svelte';

  const links = [
    { href: '/', icon: Home, title: 'Home', body: 'Back to the platform overview.' },
    { href: '/products', icon: Boxes, title: 'Products', body: 'PVE, PBS, PMG, and PDM.' },
    { href: '/docs', icon: BookOpen, title: 'Documentation', body: 'Admin guides and references.' },
    { href: '/contact', icon: MessageSquare, title: 'Contact', body: 'Talk to a Proxmox engineer.' }
  ];

  $: status = $page.status;
  $: errorMessage = $page.error?.message;
</script>

<section class="ink-section relative overflow-hidden min-h-[100vh] flex items-center">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(900px 460px at 78% 18%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative py-24 md:py-32 w-full">
    <div class="max-w-3xl">
      <div
        class="font-display mb-6 leading-none"
        style="font-family: var(--font-display); font-weight: 450; font-size: clamp(6rem, 18vw + 1rem, 14rem); letter-spacing: -0.05em; color: var(--color-primary)"
        aria-hidden="true"
      >
        {status}
      </div>

      <h1 class="mb-6" style="color: var(--color-night-text)">
        This page is <span class="quote-italic" style="color: var(--color-primary)">not in the cluster.</span>
      </h1>

      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed mb-4" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        The route you asked for doesn't exist or has migrated. Try one of these:
      </p>

      {#if status !== 404 && errorMessage}
        <p class="text-sm mb-2" style="color: var(--color-night-muted); font-family: var(--font-mono)">
          {errorMessage}
        </p>
      {/if}
    </div>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mt-12">
      {#each links as l}
        <a href={l.href} class="card card-hover p-6 group flex flex-col">
          <span class="feat-icon mb-4"><svelte:component this={l.icon} size={20} /></span>
          <h4 class="mb-2.5" style="color: var(--color-night-text)">{l.title}</h4>
          <p class="text-[15px] leading-relaxed mb-5">{l.body}</p>
          <span class="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
            Go <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>
