<script lang="ts">
  import {
    ArrowRight, Users, KeyRound, Terminal,
    Gauge, Webhook, BarChart3, Handshake, CheckCircle2, Cloud
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { customers } from '$lib/data/products';

  const primitives = [
    {
      icon: Users,
      title: 'Pools',
      subtitle: 'Resource quotas per tenant',
      body:
        'Group VMs, containers, and storage into named pools. Apply CPU, RAM, and disk quotas per pool. Grant a tenant role-based access to their pool only — they see nothing of the rest of the cluster.'
    },
    {
      icon: KeyRound,
      title: 'Realms',
      subtitle: 'Per-tenant LDAP / OIDC',
      body:
        'Authentication realms (PAM, LDAP, Active Directory, OpenID Connect) configured independently per tenant. Map external groups to Proxmox roles, federate identity to Keycloak / Azure AD / Okta, and keep tenants isolated at the auth layer.'
    },
    {
      icon: Terminal,
      title: 'API tokens',
      subtitle: 'Per-tenant programmatic access',
      body:
        'Issue scoped tokens with their own ACL, expiry, and per-token rate limits. Tokens drive customer-facing portals, Terraform providers, and CI pipelines without ever touching a user password.'
    }
  ];

  const billingItems = [
    {
      icon: Gauge,
      title: 'Per-VM rate limiting',
      body:
        'CPU, memory ballooning, disk IOPS / bandwidth, and network bandwidth caps configurable per guest. Enforce the "small / medium / large" plan you sell at the hypervisor — not on the honour system.'
    },
    {
      icon: Webhook,
      title: 'Hookscripts for provisioning',
      body:
        'Pre/post-start, pre/post-stop, pre/post-clone hookscripts on every VM and container. Wire provisioning into your billing system: charge the moment the VM boots, refund the moment it shuts down.'
    },
    {
      icon: BarChart3,
      title: 'Prometheus metrics',
      body:
        'Built-in Prometheus exporter for every Proxmox VE node, every guest, every storage pool. Scrape into your existing observability stack and run chargeback on the metrics you already alert on.'
    }
  ];

  const logoCustomers = customers.slice(0, 8);
</script>

<Seo
  title="Proxmox for service providers — multi-tenant cloud primitives"
  description="Pools, realms, API tokens, per-VM rate limiting, and Prometheus metrics — the primitives a public IaaS needs. Run a cloud business on Proxmox VE."
  path="/solutions/service-providers"
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
      <span class="pill pill-primary mb-6 inline-flex">Service providers</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Run a <span class="quote-italic" style="color: var(--color-primary)">cloud business</span> on Proxmox.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Multi-tenant pools, federated identity, per-VM rate limits,
        REST-driven provisioning, and Prometheus chargeback. Several public
        IaaS providers already run their fleets on Proxmox VE — the
        primitives are in the box.
      </p>
    </div>
  </div>
</section>

<!-- ============================== MULTI-TENANT PRIMITIVES ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Multi-tenant primitives</span>
    <h2 class="mb-5">The three things a tenant boundary is made of.</h2>
    <p class="text-lg leading-relaxed">
      Isolation at the resource layer, the identity layer, and the API layer.
      Compose them however your billing model demands.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    {#each primitives as p}
      <div class="card p-7 flex flex-col">
        <span class="feat-icon mb-5"><svelte:component this={p.icon} size={20} /></span>
        <h3 class="mb-1">{p.title}</h3>
        <div class="text-sm font-semibold mb-4" style="color: var(--color-primary)">{p.subtitle}</div>
        <p class="text-[15px] leading-relaxed">{p.body}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== BILLING-FRIENDLY ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Billing-friendly</span>
      <h2 class="mb-5">Plumbing for the chargeback team.</h2>
      <p class="text-lg leading-relaxed">
        Metering, enforcement, and provisioning hooks the billing system can
        actually trust. No screen-scraping the web UI; no "estimate the bill
        from the rack diagram".
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      {#each billingItems as b}
        <div class="card p-7" style="background: var(--color-surface)">
          <span class="feat-icon mb-5"><svelte:component this={b.icon} size={20} /></span>
          <h3 class="mb-3">{b.title}</h3>
          <p class="text-[15px] leading-relaxed">{b.body}</p>
        </div>
      {/each}
    </div>

    <div class="card p-7 mt-8" style="background: var(--color-surface)">
      <h4 class="mb-4">Reference flow</h4>
      <div class="grid md:grid-cols-4 gap-4 text-[14.5px]">
        <div class="flex items-start gap-3">
          <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
          <span>Customer signs up in your portal</span>
        </div>
        <div class="flex items-start gap-3">
          <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
          <span>Portal calls Proxmox REST API with a tenant-scoped token</span>
        </div>
        <div class="flex items-start gap-3">
          <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
          <span>VM provisions into the tenant pool with rate limits applied</span>
        </div>
        <div class="flex items-start gap-3">
          <CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
          <span>Hookscript posts a "VM started" event to the billing system</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================== PRODUCTION CUSTOMERS ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">In production</span>
    <h2 class="mb-5">Who already runs Proxmox at scale.</h2>
    <p class="text-lg leading-relaxed">
      A sample of organisations operating Proxmox VE in production
      environments — public clouds, hosting platforms, research labs, and
      enterprise data centers.
    </p>
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each logoCustomers as c}
      <div class="card p-6 flex flex-col gap-2 min-h-[120px]">
        <span style="font-family: var(--font-display); font-weight: 600; font-size: 1.35rem; letter-spacing: -0.02em; color: var(--color-ink)">
          {c.name}
        </span>
        <span class="text-sm" style="color: var(--color-muted)">{c.note}</span>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== PARTNER PROGRAM ============================== -->
<section class="container-page py-16">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-[3fr_2fr] gap-10 items-center">
      <div>
        <span class="pill pill-primary mb-5 inline-flex"><Handshake size={14} /> Partner program</span>
        <h2 class="mb-5">Resell, integrate, or build a managed offering.</h2>
        <p class="text-lg leading-relaxed mb-6">
          The Proxmox Partner Program covers reseller, integrator, and managed
          service tiers — with discounted subscriptions, lead routing,
          co-marketing, and access to Vienna engineers for joint architectures.
        </p>
        <a href="/partners" class="btn-primary">Become a Proxmox partner <ArrowRight size={15} /></a>
      </div>
      <div class="grid gap-3">
        <div class="flex items-center gap-3 text-[15px]"><Cloud size={18} style="color: var(--color-primary)" /> <span>Reseller tier with tiered discount on every subscription</span></div>
        <div class="flex items-center gap-3 text-[15px]"><Cloud size={18} style="color: var(--color-primary)" /> <span>Integrator tier with technical pre-sales support</span></div>
        <div class="flex items-center gap-3 text-[15px]"><Cloud size={18} style="color: var(--color-primary)" /> <span>Managed service tier with co-engineered architectures</span></div>
        <div class="flex items-center gap-3 text-[15px]"><Cloud size={18} style="color: var(--color-primary)" /> <span>Authorised training partner programme</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Build a cloud</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      The fleet is ready when <span class="quote-italic" style="color: var(--color-primary)">you are.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Talk to a Vienna engineer about a multi-cluster architecture, an OEM
      arrangement, or the partner programme — whichever shape your business
      needs.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/contact" class="btn-primary">Talk to an engineer</a>
      <a href="/pricing" class="btn-outline">See subscription plans</a>
    </div>
  </div>
</section>
