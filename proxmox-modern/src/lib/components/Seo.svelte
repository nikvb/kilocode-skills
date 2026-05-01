<script lang="ts">
  import { company } from '$lib/data/products';
  export let title: string;
  export let description: string;
  export let path: string = '';
  export let image: string = '/og-default.png';
  export let jsonLd: object | null = null;

  $: canonical = `${company.baseUrl}${path}`;
  $: fullTitle = title.includes('Proxmox') ? title : `${title} — Proxmox`;
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content="{company.baseUrl}{image}" />

  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="{company.baseUrl}{image}" />

  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}
  {/if}
</svelte:head>
