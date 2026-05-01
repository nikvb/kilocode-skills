import type { RequestHandler } from './$types.js';

const BASE = 'https://proxmox1.21mv.com';
const LASTMOD = '2026-04-01';

const routes: { path: string; priority: string }[] = [
  { path: '/', priority: '1.0' },
  { path: '/products', priority: '0.9' },
  { path: '/products/virtual-environment', priority: '0.9' },
  { path: '/products/backup-server', priority: '0.9' },
  { path: '/products/mail-gateway', priority: '0.9' },
  { path: '/products/datacenter-manager', priority: '0.9' },
  { path: '/solutions', priority: '0.8' },
  { path: '/solutions/private-cloud', priority: '0.8' },
  { path: '/solutions/hyperconverged', priority: '0.8' },
  { path: '/solutions/sme', priority: '0.8' },
  { path: '/solutions/service-providers', priority: '0.8' },
  { path: '/pricing', priority: '0.9' },
  { path: '/downloads', priority: '0.8' },
  { path: '/docs', priority: '0.8' },
  { path: '/support', priority: '0.7' },
  { path: '/customers', priority: '0.6' },
  { path: '/blog', priority: '0.7' },
  { path: '/about', priority: '0.6' },
  { path: '/contact', priority: '0.7' }
];

export const GET: RequestHandler = async () => {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map(
        (r) =>
          `  <url>\n` +
          `    <loc>${BASE}${r.path}</loc>\n` +
          `    <lastmod>${LASTMOD}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n` +
          `    <priority>${r.priority}</priority>\n` +
          `  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
