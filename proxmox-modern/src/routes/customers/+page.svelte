<script lang="ts">
  import {
    ArrowRight, Quote, Building2, GraduationCap, HeartPulse,
    Landmark, Wrench, Cloud, FlaskConical, Clapperboard, Briefcase
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { customers, testimonials } from '$lib/data/products';

  const industries = [
    { icon: Wrench, label: 'Manufacturing' },
    { icon: GraduationCap, label: 'Education' },
    { icon: HeartPulse, label: 'Healthcare' },
    { icon: Briefcase, label: 'Finance' },
    { icon: Landmark, label: 'Public sector' },
    { icon: Cloud, label: 'Service providers' },
    { icon: FlaskConical, label: 'Research labs' },
    { icon: Clapperboard, label: 'Media' }
  ];
</script>

<Seo
  title="Customers — twenty years of production deployments"
  description="From CERN to Stack Exchange to Hetzner, Proxmox quietly powers production infrastructure across research, hosting, education, and the enterprise."
  path="/customers"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 25% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">Customers</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        <span class="quote-italic" style="color: var(--color-primary)">Quietly</span> powering production for two decades.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Research labs, hosting providers, universities, and Fortune-500
        infrastructure teams ship on Proxmox. Few of them issue press releases
        about it. That is the point.
      </p>
      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/contact" class="btn-primary">Become a reference <ArrowRight size={16} /></a>
        <a href="/pricing" class="btn-outline">See plans</a>
      </div>
    </div>
  </div>
</section>

<!-- LOGO WALL -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">A few names</span>
    <h2 class="mb-5">In production, in twelve places you have heard of.</h2>
    <p class="text-lg leading-relaxed">
      A small selection of organizations running Proxmox in production today.
      Most prefer not to advertise their stack — these confirmed the listing.
    </p>
  </div>

  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each customers as c}
      <div class="card p-7 flex flex-col">
        <span
          style="font-family: var(--font-display); font-weight: 600; font-size: 1.6rem; letter-spacing: -0.025em; line-height: 1.1; color: var(--color-ink)"
        >
          {c.name}
        </span>
        <span class="text-[13px] mt-3" style="color: var(--color-muted)">{c.note}</span>
      </div>
    {/each}
  </div>
</section>

