<script lang="ts">
  import {
    ArrowRight, Server, Database, Mail, LayoutDashboard,
    Cpu, Network, ShieldCheck, Layers, Workflow, GitBranch,
    Boxes, Lock, Zap, CheckCircle2, Archive, Repeat,
    Activity, Users, Terminal, Bug, Inbox
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { productBySlug } from '$lib/data/products';

  const product = productBySlug('virtual-environment')!;

  const iconMap: Record<string, any> = {
    Server, Database, Mail, LayoutDashboard, Cpu, Network, ShieldCheck,
    Layers, Workflow, GitBranch, Boxes, Lock, Zap, CheckCircle2, Archive, Repeat,
    Activity, Users, Terminal, Bug, Inbox
  };
</script>

<Seo
  title="{product.name} ({product.acronym}) — Proxmox"
  description={product.tagline}
  path="/products/{product.slug}"
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(900px 460px at 80% 20%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-28 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <div class="flex flex-wrap gap-2.5 mb-6">
        <span class="pill pill-primary">{product.acronym}</span>
        <span class="pill">Released {product.released}</span>
        <span class="pill">Latest: v{product.latestVersion} ({product.latestRelease})</span>
      </div>

      <h1 class="mb-7" style="color: var(--color-night-text)">
        Proxmox Virtual<br/>
        <span class="quote-italic" style="color: var(--color-primary)">Environment.</span>
      </h1>

      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        {product.tagline}
      </p>

      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/downloads" class="btn-primary">{product.ctaPrimary} <ArrowRight size={16} /></a>
        <a href="/docs" class="btn-outline">{product.ctaSecondary}</a>
      </div>
    </div>
  </div>
</section>

<!-- ============================== INTRO ============================== -->
<section class="container-page py-24">
  <div class="grid gap-14 lg:grid-cols-2 items-start">
    <div>
      <span class="eyebrow mb-3 inline-block">What it is</span>
      <h2 class="mb-6">A hypervisor that ships finished.</h2>
      <p class="text-lg leading-relaxed mb-10">{product.intro}</p>

      <div class="card overflow-hidden">
        <table class="w-full text-[15px]">
          <tbody>
            <tr class="border-b" style:border-color="var(--color-border)">
              <th class="text-left p-4 font-semibold w-44" style="color: var(--color-muted)">Released</th>
              <td class="p-4">{product.released}</td>
            </tr>
            <tr class="border-b" style:border-color="var(--color-border)">
              <th class="text-left p-4 font-semibold" style="color: var(--color-muted)">Latest version</th>
              <td class="p-4">{product.latestVersion} <span style="color: var(--color-muted)">— {product.latestRelease}</span></td>
            </tr>
            <tr class="border-b" style:border-color="var(--color-border)">
              <th class="text-left p-4 font-semibold" style="color: var(--color-muted)">Base system</th>
              <td class="p-4">{product.baseSystem}</td>
            </tr>
            <tr>
              <th class="text-left p-4 font-semibold" style="color: var(--color-muted)">License</th>
              <td class="p-4">{product.license}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div>
      <div class="card p-6 mb-4" style="background: var(--color-night-2); border-color: var(--color-night-line)">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70"></span>
          <span class="ml-2 text-xs" style="color: var(--color-night-muted); font-family: var(--font-mono)">root@pve-node-01 ~</span>
        </div>
        <pre class="text-[13px] leading-[1.85]" style="font-family: var(--font-mono); color: var(--color-night-text); white-space: pre-wrap;"><span class="c-com" style="color: #6B7280">{'# Create a new VM with 4 cores, 8 GB RAM, an OVMF boot disk'}</span>
<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">qm</span> create 201 \
    --name web-prod-01 \
    --memory 8192 --cores 4 \
    --net0 virtio,bridge=vmbr0 \
    --bios ovmf \
    --scsihw virtio-scsi-single \
    --scsi0 local-zfs:32

<span class="c-com" style="color: #6B7280">{'# Attach an installer ISO'}</span>
<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">qm</span> set 201 \
    --ide2 local:iso/debian-12.iso,media=cdrom

<span class="c-com" style="color: #6B7280">{'# Boot it'}</span>
<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">qm</span> start 201
<span style="color: #A8E6A1">  → started VM 201 (qemu) on pve-node-01</span></pre>
      </div>
      <p class="text-sm" style="color: var(--color-muted)">
        Every web-UI action has a <code style="font-family: var(--font-mono); font-size: 0.85em">qm</code>,
        <code style="font-family: var(--font-mono); font-size: 0.85em">pct</code>, or
        <code style="font-family: var(--font-mono); font-size: 0.85em">pvesh</code> equivalent. Automate everything.
      </p>
    </div>
  </div>
</section>

<!-- ============================== HIGHLIGHTS ============================== -->
<section class="container-page py-24" style="background: var(--color-elevated); margin-inline: 0; max-width: none; padding-inline: 0">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Highlights</span>
      <h2 class="mb-5">Six things that make PVE different.</h2>
      <p class="text-lg leading-relaxed">
        Not features-by-the-pound. The decisions that, taken together, replace
        an enterprise virtualization stack on commodity hardware.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each product.highlights as h}
        {@const Icon = iconMap[h.icon] ?? Server}
        <div class="card p-7">
          <span class="feat-icon mb-4"><svelte:component this={Icon} size={20} /></span>
          <h4 class="mb-2.5">{h.title}</h4>
          <p class="text-[15px] leading-relaxed">{h.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ============================== ALL FEATURES ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">All features</span>
    <h2 class="mb-5">The complete inventory.</h2>
    <p class="text-lg leading-relaxed">
      Everything PVE ships with on day one. Free tier, enterprise tier — same
      software, different repository.
    </p>
  </div>

  <div class="grid gap-6 md:grid-cols-2">
    {#each product.features as group}
      <div class="card p-7">
        <h3 class="mb-5" style="font-size: 1.25rem">{group.group}</h3>
        <ul class="grid gap-3">
          {#each group.items as item}
            <li class="flex items-start gap-3 text-[15px] leading-relaxed">
              <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== HARDWARE REQUIREMENTS ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Hardware requirements</span>
    <h2 class="mb-5">Runs on what you already have.</h2>
    <p class="text-lg leading-relaxed">
      Modern x86 server with virtualization extensions. That is the whole list.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {#each product.hardwareRequirements as req}
      <div class="card p-6">
        <div class="text-xs font-semibold tracking-widest uppercase mb-2" style="color: var(--color-primary)">{req.label}</div>
        <p class="text-[15px] leading-relaxed" style="color: var(--color-ink)">{req.value}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== PRICING TEASER ============================== -->
<section class="container-page py-20">
  <a href="/pricing" class="card card-hover p-10 md:p-12 flex flex-col md:flex-row md:items-center gap-8 group" style="background: var(--color-elevated)">
    <div class="flex-1">
      <span class="pill pill-primary mb-4 inline-flex">Pricing</span>
      <h3 class="mb-3" style="font-size: 1.6rem">What about pricing?</h3>
      <p class="text-base leading-relaxed" style="max-width: 56ch">
        The software is free. Subscriptions buy you the enterprise repository,
        signed updates, and engineer-grade support — billed per CPU socket,
        starting at €115/year.
      </p>
    </div>
    <div class="flex items-center gap-1.5 text-sm font-semibold shrink-0" style="color: var(--color-primary)">
      See subscription plans <ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
    </div>
  </a>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Get started</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Try {product.short} <span class="quote-italic" style="color: var(--color-primary)">today.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Boot the ISO on three commodity nodes and you have a live-migrating cluster
      before lunch. No node limits. No feature paywalls. No expiration.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">{product.ctaPrimary}</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
