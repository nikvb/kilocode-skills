/**
 * Public Proxmox subscription tiers.
 * Prices reflect the Q1 2026 published rates per CPU socket per year.
 */

export type PriceTier = {
  id: string;
  name: string;
  short: string;
  pricePerCpuYear: number;
  currency: 'EUR';
  audience: string;
  popular?: boolean;
  bestFor: string;
  includes: string[];
  responseTime: string;
  ticketsPerYear: string;
  channels: string[];
};

export const tiers: PriceTier[] = [
  {
    id: 'community',
    name: 'Community',
    short: 'For homelabs, small teams, and pilots',
    pricePerCpuYear: 115,
    currency: 'EUR',
    audience: 'Hobbyist + small business',
    bestFor:
      'You run one or two hosts, you want the enterprise repository (stable, signed updates), and you do not need help-desk support.',
    includes: [
      'Access to enterprise repository',
      'Signed, tested package updates',
      'Community forum access',
      'Subscription Status indicator in the web UI',
      'No per-host limit'
    ],
    responseTime: 'Best-effort community',
    ticketsPerYear: '—',
    channels: ['Forum']
  },
  {
    id: 'basic',
    name: 'Basic',
    short: 'For starter production deployments',
    pricePerCpuYear: 340,
    currency: 'EUR',
    audience: 'Small teams in production',
    bestFor:
      'You have moved a workload to Proxmox VE in production and want a few support tickets per year for when something goes wrong.',
    includes: [
      'Everything in Community',
      '3 support tickets per year',
      'Customer portal access',
      'Per-host bug fixes',
      'One business day initial response'
    ],
    responseTime: '1 business day',
    ticketsPerYear: '3',
    channels: ['Forum', 'Customer portal']
  },
  {
    id: 'standard',
    name: 'Standard',
    short: 'The most common business plan',
    pricePerCpuYear: 540,
    currency: 'EUR',
    popular: true,
    audience: 'Production businesses with SLAs',
    bestFor:
      'You have an internal SLA to your users. You want fast response, more tickets, and remote SSH support when the cluster needs hands-on help.',
    includes: [
      'Everything in Basic',
      '10 support tickets per year',
      '4-hour initial response (business hours)',
      'Remote SSH support session',
      'Configuration review on request'
    ],
    responseTime: '4 hours, business hours',
    ticketsPerYear: '10',
    channels: ['Forum', 'Customer portal', 'Remote SSH']
  },
  {
    id: 'premium',
    name: 'Premium',
    short: 'For mission-critical infrastructure',
    pricePerCpuYear: 1080,
    currency: 'EUR',
    audience: 'Mission-critical, large enterprises',
    bestFor:
      'Downtime costs you money. Our engineers have your phone number, response is in hours not days, and unlimited tickets means you never ration when something feels off.',
    includes: [
      'Everything in Standard',
      'Unlimited support tickets',
      '2-hour initial response (business hours)',
      'Phone support with named engineer',
      'Architectural reviews',
      'Pre-release access for critical patches'
    ],
    responseTime: '2 hours, business hours',
    ticketsPerYear: 'Unlimited',
    channels: ['Forum', 'Portal', 'Phone', 'Remote SSH']
  }
];

export const pbsTiers = tiers.map((t) => ({ ...t, productLabel: 'Per host backed up' }));

export const fxNote =
  'Prices shown are per physical CPU socket per year, ex-VAT. Volume discounts apply at 10+ CPUs. Multi-year prepaid options reduce price by ~5%.';
