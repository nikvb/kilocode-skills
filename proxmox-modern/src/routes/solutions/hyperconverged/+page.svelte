<script lang="ts">
  import {
    ArrowRight, Database, Cpu, HardDrive, Network,
    CheckCircle2, Layers, Gauge, Server, Boxes
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';

  const pve = products[0];

  const refArchs = [
    {
      name: 'Small',
      tag: '3-node starter',
      cores: '~24 cores',
      ram: '192 GB',
      raw: '24 TB raw',
      net: '2 × 10 GbE per node',
      body:
        'Minimum viable Ceph cluster. Three identical hosts with 8 cores, 64 GB RAM, and 4 × 2 TB NVMe each. Tolerates one full node loss with size=3 replication. Ideal for a branch office or a pilot replacing an aging vSAN.'
    },
    {
      name: 'Medium',
      tag: '6-node business',
      cores: '~96 cores',
      ram: '768 GB',
      raw: '96 TB raw',
      net: '2 × 25 GbE per node',
      body:
        'Sized for a typical mid-market workload mix: 100 – 200 production VMs with room for backup ingest from PBS. Two failure domains across two racks; size=3, min_size=2. Standard subscription is the recommended tier.'
    },
    {
      name: 'Large',
      tag: '12+ node, scales linear',
      cores: '~192 cores+',
      ram: '1.5 TB+',
      raw: '192 TB+ raw',
      net: '2 × 100 GbE per node',
      body:
        'Add nodes in increments of three to keep failure domains balanced. Erasure-coded pools (4+2 or 8+3) trade some IOPS for usable capacity. Tested cleanly to 32 nodes per cluster; production deployments run well beyond.'
    }
  ];

  const perfStats = [
    {
      icon: HardDrive,
      num: '~50K',
      unit: 'IOPS / node',
      label:
        'Sustained 4K random write per OSD node on NVMe with size=3 replication. Aggregate scales linearly with nodes added.'
    },
    {
      icon: Gauge,
      num: '~0.8',
      unit: 'ms read latency',
      label:
        'Median 4K random read from RBD on a healthy cluster with NVMe OSDs and 25 GbE cluster network. Tail (p99) typically under 3 ms.'
    },
    {
      icon: Layers,
      num: 'Linear',
      unit: 'to 32 nodes',
      label:
        'Throughput and IOPS scale near-linearly as OSD nodes are added, until network or client concurrency becomes the bottleneck.'
    }
  ];

  const networking = [
    'Dedicated cluster (back-end) network — separate from VM and client traffic',
    '10 GbE minimum, 25 GbE recommended, 100 GbE for NVMe-heavy clusters',
    'MTU 9000 (jumbo frames) on the cluster network for replication efficiency',
    'Two switches with LACP bonding — no single switch as a failure domain',
    'Separate corosync ring on a third VLAN — latency-sensitive, not bandwidth-hungry',
    'BGP / EVPN routed fabric supported via Proxmox SDN for spine-leaf builds'
  ];
</script>

<Seo
  title="Hyperconverged infrastructure on Proxmox VE + Ceph"
  description="Three-node minimum, scale linearly to 32 nodes. KVM compute and Ceph storage on the same hosts — no SAN, no per-socket vSAN tax."
  path="/solutions/hyperconverged"
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
      <span class="pill pill-primary mb-6 inline-flex">HCI</span>
      <h1 class="mb-7" style="color: var(--color-night-text)">
        Compute, storage, network — <span class="quote-italic" style="color: var(--color-primary)">one rack.</span>
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Run KVM compute and Ceph storage on the same hosts. Add a node, get
        more cores, RAM, and storage capacity at the same time. No SAN, no
        external array, no per-socket vSAN tax.
      </p>
    </div>
  </div>
</section>

<!-- ============================== WHAT HCI IS ============================== -->
<section class="container-page py-24">
  <div class="grid lg:grid-cols-[5fr_4fr] gap-14 items-start">
    <div>
      <span class="eyebrow mb-3 inline-block">What HCI is on Proxmox</span>
      <h2 class="mb-6">Ceph and KVM, on the same Debian host.</h2>
      <div class="space-y-5 text-lg leading-relaxed">
        <p>
          Proxmox VE ships with a Ceph installer in the web UI. Pick the OSD
          disks, define the cluster network, and the same nodes that run your
          VMs become the storage cluster underneath them. RBD volumes are
          attached to KVM guests directly — no NFS, no iSCSI hop.
        </p>
        <p>
          Three nodes is the practical minimum so the cluster can survive a
          single host failure with size=3 replication. From there, scale by
          adding nodes — each one contributes CPU, RAM, and OSDs to the same
          pool. The {pve.acronym} {pve.latestVersion} release ships with Ceph
          Squid 19.x and tested-clean upgrade paths from Reef.
        </p>
      </div>
    </div>
    <div class="card p-7" style="background: var(--color-elevated)">
      <h4 class="mb-5">Why hyperconvergence on Proxmox</h4>
      <ul class="grid gap-3.5 text-[15px]">
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>Ceph integrated into the installer — no separate cluster to babysit</span></li>
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>Self-healing replication, automatic OSD rebalancing on disk loss</span></li>
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>Snapshots, thin provisioning, encryption-at-rest on every RBD pool</span></li>
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>Live migration with shared storage — sub-second cutover</span></li>
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>Same web UI for VMs, OSDs, pools, and monitors</span></li>
        <li class="flex items-start gap-2.5"><CheckCircle2 size={18} class="shrink-0 mt-0.5" style="color: var(--color-success)" /><span>No per-TB or per-socket storage license</span></li>
      </ul>
    </div>
  </div>
</section>

<!-- ============================== REFERENCE ARCHITECTURES ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="max-w-3xl mb-14">
      <span class="eyebrow mb-3 inline-block">Reference architectures</span>
      <h2 class="mb-5">Three sizes, one shape.</h2>
      <p class="text-lg leading-relaxed">
        Pick the closest match to the workload you have today; both ends scale
        out by adding three more nodes at a time.
      </p>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      {#each refArchs as a}
        <div class="card p-7 flex flex-col" style="background: var(--color-surface)">
          <span class="pill mb-5 inline-flex">{a.tag}</span>
          <h3 class="mb-5">{a.name}</h3>
          <dl class="grid gap-3 mb-6 text-[15px]">
            <div class="flex items-center gap-3">
              <Cpu size={16} style="color: var(--color-primary)" />
              <dt class="font-semibold w-20">Compute</dt>
              <dd>{a.cores}</dd>
            </div>
            <div class="flex items-center gap-3">
              <Boxes size={16} style="color: var(--color-primary)" />
              <dt class="font-semibold w-20">Memory</dt>
              <dd>{a.ram}</dd>
            </div>
            <div class="flex items-center gap-3">
              <HardDrive size={16} style="color: var(--color-primary)" />
              <dt class="font-semibold w-20">Storage</dt>
              <dd>{a.raw}</dd>
            </div>
            <div class="flex items-center gap-3">
              <Network size={16} style="color: var(--color-primary)" />
              <dt class="font-semibold w-20">Network</dt>
              <dd>{a.net}</dd>
            </div>
          </dl>
          <p class="text-[15px] leading-relaxed mt-auto">{a.body}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ============================== PERFORMANCE ============================== -->
<section class="container-page py-24">
  <div class="max-w-3xl mb-14">
    <span class="eyebrow mb-3 inline-block">Performance</span>
    <h2 class="mb-5">Numbers from real Ceph clusters.</h2>
    <p class="text-lg leading-relaxed">
      Order-of-magnitude figures for an all-NVMe cluster on 25 GbE. Your
      hardware will move them — these are the reference points to size against.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-3">
    {#each perfStats as s}
      <div class="card p-7">
        <span class="feat-icon mb-5"><svelte:component this={s.icon} size={20} /></span>
        <div class="flex items-baseline gap-2 mb-2">
          <span class="stat-num" style="font-size: 3.25rem">{s.num}</span>
          <span class="text-sm font-semibold" style="color: var(--color-muted)">{s.unit}</span>
        </div>
        <p class="text-[15px] leading-relaxed">{s.label}</p>
      </div>
    {/each}
  </div>
</section>

<!-- ============================== NETWORKING REQUIREMENTS ============================== -->
<section class="py-24" style="background: var(--color-elevated)">
  <div class="container-page">
    <div class="grid lg:grid-cols-[4fr_5fr] gap-14 items-start">
      <div>
        <span class="eyebrow mb-3 inline-block">Networking</span>
        <h2 class="mb-5">Ceph is hungry for the network.</h2>
        <p class="text-lg leading-relaxed">
          Storage replication and recovery traffic dominate. Cheaping out on
          switching is the most common reason a Ceph cluster underperforms.
          Plan the network first, the disks second.
        </p>
      </div>
      <ul class="grid gap-3.5">
        {#each networking as item}
          <li class="card p-5 flex items-start gap-3.5" style="background: var(--color-surface)">
            <Network size={18} class="shrink-0 mt-0.5" style="color: var(--color-primary)" />
            <span class="text-[15px] leading-relaxed">{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-28">
    <span class="eyebrow mb-4 inline-block">Build the rack</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Three boxes, ten gigabit, <span class="quote-italic" style="color: var(--color-primary)">one cluster.</span>
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      Download Proxmox VE, run the integrated Ceph installer, and you have a
      hyperconverged cluster before lunch. Scale by adding nodes; the cluster
      rebalances itself.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/pricing" class="btn-outline">See subscription plans</a>
    </div>
  </div>
</section>
