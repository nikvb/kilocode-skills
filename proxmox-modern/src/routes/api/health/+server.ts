import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async () =>
  json({ status: 'healthy', uptime: process.uptime(), service: 'proxmox-modern' });
