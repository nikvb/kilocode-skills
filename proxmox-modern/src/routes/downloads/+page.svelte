<script lang="ts">
  import {
    Download, Server, Database, Mail, LayoutDashboard,
    Key, Globe
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';

  const productIcons = [Server, Database, Mail, LayoutDashboard];

  // Plausible-looking SHA-256 example checksums (clearly labelled as examples).
  const checksums: Record<string, string> = {
    pve: 'a3f7c2b9e1d4f8a6c5b2e9d7f1a4c6b8e3d5a7f9c1b4e6d8a2f5c7b9e1d3a6f8',
    pbs: 'd8e1a4f7c2b5e8d1a4f7c2b5e8d1a4f7c2b5e8d1a4f7c2b5e8d1a4f7c2b5e8d1',
    pmg: '7b9e1d3a6f8c2b5e8d1a4f7c2b5e8d1a4f7c2b5e8d1a4f7c2b5e8d1a4f7c2b5e',
    pdm: 'c5b8e1d4a7f2c5b8e1d4a7f2c5b8e1d4a7f2c5b8e1d4a7f2c5b8e1d4a7f2c5b8'
  };

  const repoLabels: Record<string, string> = {
    pve: 'Proxmox VE — no-subscription repo',
    pbs: 'Proxmox Backup Server',
    pmg: 'Proxmox Mail Gateway',
    pdm: 'Proxmox Datacenter Manager (alpha)'
  };

  const repoChannel: Record<string, string> = {
    pve: 'pve-no-subscription',
    pbs: 'pbs-no-subscription',
    pmg: 'pmg-no-subscription',
    pdm: 'pdm-test'
  };

  const mirrors = [
    { city: 'Frankfurt', country: 'DE', host: 'mirror1.de.proxmox.com' },
    { city: 'Vienna', country: 'AT', host: 'mirror1.at.proxmox.com' },
    { city: 'Amsterdam', country: 'NL', host: 'mirror1.nl.proxmox.com' },
    { city: 'Ashburn', country: 'US', host: 'mirror1.us.proxmox.com' },
    { city: 'Singapore', country: 'SG', host: 'mirror1.sg.proxmox.com' },
    { city: 'São Paulo', country: 'BR', host: 'mirror1.br.proxmox.com' }
  ];
</script>

<Seo
  title="Downloads — ISOs, repositories, and checksums"
  description="Signed ISO downloads for Proxmox VE, Backup Server, Mail Gateway, and Datacenter Manager. Repository keys and SHA-256 checksums included."
  path="/downloads"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 22% 18%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">Downloads</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Burn the ISO. <span class="quote-italic" style="color: var(--color-primary)">Boot the box</span>. Done.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Each download below is the standard installer, signed and checksummed.
      </p>
    </div>
  </div>
</section>

<!-- ISO GRID -->
<section class="container-page py-24">
  <div class="grid gap-5 md:grid-cols-2">
    {#each products as p, i}
      <div class="card p-7 flex flex-col">
        <div class="flex items-start justify-between gap-4 mb-4">
          <span class="feat-icon">
            <svelte:component this={productIcons[i]} size={20} />
          </span>
          <span class="pill">{p.acronym} {p.latestVersion}</span>
        </div>

        <h3 class="mb-2">{p.name}</h3>
        <p class="text-[15px] leading-relaxed mb-5" style="color: var(--color-muted)">
          Released {p.latestRelease} · {p.baseSystem}
        </p>

        <a href="#" class="btn-primary mb-5 self-start">
          <Download size={16} /> Download ISO
        </a>

        <div class="mt-auto pt-5 border-t" style:border-color="var(--color-border)">
          <p class="text-xs uppercase tracking-widest mb-2" style="color: var(--color-muted); letter-spacing: 0.14em">
            SHA-256 (example)
          </p>
          <code class="block p-3 text-[12px] break-all rounded-md" style="background: var(--color-elevated); border: 1px solid var(--color-border); font-family: var(--font-mono); color: var(--color-ink)">
            {checksums[p.id]}
          </code>
          <p class="text-[12px] mt-2" style="color: var(--color-muted)">
            Always verify against the signed value on the official mirror.
          </p>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- REPOSITORY KEYS -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Repository keys</span>
    <h2 class="mb-5">Add the apt repository.</h2>
    <p class="text-lg leading-relaxed">
      All Proxmox products ship as Debian packages. Add the repository, import
      the GPG key, and apt does the rest. The same key signs every package
      across PVE, PBS, PMG, and PDM.
    </p>
  </div>

  <div class="grid gap-5 lg:grid-cols-2">
    {#each products as p}
      <div class="card p-6 flex flex-col">
        <div class="flex items-center gap-3 mb-4">
          <Key size={18} style="color: var(--color-primary)" />
          <h4 class="m-0">{repoLabels[p.id]}</h4>
        </div>
        <div class="code-block text-[13px]">
<span class="c-com"># {p.acronym} {p.latestVersion} apt repo</span>
<span class="c-pmpt">$</span> echo "deb http://download.proxmox.com/debian/{p.id} bookworm {repoChannel[p.id]}" \
    &gt; /etc/apt/sources.list.d/{p.id}-install-repo.list
<span class="c-pmpt">$</span> wget https://enterprise.proxmox.com/debian/proxmox-release-bookworm.gpg \
    -O /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg
<span class="c-pmpt">$</span> apt update &amp;&amp; apt full-upgrade
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- VERIFY -->
<section class="container-page py-20">
  <div class="grid lg:grid-cols-2 gap-12 items-center">
    <div>
      <span class="eyebrow mb-3 inline-block">Verify your download</span>
      <h2 class="mb-5">Trust, but checksum.</h2>
      <p class="text-lg leading-relaxed mb-5">
        Run <code style="font-family: var(--font-mono); background: var(--color-elevated); padding: 0.1rem 0.4rem; border-radius: 4px">sha256sum</code>
        against the file you downloaded and compare against the signed value on
        the mirror. The published checksums are signed with the same key as
        the apt repository.
      </p>
      <p class="text-[15px] leading-relaxed">
        For air-gapped environments, the <code style="font-family: var(--font-mono); background: var(--color-elevated); padding: 0.1rem 0.4rem; border-radius: 4px">SHA256SUMS.gpg</code>
        detached signature lets you verify offline once you have imported the
        Proxmox release key from a trusted host.
      </p>
    </div>

    <div class="code-block text-[13px]">
<span class="c-com"># Verify the ISO you just downloaded</span>
<span class="c-pmpt">$</span> sha256sum proxmox-ve_8.3-1.iso
<span class="c-str">a3f7c2b9e1d4f8a6c5b2e9d7f1a4c6b8e3d5a7f9c1b4e6d8a2f5c7b9e1d3a6f8</span>  proxmox-ve_8.3-1.iso

<span class="c-com"># Or use the published SHA256SUMS file</span>
<span class="c-pmpt">$</span> sha256sum -c SHA256SUMS --ignore-missing
<span class="c-str">proxmox-ve_8.3-1.iso: OK</span>

<span class="c-com"># Verify GPG signature on the checksum file</span>
<span class="c-pmpt">$</span> gpg --verify SHA256SUMS.gpg SHA256SUMS
<span class="c-str">gpg: Good signature from "Proxmox Release Key"</span>
    </div>
  </div>
</section>

<!-- MIRROR NETWORK -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-10">
    <span class="eyebrow mb-3 inline-block">Mirror network</span>
    <h2 class="mb-5">Download close to the rack.</h2>
    <p class="text-lg leading-relaxed">
      Six regional mirrors carry every ISO and apt repository. The default
      hostname routes via GeoDNS; pin a specific mirror in
      <code style="font-family: var(--font-mono); background: var(--color-elevated); padding: 0.1rem 0.4rem; border-radius: 4px">sources.list</code>
      if you want predictable upstream behavior.
    </p>
  </div>

  <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
    {#each mirrors as m}
      <div class="card p-5 flex items-center gap-4">
        <span class="feat-icon shrink-0"><Globe size={18} /></span>
        <div>
          <div class="font-semibold">{m.city}, {m.country}</div>
          <code class="text-[12.5px]" style="font-family: var(--font-mono); color: var(--color-muted)">
            {m.host}
          </code>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- CLOSING CTA -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Need a hand?</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Stuck on the installer? <span class="quote-italic" style="color: var(--color-primary)">Talk to us</span>.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      The forum is free and active. Paying customers can open a portal ticket
      and we will reply inside the SLA window.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/support" class="btn-primary">See support options</a>
      <a href="/docs" class="btn-outline">Read the admin guide</a>
    </div>
  </div>
</section>