<!-- CASE STUDIES -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Case studies</span>
    <h2 class="mb-5">Three deployments, on the record.</h2>
    <p class="text-lg leading-relaxed">
      The full migrations, the actual numbers, and what the teams would do
      differently. Names anonymized at the customer's request.
    </p>
  </div>

  <div class="grid gap-5 lg:grid-cols-3">
    {#each testimonials as t, i}
      <article class="card p-7 flex flex-col relative">
        <Quote size={22} class="mb-5" style="color: var(--color-primary)" />
        <blockquote class="quote-italic text-[17px] leading-relaxed mb-6" style="color: var(--color-ink); font-weight: 400">
          "{t.quote}"
        </blockquote>

        <div class="mt-auto pt-5 border-t" style:border-color="var(--color-border)">
          <div class="flex items-center gap-3 mb-4">
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm shrink-0"
              style="background: color-mix(in oklab, var(--color-primary) 14%, transparent); color: var(--color-primary); border: 1px solid color-mix(in oklab, var(--color-primary) 25%, transparent)"
              aria-hidden="true"
            >
              {t.name.split(' ').map((n) => n[0]).join('')}
            </span>
            <div>
              <div class="font-semibold text-[14.5px]">{t.name}</div>
              <div class="text-[12.5px]" style="color: var(--color-muted)">{t.role}</div>
            </div>
          </div>
          <a href="#" class="btn-ghost text-sm">
            Read the case study <ArrowRight size={14} />
          </a>
        </div>

        <span class="absolute top-7 right-7 text-xs" style="color: var(--color-muted); font-family: var(--font-mono)">
          0{i + 1}
        </span>
      </article>
    {/each}
  </div>
</section>

<!-- INDUSTRIES -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-10">
    <span class="eyebrow mb-3 inline-block">Industries we serve</span>
    <h2 class="mb-5">Wherever there are racks and budgets.</h2>
    <p class="text-lg leading-relaxed">
      Proxmox runs the same on a 4-node cluster in a clinic and a 200-node
      cluster in a research lab. The economics scale; so do the operations.
    </p>
  </div>

  <div class="flex flex-wrap gap-2.5">
    {#each industries as i}
      <span class="pill text-[13.5px] py-2 px-4">
        <svelte:component this={i.icon} size={14} />
        {i.label}
      </span>
    {/each}
  </div>
</section>

<!-- WHY CUSTOMERS STAY -->
<section class="container-page py-20">
  <div class="grid lg:grid-cols-2 gap-12 items-start">
    <div>
      <span class="eyebrow mb-3 inline-block">Why customers stay</span>
      <h2 class="mb-5">No upgrade tax. No surprise renewal.</h2>
      <p class="text-lg leading-relaxed mb-5">
        Customer retention sits north of 95% on multi-year subscriptions.
        Two reasons: the platform actually works, and the licensing model
        does not penalize success. Adding a host does not double the bill.
        Adding a feature does not require a new SKU.
      </p>
      <p class="text-[15px] leading-relaxed">
        The same engineers shipped 8.0 in 2023, 8.1 in 2024, 8.2 last June,
        8.3 in November. There has not been a release that broke a paid
        cluster's upgrade path in this decade. That is what predictable
        looks like.
      </p>
    </div>

    <div class="card p-8" style="background: var(--color-elevated)">
      <div class="grid gap-5 text-[14.5px]">
        <div class="flex items-start gap-3">
          <Building2 size={20} class="shrink-0 mt-1" style="color: var(--color-primary)" />
          <div>
            <div class="font-semibold">Twelve named reference accounts</div>
            <div style="color: var(--color-muted)">on the public list, hundreds more under NDA</div>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Landmark size={20} class="shrink-0 mt-1" style="color: var(--color-primary)" />
          <div>
            <div class="font-semibold">180+ countries</div>
            <div style="color: var(--color-muted)">have at least one paying subscription</div>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Briefcase size={20} class="shrink-0 mt-1" style="color: var(--color-primary)" />
          <div>
            <div class="font-semibold">95%+ multi-year retention</div>
            <div style="color: var(--color-muted)">across the enterprise customer base</div>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Cloud size={20} class="shrink-0 mt-1" style="color: var(--color-primary)" />
          <div>
            <div class="font-semibold">Service-provider partner program</div>
            <div style="color: var(--color-muted)">white-labelled portals, billing-friendly API</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- DEPLOYMENT PATTERNS -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Deployment patterns</span>
    <h2 class="mb-5">How customers actually use it.</h2>
    <p class="text-lg leading-relaxed">
      Three shapes account for nearly every paying deployment we see. The
      hardware varies; the architecture rarely does.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    <div class="card p-7">
      <span class="pill mb-4 inline-flex">3-12 nodes</span>
      <h4 class="mb-2">Hyperconverged starter</h4>
      <p class="text-[14.5px] leading-relaxed">
        Three to twelve nodes, Ceph for storage, 25 GbE for the cluster
        network, internal workloads on top. The stock answer for SMEs and
        public-sector teams replacing aging VMware estates.
      </p>
    </div>
    <div class="card p-7">
      <span class="pill mb-4 inline-flex">20-60 nodes</span>
      <h4 class="mb-2">Production data center</h4>
      <p class="text-[14.5px] leading-relaxed">
        Multi-rack, multi-cluster, with PBS as the shared backup target and
        PMG in front of the corporate mail. SDN VXLAN/EVPN bridges sites.
        Premium support is the norm here.
      </p>
    </div>
    <div class="card p-7">
      <span class="pill mb-4 inline-flex">100+ nodes</span>
      <h4 class="mb-2">Service provider</h4>
      <p class="text-[14.5px] leading-relaxed">
        Multi-tenant pools, REST-driven provisioning, billing-friendly token
        auth, Datacenter Manager for the operations console. Hetzner,
        OVHcloud, and dozens of regional providers run shapes like this.
      </p>
    </div>
  </div>
</section>

<!-- CLOSING CTA -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Your turn</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Twelve logos. <span class="quote-italic" style="color: var(--color-primary)">Room for more</span>.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      If you are migrating off VMware, building a hyperconverged cluster, or
      replacing a backup product, our pre-sales team will walk through the
      reference architecture for your scale.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/contact" class="btn-primary">Talk to sales</a>
      <a href="/pricing" class="btn-outline">See pricing</a>
    </div>
  </div>
</section>
