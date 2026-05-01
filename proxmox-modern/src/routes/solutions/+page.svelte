<script lang="ts">
  import {
    ArrowRight, Server, Building2, Cloud, GraduationCap,
    Home, Briefcase, Globe, CheckCircle2
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { useCases } from '$lib/data/products';

  const iconMap: Record<string, any> = {
    Server, Building2, Cloud, GraduationCap
  };

  const teamSizes = [
    {
      icon: Home,
      label: 'Homelab / SME',
      headcount: '1 – 20 employees',
      nodes: '1 – 5 nodes',
      tier: 'Community or Basic',
      body:
        'A single-node lab or a 3-node cluster on commodity hardware. The free tier ships every feature; subscribe for the enterprise repository when you put a workload in front of paying users.',
      href: '/solutions/sme'
    },
    {
      icon: Briefcase,
      label: 'Mid-market',
      headcount: '20 – 500 employees',
      nodes: '6 – 32 nodes',
      tier: 'Standard subscription',
      body:
        'Multiple clusters across two sites, hyperconverged Ceph, scheduled PBS replication, and a 4-hour SLA from Vienna. The default shape for replacing a VMware estate without a forklift.',
      href: '/solutions/private-cloud'
    },
    {
      icon: Globe,
      label: 'Service provider',
      headcount: '500+ / public cloud',
      nodes: '32+ nodes per cluster',
      tier: 'Premium subscription',
      body:
        'Multi-tenant pools, REST-driven provisioning, per-VM rate limits, Prometheus metrics for chargeback. Run a public IaaS on Proxmox VE — several already do.',
      href: '/solutions/service-providers'
    }
  ];
</script>

<Seo
  title="Solutions — Proxmox for every size of data center"
  description="From a 1-node homelab to a 32-node hyperconverged cluster: the Proxmox stack right-sized for SMEs, mid-market, and service providers."
  path="/solutions"
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
      <span class="eyebrow mb-5 inline-block">Solutions</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Right-sized for <span class="quote-italic" style="color: var(--color-primary)">every</span> kind of data center.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Four scenarios, one platform. The same Proxmox VE that runs a single
        node in an apartment closet runs the 32-node hyperconverged cluster at
        a research lab. Pick by use case, or pick by team size — both lead to
        the same Debian-based stack.
      </p>
    </div>
  </div>
</section>

<!-- ============================== USE CASES GRID ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">By use case</span>
    <h2 class="mb-5">Pick the play that matches your room.</h2>
    <p class="text-lg leading-relaxed">
      Each path is a working architecture, not a brochure. Click through for
      reference designs, sample commands, and the subscription tier that fits.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each useCases as u}
      {@const Icon = iconMap[u.icon] ?? Server}
      <a href={u.href} class="card card-hover p-7 flex flex-col group" style="min-height: 240px">
        <span class="feat-icon mb-5"><svelte:component this={Icon} size={20} /></span>
        <h3 class="mb-3">{u.title}</h3>
        <p class="text-base leading-relaxed mb-6">{u.body}</p>
        <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
          Read the play <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- ============================== BY TEAM SIZE ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">By team size</span>
      <h2 class="mb-5">Or start from the org chart.</h2>
      <p class="text-lg leading-relaxed">
        Three rough shapes cover most teams. The platform is the same; what
        changes is the cluster size, the storage layer, and how much support
        you want on speed-dial.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      {#each teamSizes as t}
        <a href={t.href} class="card card-hover p-7 flex flex-col group">
          <div class="flex items-center gap-3 mb-5">
            <span class="feat-icon"><svelte:component this={t.icon} size={20} /></span>
            <span class="pill">{t.headcount}</span>
          </div>
          <h3 class="mb-2">{t.label}</h3>
          <div class="flex flex-wrap gap-2 mb-5 text-sm" style="color: var(--color-muted)">
            <span class="inline-flex items-center gap-1.5"><CheckCircle2 size={14} /> {t.nodes}</span>
            <span class="inline-flex items-center gap-1.5"><CheckCircle2 size={14} /> {t.tier}</span>
          </div>
          <p class="text-[15px] leading-relaxed mb-6">{t.body}</p>
          <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
            See the architecture <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Ready when you are</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Start from the play, end on a <span class="quote-italic" style="color: var(--color-primary)">running cluster.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Compare subscription tiers if you know what you need, or talk to an
      engineer in Vienna who has already migrated a fleet that looks like yours.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/pricing" class="btn-primary">See subscription plans</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
