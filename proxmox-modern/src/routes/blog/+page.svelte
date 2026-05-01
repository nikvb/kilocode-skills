<script lang="ts">
  import { ArrowRight, Calendar, Clock, User, Mail } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { posts, categories } from '$lib/data/posts';

  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
</script>

<Seo
  title="Blog — engineering deep-dives, release notes, and customer stories"
  description="Notes from the Proxmox engineering team and the operators who run it: release walkthroughs, tuning guides, and migration runbooks from real data centers."
  path="/blog"
/>

<!-- ============================== HERO ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(720px 380px at 82% 22%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%);"
  ></div>

  <div class="container-page relative pt-20 pb-24 md:pt-24 md:pb-28">
    <div class="max-w-3xl">
      <span class="eyebrow mb-5 inline-block">Blog</span>
      <h1 class="mb-6" style="color: var(--color-night-text)">
        <span class="quote-italic" style="color: var(--color-primary)">Notes</span> from the rack.
      </h1>
      <p class="text-xl md:text-2xl max-w-2xl leading-relaxed" style="color: color-mix(in oklab, var(--color-night-text) 86%, transparent); font-weight: 350">
        Engineering deep-dives, release notes, and the occasional customer story.
      </p>
    </div>
  </div>
</section>

<!-- ============================== FEATURED ============================== -->
<section class="container-page py-20">
  <div class="flex items-end justify-between mb-10 flex-wrap gap-4">
    <div>
      <span class="eyebrow mb-3 inline-block">Featured</span>
      <h2 class="m-0">The most recent post.</h2>
    </div>
    <span class="text-sm" style="color: var(--color-muted)">
      Updated {fmt(featured.date)}
    </span>
  </div>

  <a href="/blog/{featured.slug}" class="card card-hover overflow-hidden grid lg:grid-cols-2 group">
    <div class="p-8 md:p-12 flex flex-col">
      <div class="flex items-center gap-3 mb-5">
        <span class="pill pill-primary">{featured.category}</span>
        <span class="text-xs" style="color: var(--color-muted)">{featured.readMin} min read</span>
      </div>
      <h2 class="mb-5" style="font-size: clamp(1.75rem, 2vw + 1rem, 2.5rem)">
        {featured.title}
      </h2>
      <p class="text-lg leading-relaxed mb-8">
        {featured.description}
      </p>
      <div class="mt-auto flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center gap-5 text-sm" style="color: var(--color-muted)">
          <span class="inline-flex items-center gap-1.5"><User size={14} /> {featured.author}</span>
          <span class="inline-flex items-center gap-1.5"><Calendar size={14} /> {fmt(featured.date)}</span>
        </div>
        <span class="inline-flex items-center gap-1.5 text-sm font-semibold" style="color: var(--color-primary)">
          Read post <ArrowRight size={15} class="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>

    <!-- stylized faux-screenshot -->
    <div class="relative overflow-hidden hidden lg:block" style="background: var(--color-night); min-height: 420px;">
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 600 420" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="featgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(229,112,0,0.10)" stroke-width="1"/>
          </pattern>
          <radialGradient id="featglow" cx="80%" cy="20%" r="60%">
            <stop offset="0%" stop-color="rgba(229,112,0,0.30)" />
            <stop offset="100%" stop-color="rgba(229,112,0,0)" />
          </radialGradient>
        </defs>
        <rect width="600" height="420" fill="url(#featgrid)" />
        <rect width="600" height="420" fill="url(#featglow)" />
        <g opacity="0.55">
          <circle cx="120" cy="100" r="3" fill="#E57000" />
          <circle cx="220" cy="160" r="3" fill="#E57000" />
          <circle cx="340" cy="120" r="3" fill="#E57000" />
          <circle cx="460" cy="200" r="3" fill="#E57000" />
          <circle cx="180" cy="280" r="3" fill="#E57000" />
          <circle cx="320" cy="320" r="3" fill="#E57000" />
          <line x1="120" y1="100" x2="220" y2="160" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
          <line x1="220" y1="160" x2="340" y2="120" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
          <line x1="340" y1="120" x2="460" y2="200" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
          <line x1="220" y1="160" x2="180" y2="280" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
          <line x1="180" y1="280" x2="320" y2="320" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
          <line x1="320" y1="320" x2="460" y2="200" stroke="rgba(229,112,0,0.35)" stroke-width="1" />
        </g>
      </svg>
      <div class="relative z-10 p-10 h-full flex flex-col">
        <div class="flex items-center gap-2 mb-6">
          <span class="w-2 h-2 rounded-full bg-red-500 opacity-70"></span>
          <span class="w-2 h-2 rounded-full bg-yellow-500 opacity-70"></span>
          <span class="w-2 h-2 rounded-full bg-green-500 opacity-70"></span>
          <span class="ml-2 text-[11px]" style="color: var(--color-night-muted); font-family: var(--font-mono);">/blog/{featured.slug}</span>
        </div>
        <div class="mt-auto">
          <div class="text-xs uppercase tracking-widest mb-3" style="color: var(--color-night-muted); letter-spacing: 0.18em;">
            {featured.category}
          </div>
          <div class="text-2xl leading-tight" style="color: var(--color-night-text); font-family: var(--font-display); letter-spacing: -0.025em; font-weight: 500;">
            {featured.title}
          </div>
        </div>
      </div>
    </div>
  </a>
