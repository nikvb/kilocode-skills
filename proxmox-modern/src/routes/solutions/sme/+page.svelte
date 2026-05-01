<script lang="ts">
  import {
    ArrowRight, Home, Building2, GraduationCap,
    CheckCircle2, BookOpen, Users, Sparkles
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { tiers } from '$lib/data/pricing';

  const personas = [
    {
      icon: Home,
      label: 'Homelab',
      headcount: '1 node',
      tier: 'No subscription',
      tierNote: 'Free tier — community repository',
      body:
        'A NUC, an old Dell workstation, an HP ProLiant pulled from a recycle bin. One node, the no-subscription repository, every feature unlocked. The same platform a research lab uses runs in an apartment closet.'
    },
    {
      icon: Building2,
      label: 'Small office',
      headcount: '3 – 5 nodes',
      tier: 'Basic subscription',
      tierNote: '€340 / CPU / year',
      body:
        'A 3-node hyperconverged cluster on the office rack — Ceph for storage, PBS for backup, PMG in front of the mail server. Basic subscription gives you the enterprise repository and three support tickets per year.'
    },
    {
      icon: GraduationCap,
      label: 'School / university',
      headcount: '5 – 20 nodes',
      tier: 'Standard subscription',
      tierNote: '50% educational discount',
      body:
        'Multi-cluster per department, OIDC tied to the campus identity provider, scheduled backups to an off-site PBS. Standard subscription with the educational discount makes the per-CPU price land below most commercial offerings.'
    }
  ];

  const freeFeatures = [
    'No node limit — cluster as wide as the hardware allows',
    'No feature paywalls — HA, live migration, SDN, Ceph all included',
    'Full HA cluster with watchdog fencing and quorum',
    'Ceph RBD + CephFS, ZFS, NFS, SMB, iSCSI, FibreChannel',
    'Software-defined networking (SDN) with VLAN, VXLAN, EVPN',
    'Modern HTML5 web UI on every node',
    'Full REST API with token authentication',
    'LDAP, Active Directory, OIDC realms, two-factor auth'
  ];

  const basicTier = tiers.find((t) => t.id === 'basic');
  const standardTier = tiers.find((t) => t.id === 'standard');
</script>

<Seo
  title="Proxmox for SME &amp; education — from one node to a campus"
  description="The free Proxmox VE tier ships every feature with no node limit. Educational discount and Basic / Standard subscriptions for production deployments."
  path="/solutions/sme"
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(900px 460px at 78% 18%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="pill pill-primary mb-6 inline-flex">SME &amp; education</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        From three nodes to <span class="quote-italic" style="color: var(--color-primary)">three hundred.</span>
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        The free tier has no node limit, no feature paywall, no expiration.
        The same Proxmox VE that runs in an apartment lab runs the cluster
        behind a university CS department. Pay only for support, when you
        need it.
      </p>
    </div>
  </div>
</section>

<!-- ============================== PERSONAS ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Right-size your stack</span>
    <h2 class="mb-5">Three shapes, one platform.</h2>
    <p class="text-lg leading-relaxed">
      Start at the size that matches today. Adding nodes later is a one-line
      command — no edition upgrade, no relicensing, no support call.
    </p>
  </div>

  <div class="grid gap-5 lg:grid-cols-3">
    {#each personas as p}
      <div class="card p-7 flex flex-col">
        <div class="flex items-center gap-3 mb-5">
          <span class="feat-icon"><svelte:component this={p.icon} size={20} /></span>
          <span class="pill">{p.headcount}</span>
        </div>
        <h3 class="mb-2">{p.label}</h3>
        <div class="mb-5">
          <div class="text-sm font-semibold" style="color: var(--color-ink)">{p.tier}</div>
          <div class="text-sm" style="color: var(--color-muted)">{p.tierNote}</div>
        </div>
        <p class="text-[15px] leading-relaxed">{p.body}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== WHAT YOU GET FREE ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="grid lg:grid-cols-[5fr_6fr] gap-14 items-start">
      <div>
        <span class="eyebrow mb-3 inline-block">Free tier</span>
        <h2 class="mb-5">Everything, on every node.</h2>
        <p class="text-lg leading-relaxed mb-6">
          There is no community edition, standard edition, or enterprise
          edition. There is one Proxmox VE, distributed under AGPL v3, with
          every feature unlocked. A subscription buys you access to the
          enterprise repository and a support contract — not features.
        </p>
        <a href="/pricing" class="btn-ghost">Compare subscription tiers <ArrowRight size={15} /></a>
      </div>

      <ul class="grid gap-3 sm:grid-cols-2">
        {#each freeFeatures as f}
          <li class="card p-5 flex items-start gap-3" style="background: var(--color-surface)">
            <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
            <span class="text-[14.5px] leading-relaxed">{f}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<!-- ============================== EDUCATION PROGRAM ============================== -->
<section class="container-page py-24">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="pill pill-primary mb-5 inline-flex"><Sparkles size={14} /> Education program</span>
        <h2 class="mb-5">50% off, for the institutions that train the next admins.</h2>
        <p class="text-lg leading-relaxed mb-6">
          Universities, technical colleges, and accredited research
          institutions qualify for a 50% discount on every Proxmox VE
          subscription tier. Train students on the same hypervisor they will
          run in production, with the same enterprise repository the labs use.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="/contact" class="btn-primary">Request the educational rate <ArrowRight size={15} /></a>
          <a href="/support" class="btn-outline">Browse training resources</a>
        </div>
      </div>

      <div class="grid gap-4">
        <div class="card p-6" style="background: var(--color-surface)">
          <div class="flex items-center gap-3 mb-3">
            <BookOpen size={20} style="color: var(--color-primary)" />
            <h4>Training resources</h4>
          </div>
          <p class="text-[15px] leading-relaxed">
            Official Proxmox VE administration guide (PDF + HTML), wiki with
            300+ technical articles, recorded talks from past Proxmox
            community events, and an active forum with weekly engineer
            participation.
          </p>
        </div>
        <div class="card p-6" style="background: var(--color-surface)">
          <div class="flex items-center gap-3 mb-3">
            <Users size={20} style="color: var(--color-primary)" />
            <h4>Authorised trainers</h4>
          </div>
          <p class="text-[15px] leading-relaxed">
            On-site and remote courses through a network of authorised
            Proxmox training partners — bootstrap admin, advanced
            cluster + Ceph, and certified PVE engineer tracks.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================== TIER QUICK GLANCE ============================== -->
<section class="container-page py-16">
  <div class="grid md:grid-cols-2 gap-5">
    <div class="card p-7">
      <span class="pill mb-4 inline-flex">{basicTier?.audience}</span>
      <h3 class="mb-3">{basicTier?.name}</h3>
      <div class="mb-4">
        <span class="stat-num" style="font-size: 2.5rem">€{basicTier?.pricePerCpuYear}</span>
        <span class="text-sm ml-2" style="color: var(--color-muted)">per CPU per year</span>
      </div>
      <p class="text-[15px] leading-relaxed mb-5">{basicTier?.bestFor}</p>
      <a href="/pricing" class="btn-ghost">See what's included <ArrowRight size={14} /></a>
    </div>
    <div class="card p-7" style="border-color: color-mix(in oklab, var(--color-primary) 40%, var(--color-border))">
      <span class="pill pill-primary mb-4 inline-flex">{standardTier?.audience}</span>
      <h3 class="mb-3">{standardTier?.name}</h3>
      <div class="mb-4">
        <span class="stat-num" style="font-size: 2.5rem">€{standardTier?.pricePerCpuYear}</span>
        <span class="text-sm ml-2" style="color: var(--color-muted)">per CPU per year</span>
      </div>
      <p class="text-[15px] leading-relaxed mb-5">{standardTier?.bestFor}</p>
      <a href="/pricing" class="btn-ghost">See what's included <ArrowRight size={14} /></a>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Start small</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      One node today, a <span class="quote-italic" style="color: var(--color-primary)">campus next year.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Download the ISO, install on the spare box you already have, and the
      learning curve starts on the same platform you would run in production.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/contact" class="btn-outline">Talk about the education rate</a>
    </div>
  </div>
</section>
