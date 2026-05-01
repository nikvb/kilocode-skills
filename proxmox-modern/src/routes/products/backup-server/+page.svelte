<script lang="ts">
  import {
    ArrowRight, Server, Database, Mail, LayoutDashboard,
    Cpu, Network, ShieldCheck, Layers, Workflow, GitBranch,
    Boxes, Lock, Zap, CheckCircle2, Tape, Repeat,
    Activity, Users, Terminal, Bug, Inbox
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { productBySlug } from '$lib/data/products';

  const product = productBySlug('backup-server')!;

  const iconMap: Record<string, any> = {
    Server, Database, Mail, LayoutDashboard, Cpu, Network, ShieldCheck,
    Layers, Workflow, GitBranch, Boxes, Lock, Zap, CheckCircle2, Tape, Repeat,
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
    style="background: radial-gradient(900px 460px at 78% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-28 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <div class="flex flex-wrap gap-2.5 mb-6">
        <span class="pill pill-primary">{product.acronym}</span>
        <span class="pill">Released {product.released}</span>
        <span class="pill">Latest: v{product.latestVersion} ({product.latestRelease})</span>
      </div>

      <h1 class="mb-7" style="color: var(--color-night-text)">
        Proxmox Backup<br/>
        <span class="quote-italic" style="color: var(--color-primary)">Server.</span>
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
      <h2 class="mb-6">A backup target that pays for itself in disk.</h2>
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
          <span class="ml-2 text-xs" style="color: var(--color-night-muted); font-family: var(--font-mono)">backup-client@host-prod-04</span>
        </div>
        <pre class="text-[13px] leading-[1.85]" style="font-family: var(--font-mono); color: var(--color-night-text); white-space: pre-wrap;"><span class="c-com" style="color: #6B7280">{'# Encrypted, deduplicated backup of /etc and /var/lib/postgres'}</span>
<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">proxmox-backup-client</span> backup \
    etc.pxar:/etc \
    pgdata.pxar:/var/lib/postgresql/16/main \
    --repository pbs@pam@pbs-01:datastore-01 \
    --keyfile /root/.pbs.key \
    --backup-id host-prod-04

<span style="color: #A8E6A1">  Starting backup: host/host-prod-04/2026-04-30T02:00:00Z</span>
<span style="color: #A8E6A1">  encryption key fingerprint: 4f:21:8c:9d:...</span>
<span style="color: #A8E6A1">  uploaded chunks  : 412 new / 11,884 reused</span>
<span style="color: #A8E6A1">  data sent        : 1.62 GiB (of 47.3 GiB on disk)</span>
<span style="color: #A8E6A1">  Backup finished OK</span></pre>
      </div>
      <p class="text-sm" style="color: var(--color-muted)">
        After the first full, every subsequent run only sends what changed —
        even across hosts. The repository deduplicates globally.
      </p>
    </div>
  </div>
</section>

<!-- ============================== HIGHLIGHTS ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Highlights</span>
      <h2 class="mb-5">Why one PBS replaces a backup vendor.</h2>
      <p class="text-lg leading-relaxed">
        Six design decisions that shrink your backup window, your storage bill,
        and your blast radius — at the same time.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each product.highlights as h}
        {@const Icon = iconMap[h.icon] ?? Database}
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
      Backup, dedup, encryption, verification, replication. Everything you would
      buy from three vendors, in one Debian appliance.
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
    <h2 class="mb-5">Sized for the storage you already have.</h2>
    <p class="text-lg leading-relaxed">
      ZFS does the heavy lifting. NVMe metadata cache makes verify jobs flying.
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
        Free to use, forever. Subscriptions add the enterprise repository,
        signed updates, and engineer-grade support — billed per CPU socket on
        the PBS host.
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
      Install on a single box, point your PVE cluster at it, and tonight's
      backup is incremental, encrypted, and verified before you wake up.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">{product.ctaPrimary}</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
