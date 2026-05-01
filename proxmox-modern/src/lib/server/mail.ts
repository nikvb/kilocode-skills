type SendArgs = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
};

type SendResult = { sent: boolean; provider_id?: string };

export async function sendMail(args: SendArgs): Promise<SendResult> {
  const key = process.env.PLATFORM_API_KEY;
  if (!key) return { sent: false };

  try {
    const res = await fetch('https://deploy.21mv.com/api/v1/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify(args)
    });
    if (!res.ok) {
      console.error('mail proxy error', res.status, await res.text().catch(() => ''));
      return { sent: false };
    }
    const data = (await res.json().catch(() => ({}))) as { provider_id?: string; id?: string };
    return { sent: true, provider_id: data.provider_id ?? data.id };
  } catch (err) {
    console.error('mail proxy fetch failed', err);
    return { sent: false };
  }
}
