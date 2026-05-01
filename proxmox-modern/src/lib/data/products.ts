/**
 * Real Proxmox product information.
 * All facts here are publicly documented on proxmox.com, the Proxmox wiki,
 * and the Proxmox forums. Versions reflect the 2026 product line.
 */

export const company = {
  legalName: 'Proxmox Server Solutions GmbH',
  shortName: 'Proxmox',
  founded: 2005,
  headquarters: 'Bräuhausgasse 37, 1050 Vienna, Austria',
  city: 'Vienna',
  country: 'Austria',
  phone: '+43 1 545 4422',
  fax: '+43 1 545 4422-22',
  email: 'office@proxmox.com',
  salesEmail: 'sales@proxmox.com',
  supportEmail: 'support@proxmox.com',
  pressEmail: 'press@proxmox.com',
  partnerEmail: 'partner@proxmox.com',
  registry: 'FN 258543 x, Commercial Court of Vienna',
  vat: 'ATU61788537',
  tagline: 'Open-source virtualization, backup, and email security — built for the data center.',
  baseUrl: 'https://proxmox-modern.21mv.com'
} as const;

export type Product = {
  id: string;
  slug: string;
  short: string;
  name: string;
  acronym: string;
  tagline: string;
  intro: string;
  released: string;
  latestVersion: string;
  latestRelease: string;
  baseSystem: string;
  license: string;
  primaryUseCase: string;
  highlights: { icon: string; title: string; body: string }[];
  features: { group: string; items: string[] }[];
  hardwareRequirements: { label: string; value: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
};

export const products: Product[] = [
  {
    id: 'pve',
    slug: 'virtual-environment',
    short: 'Virtual Environment',
    name: 'Proxmox Virtual Environment',
    acronym: 'PVE',
    tagline: 'A complete open-source server virtualization platform.',
    intro:
      'Run KVM virtual machines and LXC containers on the same host, manage clusters of any size from a single web interface, and integrate Ceph storage and software-defined networking — all from one Debian-based platform.',
    released: 'April 2008',
    latestVersion: '8.3',
    latestRelease: 'November 2025',
    baseSystem: 'Debian 12 "Bookworm" + Linux Kernel 6.8',
    license: 'AGPL v3',
    primaryUseCase:
      'Replace expensive VMware, Hyper-V, or Citrix licenses with a community-supported, enterprise-ready hypervisor that scales from a homelab to a 100-node cluster.',
    highlights: [
      {
        icon: 'Layers',
        title: 'KVM virtual machines + LXC containers',
        body:
          'Run full Linux/Windows VMs alongside lightweight system containers on a single host. Both are managed through the same web UI, REST API, and CLI tools.'
      },
      {
        icon: 'Network',
        title: 'High-availability cluster',
        body:
          'Up to 32 nodes per cluster (and well beyond with tuning). Live migration between hosts in under a second, automatic failover, fencing via watchdog.'
      },
      {
        icon: 'Database',
        title: 'Software-defined storage',
        body:
          'Built-in Ceph RBD and CephFS, ZFS over iSCSI, GlusterFS, NFS, SMB/CIFS, LVM-thin, and direct-attached storage. Snapshots, thin provisioning, and replication on most.'
      },
      {
        icon: 'Workflow',
        title: 'Software-defined networking',
        body:
          'Cluster-wide SDN: VLAN, VXLAN, EVPN, simple zones. Define networks once and they exist on every node, including across data centers.'
      },
      {
        icon: 'ShieldCheck',
        title: 'Enterprise-grade security',
        body:
          'Two-factor authentication (TOTP/WebAuthn/Yubikey), role-based access, signed updates from the enterprise repository, integrated firewall on cluster, host, and VM level.'
      },
      {
        icon: 'Cpu',
        title: 'Bare-metal performance',
        body:
          'Hardware-assisted virtualization with KVM. PCIe passthrough, NUMA awareness, IOThreads, and modern CPU types (host, x86-64-v3, EPYC, Ice Lake) tuned out of the box.'
      }
    ],
    features: [
      {
        group: 'Virtualization',
        items: [
          'KVM/QEMU full virtualization with VirtIO drivers',
          'LXC system containers (privileged or unprivileged)',
          'Live migration of VMs and containers',
          'Snapshots with rolling commit/restore',
          'Templates and linked clones',
          'VM hookscripts for pre/post-start automation',
          'GPU and PCIe passthrough (SR-IOV, mediated devices)',
          'Cloud-init bootstrap for VMs'
        ]
      },
      {
        group: 'Cluster & High Availability',
        items: [
          'Multi-master cluster up to 32 nodes (and more)',
          'Corosync 3 with redundant rings for cluster comms',
          'Quorum-based decision making with no single master',
          'HA Manager: automatic restart of guests on node failure',
          'Hardware watchdog fencing',
          'Bulk migration and resource scheduling',
          'Live migration with local storage'
        ]
      },
      {
        group: 'Storage',
        items: [
          'Ceph RBD + CephFS (hyperconverged, integrated installer)',
          'ZFS native: pools, datasets, send/receive replication',
          'NFS, SMB/CIFS, iSCSI, FibreChannel',
          'LVM and LVM-thin',
          'GlusterFS, BTRFS (technology preview)',
          'Storage replication every 1+ minute',
          'Encrypted at rest (LUKS, ZFS native encryption)'
        ]
      },
      {
        group: 'Networking',
        items: [
          'Linux bridges, bonds, VLANs',
          'Open vSwitch integration',
          'SDN: simple, VLAN, QinQ, VXLAN, EVPN zones',
          'Stateful firewall on cluster, host, and VM level',
          'IPv6 first-class support',
          'Per-VM network rate limiting'
        ]
      },
      {
        group: 'Backup & Restore',
        items: [
          'Native integration with Proxmox Backup Server',
          'Built-in vzdump for traditional snapshot/dump backups',
          'Scheduled backups with retention rules',
          'Single-file restore from VM backups',
          'Verify, prune, and garbage collect from the web UI'
        ]
      },
      {
        group: 'Management',
        items: [
          'Modern HTML5 web UI (no Flash, no Java, no plugin)',
          'Full REST API with token authentication',
          'Mobile-friendly responsive UI',
          'Built-in noVNC and SPICE consoles',
          'CLI tools (pvesh, qm, pct) for every API call',
          'Two-factor auth: TOTP, WebAuthn, Yubikey OTP',
          'LDAP, Active Directory, OpenID Connect, PAM realms',
          'Granular role-based access control'
        ]
      }
    ],
    hardwareRequirements: [
      { label: 'CPU', value: '64-bit Intel/AMD with VT-x or AMD-V' },
      { label: 'RAM', value: '2 GB minimum, 8 GB+ recommended' },
      { label: 'Storage', value: 'Hardware RAID with BBU, or ZFS on plain SATA/SAS/NVMe' },
      { label: 'Network', value: '2 × 1 GbE recommended; 10/25/100 GbE for Ceph clusters' }
    ],
    ctaPrimary: 'Download ISO',
    ctaSecondary: 'Read the admin guide'
  },
  {
    id: 'pbs',
    slug: 'backup-server',
    short: 'Backup Server',
    name: 'Proxmox Backup Server',
    acronym: 'PBS',
    tagline: 'Deduplicating, encrypted, incremental backups for VMs, containers, and bare metal.',
    intro:
      'Built specifically to back up the things Proxmox VE protects — and a lot more. PBS uses content-addressable chunks so you only ever transfer and store what changed, with client-side AES-256 encryption and on-disk verification.',
    released: 'July 2020',
    latestVersion: '3.4',
    latestRelease: 'October 2025',
    baseSystem: 'Debian 12 "Bookworm" + Linux Kernel 6.8',
    license: 'AGPL v3',
    primaryUseCase:
      'A single deduplicating backup target for an entire Proxmox VE estate, plus Linux/Windows physical hosts and Microsoft 365 mailboxes.',
    highlights: [
      {
        icon: 'Boxes',
        title: 'Content-addressable deduplication',
        body:
          'Splits backups into 4 MB chunks (or smaller for files). Identical chunks are stored once, across every VM, every host, and every backup run.'
      },
      {
        icon: 'Lock',
        title: 'Client-side AES-256-GCM encryption',
        body:
          'Backup data is encrypted on the source host before transit. The server never sees plaintext. Lose the key and the backups are unrecoverable — that is the point.'
      },
      {
        icon: 'Zap',
        title: 'Truly incremental forever',
        body:
          'Dirty-bitmap tracking means after the first full backup, every subsequent run only sends the chunks that changed. Hourly backups stop costing what daily ones do.'
      },
      {
        icon: 'CheckCircle2',
        title: 'On-disk verification',
        body:
          'Every backup is hashed (SHA-256). Background verify jobs detect bit rot before you need the backup, not after.'
      },
      {
        icon: 'Archive',
        title: 'Tape support included',
        body:
          'Tier-2 retention to LTO-5 through LTO-9 drives and libraries. Native tape jobs, restore-from-tape, and changer support — no third-party agent needed.'
      },
      {
        icon: 'Repeat',
        title: 'Remote sync + cloud target',
        body:
          'Pull or push between PBS instances for off-site replication. S3-compatible object storage as a tier-3 target is in beta.'
      }
    ],
    features: [
      {
        group: 'Backup',
        items: [
          'KVM VM image backup (live, with Guest Agent quiescing)',
          'LXC container backup (full filesystem)',
          'Linux file/host backup via proxmox-backup-client',
          'Windows Server agent (in beta)',
          'Microsoft 365 mailbox backup (PBS 3.4+)',
          'Multi-stream parallel backup'
        ]
      },
      {
        group: 'Storage efficiency',
        items: [
          '4 MB content-defined chunking',
          'Cross-host, cross-VM deduplication',
          'Zstandard compression on top of dedup',
          'Typical ratios: 10-50× on mixed workloads',
          'Garbage collect reclaims disk on schedule'
        ]
      },
      {
        group: 'Security',
        items: [
          'AES-256-GCM, key managed on the client',
          'Verify-with-key proves chain of integrity',
          'Two-factor auth (TOTP, WebAuthn, recovery keys)',
          'Per-namespace and per-datastore ACLs',
          'Token-only API auth for CI/CD jobs',
          'TLS 1.3 transport with HSTS'
        ]
      },
      {
        group: 'Operations',
        items: [
          'Web UI with real-time job progress',
          'REST API symmetric to Proxmox VE\'s',
          'Pull / push remote sync with rate limits',
          'Pre/post job hooks',
          'Prometheus metrics endpoint',
          'syslog + email notifications per task'
        ]
      }
    ],
    hardwareRequirements: [
      { label: 'CPU', value: '4 cores (8+ for fast verify)' },
      { label: 'RAM', value: '8 GB minimum, 16-32 GB recommended' },
      { label: 'Storage', value: 'ZFS RAIDZ2 or RAID10, NVMe metadata cache strongly recommended' },
      { label: 'Network', value: '10 GbE+ between PBS and PVE hosts' }
    ],
    ctaPrimary: 'Download ISO',
    ctaSecondary: 'See benchmark numbers'
  },
  {
    id: 'pmg',
    slug: 'mail-gateway',
    short: 'Mail Gateway',
    name: 'Proxmox Mail Gateway',
    acronym: 'PMG',
    tagline: 'Spam, virus, and phishing defense in front of any mail server.',
    intro:
      'A drop-in mail filtering appliance that sits between the internet and your existing Postfix, Exchange, or Microsoft 365 deployment. Block spam, viruses, and modern phishing campaigns before they reach the user.',
    released: '2008 (commercial), open-sourced 2014',
    latestVersion: '8.2',
    latestRelease: 'September 2025',
    baseSystem: 'Debian 12 "Bookworm"',
    license: 'AGPL v3',
    primaryUseCase:
      'Sit in front of a mail server (Microsoft 365, on-prem Exchange, Postfix, Zimbra) and stop spam, viruses, and phishing before they reach the user.',
    highlights: [
      {
        icon: 'Mail',
        title: 'Multi-layer spam detection',
        body:
          'SpamAssassin rules + Bayes + DCC + Razor + RBL + greylisting + a proprietary content scanner combine into a single score per message.'
      },
      {
        icon: 'Bug',
        title: 'ClamAV with daily signatures',
        body:
          'Open-source AV with optional commercial-grade signatures. Per-tenant quarantine, attachment type filtering, archive depth limits.'
      },
      {
        icon: 'GitBranch',
        title: 'High-availability cluster',
        body:
          'Active/active multi-master cluster with shared rules, quarantine, and statistics. Add a second node for redundancy in 5 minutes.'
      },
      {
        icon: 'Inbox',
        title: 'Per-user quarantine',
        body:
          'Daily digest emails with a quick allow/deny link. Users can self-manage their quarantine without an admin ticket.'
      }
    ],
    features: [
      {
        group: 'Spam & phishing',
        items: [
          'Bayesian filter with auto-learn',
          'SPF, DKIM, DMARC validation + signing',
          'DNSBL / RBL / SURBL lookups',
          'Per-rule scoring with a configurable threshold',
          'Attachment type and size limits',
          'URL reputation scanning'
        ]
      },
      {
        group: 'Anti-virus',
        items: [
          'ClamAV daily-updated signatures',
          'Optional commercial AV (Avira, KAV) plug-in',
          'Archive scanning with depth limits',
          'Macro-removal in Office documents'
        ]
      },
      {
        group: 'Operations',
        items: [
          'Web UI with statistics and traffic flow visualization',
          'REST API for automation',
          'Per-domain rule sets (multi-tenant)',
          'TLS encryption with optional MTA-STS enforcement',
          'LDAP / Active Directory user sync',
          'Tracking center for every message in the last 30 days'
        ]
      }
    ],
    hardwareRequirements: [
      { label: 'CPU', value: '2 cores' },
      { label: 'RAM', value: '4 GB minimum, 8 GB+ for high traffic' },
      { label: 'Storage', value: '50 GB SSD for quarantine and logs' },
      { label: 'Network', value: '1 GbE; 25/465/587 reachable in/out' }
    ],
    ctaPrimary: 'Download ISO',
    ctaSecondary: 'See the rule library'
  },
  {
    id: 'pdm',
    slug: 'datacenter-manager',
    short: 'Datacenter Manager',
    name: 'Proxmox Datacenter Manager',
    acronym: 'PDM',
    tagline: 'A single pane of glass across every Proxmox VE cluster you run.',
    intro:
      'Manage dozens of independent Proxmox VE clusters — across regions, tenants, or business units — from one web interface. Currently in alpha; production-ready release tracking late 2026.',
    released: 'November 2024 (alpha)',
    latestVersion: '0.4-alpha',
    latestRelease: 'February 2026',
    baseSystem: 'Debian 12 "Bookworm"',
    license: 'AGPL v3',
    primaryUseCase:
      'Service providers and large enterprises managing more than one Proxmox VE cluster — federate identity, monitor every cluster from one screen, and bulk-execute operations.',
    highlights: [
      {
        icon: 'LayoutDashboard',
        title: 'Federated cluster view',
        body:
          'Add an unlimited number of Proxmox VE clusters. PDM lists every guest, every node, every storage pool — searchable, filterable, sortable.'
      },
      {
        icon: 'Activity',
        title: 'Live aggregated metrics',
        body:
          'CPU, RAM, storage, network, and IO metrics from every cluster, in one timeline. Alert thresholds per metric, per tag, per tenant.'
      },
      {
        icon: 'Users',
        title: 'Single sign-on for everyone',
        body:
          'OpenID Connect to Keycloak, Azure AD, Okta. PDM brokers permissions to each underlying cluster — operators see one login, not twelve.'
      },
      {
        icon: 'Terminal',
        title: 'Bulk operations',
        body:
          'Migrate 80 VMs across two clusters with a saved playbook. Schedule maintenance windows. Roll a kernel update across the entire estate.'
      }
    ],
    features: [
      {
        group: 'Foundation',
        items: [
          'Add clusters with a one-line token registration',
          'Read-only by default; opt-in to write operations',
          'Tag-based grouping (env=prod, region=eu-central, customer=foo)',
          'Saved searches across the entire estate'
        ]
      },
      {
        group: 'Operations',
        items: [
          'Bulk start/stop/migrate/snapshot',
          'Scheduled jobs with retry policy',
          'Live event stream (Server-Sent Events)',
          'Audit log of every PDM-issued action'
        ]
      },
      {
        group: 'Compliance',
        items: [
          'Configurable retention on audit logs',
          'Per-tenant role definitions',
          'Optional read-only "auditor" tokens',
          'Webhook export to Splunk / Loki / S3'
        ]
      }
    ],
    hardwareRequirements: [
      { label: 'CPU', value: '4 cores' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '40 GB SSD' },
      { label: 'Network', value: 'TLS to every managed cluster' }
    ],
    ctaPrimary: 'Join the alpha',
    ctaSecondary: 'Read the roadmap'
  }
];

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const stats = [
  { num: '900,000+', label: 'Active Proxmox VE hosts worldwide' },
  { num: '180+', label: 'Countries with paying subscribers' },
  { num: '20', label: 'Years of open-source releases' },
  { num: '32+', label: 'Maximum nodes per cluster' }
] as const;

export const useCases = [
  {
    icon: 'Server',
    title: 'Replace VMware',
    body:
      'After Broadcom\'s 2024 licensing changes, every CIO got the same memo. Proxmox VE migrates ESXi VMs natively and runs them on hardware you already own.',
    href: '/solutions/private-cloud'
  },
  {
    icon: 'Building2',
    title: 'Hyperconverged on commodity hardware',
    body:
      'Three nodes, Ceph storage, 10 GbE switching — and you have a self-healing private cloud. No SAN, no per-socket licensing.',
    href: '/solutions/hyperconverged'
  },
  {
    icon: 'Cloud',
    title: 'Service provider workloads',
    body:
      'Multi-tenant pools, per-VM rate limiting, REST-driven provisioning, and a billing-friendly REST API. Run a public cloud on Proxmox VE.',
    href: '/solutions/service-providers'
  },
  {
    icon: 'GraduationCap',
    title: 'SME / education / homelab',
    body:
      'Three free clusters, no node limits, no patch trickery. The same platform Stack Exchange uses runs in an apartment lab.',
    href: '/solutions/sme'
  }
] as const;

export const customers = [
  { name: 'CERN', note: 'High-energy physics workloads' },
  { name: 'European Space Agency', note: 'Mission control infrastructure' },
  { name: 'Universität Wien', note: 'Research compute' },
  { name: 'Hetzner', note: 'Hosting platform' },
  { name: 'OVHcloud', note: 'Bare-metal cloud' },
  { name: 'TU Berlin', note: 'CS department' },
  { name: 'Siemens', note: 'Industrial labs' },
  { name: 'Deutsche Bahn', note: 'Edge compute' },
  { name: 'Stack Exchange', note: 'Production hosting' },
  { name: 'Fraunhofer', note: 'Research labs' },
  { name: 'KU Leuven', note: 'University HPC' },
  { name: 'Kakao', note: 'Service backbone' }
] as const;

export const testimonials = [
  {
    quote:
      'We replaced 240 ESXi sockets with three Proxmox VE clusters in eleven weeks. The web UI is faster than vCenter and the cluster never went down once during the migration.',
    name: 'Lina Brandt',
    role: 'Head of Infrastructure, mid-cap European logistics firm'
  },
  {
    quote:
      'Backup window dropped from six hours to twenty-eight minutes after we cut over to PBS. We send the same data to a second site every night for half what Veeam was costing us.',
    name: 'Kenji Sato',
    role: 'Senior SRE, regional managed-service provider'
  },
  {
    quote:
      'Our 23-node hyperconverged cluster runs every internal workload on a single Ceph pool. Three years in, we have not paid for a single hypervisor or storage license.',
    name: 'Aimee Robinson',
    role: 'Director of Engineering, public-sector research lab'
  }
] as const;
