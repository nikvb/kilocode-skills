import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () => {
  const body =
    `User-agent: *\n` +
    `Allow: /\n` +
    `Sitemap: https://proxmox-modern.21mv.com/sitemap.xml\n`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
