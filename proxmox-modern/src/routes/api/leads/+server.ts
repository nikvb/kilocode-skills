import { json, redirect } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types.js';
import { ensureLeadsTable, query } from '$lib/server/db.js';
import { sendMail } from '$lib/server/mail.js';

type LeadInput = {
  name?: string;
  email?: string;
  company?: string;
  cpus?: string | number | null;
  inquiry?: string;
  message?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: RequestHandler = async ({ request }) => {
  const ct = request.headers.get('content-type') ?? '';
  const isForm = ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data');

  let body: LeadInput = {};
  if (isForm) {
    const fd = await request.formData();
    body = {
      name: (fd.get('name') as string) ?? '',
      email: (fd.get('email') as string) ?? '',
      company: (fd.get('company') as string) ?? '',
      cpus: (fd.get('cpus') as string) ?? '',
      inquiry: (fd.get('inquiry') as string) ?? '',
      message: (fd.get('message') as string) ?? ''
    };
  } else {
    body = (await request.json().catch(() => ({}))) as LeadInput;
  }

  const name = (body.name ?? '').toString().trim();
  const email = (body.email ?? '').toString().trim();
  const company = (body.company ?? '').toString().trim();
  const inquiry = (body.inquiry ?? '').toString().trim();
  const message = (body.message ?? '').toString().trim();
  const cpusRaw = body.cpus;
  const cpus =
    cpusRaw === undefined || cpusRaw === null || cpusRaw === ''
      ? null
      : Number.parseInt(String(cpusRaw), 10);

  if (!email.includes('@')) {
    return json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (message.length < 1 || message.length > 5000) {
    return json({ error: 'Message must be between 1 and 5000 characters.' }, { status: 400 });
  }

  const id = nanoid();

  try {
    await ensureLeadsTable();
    await query(
      `INSERT INTO leads (id, name, email, company, cpus, inquiry, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, name, email, company, Number.isFinite(cpus) ? cpus : null, inquiry, message]
    );
  } catch (err) {
    console.error('lead db insert failed', err);
  }

  const subject = `New lead: ${inquiry || 'inquiry'} from ${company || name || email}`;
  const html = `
    <h2>New lead</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>
      <tr><td><strong>CPUs</strong></td><td>${cpus ?? ''}</td></tr>
      <tr><td><strong>Inquiry</strong></td><td>${escapeHtml(inquiry)}</td></tr>
      <tr><td valign="top"><strong>Message</strong></td><td><pre style="white-space:pre-wrap;margin:0;font-family:inherit">${escapeHtml(message)}</pre></td></tr>
      <tr><td><strong>Lead ID</strong></td><td>${id}</td></tr>
    </table>
  `;

  await sendMail({
    to: 'sales@proxmox.com',
    subject,
    html,
    replyTo: email
  });

  if (isForm) {
    throw redirect(303, '/contact?ok=1');
  }
  return json({ ok: true }, { status: 201 });
};
