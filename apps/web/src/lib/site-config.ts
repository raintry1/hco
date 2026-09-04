export const siteConfig = {
  name: 'Hackers Colony Official',
  shortName: 'HCO',
  description: 'Learn. Hack. Build. Grow Together. A community-driven platform for developers and cybersecurity enthusiasts.',
  url: 'https://hco.dev',
  ogImage: '/og-image.png',
  twitterHandle: '@hackerscolony',
  links: {
    twitter: 'https://twitter.com/hackerscolony',
    github: 'https://github.com/hackerscolony',
    discord: 'https://discord.gg/hackerscolony',
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