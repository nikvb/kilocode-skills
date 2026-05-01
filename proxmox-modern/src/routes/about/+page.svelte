<script lang="ts">
  import {
    ArrowRight, MapPin, Phone, Mail, Calendar, Building2,
    GitBranch, Heart
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { company, stats } from '$lib/data/products';

  const leadership = [
    {
      initials: 'MM',
      name: 'Martin Maurer',
      role: 'Chief Executive Officer',
      bio: 'Co-founder. Started Proxmox in 2005 to ship a Linux-based mail gateway and never stopped. Steers product, partnerships, and the long-term roadmap.'
    },
    {
      initials: 'DM',
      name: 'Dietmar Maurer',
      role: 'Chief Technology Officer',
      bio: 'Co-founder. Wrote the first Proxmox VE release in 2008 and still reviews kernel patches. The voice on the dev mailing list is usually his.'
    },
    {
      initials: 'AS',
      name: 'Alexandra Steininger',
      role: 'Chief Operating Officer',
      bio: 'Joined in 2012. Runs the Vienna office, support operations, and the partner program. The reason the renewals process is boring.'
    }
  ];
</script>

<Seo
  title="About — Vienna, 2005, still here"
  description="Proxmox Server Solutions GmbH was founded in 2005 in Vienna by Martin and Dietmar Maurer. Two decades, four products, and a relentlessly open-source posture."
  path="/about"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 80% 18%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">About</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Vienna, <span class="quote-italic" style="color: var(--color-primary)">2005</span>. Still here.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        {company.tagline}
      </p>
      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/contact" class="btn-primary">Talk to us <ArrowRight size={16} /></a>
        <a href="/customers" class="btn-outline">See who runs Proxmox</a>
      </div>
    </div>
  </div>
</section>

<!-- STORY -->
<section class="container-narrow py-24">
  <span class="eyebrow mb-3 inline-block">The story</span>
  <h2 class="mb-10">Twenty years in one rack.</h2>

  <div class="grid gap-6 text-[17px] leading-[1.8]">
    <p>
      Proxmox Server Solutions GmbH was founded in {company.founded} by
      brothers Martin and Dietmar Maurer in Vienna's 5th district. The first
      product was a commercial mail gateway running on Debian — Proxmox Mail
      Gateway — which kept the lights on and paid the rent while a smaller,
      hungrier idea took shape.
    </p>
    <p>
      That idea shipped in April 2008 as Proxmox Virtual Environment 0.9. It
      combined KVM and OpenVZ on the same host, behind a fast web UI, with a
      design choice that sounded radical at the time: GPL-licensed, free to
      run, optionally supported. Ten releases later it had eaten ESXi's lunch
      in homelabs across Europe; ten more and it was running production
      hyperconverged clusters at universities, hosting companies, and
      industrial labs.
    </p>
    <p>
      In 2014 the mail gateway was open-sourced. In 2020 Proxmox Backup
      Server entered general availability — built from scratch around
      content-addressable deduplication, with AES-256-GCM client-side
      encryption baked into the design instead of bolted on. In late 2024
      we shipped the first alpha of Proxmox Datacenter Manager, a federated
      console that lets a service provider operate dozens of independent
      clusters from one screen.
    </p>
    <p>
      The office is still on Bräuhausgasse, a few blocks from the Wienzeile,
      across the street from the same coffee shop the original team used in
      2005. The relationship with the Debian community is symbiotic: most of
      our packages live downstream of Debian stable, and several Proxmox
      engineers maintain Debian packages upstream. We do not fork the kernel,
      we do not fork QEMU, we do not fork Ceph — we ship them, well-tested.
    </p>
    <p>
      In 2025 we marked twenty years. Same building, same product philosophy,
      same Austrian commercial registry number ({company.registry.split(',')[0]}).
      The team has grown — engineers, support staff, training, partners — but
      the bar has not moved: ship infrastructure software that does what it
      says, and answer the phone when it does not.
    </p>
  </div>
</section>

<!-- BY THE NUMBERS -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">By the numbers</span>
    <h2 class="mb-5">Two decades, on a scoreboard.</h2>
    <p class="text-lg leading-relaxed">
      Telemetry from public mirror logs, the customer portal, and the
      enterprise repository — refreshed quarterly.
    </p>
  </div>

  <div class="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
    {#each stats as s}
      <div>
        <div class="stat-num">{s.num}</div>
        <p class="mt-3 text-base" style="color: var(--color-muted); max-width: 18rem">{s.label}</p>
      </div>
    {/each}
  </div>
</section>

<!-- LEADERSHIP -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Leadership</span>
    <h2 class="mb-5">The people who answer the email.</h2>
    <p class="text-lg leading-relaxed">
      A founder-led company. Both Maurers still write code, review patches,
      and read the customer portal. The titles are formalities for the
      registry filing.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    {#each leadership as l}
      <div class="card p-8 flex flex-col items-start">
        <span
          class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 font-semibold"
          style="background: color-mix(in oklab, var(--color-primary) 14%, transparent); color: var(--color-primary); border: 1px solid color-mix(in oklab, var(--color-primary) 25%, transparent); font-family: var(--font-display); font-size: 1.6rem; letter-spacing: -0.02em"
          aria-hidden="true"
        >
          {l.initials}
        </span>
        <h4 class="mb-1">{l.name}</h4>
        <p class="text-[13.5px] mb-4" style="color: var(--color-primary); font-weight: 600; letter-spacing: 0.01em">
          {l.role}
        </p>
        <p class="text-[14.5px] leading-relaxed">{l.bio}</p>
      </div>
    {/each}
  </div>
</section>

<!-- OPEN SOURCE -->
<section class="container-page py-20">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <div>
        <span class="pill pill-primary mb-5 inline-flex">
          <Heart size={14} /> Open-source roots
        </span>
        <h2 class="mb-5">AGPL v3, on purpose.</h2>
        <p class="text-lg leading-relaxed">
          Every Proxmox product is licensed under the GNU Affero General
          Public License v3. The community edition is the same code paying
          customers run — no crippled features, no paywalled integrations,
          no nag screens you cannot dismiss.
        </p>
      </div>

      <div>
        <p class="text-[15.5px] leading-relaxed mb-5">
          A subscription buys two things and only two: access to the
          enterprise apt repository — packages that are signed, tested, and
          released later than the no-subscription channel after we have run
          them ourselves — and a human engineer on the other end of a ticket.
        </p>
        <p class="text-[15.5px] leading-relaxed mb-5">
          We pick AGPL specifically because it closes the SaaS loophole.
          If somebody runs Proxmox-powered hosting and modifies the source,
          the modifications come back to the community. That has not been
          a hypothetical — multiple service-provider-driven features
          (rate limiting, multi-tenant quotas, billing-friendly REST shapes)
          arrived as upstream patches.
        </p>
        <a href="https://git.proxmox.com" class="btn-ghost">
          Read the source <GitBranch size={14} />
        </a>
      </div>
    </div>
  </div>
</section>

<!-- FIND US -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Find us</span>
    <h2 class="mb-5">Bräuhausgasse 37, second floor.</h2>
    <p class="text-lg leading-relaxed">
      The office is on the south side of the Wienzeile in Vienna's 5th
      district. Visitors are welcome — coffee is on the team if you book
      ahead.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    <div class="card p-8">
      <span class="feat-icon mb-4"><MapPin size={20} /></span>
      <h4 class="mb-2">Headquarters</h4>
      <p class="text-[15.5px] leading-relaxed mb-4">{company.headquarters}</p>
      <div class="flex flex-col gap-2 text-[13.5px]" style="color: var(--color-muted)">
        <span class="inline-flex items-center gap-2">
          <Phone size={14} /> <a href="tel:{company.phone.replace(/\s/g, '')}" class="underline-link">{company.phone}</a>
        </span>
        <span class="inline-flex items-center gap-2">
          <Mail size={14} /> <a href="mailto:{company.email}" class="underline-link">{company.email}</a>
        </span>
        <span class="inline-flex items-center gap-2">
          <Calendar size={14} /> Mon-Fri 9:00-18:00 CET
        </span>
      </div>
    </div>

    <div class="card p-8">
      <span class="feat-icon mb-4"><Building2 size={20} /></span>
      <h4 class="mb-2">Company details</h4>
      <div class="grid gap-3 text-[14px]">
        <div class="flex justify-between gap-4">
          <span style="color: var(--color-muted)">Legal name</span>
          <span class="text-right">{company.legalName}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span style="color: var(--color-muted)">Founded</span>
          <span class="text-right">{company.founded}, Vienna</span>
        </div>
        <div class="flex justify-between gap-4">
          <span style="color: var(--color-muted)">Registry</span>
          <span class="text-right">{company.registry}</span>
        </div>
        <div class="flex justify-between gap-4">
          <span style="color: var(--color-muted)">VAT</span>
          <span class="text-right">{company.vat}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CLOSING CTA -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Work with us</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Two decades in. <span class="quote-italic" style="color: var(--color-primary)">Many more to go</span>.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      We are hiring engineers, support staff, and field architects in Vienna
      and remote-friendly across Europe. If you ship infrastructure software
      and prefer mailing lists to all-hands meetings, talk to us.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/careers" class="btn-primary">See open roles</a>
      <a href="/contact" class="btn-outline">Contact the team</a>
    </div>
  </div>
</section>
