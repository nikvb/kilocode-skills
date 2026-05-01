<script lang="ts">
  import {
    ArrowRight, Headset, Phone, Clock, MessageSquare, BookOpen,
    Users, Github, FileCode, GraduationCap, Award, Workflow,
    UserCheck, BadgeCheck, Mail, Terminal
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { tiers } from '$lib/data/pricing';

  const tierEmphasis: Record<string, { headline: string; engineer: string; phone: boolean }> = {
    community: {
      headline: 'Community-driven help via the public forum.',
      engineer: 'Forum moderators + maintainers respond as volunteers.',
      phone: false
    },
    basic: {
      headline: 'Three tickets a year — the right safety net for small prod.',
      engineer: 'L1 engineer assigned per ticket; escalation to senior on cluster issues.',
      phone: false
    },
    standard: {
      headline: 'Fast response and remote SSH when the cluster needs hands-on help.',
      engineer: 'L2 engineer per ticket; configuration review on request.',
      phone: false
    },
    premium: {
      headline: 'Named senior engineer, phone in hours, unlimited tickets.',
      engineer: 'Named senior engineer with direct phone line; architectural reviews quarterly.',
      phone: true
    }
  };

  const ticketFlow = [
    {
      icon: 'Terminal',
      title: 'You file a ticket',
      body: 'Customer portal walks you through gathering pveversion, journalctl, and pvecm status. The form pre-tags severity from your subscription tier.'
    },
    {
      icon: 'UserCheck',
      title: 'L1 engineer triages',
      body: 'Within your SLA window, an L1 engineer reads the report, reproduces against a matching version, and asks for the missing context (or fixes it).'
    },
    {
      icon: 'Workflow',
      title: 'Senior engineer if needed',
      body: 'Anything kernel, Ceph, clustering, or storage replication-related goes to a senior engineer the same day. Premium customers get a phone callback.'
    },
    {
      icon: 'BadgeCheck',
      title: 'Resolution + post-mortem',
      body: 'You get a written explanation, a patched package if applicable, and — for production-impacting issues — a short post-mortem you can share internally.'
    }
  ];

  const ticketFlowIcons: Record<string, any> = {
    Terminal, UserCheck, Workflow, BadgeCheck
  };

  const selfServe = [
    {
      icon: 'BookOpen',
      title: 'Documentation',
      body: 'The complete admin guide for every product, with config examples, REST API reference, and CLI man pages.',
      href: '/docs',
      cta: 'Read the docs'
    },
    {
      icon: 'Users',
      title: 'Community forum',
      body: '180,000+ registered users. The moderators are Proxmox engineers; the answers are usually faster than tickets.',
      href: 'https://forum.proxmox.com',
      cta: 'Visit the forum'
    },
    {
      icon: 'Github',
      title: 'GitHub issues',
      body: 'Bug reports go to the Bugzilla; feature discussions live on git.proxmox.com and the dev mailing list.',
      href: 'https://bugzilla.proxmox.com',
      cta: 'Open a bug'
    },
    {
      icon: 'FileCode',
      title: 'Wiki',
      body: 'Community-curated runbooks and migration playbooks. Especially good for VMware-to-Proxmox specifics.',
      href: 'https://pve.proxmox.com/wiki',
      cta: 'Browse the wiki'
    }
  ];

  const selfServeIcons: Record<string, any> = {
    BookOpen, Users, Github, FileCode
  };
</script>

<Seo
  title="Support — engineers who built it, on call"
  description="Four support tiers from community forum to named senior engineer with phone access. Response within hours, not days, on premium plans."
  path="/support"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 75% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">Support</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Engineers who <span class="quote-italic" style="color: var(--color-primary)">built it</span>, on call.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        The same people who write the kernel patches answer the tickets. No
        outsourced first-line. No script. No hold music.
      </p>
      <div class="mt-10 flex flex-wrap gap-3.5">
        <a href="/contact" class="btn-primary">Talk to support <ArrowRight size={16} /></a>
        <a href="/pricing" class="btn-outline">See pricing</a>
      </div>
    </div>
  </div>
</section>

<!-- TIER COMPARISON -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Tiers</span>
    <h2 class="mb-5">Four levels, one principle: fast humans.</h2>
    <p class="text-lg leading-relaxed">
      Pricing is per CPU socket per year. The differences below are about
      response speed and how senior the engineer on the other end is —
      not about which features you can run.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {#each tiers as t}
      <div
        class="card p-6 flex flex-col"
        style={t.popular ? 'border-color: var(--color-primary)' : ''}
      >
        <div class="flex items-center gap-2 mb-3">
          <Headset size={18} style="color: var(--color-primary)" />
          <h3 class="m-0" style="font-size: 1.4rem">{t.name}</h3>
        </div>
        <p class="text-[14px] leading-relaxed mb-5" style="color: var(--color-ink); font-weight: 500">
          {tierEmphasis[t.id].headline}
        </p>

        <div class="grid gap-3 text-[13.5px] mb-5">
          <div class="flex items-start gap-2.5">
            <Clock size={16} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
            <div>
              <div style="color: var(--color-muted)">Response</div>
              <div class="font-semibold">{t.responseTime}</div>
            </div>
          </div>
          <div class="flex items-start gap-2.5">
            <MessageSquare size={16} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
            <div>
              <div style="color: var(--color-muted)">Tickets / year</div>
              <div class="font-semibold">{t.ticketsPerYear}</div>
            </div>
          </div>
          <div class="flex items-start gap-2.5">
            <Users size={16} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
            <div>
              <div style="color: var(--color-muted)">Channels</div>
              <div class="font-semibold">{t.channels.join(', ')}</div>
            </div>
          </div>
          {#if tierEmphasis[t.id].phone}
            <div class="flex items-start gap-2.5">
              <Phone size={16} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
              <div>
                <div style="color: var(--color-muted)">Phone</div>
                <div class="font-semibold">Named engineer line</div>
              </div>
            </div>
          {/if}
        </div>

        <p class="text-[13px] leading-relaxed mt-auto pt-5 border-t" style:border-color="var(--color-border)" style:color="var(--color-muted)">
          {tierEmphasis[t.id].engineer}
        </p>
      </div>
    {/each}
  </div>
</section>

<!-- TICKET FLOW -->
<section class="ink-section">
  <div class="container-page py-24">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">How a ticket flows</span>
      <h2 class="mb-5" style="color: var(--color-night-text)">
        From submitted to resolved, on the record.
      </h2>
      <p class="text-lg leading-relaxed">
        Every ticket follows the same flow. The differences between tiers are
        the SLA windows on each step, not the steps themselves.
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {#each ticketFlow as step, i}
        {@const Icon = ticketFlowIcons[step.icon]}
        <div class="card p-6 relative">
          <span
            class="absolute -top-3 left-6 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
            style="background: var(--color-primary); color: var(--color-on-primary)"
          >
            {i + 1}
          </span>
          <span class="feat-icon mb-4 mt-2"><svelte:component this={Icon} size={20} /></span>
          <h4 class="mb-2.5" style="color: var(--color-night-text)">{step.title}</h4>
          <p class="text-[14.5px] leading-relaxed">{step.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- SELF SERVE -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Self-serve resources</span>
    <h2 class="mb-5">Most questions have already been answered.</h2>
    <p class="text-lg leading-relaxed">
      Before you open a ticket, the docs, forum, bug tracker, and wiki are
      where to look. The same engineers who triage tickets read the forum.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {#each selfServe as r}
      {@const Icon = selfServeIcons[r.icon]}
      <a href={r.href} class="card card-hover p-6 flex flex-col">
        <span class="feat-icon mb-4"><svelte:component this={Icon} size={20} /></span>
        <h4 class="mb-2.5">{r.title}</h4>
        <p class="text-[14.5px] leading-relaxed mb-5">{r.body}</p>
        <span class="mt-auto text-sm font-semibold underline-link" style="color: var(--color-primary)">
          {r.cta} &rarr;
        </span>
      </a>
    {/each}
  </div>
</section>

<!-- TRAINING -->
<section class="container-page py-20">
  <div class="card p-10 md:p-14" style="background: var(--color-elevated)">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="pill pill-primary mb-5 inline-flex"><GraduationCap size={14} /> Training &amp; certification</span>
        <h2 class="mb-5">Proxmox VE Administrator certification.</h2>
        <p class="text-lg leading-relaxed mb-4">
          A four-day instructor-led course, in-person in Vienna, Berlin, and
          Madrid — or remote with the same trainer over Jitsi. Hands-on
          labs cover cluster deployment, Ceph, SDN, HA, backups, and the
          REST API.
        </p>
        <p class="text-[15px] leading-relaxed mb-6" style="color: var(--color-muted)">
          Certification exam included. Three years validity. Group discounts
          for cohorts of five or more.
        </p>
        <a href="/training" class="btn-primary">View upcoming sessions <ArrowRight size={16} /></a>
      </div>

      <div class="grid gap-3">
        <div class="card p-5 flex items-center gap-4">
          <span class="feat-icon shrink-0"><Award size={20} /></span>
          <div>
            <div class="font-semibold">Administrator</div>
            <div class="text-sm" style="color: var(--color-muted)">4 days · in-person or remote</div>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <span class="feat-icon shrink-0"><Award size={20} /></span>
          <div>
            <div class="font-semibold">Advanced Cluster &amp; Ceph</div>
            <div class="text-sm" style="color: var(--color-muted)">3 days · in-person</div>
          </div>
        </div>
        <div class="card p-5 flex items-center gap-4">
          <span class="feat-icon shrink-0"><Award size={20} /></span>
          <div>
            <div class="font-semibold">Backup &amp; DR with PBS</div>
            <div class="text-sm" style="color: var(--color-muted)">2 days · remote</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CLOSING CTA -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Talk to us</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      The cluster is down. <span class="quote-italic" style="color: var(--color-primary)">We're listening</span>.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Open a ticket on the customer portal or pick up the phone if you are on
      Premium. CET business hours, named engineers, no triage by chatbot.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/contact" class="btn-primary">Open a ticket</a>
      <a href="/pricing" class="btn-outline">See plans</a>
    </div>
  </div>
</section>
