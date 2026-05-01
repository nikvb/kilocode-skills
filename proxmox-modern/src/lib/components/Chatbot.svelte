<script lang="ts">
  import { MessageSquare, X, Send, Loader2 } from 'lucide-svelte';
  import { tick } from 'svelte';

  type Msg = { role: 'user' | 'assistant'; content: string };

  let open = false;
  let input = '';
  let sending = false;
  let messages: Msg[] = [
    {
      role: 'assistant',
      content:
        'Hi — I am the Proxmox assistant. Ask me anything about Proxmox VE, Backup Server, Mail Gateway, pricing, or which product fits your stack.'
    }
  ];
  let scroller: HTMLDivElement;

  async function scroll() {
    await tick();
    scroller?.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' });
  }

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    input = '';
    messages = [...messages, { role: 'user', content: text }];
    sending = true;
    await scroll();

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      });
      if (!r.ok || !r.body) throw new Error('chat failed');

      messages = [...messages, { role: 'assistant', content: '' }];
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const j = JSON.parse(line);
            const piece = j?.message?.content ?? j?.response ?? '';
            if (piece) {
              messages[messages.length - 1].content += piece;
              messages = messages;
              await scroll();
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      messages = [
        ...messages,
        {
          role: 'assistant',
          content: 'Sorry — the assistant is unavailable right now. Email sales@proxmox.com and we will respond within one business day.'
        }
      ];
    } finally {
      sending = false;
      await scroll();
    }
  }
</script>

{#if !open}
  <button
    class="fixed bottom-6 right-6 z-30 btn-primary rounded-full shadow-2xl"
    on:click={() => (open = true)}
    aria-label="Open assistant"
  >
    <MessageSquare size={18} /> Ask the assistant
  </button>
{:else}
  <div
    class="fixed bottom-6 right-6 z-30 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-3rem))] flex flex-col card overflow-hidden"
    style="box-shadow: 0 24px 80px -20px rgba(15,20,25,0.35);"
  >
    <div class="flex items-center justify-between p-4 border-b" style:border-color="var(--color-border)">
      <div>
        <div class="font-semibold">Proxmox assistant</div>
        <div class="text-xs" style="color: var(--color-muted)">Powered by an on-prem LLM. No data leaves the platform.</div>
      </div>
      <button on:click={() => (open = false)} aria-label="Close assistant" class="p-1 -mr-1 rounded hover:bg-elevated">
        <X size={18} />
      </button>
    </div>

    <div bind:this={scroller} class="flex-1 overflow-y-auto p-4 grid gap-3">
      {#each messages as m}
        <div class="flex {m.role === 'user' ? 'justify-end' : 'justify-start'}">
          <div
            class="max-w-[85%] px-3.5 py-2.5 rounded-lg text-sm leading-relaxed whitespace-pre-wrap"
            style="background: {m.role === 'user' ? 'var(--color-primary)' : 'var(--color-elevated)'}; color: {m.role === 'user' ? 'var(--color-on-primary)' : 'var(--color-ink)'};"
          >{m.content || (sending ? '…' : '')}</div>
        </div>
      {/each}
    </div>

    <form
      class="border-t p-3 flex gap-2"
      style:border-color="var(--color-border)"
      on:submit|preventDefault={send}
    >
      <input
        bind:value={input}
        placeholder="Ask about clustering, backups, pricing…"
        class="flex-1 px-3 py-2 rounded-md border bg-paper text-sm"
        style:border-color="var(--color-border)"
        disabled={sending}
      />
      <button type="submit" class="btn-primary px-3" disabled={sending || !input.trim()} aria-label="Send">
        {#if sending}<Loader2 size={16} class="animate-spin" />{:else}<Send size={16} />{/if}
      </button>
    </form>
  </div>
{/if}
