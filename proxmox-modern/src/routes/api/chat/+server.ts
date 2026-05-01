import type { RequestHandler } from './$types.js';

export const config = { csrf: { checkOrigin: false } };

const SYSTEM_PROMPT =
  'You are the Proxmox assistant. Reply in 2-4 short sentences. Always recommend the right product (PVE for compute, PBS for backup, PMG for mail security, PDM for federation). Refer users to /pricing for cost questions and /contact for sales. If asked about competitors (VMware, Hyper-V), be factual and not snarky.';

const OLLAMA_URL = 'http://127.0.0.1:11434';
const MODEL = 'gemma2:2b';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function fallbackStream(message: string): Response {
  const line =
    JSON.stringify({
      model: MODEL,
      created_at: new Date().toISOString(),
      message: { role: 'assistant', content: message },
      done: true
    }) + '\n';
  return new Response(line, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-store'
    }
  });
}

export const POST: RequestHandler = async ({ request }) => {
  let payload: { messages?: ChatMessage[]; message?: string } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    payload = {};
  }

  const incoming: ChatMessage[] = Array.isArray(payload.messages) ? payload.messages : [];
  const messages: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }];
  if (incoming.length > 0) {
    for (const m of incoming) {
      if (m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') {
        messages.push({ role: m.role, content: m.content });
      }
    }
  } else if (typeof payload.message === 'string' && payload.message.trim()) {
    messages.push({ role: 'user', content: payload.message });
  }

  if (messages.length === 1) {
    return fallbackStream("Ask me anything about Proxmox VE, PBS, PMG, or PDM.");
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, stream: true })
    });
  } catch (err) {
    console.error('ollama unreachable', err);
    return fallbackStream(
      "I'm offline right now, but I can still point you to the docs at /docs or sales at /contact. For pricing, check /pricing."
    );
  }

  if (!upstream.ok || !upstream.body) {
    return fallbackStream(
      "The chat backend is warming up. Try again in a moment, or reach out via /contact."
    );
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-store'
    }
  });
};
