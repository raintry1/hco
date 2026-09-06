// The site's public base URL, used for metadataBase, canonical URLs, Open
// Graph, sitemap, and JSON-LD. Override per environment with
// NEXT_PUBLIC_SITE_URL (e.g. http://localhost:3000 locally,
// https://hackerscolony.vercel.app in production).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hackerscolony.vercel.app';

export const siteConfig = {
  name: 'Hackers Colony Official',
  shortName: 'HCO',
  description: 'Learn. Hack. Build. Grow Together. A community-driven platform for developers and cybersecurity enthusiasts.',
  url: siteUrl,
  ogImage: '/og-image.png',
  twitterHandle: '@Hackers_Colony',
  links: {
    twitter: 'https://x.com/Hackers_Colony',
    github: 'https://github.com/Hackerscolonyofficial',
    discord: 'https://discord.gg/UrtsdYRP2',
    facebook: 'https://www.facebook.com/share/1YUtNK5PX2/',
    email: 'mailto:hackerscolonynew@gmail.com',
  },
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/categories' },
    { label: 'Search', href: '/search' },
    { label: 'About', href: '/about' },
  ],
};

export const categoryConfig = {
  'web-security': { name: 'Web Security', color: '#ef4444', icon: 'shield' },
  'network-security': { name: 'Network Security', color: '#f97316', icon: 'globe' },
  'cryptography': { name: 'Cryptography', color: '#eab308', icon: 'lock' },
  'reverse-engineering': { name: 'Reverse Engineering', color: '#22c55e', icon: 'cpu' },
  'malware-analysis': { name: 'Malware Analysis', color: '#a855f7', icon: 'bug' },
  'devops-security': { name: 'DevOps Security', color: '#06b6d4', icon: 'server' },
  'programming': { name: 'Programming', color: '#8b5cf6', icon: 'code' },
  'career': { name: 'Career', color: '#ec4899', icon: 'briefcase' },
};