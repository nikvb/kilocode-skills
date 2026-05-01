<script lang="ts">
  import {
    ArrowRight, AlertTriangle, TrendingUp, Lock,
    CheckCircle2, XCircle, Search, FlaskConical, Truck, Power,
    Server
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';
  import { tiers } from '$lib/data/pricing';

  const pve = products[0];

  const problems = [
    {
      icon: AlertTriangle,
      title: 'Broadcom\'s 2024 license shake-up',
      body:
        'Perpetual licenses ended overnight. Renewal terms turned subscription-only, three-product bundles replaced à-la-carte, and many existing customers were dropped from direct sales into a partner reseller channel.'
    },
    {
      icon: TrendingUp,
      title: 'Per-socket cost spiral',
      body:
        'Reports of 3× to 10× renewal increases on identical hardware. Independent CIO surveys put the median ESXi renewal hike above 200% in the first cycle after the acquisition closed.'
    },
    {
      icon: Lock,
      title: 'Vendor lock-in by design',
      body:
        'Closed-source hypervisor, proprietary VMFS datastore, vSAN-only HCI path. Migration off VMware historically meant rebuilding the storage layer too — until tooling like Proxmox\'s native ESXi import driver landed.'
    }
  ];

  const compare = [
    { feature: 'Hypervisor', pve: 'KVM (mainline Linux)', vsphere: 'ESXi (proprietary)' },
    { feature: 'Live migration', pve: 'Yes — including local-storage', vsphere: 'Yes (vMotion, paid)' },
    { feature: 'High availability', pve: 'Built-in HA Manager, free', vsphere: 'vSphere HA, paid edition' },
    { feature: 'Hyperconverged storage', pve: 'Ceph RBD + CephFS, integrated', vsphere: 'vSAN, separate license' },
    { feature: 'REST API', pve: 'Full, token-auth, OpenAPI 3', vsphere: 'vSphere REST + SOAP' },
    { feature: 'Web UI', pve: 'HTML5, no plugin, mobile-friendly', vsphere: 'HTML5 (since 6.7)' },
    { feature: 'Per-socket cost (entry)', pve: '€115/yr Community subscription', vsphere: 'Subscription, partner-quoted' },
    { feature: 'Source code access', pve: 'AGPL v3, public Git', vsphere: 'Closed source' }
  ];

  const playbook = [
    {
      icon: Search,
      step: '01',
      title: 'Assess',
      body:
        'Inventory the ESXi estate: socket count, VM count, storage layout, network topology, and licenses up for renewal. Tag the workloads that have to move first (the ones whose support contract expires soonest) and the ones that can wait.'
    },
    {
      icon: FlaskConical,
      step: '02',
      title: 'Pilot',
      body:
        'Stand up a 3-node Proxmox VE cluster on commodity hardware — or on a few ESXi hosts you have already drained. Add the existing vCenter as an import source, migrate a tier-3 workload, and run it for two weeks.'
    },
    {
      icon: Truck,
      step: '03',
      title: 'Migrate',
      body:
        'Use the native ESXi import driver to move VMs in waves, weekend by weekend. Live import keeps the source running until cutover. Most teams migrate 30–60 VMs per maintenance window with no application downtime.'
    },
    {
      icon: Power,
      step: '04',
      title: 'Retire',
      body:
        'Once every workload is on Proxmox VE and PBS is taking the backups, decommission the ESXi hosts. Re-purpose them as additional Proxmox nodes — same hardware, no per-socket renewal email next year.'
    }
  ];

  const standardTier = tiers.find((t) => t.id === 'standard');
</script>

<Seo
  title="Private cloud on Proxmox — leave VMware behind"
  description="The migration playbook for moving off VMware vSphere onto Proxmox VE: assess, pilot, migrate, retire. KVM, Ceph, REST API — no per-socket renewal."
  path="/solutions/private-cloud"
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
      <span class="pill pill-primary mb-6 inline-flex">VMware migration</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Leave the <span class="quote-italic" style="color: var(--color-primary)">renewal email</span> behind.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        After Broadcom's 2024 license overhaul, every CIO got the same memo.
        Proxmox VE is the open-source alternative most of them ended up
        evaluating — and a growing number ended up shipping.
      </p>
    </div>
  </div>
</section>

<!-- ============================== WHY TEAMS LEAVE ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Why teams leave</span>
    <h2 class="mb-5">Three reasons the renewal letter goes unsigned.</h2>
    <p class="text-lg leading-relaxed">
      None of these are theoretical. They are the headline complaints in every
      VMware-exit briefing we have run since the acquisition closed.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    {#each problems as p}
      <div class="card p-7">
        <span class="feat-icon mb-5"><svelte:component this={p.icon} size={20} /></span>
        <h3 class="mb-3">{p.title}</h3>
        <p class="text-[15px] leading-relaxed">{p.body}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== HOW PROXMOX REPLACES IT ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Feature parity</span>
      <h2 class="mb-5">How Proxmox replaces it, line by line.</h2>
      <p class="text-lg leading-relaxed">
        Same primitives. Different licensing. The features VMware bills as
        separate editions are bundled into the open-source Proxmox VE base.
      </p>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="border-collapse: collapse;">
          <thead>
            <tr style="background: var(--color-elevated); border-bottom: 1px solid var(--color-border);">
              <th class="px-6 py-4 text-sm font-semibold" style="color: var(--color-muted); letter-spacing: 0.04em">Capability</th>
              <th class="px-6 py-4 text-sm font-semibold" style="color: var(--color-primary); letter-spacing: 0.04em">Proxmox VE</th>
              <th class="px-6 py-4 text-sm font-semibold" style="color: var(--color-muted); letter-spacing: 0.04em">vSphere</th>
            </tr>
          </thead>
          <tbody>
            {#each compare as row, i}
              <tr style="border-top: {i === 0 ? '0' : '1px solid var(--color-border)'}">
                <td class="px-6 py-4 font-semibold" style="color: var(--color-ink)">{row.feature}</td>
                <td class="px-6 py-4">
                  <div class="flex items-start gap-2">
                    <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
                    <span class="text-[15px]">{row.pve}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-start gap-2">
                    <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-muted)" />
                    <span class="text-[15px]" style="color: var(--color-muted)">{row.vsphere}</span>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<!-- ============================== MIGRATION PLAYBOOK ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Playbook</span>
    <h2 class="mb-5">Four steps from ESXi to Proxmox VE.</h2>
    <p class="text-lg leading-relaxed">
      Most teams complete a full migration in 8 – 16 weeks. The pattern is
      always the same: shrink the ESXi footprint as the Proxmox footprint
      grows, on the same hardware, with no big-bang cutover.
    </p>
  </div>

  <ol class="grid gap-6">
    {#each playbook as p}
      <li class="card p-7 md:p-8">
        <div class="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
          <div class="flex md:flex-col items-center md:items-start gap-4 md:gap-3">
            <span class="feat-icon shrink-0"><svelte:component this={p.icon} size={20} /></span>
            <span class="font-mono text-2xl font-semibold" style="color: var(--color-primary); letter-spacing: -0.02em">{p.step}</span>
          </div>
          <div>
            <h3 class="mb-3">{p.title}</h3>
            <p class="text-base leading-relaxed">{p.body}</p>
          </div>
        </div>
      </li>
    {/each}
  </ol>
</section>

<!-- ============================== WHAT IT COSTS ============================== -->
<section class="container-page py-24">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="eyebrow mb-3 inline-block">What it costs</span>
        <h2 class="mb-5">Predictable, per-socket, in euros.</h2>
        <p class="text-lg leading-relaxed mb-6">
          The most common business plan is Proxmox VE Standard at
          €{standardTier?.pricePerCpuYear}/CPU/year. {standardTier?.ticketsPerYear} support
          tickets, {standardTier?.responseTime} initial response, remote SSH
          when the cluster needs hands. Compare that to your last vSphere
          renewal and decide.
        </p>
        <div class="flex flex-wrap gap-3">
          <a href="/pricing" class="btn-primary">See all subscription tiers <ArrowRight size={15} /></a>
          <a href="/contact" class="btn-outline">Get a migration quote</a>
        </div>
      </div>
      <div class="card p-7" style="background: var(--color-surface)">
        <div class="flex items-center gap-3 mb-5">
          <span class="feat-icon"><Server size={20} /></span>
          <span class="pill pill-primary">Most popular</span>
        </div>
        <h3 class="mb-2">{standardTier?.name}</h3>
        <p class="text-sm mb-6" style="color: var(--color-muted)">{standardTier?.short}</p>
        <div class="mb-6">
          <span class="stat-num" style="font-size: 3rem">€{standardTier?.pricePerCpuYear}</span>
          <span class="text-sm ml-2" style="color: var(--color-muted)">per CPU per year</span>
        </div>
        <ul class="grid gap-2.5 text-[15px]">
          {#each standardTier?.includes ?? [] as item}
            <li class="flex items-start gap-2.5">
              <CheckCircle2 size={17} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Ready to migrate</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Skip the next <span class="quote-italic" style="color: var(--color-primary)">renewal cycle.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Download Proxmox VE {pve.latestVersion}, pilot a 3-node cluster, and ask
      a Vienna engineer for a migration plan that fits your renewal date.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
