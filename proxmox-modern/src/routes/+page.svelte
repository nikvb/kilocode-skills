<script lang="ts">
  import {
    ArrowRight, Server, Database, Mail, LayoutDashboard,
    Cpu, Network, ShieldCheck, Layers, Workflow, GitBranch,
    Building2, Cloud, GraduationCap, Boxes, Lock, Zap, CheckCircle2,
    Archive, Repeat, BadgeCheck, Quote
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products, stats, useCases, customers, testimonials, company } from '$lib/data/products';

  const iconMap: Record<string, any> = {
    Server, Database, Mail, LayoutDashboard, Cpu, Network, ShieldCheck,
    Layers, Workflow, GitBranch, Building2, Cloud, GraduationCap,
    Boxes, Lock, Zap, CheckCircle2, Archive, Repeat
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: company.legalName,
        url: company.baseUrl,
        foundingDate: String(company.founded),
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Bräuhausgasse 37',
          addressLocality: 'Vienna',
          postalCode: '1050',
          addressCountry: 'AT'
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: company.phone,
          email: company.email,
          contactType: 'customer service'
        }
      },
      {
        '@type': 'WebSite',
        url: company.baseUrl,
        name: 'Proxmox',
        description: company.tagline
      }
    ]
  };

  // Logo marquee — repeated twice for seamless loop
  const logosLoop = [...customers, ...customers];
</script>

