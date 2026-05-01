<script lang="ts">
  import { page } from '$app/stores';
  import {
    ArrowRight, MapPin, Phone, Mail, CheckCircle2, Building2,
    Headset, Handshake, Newspaper
  } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { company } from '$lib/data/products';

  $: ok = $page.url.searchParams.get('ok') === '1';

  const inquiryTypes = ['Sales', 'Support', 'Partner', 'Press'] as const;
</script>

<Seo
  title="Contact — talk to the Proxmox team"
  description="Sales, support, partner, and press inquiries reach the Vienna team directly. Phone, email, and a contact form that goes to a human, not a queue."
  path="/contact"
/>

<!-- HERO -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 360px at 78% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-20 md:pt-24 md:pb-24">
    <div class="max-w-3xl">
      <span class="eyebrow mb-4 inline-block">Contact</span>
      <h1 class="mb-6" style="color: var(--color-night-text)">
        Talk to <span class="quote-italic" style="color: var(--color-primary)">the team</span>.
      </h1>
      <p class="text-xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Sales, support, partner, and press inquiries land in Vienna. We answer
        in CET business hours and most replies go out the same day.
      </p>
    </div>
  </div>
</section>

<!-- TWO-COLUMN FORM + INFO -->
<section class="container-page py-20">
  <div class="grid lg:grid-cols-5 gap-12">
    <!-- LEFT: Contact details -->
    <div class="lg:col-span-2">
      <span class="eyebrow mb-3 inline-block">Direct lines</span>
      <h2 class="mb-6" style="font-size: clamp(1.75rem, 2vw + 1rem, 2.5rem)">
        How to reach us.
      </h2>

      <div class="grid gap-4">
        <div class="card p-5">
          <div class="flex items-start gap-3 mb-2">
            <span class="feat-icon shrink-0"><Headset size={18} /></span>
            <div>
              <div class="font-semibold">Sales</div>
              <a href="mailto:{company.salesEmail}" class="underline-link text-[14.5px]" style="color: var(--color-primary)">
                {company.salesEmail}
              </a>
            </div>
          </div>
          <p class="text-[13.5px] leading-relaxed pl-12" style="color: var(--color-muted)">
            Quotes, volume discounts, multi-year prepay, MSP arrangements, and
            evaluation licenses.
          </p>
        </div>

        <div class="card p-5">
          <div class="flex items-start gap-3 mb-2">
            <span class="feat-icon shrink-0"><Mail size={18} /></span>
            <div>
              <div class="font-semibold">Support</div>
              <a href="mailto:{company.supportEmail}" class="underline-link text-[14.5px]" style="color: var(--color-primary)">
                {company.supportEmail}
              </a>
            </div>
          </div>
          <p class="text-[13.5px] leading-relaxed pl-12" style="color: var(--color-muted)">
            Existing customers should open tickets via the customer portal —
            response is faster and the SLA tracks.
          </p>
        </div>

        <div class="card p-5">
          <div class="flex items-start gap-3 mb-2">
            <span class="feat-icon shrink-0"><Handshake size={18} /></span>
            <div>
              <div class="font-semibold">Partners &amp; resellers</div>
              <a href="mailto:{company.partnerEmail}" class="underline-link text-[14.5px]" style="color: var(--color-primary)">
                {company.partnerEmail}
              </a>
            </div>
          </div>
          <p class="text-[13.5px] leading-relaxed pl-12" style="color: var(--color-muted)">
            For training partners, hosting partners, and authorized resellers.
          </p>
        </div>

        <div class="card p-5">
          <div class="flex items-start gap-3 mb-2">
            <span class="feat-icon shrink-0"><Newspaper size={18} /></span>
            <div>
              <div class="font-semibold">Press</div>
              <a href="mailto:{company.pressEmail}" class="underline-link text-[14.5px]" style="color: var(--color-primary)">
                {company.pressEmail}
              </a>
            </div>
          </div>
          <p class="text-[13.5px] leading-relaxed pl-12" style="color: var(--color-muted)">
            Embargoed briefings, executive interviews, and product imagery.
          </p>
        </div>
      </div>

      <div class="mt-8 text-[13px]" style="color: var(--color-muted)">
        Office hours · Mon-Fri 9:00-18:00 CET
      </div>
    </div>

    <!-- RIGHT: Form -->
    <div class="lg:col-span-3">
      {#if ok}
        <div
          class="card p-7 flex items-start gap-4 mb-6"
          style="background: color-mix(in oklab, var(--color-success) 8%, var(--color-surface)); border-color: color-mix(in oklab, var(--color-success) 40%, var(--color-border))"
          role="status"
        >
          <CheckCircle2 size={24} class="shrink-0 mt-0.5" style="color: var(--color-success)" />
          <div>
            <div class="font-semibold" style="color: var(--color-success)">Message received.</div>
            <p class="text-[14.5px] leading-relaxed mt-1" style="color: var(--color-ink)">
              Thanks. A team member in Vienna will get back to you inside one
              business day. Look out for a reply from a {company.email.split('@')[1]}
              address.
            </p>
          </div>
        </div>
      {/if}

      <form
        action="/api/leads"
        method="POST"
        class="card p-7 md:p-9"
      >
        <h3 class="mb-2">Send a message.</h3>
        <p class="text-[14.5px] mb-7" style="color: var(--color-muted)">
          Required fields are marked. The form goes to the team that owns
          the inquiry type — no inbox round trip.
        </p>

        <div class="grid gap-5 md:grid-cols-2">
          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">
              Name <span style="color: var(--color-primary)">*</span>
            </span>
            <input
              required
              type="text"
              name="name"
              autocomplete="name"
              class="px-3.5 py-2.5 rounded-md text-[14.5px]"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">
              Work email <span style="color: var(--color-primary)">*</span>
            </span>
            <input
              required
              type="email"
              name="email"
              autocomplete="email"
              class="px-3.5 py-2.5 rounded-md text-[14.5px]"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">Company</span>
            <input
              type="text"
              name="company"
              autocomplete="organization"
              class="px-3.5 py-2.5 rounded-md text-[14.5px]"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            />
          </label>

          <label class="flex flex-col gap-1.5">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">Number of CPUs</span>
            <input
              type="number"
              min="0"
              name="cpus"
              placeholder="e.g. 32"
              class="px-3.5 py-2.5 rounded-md text-[14.5px]"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            />
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">
              Inquiry type <span style="color: var(--color-primary)">*</span>
            </span>
            <select
              required
              name="inquiry"
              class="px-3.5 py-2.5 rounded-md text-[14.5px]"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            >
              <option value="">Pick one…</option>
              {#each inquiryTypes as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </label>

          <label class="flex flex-col gap-1.5 md:col-span-2">
            <span class="text-[13px] font-semibold" style="color: var(--color-ink)">
              Message <span style="color: var(--color-primary)">*</span>
            </span>
            <textarea
              required
              name="message"
              rows="6"
              placeholder="Tell us what you are running and what you are trying to do."
              class="px-3.5 py-2.5 rounded-md text-[14.5px] resize-y"
              style="background: var(--color-surface); border: 1px solid var(--color-border); font-family: var(--font-sans)"
            ></textarea>
          </label>
        </div>

        <div class="mt-7 flex flex-wrap items-center justify-between gap-4">
          <p class="text-[12.5px]" style="color: var(--color-muted); max-width: 28rem">
            By sending this, you agree to be contacted by Proxmox Server
            Solutions GmbH. We do not share contact details with third parties.
          </p>
          <button type="submit" class="btn-primary">
            Send message <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- OFFICE INFO CARDS -->
<section class="container-page py-16">
  <div class="grid gap-5 md:grid-cols-3">
    <div class="card p-7">
      <span class="feat-icon mb-4"><MapPin size={20} /></span>
      <h4 class="mb-2">Headquarters</h4>
      <p class="text-[14.5px] leading-relaxed" style="color: var(--color-ink)">
        {company.headquarters}
      </p>
      <p class="text-[13px] mt-3" style="color: var(--color-muted)">
        {company.registry} · VAT {company.vat}
      </p>
    </div>

    <div class="card p-7">
      <span class="feat-icon mb-4"><Phone size={20} /></span>
      <h4 class="mb-2">Phone</h4>
      <a href="tel:{company.phone.replace(/\s/g, '')}" class="text-[15px] font-semibold underline-link" style="color: var(--color-primary)">
        {company.phone}
      </a>
      <p class="text-[13px] mt-3" style="color: var(--color-muted)">
        Mon-Fri 9:00-18:00 CET. Outside hours: emergency line for Premium customers.
      </p>
    </div>

    <div class="card p-7">
      <span class="feat-icon mb-4"><Mail size={20} /></span>
      <h4 class="mb-2">General email</h4>
      <a href="mailto:{company.email}" class="text-[15px] font-semibold underline-link" style="color: var(--color-primary)">
        {company.email}
      </a>
      <p class="text-[13px] mt-3" style="color: var(--color-muted)">
        For anything that does not fit a specific channel above.
      </p>
    </div>
  </div>

  <div class="mt-10 flex items-center gap-3 text-[13px]" style="color: var(--color-muted)">
    <Building2 size={15} />
    <span>{company.legalName} · founded {company.founded} in {company.city}, {company.country}</span>
  </div>
</section>