</section>

<!-- ============================== LATEST POSTS ============================== -->
<section class="container-page py-16">
  <div class="max-w-3xl mb-12">
    <span class="eyebrow mb-3 inline-block">Latest posts</span>
    <h2 class="mb-4">Recent writing.</h2>
    <p class="text-lg">
      A short list. We publish when there is something useful to say &mdash; not on a quota.
    </p>
  </div>

  <div class="grid gap-5 md:grid-cols-2">
    {#each rest as p}
      <article class="card card-hover p-7 flex flex-col">
        <div class="flex items-center gap-3 mb-5">
          <span class="pill pill-primary">{p.category}</span>
          <span class="text-xs" style="color: var(--color-muted)">{p.readMin} min read</span>
        </div>
        <h3 class="mb-3">
          <a href="/blog/{p.slug}" class="hover:text-[color:var(--color-primary)]">{p.title}</a>
        </h3>
        <p class="text-base leading-relaxed mb-6">{p.description}</p>
        <div class="mt-auto pt-5 border-t flex items-center justify-between flex-wrap gap-3" style:border-color="var(--color-border)">
          <div class="flex items-center gap-4 text-sm" style="color: var(--color-muted)">
            <span class="inline-flex items-center gap-1.5"><User size={13} /> {p.author.split(',')[0]}</span>
            <span class="inline-flex items-center gap-1.5"><Calendar size={13} /> {fmt(p.date)}</span>
          </div>
          <a href="/blog/{p.slug}" class="text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
            Read post <ArrowRight size={14} />
          </a>
        </div>
      </article>
    {/each}
  </div>
</section>

<!-- ============================== CATEGORIES ============================== -->
<section class="container-page py-16">
  <div class="max-w-3xl mb-8">
    <span class="eyebrow mb-3 inline-block">Browse</span>
    <h2 class="mb-4">By category.</h2>
    <p class="text-lg">
      We tag posts in four buckets. Engineering is most of what we publish; customer stories take longer to get through legal.
    </p>
  </div>

  <div class="flex flex-wrap gap-3">
    <span class="pill pill-primary cursor-pointer">All posts</span>
    {#each categories as c}
      <span class="pill cursor-pointer">{c}</span>
    {/each}
  </div>
</section>

<!-- ============================== SUBSCRIBE CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow py-24 text-center">
    <span class="feat-icon mb-6 mx-auto"><Mail size={20} /></span>
    <span class="eyebrow mb-3 inline-block">Subscribe</span>
    <h2 class="mb-5" style="color: var(--color-night-text)">
      One email a month. <span class="quote-italic" style="color: var(--color-primary)">No spam.</span>
    </h2>
    <p class="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      A monthly digest of new posts, release notes, and the occasional unlisted benchmark. Unsubscribe with one click; we will not chase you.
    </p>

    <form action="/api/leads" method="post" class="max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
      <input type="hidden" name="inquiry" value="newsletter" />
      <input
        type="email"
        name="email"
        required
        placeholder="you@company.com"
        class="flex-1 px-5 py-3 rounded-md text-base"
        style="background: var(--color-night-2); border: 1px solid var(--color-night-line); color: var(--color-night-text); font-family: var(--font-sans);"
      />
      <button type="submit" class="btn-primary">
        Subscribe <ArrowRight size={15} />
      </button>
    </form>
    <p class="mt-5 text-xs" style="color: var(--color-night-muted)">
      We use your email only for the digest. See the privacy notice for the full story.
    </p>
  </div>
</section>
