<script lang="ts">
  import {
    ArrowRight, Check, Star, Cpu, MessageCircleQuestion,
    Phone, Users, BadgeCheck, ShieldCheck, Headset
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { tiers, fxNote } from '$lib/data/pricing';

  const faqs = [
    {
      q: 'Do I have to subscribe?',
      a:
        'No. Proxmox VE, PBS, and PMG are AGPL v3 software — fully usable without any subscription, on as many hosts as you want, with no feature paywalls. A subscription buys you access to the enterprise repository (signed, tested updates) and human support.'
    },
    {
      q: 'What is a CPU?',
      a:
        'A CPU is a physical socket on the motherboard, not a core or a thread. A dual-socket server with two 64-core EPYCs counts as 2 CPUs. We have never charged per core and we never will.'
    },
    {
      q: 'Is there a free tier?',
      a:
        'Yes. Run Proxmox from the no-subscription repository forever, on every host you own, with the same code paths the paying customers run. The community forum is active and the docs are public.'
    },
    {
      q: 'Can I switch tiers?',
      a:
        'Up at any time, prorated. Down at the next renewal. Tier mismatches across hosts in the same cluster are allowed — pay Premium on the cluster manager nodes and Basic on the workers if that suits you.'
    },
    {
      q: 'Do you do volume discounts?',
      a:
        'Yes — automatic at 10+ CPUs, with deeper bands at 50, 100, and 500 CPUs. Multi-year prepay (2 or 3 years) cuts another ~5% per year. Contact sales for an MSP/reseller arrangement.'
    },
    {
      q: 'How does support work for distributed teams?',
      a:
        'One subscription, multiple authorized contacts on the customer portal. Tickets are not capped per person — they are capped per subscription year. Premium customers get phone numbers for named engineers reachable in CET business hours.'
    }
  ];
</script>

<Seo
  title="Pricing — predictable per-CPU subscriptions"
  description="Proxmox subscriptions are priced per physical CPU socket per year. Four tiers from Community to Premium, with no per-core gotchas and no surprise renewals."
  path="/pricing"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 80% 20%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">Pricing</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Predictable. <span class="quote-italic" style="color: var(--color-primary)">Per-CPU.</span> Per-year.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        No per-core gotchas. No surprise renewal email.
      </p>
      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/contact" class="btn-primary">Talk to sales <ArrowRight size={16} /></a>
        <a href="/downloads" class="btn-outline">Download the free edition</a>
      </div>
    </div>
  </div>
</section>

<!-- TIER TABLE -->
<section class="container-page py-24">
  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {#each tiers as t}
      <div
        class="card p-7 flex flex-col relative"
        class:popular={t.popular}
        style={t.popular ? 'border-color: var(--color-primary); box-shadow: 0 22px 48px -28px rgba(229,112,0,0.5);' : ''}
      >
        {#if t.popular}
          <span
            class="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style="background: var(--color-primary); color: var(--color-on-primary)"
          >
            <Star size={12} /> Most popular
          </span>
        {/if}

        <h3 class="mb-1.5">{t.name}</h3>
        <p class="text-sm leading-relaxed mb-6" style="color: var(--color-muted)">{t.short}</p>

        <div class="mb-2 flex items-baseline gap-1.5">
          <span class="stat-num" style="font-size: 2.6rem">€{t.pricePerCpuYear}</span>
        </div>
        <p class="text-xs uppercase tracking-widest mb-6" style="color: var(--color-muted); letter-spacing: 0.14em">
          per CPU / year
        </p>

        <div class="pill mb-6 self-start">{t.audience}</div>

        <p class="text-[14px] leading-relaxed mb-6" style="color: var(--color-ink)">{t.bestFor}</p>

        <ul class="grid gap-2.5 mb-6">
          {#each t.includes as inc}
            <li class="flex items-start gap-2.5 text-[14px]">
              <Check size={16} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
              <span>{inc}</span>
            </li>
          {/each}
        </ul>

        <div class="grid gap-2 text-[13px] mb-7 pt-5 border-t" style:border-color="var(--color-border)">
          <div class="flex justify-between gap-4">
            <span style="color: var(--color-muted)">Response time</span>
            <span class="font-semibold text-right">{t.responseTime}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span style="color: var(--color-muted)">Tickets / year</span>
            <span class="font-semibold text-right">{t.ticketsPerYear}</span>
          </div>
          <div class="flex justify-between gap-4">
            <span style="color: var(--color-muted)">Channels</span>
            <span class="font-semibold text-right">{t.channels.join(', ')}</span>
          </div>
        </div>

        <a
          href={t.id === 'community' ? '/downloads' : '/contact'}
          class={t.popular ? 'btn-primary mt-auto' : 'btn-outline mt-auto'}
        >
          {t.id === 'community' ? 'Download free' : `Buy ${t.name}`}
          <ArrowRight size={15} />
        </a>
      </div>
    {/each}
  </div>

  <p class="mt-8 text-sm italic max-w-3xl" style="color: var(--color-muted); font-family: var(--font-quote)">
    {fxNote}
  </p>
</section>

<!-- WHATS INCLUDED FREE -->
<section class="container-page py-20">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <div>
        <span class="eyebrow mb-3 inline-block">Free, forever</span>
        <h2 class="mb-5">What is included for free.</h2>
        <p class="text-lg leading-relaxed mb-6">
          Every Proxmox product is licensed under AGPL v3. The community
          edition is the same code that paying customers run — no crippled
          features, no node limits, no nag screens you cannot dismiss.
        </p>
        <p class="text-base leading-relaxed">
          A subscription does two things and only two things: it gives you
          access to the enterprise apt repository (signed, tested updates that
          land later than the no-subscription repo, after we have run them
          ourselves) and it puts a human engineer on the other end of a
          ticket. That is the whole pitch.
        </p>
      </div>

      <ul class="grid gap-4">
        {#each [
          'KVM virtual machines and LXC containers, unlimited',
          'Multi-master cluster up to 32 nodes (and more with tuning)',
          'Live migration, HA failover, hardware watchdog fencing',
          'Software-defined storage: Ceph, ZFS, NFS, iSCSI, LVM',
          'Software-defined networking: VLAN, VXLAN, EVPN, simple zones',
          'Two-factor auth, RBAC, integrated firewall, signed updates',
          'Full REST API, CLI tools, and HTML5 web UI',
          'Backup integration with Proxmox Backup Server'
        ] as item}
          <li class="flex items-start gap-3 text-[15px]">
            <span class="feat-icon shrink-0" style="width: 28px; height: 28px"><BadgeCheck size={15} /></span>
            <span class="pt-1">{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="container-narrow py-24">
  <div class="mb-12 max-w-2xl">
    <span class="eyebrow mb-3 inline-block">FAQ</span>
    <h2 class="mb-4">Questions, answered plainly.</h2>
    <p class="text-lg leading-relaxed">
      No marketing wiggle. If a question is missing, the contact form goes
      straight to the sales team.
    </p>
  </div>

  <div class="grid gap-3">
    {#each faqs as f}
      <details class="card p-6 group" style="border-radius: 10px">
        <summary class="cursor-pointer flex items-start justify-between gap-4 list-none">
          <span class="flex items-start gap-3">
            <MessageCircleQuestion size={20} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
            <span class="text-[17px] font-semibold">{f.q}</span>
          </span>
          <span
            class="text-[13px] font-semibold shrink-0 transition-transform group-open:rotate-45"
            style="color: var(--color-muted)"
          >+</span>
        </summary>
        <p class="mt-4 pl-8 text-[15px] leading-relaxed">{f.a}</p>
      </details>
    {/each}
  </div>
</section>

<!-- TALK TO SALES CALLOUT -->
<section class="container-page py-20">
  <div
    class="card p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center gap-8 justify-between"
    style="background: var(--color-elevated)"
  >
    <div class="max-w-2xl">
      <span class="eyebrow mb-3 inline-block">Volume &amp; enterprise</span>
      <h3 class="mb-3">Running 50+ CPUs?</h3>
      <p class="text-[15px] leading-relaxed">
        Volume discounts kick in automatically, and our enterprise team will
        walk you through migration planning, architectural reviews, and
        multi-region SLAs. We answer in CET business hours and most quotes go
        out same-day.
      </p>
    </div>
    <a href="/contact" class="btn-primary shrink-0">
      Talk to sales <ArrowRight size={16} />
    </a>
  </div>
</section>

<!-- CLOSING CTA -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Next step</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Pick a tier or <span class="quote-italic" style="color: var(--color-primary)">just download</span>.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      The community edition has zero feature paywalls. When you are ready for
      signed updates and a human in the loop, upgrade by clicking three boxes
      on the customer portal.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/contact" class="btn-outline">Talk to sales</a>
    </div>
  </div>
</section>
