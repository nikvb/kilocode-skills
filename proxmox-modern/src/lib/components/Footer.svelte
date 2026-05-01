<script>
  import Wordmark from '$lib/brand/Wordmark.svelte';
  import { company } from '$lib/data/products';
  import { Github, Mail, Phone, MapPin } from 'lucide-svelte';

  const year = new Date().getFullYear();
</script>

<footer class="ink-section mt-32">
  <div class="container-page py-20">
    <div class="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
      <div class="lg:col-span-2 max-w-sm">
        <Wordmark size={28} dark={true} />
        <p class="mt-5 text-sm leading-relaxed">
          {company.tagline} Built and maintained by {company.legalName} in {company.city}, {company.country} since {company.founded}.
        </p>
        <div class="mt-6 grid gap-2 text-sm">
          <div class="flex items-start gap-2.5">
            <MapPin size={15} class="shrink-0 mt-0.5" style="color: var(--color-night-muted)" />
            <span style="color: var(--color-night-muted)">{company.headquarters}</span>
          </div>
          <a href="tel:+431545442" class="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
            <Phone size={15} class="shrink-0" style="color: var(--color-night-muted)" />
            {company.phone}
          </a>
          <a href="mailto:{company.email}" class="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
            <Mail size={15} class="shrink-0" style="color: var(--color-night-muted)" />
            {company.email}
          </a>
        </div>
      </div>

      <div>
        <div class="text-xs font-semibold tracking-widest uppercase mb-4" style="color: var(--color-night-muted)">Products</div>
        <ul class="grid gap-2.5 text-sm">
          <li><a href="/products/virtual-environment" class="hover:text-orange-400 transition-colors">Virtual Environment</a></li>
          <li><a href="/products/backup-server" class="hover:text-orange-400 transition-colors">Backup Server</a></li>
          <li><a href="/products/mail-gateway" class="hover:text-orange-400 transition-colors">Mail Gateway</a></li>
          <li><a href="/products/datacenter-manager" class="hover:text-orange-400 transition-colors">Datacenter Manager</a></li>
          <li><a href="/downloads" class="hover:text-orange-400 transition-colors">Downloads</a></li>
        </ul>
      </div>

      <div>
        <div class="text-xs font-semibold tracking-widest uppercase mb-4" style="color: var(--color-night-muted)">Solutions</div>
        <ul class="grid gap-2.5 text-sm">
          <li><a href="/solutions/private-cloud" class="hover:text-orange-400 transition-colors">Private cloud</a></li>
          <li><a href="/solutions/hyperconverged" class="hover:text-orange-400 transition-colors">Hyperconverged</a></li>
          <li><a href="/solutions/sme" class="hover:text-orange-400 transition-colors">SME &amp; education</a></li>
          <li><a href="/solutions/service-providers" class="hover:text-orange-400 transition-colors">Service providers</a></li>
          <li><a href="/customers" class="hover:text-orange-400 transition-colors">Customers</a></li>
        </ul>
      </div>

      <div>
        <div class="text-xs font-semibold tracking-widest uppercase mb-4" style="color: var(--color-night-muted)">Resources</div>
        <ul class="grid gap-2.5 text-sm">
          <li><a href="/docs" class="hover:text-orange-400 transition-colors">Documentation</a></li>
          <li><a href="/support" class="hover:text-orange-400 transition-colors">Support</a></li>
          <li><a href="/pricing" class="hover:text-orange-400 transition-colors">Pricing</a></li>
          <li><a href="/blog" class="hover:text-orange-400 transition-colors">Blog</a></li>
          <li><a href="/about" class="hover:text-orange-400 transition-colors">About</a></li>
          <li><a href="/contact" class="hover:text-orange-400 transition-colors">Contact</a></li>
        </ul>
      </div>
    </div>

    <hr class="my-12" />

    <div class="flex flex-col-reverse lg:flex-row gap-6 justify-between items-start lg:items-center text-sm">
      <div style="color: var(--color-night-muted)">
        © {year} {company.legalName}. {company.registry}. VAT {company.vat}.
      </div>
      <div class="flex flex-wrap items-center gap-6">
        <a href="/legal/imprint" class="hover:text-orange-400 transition-colors" style="color: var(--color-night-muted)">Imprint</a>
        <a href="/legal/privacy" class="hover:text-orange-400 transition-colors" style="color: var(--color-night-muted)">Privacy</a>
        <a href="/legal/terms" class="hover:text-orange-400 transition-colors" style="color: var(--color-night-muted)">Terms</a>
        <a href="https://github.com/proxmox" rel="noopener noreferrer" target="_blank" class="hover:text-orange-400 transition-colors flex items-center gap-1.5" style="color: var(--color-night-muted)">
          <Github size={15} /> GitHub
        </a>
      </div>
    </div>
  </div>
</footer>
