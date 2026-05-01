export type PostCategory = 'Engineering' | 'Releases' | 'Customer story' | 'Tutorial';

export type Post = {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readMin: number;
  category: PostCategory;
  body: string;
};

export const posts: Post[] = [
  {
    slug: 'pve-8-3-released',
    title: 'Proxmox VE 8.3 brings GA EVPN SDN, Ceph Squid, and ZFS 2.2',
    description:
      'A roundup of what shipped in 8.3: BGP-EVPN graduates from tech preview, the Ceph Squid 19.2 upgrade path lands, ZFS 2.2 imports cleanly, cluster config sync gets faster, and root@pam grows mandatory MFA.',
    author: 'Proxmox Engineering',
    date: '2025-11-21',
    readMin: 6,
    category: 'Releases',
    body: `<p>Proxmox VE 8.3 is now in the enterprise repository. This is a deliberately small release on purpose &mdash; we held back several invasive changes for the 9.x line so that the 8.x branch can stay boring, predictable, and easy to upgrade. Below is a tour of what actually landed and, more usefully, what to test before you roll it across a cluster.</p>

<h2>BGP-EVPN graduates to GA</h2>

<p>SDN with EVPN has been a tech preview since 8.0. With 8.3 it is officially supported. You can now run a multi-tenant overlay across an entire cluster &mdash; or across multiple clusters connected by BGP &mdash; without third-party controllers. We tested it on a 14-node cluster with 3,200 VMs distributed across 18 EVPN zones; convergence after a node reboot is consistently below 4 seconds.</p>

<p>The configuration model has not changed. If you were already running EVPN in tech preview, an <code>apt full-upgrade</code> is enough. The web UI now exposes the per-zone BGP route-target and route-distinguisher fields directly, so you no longer need to drop into <code>/etc/pve/sdn/zones.cfg</code> for the common cases.</p>

<h2>Ceph Squid 19.2 upgrade path</h2>

<p>Ceph Squid (19.2) is the new default for fresh installs. Existing Reef (18.2) clusters are not auto-upgraded; you opt in via the documented two-step path:</p>

<pre><code># on every node, in rolling order
apt update
apt install ceph-mgr ceph-mon ceph-osd ceph-mds=19.2.*
systemctl restart ceph-mon@$(hostname)
# verify
ceph health detail
ceph versions</code></pre>

<p>BlueStore on Squid handles small random IO measurably better &mdash; in our internal lab a 24-OSD all-NVMe pool moved from roughly 380k 4K read IOPS to about 470k after the upgrade, with no other tuning. We will publish the full benchmark methodology in a follow-up post.</p>

<h2>ZFS 2.2 imports cleanly</h2>

<p>The kernel module ships ZFS 2.2.6. Pools created on 2.1.x systems import without a feature-flag dance. The <code>blake3</code> checksum is now available; we recommend it for new datasets where dedup or block cloning is in play. Block cloning itself is enabled by default but, given the data-corruption issue patched upstream in 2.2.2, we strongly suggest you stay on 2.2.6 or later.</p>

<h2>Cluster config sync is faster</h2>

<p>The <code>pmxcfs</code> filesystem (the magic FUSE layer that propagates <code>/etc/pve</code> across nodes) got a meaningful tune-up. Bulk operations that touch many config files &mdash; provisioning 50 VMs in a script, importing a large ESXi datastore, applying a backup-policy change to a hundred guests &mdash; are 3 to 6 times faster on a 12-node cluster. Single-VM operations are within margin of error.</p>

<h2>MFA enforcement on root@pam</h2>

<p>The shipped default for new installs is now: <em>root@pam cannot log in to the web UI without a second factor</em>. CLI/SSH access is unaffected; this is a UI-only enforcement. Existing clusters keep their current configuration on upgrade, but the cluster-wide setting is one click away under <em>Datacenter &rarr; Options &rarr; Authentication</em>.</p>

<blockquote>If you are operating a cluster where root is the only admin account, please enroll a TOTP or WebAuthn factor before you flip the switch. We have seen exactly one support ticket where a customer locked themselves out by changing the policy without enrolling first; recovery requires console access.</blockquote>

<h2>Web UI tweaks</h2>

<ul>
<li>The summary panel finally shows guest agent state per-VM, including which optional features (fstrim, SSH key handling, hostname) are wired up.</li>
<li>The bulk-action dialog (start/stop/migrate) now persists per-user across sessions.</li>
<li>Dark mode shipped as opt-in. It is honest dark, not a low-contrast gray; we tested it against WCAG AA on every panel.</li>
<li>The cluster log gets a real filter UI &mdash; severity, node, time range &mdash; instead of the previous server-side regex.</li>
</ul>

<h2>What did not change</h2>

<p>Deliberately: the API surface, on-disk formats, and the kernel ABI for out-of-tree modules. If you were running custom modules (NVIDIA vGPU, Mellanox OFED, ZFS-native encryption add-ons), they should rebuild cleanly. The shipped kernel is 6.8.12; the 6.11 opt-in remains available from <code>pve-kernel-6.11</code>.</p>

<h2>Upgrading</h2>

<pre><code># on every node, in maintenance order
apt update
apt full-upgrade
# reboot is required; live-migrate guests off first
reboot</code></pre>

<p>Existing cluster on 8.2? You can upgrade in place &mdash; we have tested rolling upgrades on clusters from 3 nodes to 64 nodes without quorum loss. Run <code>pve8to9 --full</code> first; it is the same script that will check 8.3 readiness for the future 9.0 jump.</p>

<p>The 8.3 ISO is available from the downloads page. Source packages, as always, are signed and on git.proxmox.com. If you find a regression, the bug tracker at bugzilla.proxmox.com is the fastest path to a fix.</p>`
  },
  {
    slug: 'migrating-from-vmware-2026',
    title: 'We migrated 2,400 ESXi VMs in eleven weeks. Here is the runbook.',
    description:
      'A week-by-week account of moving a mid-cap European logistics estate off vSphere onto a three-cluster Proxmox VE deployment, including the snags, the wins, and the spreadsheet that drove it.',
    author: 'Lina Brandt, Head of Infrastructure',
    date: '2026-02-08',
    readMin: 12,
    category: 'Customer story',
    body: `<p>This is the post I was looking for in March 2025 and could not find: a concrete, week-by-week account of getting an established VMware estate onto Proxmox VE without a six-month consulting engagement. Two-thousand four-hundred VMs, eleven weeks, three engineers, one panicked Friday. Here is what we did, what hurt, and what worked.</p>

<h2>The setup</h2>

<p>We ran a 14-host vSphere 7 cluster across two data centers in Frankfurt and Amsterdam. About 2,400 VMs &mdash; a mix of warehouse management systems, internal Java services, build agents, and a long tail of forgotten Windows 2016 boxes that nobody quite wanted to take responsibility for. Storage was split between a Pure FlashArray and an older NetApp; networking was Cisco ACI with about 90 EPGs.</p>

<p>The Broadcom letter arrived in the spring. Our renewal quote came in at roughly 4.1 times the previous year. The CFO asked for a number; the number we came back with three weeks later was an 87% three-year cost reduction by moving to Proxmox VE on the existing hardware, with new storage paid for out of the licensing delta.</p>

<h2>Week 1 &mdash; planning, not panicking</h2>

<p>We built a single spreadsheet. One row per VM. Columns: hostname, OS, primary application owner, storage tier, network EPG, RPO requirement, last reboot, criticality (1&ndash;3). It took two engineers four days. The spreadsheet became the thing we ran the project from; it is still the thing we run capacity planning from today.</p>

<p>We picked three target clusters: a 6-node primary in Frankfurt, a 6-node DR in Amsterdam, and a 3-node "edge" cluster for the warehouse on-site systems. All three on existing hardware that had been earmarked for vSphere expansion.</p>

<h2>Week 2 &mdash; standing up the new clusters</h2>

<p>Three engineers, three clusters, three days. Proxmox VE 8.3 from the ISO, Ceph Squid hyperconverged, two SDN zones (a flat one for legacy lift-and-shift, an EVPN one for the new microsegmentation we wanted to introduce while we were here anyway). The first cluster was painful only because we did not yet trust the install defaults; the second and third were a copy-paste of the first.</p>

<p>One thing we got right: we put the cluster network on a dedicated VLAN with jumbo frames before we touched a single guest. Ceph rebalances are the least fun thing to have to retrofit MTU around.</p>

<h2>Weeks 3 to 4 &mdash; pilot wave (the easy 200)</h2>

<p>We picked 200 non-critical VMs &mdash; build agents, dev environments, the kind of thing that nobody notices if it is offline for half an hour. We used the native ESXi import driver:</p>

<pre><code># register the source
pvesm add esxi vmware-fra \\
  --server vcsa-fra.example.com \\
  --username root@vsphere.local

# import a single VM, live (source still running)
qm importovf 1042 \\
  --pool wave1 \\
  --target-storage rbd-prod</code></pre>

<p>The ESXi import driver mounts the source datastore read-only, copies the VMDK chains, converts them to qcow2 or raw on the way in, and produces a stopped VM on the new cluster. The source VM keeps running until you cut the network over. For VMs we did not care about briefly losing, we just imported, shut down the source, started the target. Average time per VM: 11 minutes for a 50 GB Linux box, 18 minutes for a 100 GB Windows box.</p>

<p>We ran ten imports in parallel, gated on storage IO, and finished the pilot wave in eight working days.</p>

<h2>Week 5 &mdash; the storage rebalance snag</h2>

<p>Our first real bite. We had under-provisioned the metadata pool on the primary cluster &mdash; a classic Ceph rookie error. Around VM number 600, OSD memory pressure spiked, two OSDs went into <code>OUT</code> state, and we got a "you have 18 hours to fix this" email from the cluster.</p>

<p>The fix was straightforward but stressful: add three more NVMe drives, recreate the metadata pool with a higher PG count, and let the cluster rebalance over a long weekend. We learned to do PG math up front, not retroactively. There is a tuning post coming from the engineering team; read it before you stand up your own cluster.</p>

<h2>Weeks 6 to 7 &mdash; production wave 1 (the boring 800)</h2>

<p>This is where the spreadsheet earned its keep. We sorted by criticality and storage tier, scheduled imports in 4-hour windows during normal business hours (against everyone's instinct), and kept a Slack channel open with the application owners. Each morning standup: 50 to 80 VMs migrated, zero application incidents.</p>

<p>The repetition revealed a second snag: a handful of older Windows VMs had hand-pinned MAC addresses that conflicted on the new Linux bridges. We ended up writing a small <code>preimport.sh</code> hook that scanned the OVF for fixed MACs and re-randomized them in a known range. Forty-six VMs needed it; the rest did not.</p>

<h2>Weeks 8 to 9 &mdash; production wave 2 (the gnarly 1,200)</h2>

<p>SQL Server clusters, three-tier ERP, a SAP landscape, the things we were genuinely afraid of. We extended the maintenance window to overnight, cut over service-by-service rather than VM-by-VM, and used Proxmox Backup Server to take a guaranteed restore point of every VM ten minutes before we touched it.</p>

<p>The SAP landscape went over in a single Saturday. The SQL clusters needed a rebuild of the witness on the new side, but otherwise the AlwaysOn replicas just resynced. The ERP had a 90-minute hiccup because we mis-mapped a VLAN; we caught it in 12 minutes and rolled back the network change without touching the guests.</p>

<h2>Weeks 10 to 11 &mdash; the long tail and decommissioning</h2>

<p>The last 200 VMs are always the worst. Forgotten owners, brittle installers, one VM that turned out to be the print server for a building that nobody had stepped in for two years. We migrated what we could, decommissioned what we could not justify, and ended up retiring 64 VMs entirely.</p>

<p>Then we shut down the vSphere cluster. There was a brief, unceremonious moment with three of us watching the vCenter dashboard go red. No-one made a speech.</p>

<h2>The numbers</h2>

<ul>
<li>2,400 VMs migrated, 64 decommissioned, zero data-loss incidents.</li>
<li>Total downtime budget consumed: 4 hours 11 minutes across the entire project.</li>
<li>Three-year TCO: 87% lower than the renewal quote. Most of the saving is licensing; the rest is consolidation onto fewer hosts thanks to better Ceph compression ratios.</li>
<li>Performance: average VM CPU usage dropped 9% (KVM scheduler is happier with our workload mix); average IO latency dropped 22% (NVMe Ceph beat the FlashArray for our access pattern).</li>
</ul>

<h2>What I would do differently</h2>

<p>Three things, in order of regret:</p>

<ul>
<li><strong>Size the Ceph metadata pool up front.</strong> The week 5 incident was avoidable.</li>
<li><strong>Start with the gnarly stuff sooner.</strong> The pilot wave gave us false confidence; we could have moved SAP in week 4 with the same outcome and three more weeks of buffer.</li>
<li><strong>Buy support from day one.</strong> We bought it in week 6 after the storage incident. The Proxmox engineers we worked with were sharp and direct; I would have preferred to have them on the phone in week 1.</li>
</ul>

<h2>What I would not change</h2>

<p>The spreadsheet. The maintenance windows during business hours (with application owners awake and reachable). The decision to do the network refresh and the hypervisor refresh in the same project, against everyone's advice. And the decision not to bring in a six-month consulting engagement &mdash; three engineers who knew our environment shipped this faster than any consultancy proposal we received.</p>

<blockquote>If you are facing the same Broadcom letter we faced last March, my one piece of advice: do not let the licensing problem turn into an architecture problem. Migrate flat first, refactor later.</blockquote>

<p>We are running Proxmox VE 8.3 across three clusters, with the Datacenter Manager alpha federating them. Eleven months in, we have not paid a hypervisor license. The engineers sleep better. So do I.</p>`
  },
  {
    slug: 'ceph-squid-tuning',
    title: 'Ceph Squid on Proxmox: the five tuning knobs that actually matter',
    description:
      'Most Ceph tuning advice on the internet is out of date or copied from a Reef-era blog. Here are the five settings on Squid (19.2) that move the IOPS needle on a Proxmox VE hyperconverged cluster, with the math behind each one.',
    author: 'Proxmox Engineering',
    date: '2026-03-14',
    readMin: 9,
    category: 'Engineering',
    body: `<p>If you search "ceph tuning" you will find roughly 9,000 blog posts and at least three of them will be useful. The rest are either Reef-era advice that does not survive the Squid changes, or generic "set it to 80% of RAM" cargo culting. This post is the short list of knobs we actually turn on production Proxmox VE clusters running Ceph Squid 19.2 hyperconverged.</p>

<p>The numbers below are from a 6-node cluster with 4 NVMe OSDs per node, dual 25 GbE for cluster traffic, and a workload mix of 60% random read, 30% random write, 10% sequential. Your numbers will differ. The shape of the changes will not.</p>

<h2>1. BlueStore cache size and split</h2>

<p>BlueStore caches three things: the kv (rocksdb) database, the metadata onodes, and the data blocks. The default in Squid is "auto" with a target of 4 GiB per OSD. On NVMe with plenty of host RAM, that is leaving performance on the table.</p>

<pre><code># on each node, in /etc/pve/ceph.conf under [osd]
bluestore_cache_size_ssd = 8589934592       # 8 GiB per OSD
bluestore_cache_kv_ratio = 0.5
bluestore_cache_meta_ratio = 0.4
bluestore_cache_data_ratio = 0.1</code></pre>

<p>The ratios add up to 1.0 (the data ratio is implied as the remainder). On a metadata-heavy workload &mdash; lots of small files, lots of snapshots &mdash; raise the meta ratio to 0.5 and drop kv to 0.4. On a database-heavy workload, do the opposite.</p>

<p>Effect on our cluster: 4K random read IOPS went from 380k to 462k. 4K random write was unchanged (writes hit the WAL, not the cache).</p>

<h2>2. OSD memory target</h2>

<p>This is the knob that gets the most bad advice. The OSD memory target is <em>not</em> the same as the BlueStore cache size; it is the soft cap on total OSD process RSS, including the cache, pglog, in-flight ops, and the rocksdb working set.</p>

<pre><code># under [osd] in /etc/pve/ceph.conf
osd_memory_target = 12884901888              # 12 GiB per OSD</code></pre>

<p>The math: take total host RAM, subtract 16 GiB for the OS and Ceph daemons, subtract whatever you reserve for guests, divide the rest by the number of OSDs on the host. If that number is below 4 GiB, you do not have enough RAM to run Ceph hyperconverged on this host &mdash; do not lower the cache to compensate, get more RAM or move OSDs off.</p>

<p>On a 256 GiB host with 4 OSDs and 128 GiB reserved for guests, that gives you (256 &minus; 16 &minus; 128) / 4 = 28 GiB per OSD. Set the target to 12 GiB and use the rest as headroom; Ceph will use it under burst load and release it for guests when idle.</p>

<h2>3. Placement Group count</h2>

<p>Wrong PG count is the single most common cause of "my Ceph cluster is slow" tickets we see. The autoscaler in Squid is much better than it was in Reef, but it still benefits from a sane initial value.</p>

<p>The formula:</p>

<pre><code>target_pgs_per_osd = 100      # for SSD/NVMe; use 50 for HDD
target_pg_count = (osd_count * target_pgs_per_osd) / replica_count
# round up to nearest power of 2</code></pre>

<p>On a 24-OSD cluster with 3x replication: (24 &times; 100) / 3 = 800 &rarr; round to 1024.</p>

<p>Set it explicitly, then let the autoscaler take over:</p>

<pre><code>ceph osd pool set rbd-prod pg_num 1024
ceph osd pool set rbd-prod pgp_num 1024
ceph osd pool set rbd-prod pg_autoscale_mode on</code></pre>

<p>If you have multiple pools sharing the same OSDs, divide the budget. The autoscaler can do this for you, but it will sometimes pick conservative numbers; watch the first 24 hours after enabling it and override if you see less than 50 PGs/OSD.</p>

<h2>4. Network MTU</h2>

<p>This is not strictly Ceph, but it is the single biggest free win for cluster IO. Jumbo frames (9000 MTU) on the cluster network reduce per-packet overhead enough to matter on small IO, and meaningfully on large IO.</p>

<pre><code># on every node, in /etc/network/interfaces
auto bond1
iface bond1 inet static
  address 10.10.10.11/24
  mtu 9000
  bond-slaves enp1s0f0 enp1s0f1
  bond-miimon 100
  bond-mode 802.3ad</code></pre>

<p>The catch: every device on the cluster network &mdash; switches included &mdash; must agree on MTU 9000. One switch port left at 1500 will produce mysterious, intermittent slow rebalances and you will spend a Friday afternoon finding it. Verify with:</p>

<pre><code>ping -M do -s 8972 10.10.10.12
# 8972 = 9000 - 20 (IP) - 8 (ICMP)</code></pre>

<p>If that fragments, your MTU is broken somewhere on the path.</p>

<p>Effect on our cluster: rebalance throughput up 31%, small-IO latency down 8%. Free.</p>

<h2>5. Recovery and rebalance throttling</h2>

<p>Default Squid recovery is conservative on purpose &mdash; it prioritises client IO over getting healthy quickly. On a fast all-NVMe cluster with bandwidth to spare, you can move it the other direction.</p>

<pre><code>ceph config set osd osd_max_backfills 4
ceph config set osd osd_recovery_max_active 8
ceph config set osd osd_recovery_op_priority 3</code></pre>

<p>The op priority scale is 1 (let recovery starve) to 63 (recovery first). 3 is a noticeable bias toward recovery without making the cluster unusable for clients.</p>

<p>Crucially, set these only when a recovery is in progress. Do not leave them set as cluster-wide defaults &mdash; under steady state they cost you a small amount of client latency for no benefit. We wrap the change in a short script:</p>

<pre><code>#!/bin/bash
# faster-recovery.sh
ceph config set osd osd_max_backfills 4
ceph config set osd osd_recovery_max_active 8
echo "boosted; remember to revert with: $0 reset"

if [ "$1" = "reset" ]; then
  ceph config rm osd osd_max_backfills
  ceph config rm osd osd_recovery_max_active
fi</code></pre>

<h2>What is not on this list</h2>

<p>A lot of the advice you find online. Specifically: <code>filestore_*</code> anything (BlueStore is the only store on Squid), <code>journal_*</code> anything (no separate journal on BlueStore), CRUSH tunables (the Squid default is correct for 99% of clusters), and the entire <code>mon_*</code> tunable family (the monitor is rarely the bottleneck).</p>

<blockquote>The single best Ceph performance investment is faster networking, not tuning. If you are on 10 GbE and considering the knobs above, save the energy and move to 25 GbE first.</blockquote>

<h2>Measuring the change</h2>

<p>Before you turn any knob, take a baseline. After you turn it, take a measurement. The Proxmox Ceph dashboard shows you cluster-wide IOPS and latency, but for a real benchmark you want <code>fio</code> against an RBD image:</p>

<pre><code>rbd create rbd-prod/bench --size 50G
rbd map rbd-prod/bench
fio --name=randread --filename=/dev/rbd0 \\
    --rw=randread --bs=4k --iodepth=32 \\
    --numjobs=8 --direct=1 --runtime=60 \\
    --time_based --group_reporting</code></pre>

<p>Do this with the cluster otherwise idle. Record the number. Change one thing. Measure again. If you change five things at once you will not know which one mattered, and you will end up running the same blog post you just read but with worse numbers.</p>`
  }
];

export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const categories: PostCategory[] = ['Engineering', 'Releases', 'Customer story', 'Tutorial'];
