<script lang="ts">
  import {
    ArrowRight, Search, Server, Database, Mail, LayoutDashboard,
    BookOpen, MessagesSquare, Github, FileText, ExternalLink, Terminal
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';

  const productIcons: Record<string, any> = {
    pve: Server,
    pbs: Database,
    pmg: Mail,
    pdm: LayoutDashboard
  };

  const docPages: Record<string, { label: string; href: string }[]> = {
    pve: [
      { label: 'Installation guide', href: '#' },
      { label: 'Cluster setup with Corosync', href: '#' },
      { label: 'Storage configuration (Ceph, ZFS, NFS)', href: '#' },
      { label: 'Networking & SDN (VLAN, VXLAN, EVPN)', href: '#' },
      { label: 'Backup strategy with PBS', href: '#' },
      { label: 'Upgrading from 8.2 to 8.3', href: '#' }
    ],
    pbs: [
      { label: 'Installation guide', href: '#' },
      { label: 'Datastore design and sizing', href: '#' },
      { label: 'Encrypted backups with client keys', href: '#' },
      { label: 'Tape integration (LTO-7 / 8 / 9)', href: '#' },
      { label: 'Remote sync between sites', href: '#' },
      { label: 'Garbage collection and verification', href: '#' }
    ],
    pmg: [
      { label: 'Installation guide', href: '#' },
      { label: 'Sitting in front of Microsoft 365', href: '#' },
      { label: 'Cluster setup (active/active)', href: '#' },
      { label: 'Spam scoring and rule customization', href: '#' },
      { label: 'Quarantine and per-user digests', href: '#' },
      { label: 'DKIM, DMARC, MTA-STS', href: '#' }
    ],
    pdm: [
      { label: 'Installation guide (alpha)', href: '#' },
      { label: 'Adding a Proxmox VE cluster', href: '#' },
      { label: 'Federated identity with OIDC', href: '#' },
      { label: 'Bulk operations and saved playbooks', href: '#' },
      { label: 'Audit log and webhook export', href: '#' }
    ]
  };

  const cli = [
    {
      cmd: 'qm',
      desc: 'KVM virtual machine management',
      lines: [
        { p: '$', rest: ' list' },
        { p: '$', rest: ' start 102 --skiplock 0' },
        { p: '$', rest: ' migrate 102 pve-node-03 --online' },
        { p: '$', rest: ' snapshot 102 pre-upgrade' }
      ]
    },
    {
      cmd: 'pct',
      desc: 'LXC container management',
      lines: [
        { p: '$', rest: ' list' },
        { p: '$', rest: ' create 200 local:vztmpl/debian-12.tar.zst' },
        { p: '$', rest: ' enter 200' },
        { p: '$', rest: ' exec 200 -- apt update' }
      ]
    },
    {
      cmd: 'pvesh',
      desc: 'Proxmox API shell — every UI action, scriptable',
      lines: [
        { p: '$', rest: ' get /nodes' },
        { p: '$', rest: ' get /cluster/resources --type vm' },
        { p: '$', rest: ' create /access/users --userid api@pve' },
        { p: '$', rest: ' ls /storage' }
      ]
    },
    {
      cmd: 'proxmox-backup-client',
      desc: 'Push backups from any Linux host to PBS',
      lines: [
        { p: '$', rest: ' login' },
        { p: '$', rest: ' backup root.pxar:/etc' },
        { p: '$', rest: ' list' },
        { p: '$', rest: ' restore SNAP root.pxar /tmp/r' }
      ]
    }
  ];
</script>

<Seo
  title="Documentation — Proxmox VE, Backup Server, Mail Gateway, Datacenter Manager"
  description="Installation guides, cluster setup, storage configuration, networking, and the API reference for every Proxmox product. Plus a quick CLI cheat sheet."
  path="/docs"
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(800px 420px at 80% 20%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-24 md:pb-28">
    <div class="max-w-3xl">
      <span class="eyebrow mb-5 inline-block">Documentation</span>
      <h1 class="mb-6" style="color: var(--color-night-text)">
        <span class="quote-italic" style="color: var(--color-primary)">Everything</span> you need to run Proxmox in production.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Installation, clustering, storage, networking, and the REST API &mdash; for every product in the suite. Written by the engineers who ship the code.
      </p>

      <form class="max-w-xl flex flex-col sm:flex-row gap-3" on:submit|preventDefault>
        <div class="flex items-center gap-2 flex-1 px-4 py-3 rounded-md" style="background: var(--color-night-2); border: 1px solid var(--color-night-line);">
          <Search size={16} style="color: var(--color-night-muted)" />
          <input
            type="text"
            placeholder="Search the docs &mdash; e.g. ZFS, EVPN, MFA"
            class="bg-transparent flex-1 outline-none text-base"
            style="color: var(--color-night-text); font-family: var(--font-sans);"
          />
        </div>
        <a href="#api" class="btn-primary">
          Open API reference <ArrowRight size={15} />
        </a>
      </form>
    </div>
  </div>
</section>

<!-- ============================== PRODUCT DOC GRID ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">By product</span>
    <h2 class="mb-5">Pick a product, find the page.</h2>
    <p class="text-lg">
      Every Proxmox product has its own admin guide, hosted as HTML and PDF. The links below jump straight to the most-used pages.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    {#each products as p}
      {@const Icon = productIcons[p.id] ?? Server}
      <div class="card p-7 flex flex-col">
        <div class="flex items-center justify-between mb-5">
          <span class="feat-icon"><svelte:component this={Icon} size={20} /></span>
          <span class="pill text-[10.5px]">{p.acronym}</span>
        </div>
        <h4 class="mb-2">{p.name.replace('Proxmox ', '')}</h4>
        <p class="text-[14.5px] leading-relaxed mb-5" style="min-height: 4em;">
          {p.tagline}
        </p>

        <ul class="space-y-2 mb-6">
          {#each docPages[p.id] as d}
            <li>
              <a
                href={d.href}
                class="inline-flex items-center gap-1.5 text-[14.5px] underline-link"
                style="color: var(--color-ink);"
              >
                <FileText size={13} style="color: var(--color-muted); flex-shrink: 0" />
                {d.label}
              </a>
            </li>
          {/each}
        </ul>

        <a href="/products/{p.slug}" class="mt-auto text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
          All {p.acronym} docs <ArrowRight size={14} />
        </a>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== QUICK REFERENCE ============================== -->
<section id="api" class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Quick reference</span>
    <h2 class="mb-5">CLI cheat sheet.</h2>
    <p class="text-lg">
      The four commands you will type the most. Every web-UI action has a CLI equivalent and a REST endpoint behind it &mdash; nothing is gated behind the GUI.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each cli as c}
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b flex items-center justify-between" style:border-color="var(--color-border)">
          <div class="flex items-center gap-3">
            <Terminal size={16} style="color: var(--color-primary)" />
            <code class="text-sm font-semibold" style="color: var(--color-ink); font-family: var(--font-mono);">{c.cmd}</code>
          </div>
          <span class="text-xs" style="color: var(--color-muted)">{c.desc}</span>
        </div>
        <div class="code-block rounded-none border-0">
{#each c.lines as l}<span class="c-pmpt">{l.p}</span> <span class="c-key">{c.cmd}</span>{l.rest}
{/each}</div>
      </div>
    {/each}
  </div>

  <div class="mt-10">
    <a href="#" class="btn-outline">
      Read the full API reference <ExternalLink size={14} />
    </a>
  </div>
</section>

<!-- ============================== COMMUNITY ============================== -->
<section class="container-page py-20">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Community</span>
    <h2 class="mb-4">Where the answers live.</h2>
    <p class="text-lg">
      Most operational questions have already been answered &mdash; usually by another operator, sometimes by the maintainers, occasionally by the original commit author.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    <a href="https://forum.proxmox.com" class="card card-hover p-7 flex flex-col group">
      <span class="feat-icon mb-5"><MessagesSquare size={20} /></span>
      <h4 class="mb-2.5">Forum</h4>
      <p class="text-[15px] leading-relaxed mb-6">
        Eighteen years of threads. Search before you post; you will usually find your answer in a 2019 reply from a Hetzner SRE.
      </p>
      <span class="mt-auto text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
        forum.proxmox.com <ExternalLink size={13} />
      </span>
    </a>

    <a href="https://pve.proxmox.com/wiki" class="card card-hover p-7 flex flex-col group">
      <span class="feat-icon mb-5"><BookOpen size={20} /></span>
      <h4 class="mb-2.5">Wiki</h4>
      <p class="text-[15px] leading-relaxed mb-6">
        Operator-edited, lightly-curated. The wiki is where the longer-form howtos live &mdash; PCIe passthrough, GPU mediation, exotic storage backends.
      </p>
      <span class="mt-auto text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
        pve.proxmox.com/wiki <ExternalLink size={13} />
      </span>
    </a>

    <a href="https://git.proxmox.com" class="card card-hover p-7 flex flex-col group">
      <span class="feat-icon mb-5"><Github size={20} /></span>
      <h4 class="mb-2.5">Source on Git</h4>
      <p class="text-[15px] leading-relaxed mb-6">
        Every package, signed and tagged. The bug tracker links commits to releases; the mailing list patches are public, archived, and searchable.
      </p>
      <span class="mt-auto text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
        git.proxmox.com <ExternalLink size={13} />
      </span>
    </a>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-24">
    <span class="eyebrow mb-4 inline-block">Need a human</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      When the docs run out, <span class="quote-italic" style="color: var(--color-primary)">we pick up the phone.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Enterprise subscriptions include direct access to the engineering team in Vienna. No first-line filter, no ticket-routing carousel, no overseas escalation desk.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/support" class="btn-primary">See support plans</a>
      <a href="/contact" class="btn-outline">Talk to an engineer</a>
    </div>
  </div>
</section>
