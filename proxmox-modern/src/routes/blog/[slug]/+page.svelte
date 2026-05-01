<script lang="ts">
  import { ArrowRight, Calendar, Clock, User, ArrowLeft } from 'lucide-svelte';
  import Seo from '$lib/components/Seo.svelte';

  export let data;
  $: ({ post, others } = data);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
</script>

<Seo
  title={post.title}
  description={post.description}
  path="/blog/{post.slug}"
/>

<!-- ============================== HERO (thin) ============================== -->
<section class="ink-section relative overflow-hidden">
  <div class="grid-bg absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true"></div>
  <div
    class="absolute inset-0 pointer-events-none"
    aria-hidden="true"
    style="background: radial-gradient(640px 320px at 78% 22%, color-mix(in oklab, var(--color-primary) 14%, transparent), transparent 70%);"
  ></div>

  <div class="container-narrow relative pt-16 pb-20 md:pt-20 md:pb-24">
    <a href="/blog" class="inline-flex items-center gap-1.5 text-sm mb-8" style="color: var(--color-night-muted)">
      <ArrowLeft size={14} /> All posts
    </a>

    <span class="eyebrow mb-4 inline-block">{post.category}</span>
    <h1 class="mb-6" style="color: var(--color-night-text); font-size: clamp(2.25rem, 4vw + 1rem, 4rem)">
      {post.title}
    </h1>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent); font-weight: 350">
      {post.description}
    </p>

    <div class="flex flex-wrap gap-x-6 gap-y-3 text-sm" style="color: var(--color-night-muted)">
      <span class="inline-flex items-center gap-1.5"><User size={14} /> {post.author}</span>
      <span class="inline-flex items-center gap-1.5"><Calendar size={14} /> {fmt(post.date)}</span>
      <span class="inline-flex items-center gap-1.5"><Clock size={14} /> {post.readMin} min read</span>
    </div>
  </div>
</section>

<!-- ============================== ARTICLE BODY ============================== -->
<article class="container-narrow py-20 md:py-24">
  <div class="prose-like">
    {@html post.body}
  </div>
</article>

<style>
  .prose-like :global(h2) {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 1.4vw + 1rem, 2rem);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--color-ink);
    margin-top: 3rem;
    margin-bottom: 1.25rem;
  }
  .prose-like :global(h3) {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-ink);
    margin-top: 2.25rem;
    margin-bottom: 1rem;
  }
  .prose-like :global(p) {
    color: color-mix(in oklab, var(--color-ink) 82%, transparent);
    font-size: 1.0625rem;
    line-height: 1.75;
    margin-bottom: 1.25rem;
  }
  .prose-like :global(ul) {
    margin: 1.25rem 0 1.5rem 0;
    padding-left: 1.25rem;
    list-style: none;
  }
  .prose-like :global(ul li) {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 0.6rem;
    color: color-mix(in oklab, var(--color-ink) 82%, transparent);
    font-size: 1.0625rem;
    line-height: 1.7;
  }
  .prose-like :global(ul li::before) {
    content: "";
    position: absolute;
    left: 0;
    top: 0.7rem;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--color-primary);
  }
  .prose-like :global(blockquote) {
    margin: 2rem 0;
    padding: 1.25rem 1.5rem;
    border-left: 3px solid var(--color-primary);
    background: var(--color-elevated);
    border-radius: 0 6px 6px 0;
    color: var(--color-ink);
    font-family: var(--font-quote);
    font-style: italic;
    font-size: 1.15rem;
    line-height: 1.6;
  }
  .prose-like :global(p code),
  .prose-like :global(li code) {
    background: var(--color-elevated);
    border: 1px solid var(--color-border);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
    color: var(--color-ink);
  }
  .prose-like :global(pre) {
    background: var(--color-night);
    color: var(--color-night-text);
    border: 1px solid var(--color-night-line);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    margin: 1.75rem 0;
    overflow-x: auto;
    font-size: 0.86rem;
    line-height: 1.7;
  }
  .prose-like :global(pre code) {
    background: transparent;
    border: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
  }
  .prose-like :global(strong) {
    color: var(--color-ink);
    font-weight: 600;
  }
  .prose-like :global(a) {
    color: var(--color-primary);
    border-bottom: 1px solid color-mix(in oklab, var(--color-primary) 40%, transparent);
  }
  .prose-like :global(a:hover) { border-bottom-color: var(--color-primary); }
</style>

<!-- ============================== ABOUT THE AUTHOR ============================== -->
<section class="container-narrow pb-12">
  <div class="card p-7 flex items-start gap-5" style="background: var(--color-elevated)">
    <span class="feat-icon shrink-0"><User size={18} /></span>
    <div>
      <div class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-muted); letter-spacing: 0.16em;">About the author</div>
      <div class="font-semibold mb-1.5">{post.author}</div>
      <p class="text-[15px] leading-relaxed m-0">
        {#if post.author.startsWith('Proxmox')}
          The Proxmox engineering team writes about the work behind the releases &mdash; release notes, tuning advice, and the occasional postmortem. We do not have a marketing department.
        {:else}
          Guest author. The views in this post are the author's own; we publish customer stories with their words and our editing.
        {/if}
      </p>
    </div>
  </div>
</section>

<!-- ============================== CONTINUE READING ============================== -->
{#if others.length}
  <section class="container-page py-20">
    <div class="max-w-3xl mb-10">
      <span class="eyebrow mb-3 inline-block">Continue reading</span>
      <h2 class="mb-3">More from the rack.</h2>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      {#each others as o}
        <article class="card card-hover p-7 flex flex-col">
          <div class="flex items-center gap-3 mb-5">
            <span class="pill pill-primary">{o.category}</span>
            <span class="text-xs" style="color: var(--color-muted)">{o.readMin} min read</span>
          </div>
          <h3 class="mb-3">
            <a href="/blog/{o.slug}" class="hover:text-[color:var(--color-primary)]">{o.title}</a>
          </h3>
          <p class="text-base leading-relaxed mb-5">{o.description}</p>
          <div class="mt-auto pt-5 border-t flex items-center justify-between flex-wrap gap-3" style:border-color="var(--color-border)">
            <span class="text-sm" style="color: var(--color-muted)">{fmt(o.date)}</span>
            <a href="/blog/{o.slug}" class="text-sm font-semibold inline-flex items-center gap-1.5" style="color: var(--color-primary)">
              Read post <ArrowRight size={14} />
            </a>
          </div>
        </article>
      {/each}
    </div>
  </section>
{/if}

<!-- ============================== CLOSING CTA ============================== -->
<section class="ink-section">
  <div class="container-narrow text-center py-24">
    <span class="eyebrow mb-4 inline-block">Get started</span>
    <h2 class="mb-6" style="color: var(--color-night-text)">
      Read more, or <span class="quote-italic" style="color: var(--color-primary)">try it</span> on a spare box.
    </h2>
    <p class="text-xl leading-relaxed mb-10" style="color: color-mix(in oklab, var(--color-night-text) 85%, transparent)">
      The ISO is 1.2 GiB and installs in under ten minutes. The free tier has no node limits, no feature paywalls, no expiration.
    </p>
    <div class="flex flex-wrap gap-3 justify-center">
      <a href="/downloads" class="btn-primary">Download Proxmox VE</a>
      <a href="/blog" class="btn-outline">Back to the blog</a>
    </div>
  </div>
</section>