<Seo
  title="Proxmox — Open-source virtualization, backup, and email security"
  description="The complete open-source data-center platform. KVM and LXC virtualization, deduplicating backup, and mail security — clustered, supported, and built in Vienna since 2005."
  path="/"
  {jsonLd}
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(900px 460px at 78% 18%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-32 md:pt-28 md:pb-40">
    <div class="max-w-3xl">
      <span class="pill mb-6 inline-flex">
        <span class="w-1.5 h-1.5 rounded-full" style="background: var(--color-primary)"></span>
        Proxmox VE 8.3 is out — improved Ceph Squid, SDN EVPN GA
      </span>

      <h1 class="mb-7" style="color: var(--color-night-text)">
        The data center,<br/>
        <span class="quote-italic" style="color: var(--color-primary)">unlicensed.</span>
      </h1>

      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Run virtual machines, system containers, deduplicating backups, and mail
        security on hardware you already own — clustered, supported, and open-source
        since {company.founded}.
      </p>

      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/downloads" class="btn-primary">
          Download Proxmox VE <ArrowRight size={16} />
        </a>
        <a href="/contact" class="btn-outline">Talk to an engineer</a>
      </div>

      <div class="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm" style="color: var(--color-night-muted)">
        <span class="inline-flex items-center gap-2"><BadgeCheck size={15} class="text-orange-400" /> AGPL v3 — no per-socket licensing</span>
        <span class="inline-flex items-center gap-2"><BadgeCheck size={15} class="text-orange-400" /> Production-ready since 2008</span>
        <span class="inline-flex items-center gap-2"><BadgeCheck size={15} class="text-orange-400" /> Works on hardware from the last decade</span>
      </div>
    </div>

    <!-- Floating product card preview, right side, desktop only -->
    <div class="hidden xl:block absolute right-12 top-32 w-[480px]" aria-hidden="true">
      <div class="card p-6" style="background: var(--color-night-2); border-color: var(--color-night-line)">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70"></span>
          <span class="ml-2 text-xs" style="color: var(--color-night-muted); font-family: var(--font-mono)">cluster-prd-01</span>
        </div>
        <pre class="text-[12.5px] leading-[1.85]" style="font-family: var(--font-mono); color: var(--color-night-text); white-space: pre-wrap;"><span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">qm</span> migrate 102 pve-node-03 --online
task started by HA resource agent
<span style="color: #6B7280"># live migrate VM 102 → pve-node-03</span>
2026-04-29 15:20:11 starting migration of VM 102
2026-04-29 15:20:11 found local disk 'local-zfs:vm-102-disk-0'
2026-04-29 15:20:12 copying disk image (12 GiB) over the network
2026-04-29 15:20:34 average bandwidth: <span style="color: #A8E6A1">421 MiB/s</span>
2026-04-29 15:20:34 starting online migration
2026-04-29 15:20:35 migration speed: 14.2 GB/s
2026-04-29 15:20:36 <span style="color: #A8E6A1">migration finished successfully</span>
<span style="color: var(--color-primary)">$</span> <span style="color: #6B7280"># 25 seconds, no downtime</span></pre>
      </div>
    </div>
  </div>

  <!-- Customer logos marquee -->
  <div class="border-t" style:border-color="var(--color-night-line)">
    <div class="container-page py-8">
      <p class="text-xs uppercase tracking-widest mb-5" style="color: var(--color-night-muted); font-weight: 600; letter-spacing: 0.18em">
        Trusted in production
      </p>
      <div class="overflow-hidden">
        <div class="marquee">
          {#each logosLoop as c, i}
            <div class="flex items-center gap-3 shrink-0" aria-hidden={i >= customers.length}>
              <span style="color: color-mix(in oklab, var(--color-night-text) 70%, transparent); font-family: var(--font-display); font-weight: 600; font-size: 1.45rem; letter-spacing: -0.02em;">{c.name}</span>
              <span class="text-xs" style="color: var(--color-night-muted)">·</span>
              <span class="text-xs" style="color: var(--color-night-muted)">{c.note}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================== STATS ============================== -->
<section class="container-page py-24">
  <div class="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
    {#each stats as s}
      <div>
        <div class="stat-num">{s.num}</div>
        <p class="mt-3 text-base" style="color: var(--color-muted); max-width: 18rem">{s.label}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== PRODUCT GRID ============================== -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Four products, one platform</span>
    <h2 class="mb-5">Everything a small data center needs.<br/>Nothing it does not.</h2>
    <p class="text-lg leading-relaxed">
      Each Proxmox product is a self-contained Debian appliance with the same
      design language: a fast HTML5 web UI, a complete REST API, and source
      code on GitHub. Use one. Use all four. Switch the licensing model from
      per-socket extortion to predictable per-socket support.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each products as p, i}
      <a
        href="/products/{p.slug}"
        class="card card-hover p-7 group flex flex-col"
        style="min-height: 280px"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <span class="feat-icon">
            <svelte:component this={[Server, Database, Mail, LayoutDashboard][i]} size={20} />
          </span>
          <span class="pill text-[10.5px]">{p.acronym}</span>
        </div>
        <h3 class="mb-2.5">{p.name.replace('Proxmox ', '')}</h3>
        <p class="mb-5 text-base leading-relaxed">{p.tagline}</p>
        <div class="mt-auto flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
          Learn more <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- ============================== USE CASES ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Why teams switch</span>
    <h2 class="mb-5">Proxmox shines in the cases that matter.</h2>
    <p class="text-lg">
      Four scenarios where Proxmox is not just an alternative — it is the
      better answer to the question.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {#each useCases as u}
      {@const Icon = iconMap[u.icon] ?? Server}
      <a href={u.href} class="card card-hover p-6 flex flex-col">
        <span class="feat-icon mb-4"><svelte:component this={Icon} size={20} /></span>
        <h4 class="mb-2.5">{u.title}</h4>
        <p class="text-[15px] leading-relaxed mb-5">{u.body}</p>
        <span class="mt-auto text-sm font-semibold underline-link" style="color: var(--color-primary)">Read the play →</span>
      </a>
    {/each}
  </div>
</section>

<!-- ============================== HOW IT FITS TOGETHER (DIAGRAM) ============================== -->
<section class="ink-section">
  <div class="container-page py-24">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <span class="eyebrow mb-3 inline-block">How it fits together</span>
        <h2 class="mb-6" style="color: var(--color-night-text)">
          A platform, not a product catalog.
        </h2>
        <p class="text-lg leading-relaxed mb-8">
          Every Proxmox component speaks the same REST API and shares the same
          identity layer. PBS backs up VMs running on PVE; PMG sits in front of a
          mail server living on PVE; PDM federates them. Add Ceph for shared
          storage and the entire data center fits in one rack — no SAN, no
          vendor lock-in, no surprise renewal email.
        </p>
        <ul class="grid gap-3 text-base">
          <li class="flex items-start gap-3"><CheckCircle2 size={20} class="shrink-0 mt-0.5 text-orange-400" /><span>Identical web UI, REST API, and CLI semantics across all four products</span></li>
          <li class="flex items-start gap-3"><CheckCircle2 size={20} class="shrink-0 mt-0.5 text-orange-400" /><span>Single LDAP / OIDC / Active Directory realm spans the entire estate</span></li>
          <li class="flex items-start gap-3"><CheckCircle2 size={20} class="shrink-0 mt-0.5 text-orange-400" /><span>Apt repositories signed and tested for stable, predictable updates</span></li>
          <li class="flex items-start gap-3"><CheckCircle2 size={20} class="shrink-0 mt-0.5 text-orange-400" /><span>One subscription model, one renewal date, one phone number</span></li>
        </ul>
      </div>

      <div>
        <div class="card p-7" style="background: var(--color-night-2); border-color: var(--color-night-line)">
          <!-- Stack diagram -->
          <div class="grid gap-3">
            <div class="rounded-md border p-4 flex items-center gap-3" style="background: var(--color-night-3); border-color: var(--color-night-line)">
              <LayoutDashboard size={18} class="text-orange-400" />
              <div>
                <div class="text-sm font-semibold" style="color: var(--color-night-text)">Datacenter Manager</div>
                <div class="text-xs" style="color: var(--color-night-muted)">Federates every cluster, every product</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div class="rounded-md border p-4" style="background: var(--color-night-3); border-color: var(--color-night-line)">
                <Server size={18} class="text-orange-400 mb-2" />
                <div class="text-sm font-semibold" style="color: var(--color-night-text)">PVE</div>
                <div class="text-xs" style="color: var(--color-night-muted)">VMs &amp; containers</div>
              </div>
              <div class="rounded-md border p-4" style="background: var(--color-night-3); border-color: var(--color-night-line)">
                <Database size={18} class="text-orange-400 mb-2" />
                <div class="text-sm font-semibold" style="color: var(--color-night-text)">PBS</div>
                <div class="text-xs" style="color: var(--color-night-muted)">Dedup backup</div>
              </div>
              <div class="rounded-md border p-4" style="background: var(--color-night-3); border-color: var(--color-night-line)">
                <Mail size={18} class="text-orange-400 mb-2" />
                <div class="text-sm font-semibold" style="color: var(--color-night-text)">PMG</div>
                <div class="text-xs" style="color: var(--color-night-muted)">Mail security</div>
              </div>
            </div>
            <div class="rounded-md border p-4" style="background: var(--color-night-3); border-color: var(--color-night-line)">
              <div class="text-xs uppercase tracking-widest mb-1.5" style="color: var(--color-night-muted)">Foundation</div>
              <div class="grid grid-cols-2 gap-2 text-sm" style="color: var(--color-night-text)">
                <div>• Debian 12 Bookworm</div>
                <div>• Linux Kernel 6.8</div>
                <div>• KVM / QEMU + LXC</div>
                <div>• Ceph Squid 19.x</div>
                <div>• ZFS 2.2</div>
                <div>• Open vSwitch / SDN</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============================== KEY CAPABILITIES (FEATURE GRID) ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Capabilities</span>
    <h2 class="mb-5">Built like infrastructure, not a SaaS demo.</h2>
    <p class="text-lg">
      Live migration, software-defined storage, signed updates, two-factor
      auth, and SDN — all available on day one, on the free tier.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
    {#each products[0].highlights as h}
      {@const Icon = iconMap[h.icon] ?? Server}
      <div class="card p-6">
        <span class="feat-icon mb-4"><svelte:component this={Icon} size={20} /></span>
        <h4 class="mb-2.5">{h.title}</h4>
        <p class="text-[15px] leading-relaxed">{h.body}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== TESTIMONIALS ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Voices</span>
    <h2 class="mb-5">From the racks of teams who shipped it.</h2>
  </div>

  <div class="grid gap-5 lg:grid-cols-3">
    {#each testimonials as t}
      <figure class="card p-7 flex flex-col">
        <Quote size={22} class="mb-5" style="color: var(--color-primary)" />
        <blockquote class="quote-italic text-lg leading-relaxed mb-6" style="color: var(--color-ink); font-weight: 400">
          "{t.quote}"
        </blockquote>
        <figcaption class="mt-auto pt-5 border-t" style:border-color="var(--color-border)">
          <div class="font-semibold">{t.name}</div>
          <div class="text-sm" style="color: var(--color-muted)">{t.role}</div>
        </figcaption>
      </figure>
    {/each}
  </div>
</section>

<!-- ============================== MIGRATION PLAYBOOK ============================== -->
<section class="container-page py-24">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="pill pill-primary mb-5 inline-flex">VMware migration</span>
        <h2 class="mb-5">Bring your ESXi hosts in three commands.</h2>
        <p class="text-lg mb-6">
          Native ESXi-import driver. Mount the existing datastore, point Proxmox VE
          at it, and live-migrate VMs over while the source cluster keeps running.
          No conversion tools. No third-party agents. No professional services line item.
        </p>
        <a href="/solutions/private-cloud" class="btn-primary">Read the migration guide <ArrowRight size={15} /></a>
      </div>
      <div class="code-block text-sm">
<span class="c-com"># 1. Add the ESXi host as an import source</span>
<span class="c-pmpt">$</span> pvesm add esxi vmware-prod \
    --server vcsa.example.com \
    --username root@vsphere.local

<span class="c-com"># 2. Import a VM (live, while source is running)</span>
<span class="c-pmpt">$</span> qm importovf 201 \
    --pool vmware-prod \
    --target-storage rbd

<span class="c-com"># 3. Boot it on the new cluster</span>
<span class="c-pmpt">$</span> qm start 201
<span class="c-str">  → VM 201 running on pve-node-01</span>
</div>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Get started</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Stand up a cluster <span class="quote-italic" style="color: var(--color-primary)">this afternoon.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Download the ISO, install on three commodity boxes, and you have a
      live-migrating cluster before the coffee goes cold. The free tier has no
      node limits, no feature paywalls, no expiration.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/pricing" class="btn-outline">See subscription plans</a>
    </div>
  </div>
</section>
