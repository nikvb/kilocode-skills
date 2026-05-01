<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import Wordmark from '$lib/brand/Wordmark.svelte';
  import { Menu, X, ChevronDown, Download, Server, Database, Mail, LayoutDashboard } from 'lucide-svelte';

  let scrolled = false;
  let open = false;
  let productsOpen = false;
  let solutionsOpen = false;

  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  $: pathname = $page.url.pathname;
  $: closeAll = () => {
    open = false;
    productsOpen = false;
    solutionsOpen = false;
  };
</script>

<header
  class="fixed top-0 left-0 right-0 z-40 transition-all duration-200"
  class:bg-paper={scrolled}
  class:shadow-sm={scrolled}
  class:bg-bg={!scrolled}
  style:border-bottom={scrolled ? '1px solid var(--color-border)' : '1px solid transparent'}
>
  <div class="container-page flex items-center justify-between gap-6 py-3.5">
    <Wordmark size={26} />

    <nav class="hidden lg:flex items-center gap-7" aria-label="Primary">
      <div class="relative" on:mouseenter={() => (productsOpen = true)} on:mouseleave={() => (productsOpen = false)}>
        <button
          class="nav-link inline-flex items-center gap-1"
          aria-expanded={productsOpen}
          aria-haspopup="true"
          on:click={() => (productsOpen = !productsOpen)}
        >
          Products <ChevronDown size={14} />
        </button>
        {#if productsOpen}
          <div class="absolute top-full left-0 pt-3" role="menu">
            <div class="w-[460px] card p-2 shadow-xl">
              <a href="/products/virtual-environment" class="flex gap-3 p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="feat-icon shrink-0"><Server size={20} /></span>
                <span>
                  <span class="block font-semibold text-ink">Proxmox Virtual Environment</span>
                  <span class="block text-sm" style="color: var(--color-muted)">KVM + LXC, clustered, with Ceph and SDN</span>
                </span>
              </a>
              <a href="/products/backup-server" class="flex gap-3 p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="feat-icon shrink-0"><Database size={20} /></span>
                <span>
                  <span class="block font-semibold text-ink">Proxmox Backup Server</span>
                  <span class="block text-sm" style="color: var(--color-muted)">Encrypted, deduplicating, incremental backups</span>
                </span>
              </a>
              <a href="/products/mail-gateway" class="flex gap-3 p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="feat-icon shrink-0"><Mail size={20} /></span>
                <span>
                  <span class="block font-semibold text-ink">Proxmox Mail Gateway</span>
                  <span class="block text-sm" style="color: var(--color-muted)">Spam, virus, and phishing defense</span>
                </span>
              </a>
              <a href="/products/datacenter-manager" class="flex gap-3 p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="feat-icon shrink-0"><LayoutDashboard size={20} /></span>
                <span>
                  <span class="block font-semibold text-ink">Datacenter Manager</span>
                  <span class="block text-sm" style="color: var(--color-muted)">One pane of glass across every cluster — alpha</span>
                </span>
              </a>
            </div>
          </div>
        {/if}
      </div>

      <div class="relative" on:mouseenter={() => (solutionsOpen = true)} on:mouseleave={() => (solutionsOpen = false)}>
        <button
          class="nav-link inline-flex items-center gap-1"
          aria-expanded={solutionsOpen}
          aria-haspopup="true"
          on:click={() => (solutionsOpen = !solutionsOpen)}
        >
          Solutions <ChevronDown size={14} />
        </button>
        {#if solutionsOpen}
          <div class="absolute top-full left-0 pt-3" role="menu">
            <div class="w-[300px] card p-2 shadow-xl">
              <a href="/solutions/private-cloud" class="block p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="block font-semibold text-ink">Private cloud</span>
                <span class="block text-sm" style="color: var(--color-muted)">VMware exit, on your own hardware</span>
              </a>
              <a href="/solutions/hyperconverged" class="block p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="block font-semibold text-ink">Hyperconverged infrastructure</span>
                <span class="block text-sm" style="color: var(--color-muted)">Compute + storage + network in one stack</span>
              </a>
              <a href="/solutions/sme" class="block p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="block font-semibold text-ink">SME &amp; education</span>
                <span class="block text-sm" style="color: var(--color-muted)">Right-size for teams of three to three hundred</span>
              </a>
              <a href="/solutions/service-providers" class="block p-3 rounded-md hover:bg-elevated transition-colors" on:click={closeAll}>
                <span class="block font-semibold text-ink">Service providers</span>
                <span class="block text-sm" style="color: var(--color-muted)">Multi-tenant, REST-driven, billable workloads</span>
              </a>
            </div>
          </div>
        {/if}
      </div>

      <a class="nav-link" href="/pricing" aria-current={pathname === '/pricing' ? 'page' : undefined}>Pricing</a>
      <a class="nav-link" href="/docs" aria-current={pathname?.startsWith('/docs') ? 'page' : undefined}>Docs</a>
      <a class="nav-link" href="/customers" aria-current={pathname === '/customers' ? 'page' : undefined}>Customers</a>
      <a class="nav-link" href="/blog" aria-current={pathname?.startsWith('/blog') ? 'page' : undefined}>Blog</a>
    </nav>

    <div class="hidden lg:flex items-center gap-3">
      <a href="/support" class="nav-link">Support</a>
      <a href="/downloads" class="btn-outline gap-1.5"><Download size={15} />Download</a>
      <a href="/contact" class="btn-primary">Talk to sales</a>
    </div>

    <button
      class="lg:hidden p-2 -mr-2"
      on:click={() => (open = !open)}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      {#if open}<X size={22} />{:else}<Menu size={22} />{/if}
    </button>
  </div>

  {#if open}
    <div class="lg:hidden border-t" style:border-color="var(--color-border)">
      <div class="container-page py-5 grid gap-1.5">
        <a href="/products/virtual-environment" class="py-2 font-semibold" on:click={closeAll}>Proxmox VE</a>
        <a href="/products/backup-server" class="py-2 font-semibold" on:click={closeAll}>Proxmox Backup Server</a>
        <a href="/products/mail-gateway" class="py-2 font-semibold" on:click={closeAll}>Proxmox Mail Gateway</a>
        <a href="/products/datacenter-manager" class="py-2 font-semibold" on:click={closeAll}>Datacenter Manager</a>
        <hr class="my-2" />
        <a href="/solutions/private-cloud" class="py-2" on:click={closeAll}>Private cloud</a>
        <a href="/solutions/hyperconverged" class="py-2" on:click={closeAll}>Hyperconverged</a>
        <a href="/solutions/sme" class="py-2" on:click={closeAll}>SME &amp; education</a>
        <a href="/solutions/service-providers" class="py-2" on:click={closeAll}>Service providers</a>
        <hr class="my-2" />
        <a href="/pricing" class="py-2" on:click={closeAll}>Pricing</a>
        <a href="/docs" class="py-2" on:click={closeAll}>Docs</a>
        <a href="/customers" class="py-2" on:click={closeAll}>Customers</a>
        <a href="/blog" class="py-2" on:click={closeAll}>Blog</a>
        <a href="/support" class="py-2" on:click={closeAll}>Support</a>
        <div class="flex gap-3 pt-3">
          <a href="/downloads" class="btn-outline flex-1" on:click={closeAll}>Download</a>
          <a href="/contact" class="btn-primary flex-1" on:click={closeAll}>Talk to sales</a>
        </div>
      </div>
    </div>
  {/if}
</header>

<div aria-hidden="true" style="height: 64px"></div>
