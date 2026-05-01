<script lang="ts">
  import {
    ArrowRight, Server, Database, Mail, LayoutDashboard,
    Cpu, Network, ShieldCheck, Layers, Workflow, GitBranch,
    Boxes, Lock, Zap, CheckCircle2, Archive, Repeat,
    Activity, Users, Terminal, Bug, Inbox
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { productBySlug } from '$lib/data/products';

  const product = productBySlug('mail-gateway')!;

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
    style="background: radial-gradient(900px 460px at 80% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-28 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <div class="flex flex-wrap gap-2.5 mb-6">
        <span class="pill pill-primary">{product.acronym}</span>
        <span class="pill">Released {product.released}</span>
        <span class="pill">Latest: v{product.latestVersion} ({product.latestRelease})</span>
      </div>

      <h1 class="mb-7" style="color: var(--color-night-text)">
        Proxmox Mail<br/>
        <span class="quote-italic" style="color: var(--color-primary)">Gateway.</span>
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
      <h2 class="mb-6">A drop-in mail filter, not a forklift upgrade.</h2>
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
          <span class="ml-2 text-xs" style="color: var(--color-night-muted); font-family: var(--font-mono)">/etc/postfix/transport · pmg-01</span>
        </div>
        <pre class="text-[13px] leading-[1.85]" style="font-family: var(--font-mono); color: var(--color-night-text); white-space: pre-wrap;"><span class="c-com" style="color: #6B7280">{'# Route inbound mail through PMG before delivery to Exchange'}</span>
<span class="c-com" style="color: #6B7280">{'# /etc/postfix/transport on the perimeter MX'}</span>
example.com           smtp:[pmg-01.dmz.example.com]:26
.example.com          smtp:[pmg-01.dmz.example.com]:26

<span class="c-com" style="color: #6B7280">{'# /etc/postfix/main.cf — relay scanned mail to Exchange'}</span>
relay_domains      = example.com
transport_maps     = hash:/etc/postfix/transport
smtpd_recipient_restrictions =
  permit_mynetworks,
  reject_unauth_destination,
  check_policy_service unix:private/pmg-policy

<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">postmap</span> /etc/postfix/transport
<span style="color: var(--color-primary)">$</span> <span style="color: #FFB95C">systemctl</span> reload postfix
<span style="color: #A8E6A1">  → reloaded; PMG now scanning all inbound</span></pre>
      </div>
      <p class="text-sm" style="color: var(--color-muted)">
        PMG sits in front of any MTA — Microsoft 365 connector, Postfix
        relay, on-prem Exchange. Outbound scanning works the same way.
      </p>
    </div>
  </div>
</section>

<!-- ============================== HIGHLIGHTS ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Highlights</span>
      <h2 class="mb-5">Four things that catch the spam your current filter misses.</h2>
      <p class="text-lg leading-relaxed">
        Layered scoring, daily-updated AV, active-active clustering, and per-user
        quarantine — the parts that actually move the false-negative rate.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each product.highlights as h}
        {@const Icon = iconMap[h.icon] ?? Mail}
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
      Anti-spam, anti-virus, transport encryption, multi-tenant rule sets, and
      a tracking center for every message.
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
    <h2 class="mb-5">Modest specs. Big throughput.</h2>
    <p class="text-lg leading-relaxed">
      A two-core VM handles a small business; clustered nodes scale to millions
      of messages a day.
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
        Software is AGPL-licensed and free. Subscriptions cover the enterprise
        rule repository, anti-virus signature updates, and Proxmox-engineer
        support — priced per mailbox tier.
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
      Boot the ISO on a single VM, point your perimeter MX at it, and the next
      wave of phishing breaks against the gateway instead of your users.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">{product.ctaPrimary}</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
