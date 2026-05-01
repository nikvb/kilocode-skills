<script lang="ts">
  import {
    ArrowRight, Server, Database, Mail, LayoutDashboard, CheckCircle2
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';

  const productIcons = [Server, Database, Mail, LayoutDashboard];
</script>

<Seo
  title="Products — Proxmox"
  description="Four open-source data-center products: Virtual Environment, Backup Server, Mail Gateway, and Datacenter Manager. One platform, one identity layer, one renewal date."
  path="/products"
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(900px 460px at 82% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-28 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-5 inline-block">Products</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        The complete data-center<br/>
        <span class="quote-italic" style="color: var(--color-primary)">toolkit.</span>
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Four Debian appliances, one design language. Run virtual machines,
        deduplicate backups, filter mail, and federate it all — without paying
        a per-socket tax to anyone.
      </p>
      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/downloads" class="btn-primary">
          Download an ISO <ArrowRight size={16} />
        </a>
        <a href="/pricing" class="btn-outline">See subscription plans</a>
      </div>
    </div>
  </div>
</section>

<!-- ============================== PRODUCT CARDS ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Pick a starting point</span>
    <h2 class="mb-5">Four products. Pick one. Or run them all.</h2>
    <p class="text-lg leading-relaxed">
      Each product stands on its own — no upsell ladder, no enterprise edition
      hidden behind a sales call. Install the ISO, register a key when you need
      support, and your renewal date is the only thing that follows you around.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each products as p, i}
      {@const Icon = productIcons[i]}
      <a
        href="/products/{p.slug}"
        class="card card-hover p-8 group flex flex-col"
        style="min-height: 320px"
      >
        <div class="flex items-start justify-between gap-4 mb-5">
          <span class="feat-icon" style="width: 48px; height: 48px">
            <svelte:component this={Icon} size={22} />
          </span>
          <span class="pill text-[10.5px]">{p.acronym} · v{p.latestVersion}</span>
        </div>
        <h3 class="mb-2">{p.name.replace('Proxmox ', '')}</h3>
        <p class="mb-4 text-sm font-semibold" style="color: var(--color-muted); letter-spacing: 0.005em">
          {p.acronym} · {p.short}
        </p>
        <p class="mb-7 text-base leading-relaxed">{p.tagline}</p>
        <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
          Read more <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- ============================== HOW THEY WORK TOGETHER ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">How they work together</span>
    <h2 class="mb-5">A platform, not a product catalog.</h2>
    <p class="text-lg leading-relaxed">
      The four products share a REST API, an identity layer, and an update
      cadence. Data flows from the edge inward: mail through PMG, workloads
      on PVE, backups to PBS, federation across PDM.
    </p>
  </div>

  <div class="grid gap-4 md:grid-cols-7 items-stretch">
    <!-- PMG -->
    <div class="card p-6 md:col-span-1 lg:col-span-1 flex flex-col" style="grid-column: span 1; min-height: 220px">
      <span class="feat-icon mb-4"><Mail size={20} /></span>
      <div class="text-xs font-semibold tracking-widest uppercase mb-1" style="color: var(--color-primary)">Edge</div>
      <h4 class="mb-2">PMG</h4>
      <p class="text-sm leading-relaxed">Filters spam, viruses, and phishing before mail reaches your server.</p>
    </div>
    <div class="hidden md:flex items-center justify-center" aria-hidden="true">
      <ArrowRight size={22} style="color: var(--color-primary)" />
    </div>
    <!-- PVE -->
    <div class="card p-6 flex flex-col" style="min-height: 220px">
      <span class="feat-icon mb-4"><Server size={20} /></span>
      <div class="text-xs font-semibold tracking-widest uppercase mb-1" style="color: var(--color-primary)">Compute</div>
      <h4 class="mb-2">PVE</h4>
      <p class="text-sm leading-relaxed">Runs every workload — KVM virtual machines, LXC containers, the whole estate.</p>
    </div>
    <div class="hidden md:flex items-center justify-center" aria-hidden="true">
      <ArrowRight size={22} style="color: var(--color-primary)" />
    </div>
    <!-- PBS -->
    <div class="card p-6 flex flex-col" style="min-height: 220px">
      <span class="feat-icon mb-4"><Database size={20} /></span>
      <div class="text-xs font-semibold tracking-widest uppercase mb-1" style="color: var(--color-primary)">Backup</div>
      <h4 class="mb-2">PBS</h4>
      <p class="text-sm leading-relaxed">Deduplicates and encrypts every guest, host, and mailbox — incrementally forever.</p>
    </div>
    <div class="hidden md:flex items-center justify-center" aria-hidden="true">
      <ArrowRight size={22} style="color: var(--color-primary)" />
    </div>
    <!-- PDM -->
    <div class="card p-6 flex flex-col" style="min-height: 220px">
      <span class="feat-icon mb-4"><LayoutDashboard size={20} /></span>
      <div class="text-xs font-semibold tracking-widest uppercase mb-1" style="color: var(--color-primary)">Federation</div>
      <h4 class="mb-2">PDM</h4>
      <p class="text-sm leading-relaxed">A single pane of glass across every cluster — search, filter, bulk-execute.</p>
    </div>
  </div>

  <div class="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <div class="flex items-start gap-3">
      <CheckCircle2 size={20} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
      <p class="text-[15px] leading-relaxed">Identical web UI, REST API, and CLI semantics across all four products.</p>
    </div>
    <div class="flex items-start gap-3">
      <CheckCircle2 size={20} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
      <p class="text-[15px] leading-relaxed">Single LDAP / OIDC realm spans the entire estate.</p>
    </div>
    <div class="flex items-start gap-3">
      <CheckCircle2 size={20} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
      <p class="text-[15px] leading-relaxed">Apt repositories signed and tested for predictable updates.</p>
    </div>
    <div class="flex items-start gap-3">
      <CheckCircle2 size={20} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
      <p class="text-[15px] leading-relaxed">One subscription model, one renewal date, one phone number.</p>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Get started</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      One ISO away from a <span class="quote-italic" style="color: var(--color-primary)">running cluster.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Every product ships as a Debian-based installer. No registration wall, no
      trial expiration, no feature paywall. Boot it on the box you already own
      and the cluster comes up in minutes.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download <ArrowRight size={15} /></a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
