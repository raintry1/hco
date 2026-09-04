import type { Author, Category, Tag, PostWithRelations } from '@hco/shared';

export const authors: Author[] = [
  {
    id: '1',
    name: 'Alex Chen',
    slug: 'alex-chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Senior Security Researcher specializing in web application security and bug bounty hunting. Former red teamer at a Fortune 500.',
    role: 'Security Researcher',
    twitter: 'https://twitter.com/alexchen_sec',
    github: 'https://github.com/alexchen',
    website: 'https://alexchen.dev',
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    slug: 'maria-rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    bio: 'Cryptography engineer with a passion for zero-knowledge proofs and privacy-preserving technologies. PhD in Computer Science.',
    role: 'Cryptography Engineer',
    twitter: 'https://twitter.com/maria_crypto',
    github: 'https://github.com/mariarodriguez',
    website: 'https://mariarodriguez.io',
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: '3',
    name: 'James Park',
    slug: 'james-park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    bio: 'Malware analyst and reverse engineer. Loves taking things apart to understand how they work. Speaker at DEF CON and Black Hat.',
    role: 'Malware Analyst',
    twitter: 'https://twitter.com/jamespark_re',
    github: 'https://github.com/jamespark',
    createdAt: '2023-03-10T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sarah Kim',
    slug: 'sarah-kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'DevSecOps advocate helping teams build secure pipelines. Kubernetes security specialist and CNCF contributor.',
    role: 'DevSecOps Engineer',
    twitter: 'https://twitter.com/sarahkim_devsec',
    github: 'https://github.com/sarahkim',
    website: 'https://sarahkim.dev',
    createdAt: '2023-04-05T00:00:00Z',
  },
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Web Security',
    slug: 'web-security',
    description: 'Vulnerabilities, exploits, and defenses for web applications',
    color: '#ef4444',
    icon: 'shield',
    postCount: 12,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Network Security',
    slug: 'network-security',
    description: 'Network protocols, penetration testing, and infrastructure security',
    color: '#f97316',
    icon: 'globe',
    postCount: 8,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Cryptography',
    slug: 'cryptography',
    description: 'Encryption, protocols, and mathematical foundations of security',
    color: '#eab308',
    icon: 'lock',
    postCount: 6,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Reverse Engineering',
    slug: 'reverse-engineering',
    description: 'Binary analysis, decompilation, and understanding compiled code',
    color: '#22c55e',
    icon: 'cpu',
    postCount: 5,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Malware Analysis',
    slug: 'malware-analysis',
    description: 'Behavioral analysis, static/dynamic analysis of malicious software',
    color: '#a855f7',
    icon: 'bug',
    postCount: 7,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'DevOps Security',
    slug: 'devops-security',
    description: 'CI/CD security, container security, infrastructure as code',
    color: '#06b6d4',
    icon: 'server',
    postCount: 4,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Programming',
    slug: 'programming',
    description: 'Secure coding practices, language-specific security features',
    color: '#8b5cf6',
    icon: 'code',
    postCount: 10,
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Career',
    slug: 'career',
    description: 'Career advice, certifications, and professional development',
    color: '#ec4899',
    icon: 'briefcase',
    postCount: 3,
    createdAt: '2023-01-01T00:00:00Z',
  },
];

export const tags: Tag[] = [
  { id: '1', name: 'XSS', slug: 'xss', createdAt: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'SQL Injection', slug: 'sql-injection', createdAt: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'CSRF', slug: 'csrf', createdAt: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Authentication', slug: 'authentication', createdAt: '2023-01-01T00:00:00Z' },
  { id: '5', name: 'OAuth', slug: 'oauth', createdAt: '2023-01-01T00:00:00Z' },
  { id: '6', name: 'JWT', slug: 'jwt', createdAt: '2023-01-01T00:00:00Z' },
  { id: '7', name: 'Zero-Knowledge', slug: 'zero-knowledge', createdAt: '2023-01-01T00:00:00Z' },
  { id: '8', name: 'Elliptic Curves', slug: 'elliptic-curves', createdAt: '2023-01-01T00:00:00Z' },
  { id: '9', name: 'Ghidra', slug: 'ghidra', createdAt: '2023-01-01T00:00:00Z' },
  { id: '10', name: 'IDA Pro', slug: 'ida-pro', createdAt: '2023-01-01T00:00:00Z' },
  { id: '11', name: 'YARA', slug: 'yara', createdAt: '2023-01-01T00:00:00Z' },
  { id: '12', name: 'Docker', slug: 'docker', createdAt: '2023-01-01T00:00:00Z' },
  { id: '13', name: 'Kubernetes', slug: 'kubernetes', createdAt: '2023-01-01T00:00:00Z' },
  { id: '14', name: 'Rust', slug: 'rust', createdAt: '2023-01-01T00:00:00Z' },
  { id: '15', name: 'Go', slug: 'go', createdAt: '2023-01-01T00:00:00Z' },
  { id: '16', name: 'Bug Bounty', slug: 'bug-bounty', createdAt: '2023-01-01T00:00:00Z' },
  { id: '17', name: 'CTF', slug: 'ctf', createdAt: '2023-01-01T00:00:00Z' },
  { id: '18', name: 'OSINT', slug: 'osint', createdAt: '2023-01-01T00:00:00Z' },
];

const tagMap = new Map(tags.map(t => [t.id, t]));
const authorMap = new Map(authors.map(a => [a.id, a]));
const categoryMap = new Map(categories.map(c => [c.id, c]));

function getTags(tagIds: string[]): Tag[] {
  return tagIds.map(id => tagMap.get(id)!).filter(Boolean);
}

function getAuthor(authorId: string): Author {
  return authorMap.get(authorId)!;
}

function getCategory(categoryId: string): Category {
  return categoryMap.get(categoryId)!;
}

export const posts: PostWithRelations[] = [
  {
    id: '1',
    slug: 'finding-xss-in-popular-react-library',
    title: 'Finding a Stored XSS in a Popular React Component Library',
    description: 'A deep dive into how I discovered a stored XSS vulnerability affecting 500k+ weekly downloads, the responsible disclosure process, and lessons learned for secure component design.',
    content: `# Finding a Stored XSS in a Popular React Component Library

## Introduction

Last month, while auditing a widely-used React component library for a client project, I stumbled upon a stored Cross-Site Scripting (XSS) vulnerability that had been hiding in plain sight for over two years.

## The Vulnerability

The library provided a \`MarkdownRenderer\` component that allowed users to render markdown content. The issue was in how it handled HTML sanitization...

\`\`\`jsx
// Vulnerable code
function MarkdownRenderer({ content }) {
  const html = markdownToHtml(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
\`\`\`

The library used a popular sanitization library but had misconfigured it to allow \`data-\` attributes, which led to the bypass.

## The Exploit

An attacker could craft markdown like:

\`\`\`markdown
![image](x onerror=alert(1) data-x=")
\`\`\`

This would execute JavaScript in the context of any application using the component.

## Responsible Disclosure

1. **Day 1**: Reported to maintainers via GitHub Security Advisory
2. **Day 3**: Maintainers acknowledged and began working on a fix
3. **Day 7**: Patch released in v3.2.1
4. **Day 14**: Public disclosure after users had time to update

## Lessons Learned

1. **Never trust \`dangerouslySetInnerHTML\`** - Even with sanitization
2. **Audit your dependencies** - Regular security reviews are essential
3. **Use Content Security Policy** - Defense in depth matters
4. **Test with real attack vectors** - Automated tools miss context-specific issues

## Conclusion

This vulnerability affected over 500,000 weekly downloads. The fix was straightforward, but the impact could have been massive. Always sanitize, always validate, and never assume a popular library is immune to security issues.`,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
    authorId: '1',
    categoryId: '1',
    tagIds: ['1', '16'],
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 12,
    viewCount: 15420,
    featured: true,
    trending: true,
    status: 'published',
    seoTitle: 'Finding Stored XSS in Popular React Library - HCO',
    seoDescription: 'Deep dive into discovering a stored XSS vulnerability in a React component library with 500k+ weekly downloads.',
    author: getAuthor('1'),
    category: getCategory('1'),
    tags: getTags(['1', '16']),
  },
  {
    id: '2',
    slug: 'zero-knowledge-proofs-explained',
    title: 'Zero-Knowledge Proofs: A Practical Introduction for Developers',
    description: 'Understanding ZK-SNARKs, ZK-STARKs, and how to integrate zero-knowledge proofs into your applications without a PhD in mathematics.',
    content: `# Zero-Knowledge Proofs: A Practical Introduction

## What Are Zero-Knowledge Proofs?

A zero-knowledge proof allows one party (the prover) to convince another party (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.

## Types of ZK Proofs

### ZK-SNARKs
- Succinct Non-interactive Argument of Knowledge
- Requires trusted setup
- Small proof size (~200 bytes)
- Fast verification

### ZK-STARKs
- Scalable Transparent Argument of Knowledge
- No trusted setup required
- Larger proof size (~50-100 KB)
- Quantum resistant

## Practical Example: Private Voting

\`\`\`rust
// Simplified circuit for private voting
fn voting_circuit(
    vote: bool,      // Private input
    nullifier: u64,  // Private input
    commitment: u64, // Public input
) -> bool {
    // Verify the vote is valid (0 or 1)
    // Verify nullifier hasn't been used
    // Verify commitment matches
    true
}
\`\`\`

## Getting Started

1. **Learn Circom** - Circuit language for ZK-SNARKs
2. **Try snarkjs** - JavaScript library for proof generation
3. **Explore RISC Zero** - ZK virtual machine for general computation
4. **Join the community** - ZK Hack, zkSummit, and more

## Resources

- [Zero Knowledge Proofs for Beginners](https://zkdocs.com)
- [Circom Documentation](https://docs.circom.io)
- [RISC Zero](https://risc0.com)

The field is moving fast. What seemed impossible two years ago is now production-ready.`,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    authorId: '2',
    categoryId: '3',
    tagIds: ['7', '8'],
    publishedAt: '2024-01-10T14:30:00Z',
    readingTime: 18,
    viewCount: 8930,
    featured: false,
    trending: true,
    status: 'published',
    seoTitle: 'Zero-Knowledge Proofs Practical Guide - HCO',
    seoDescription: 'Learn ZK-SNARKs, ZK-STARKs, and how to integrate zero-knowledge proofs into applications.',
    author: getAuthor('2'),
    category: getCategory('3'),
    tags: getTags(['7', '8']),
  },
  {
    id: '3',
    slug: 'reverse-engineering-malware-with-ghidra',
    title: 'Reverse Engineering Modern Malware with Ghidra: A Hands-On Guide',
    description: 'Step-by-step walkthrough of analyzing a real-world malware sample using Ghidra, including anti-analysis techniques and extraction of IOCs.',
    content: `# Reverse Engineering Modern Malware with Ghidra

## Setting Up Ghidra

Download from [ghidra-sre.org](https://ghidra-sre.org) and ensure you have JDK 17+ installed.

## Sample Analysis: Lumma Stealer

We'll analyze a recent Lumma Stealer sample (SHA256: \`a1b2c3d4...\`).

### Initial Triage

\`\`\`bash
$ file sample.exe
sample.exe: PE32+ executable (GUI) x86-64, for MS Windows

$ strings sample.exe | head -20
...
kernel32.dll
advapi32.dll
crypt32.dll
...
\`\`\`

### Anti-Analysis Techniques

The sample employs several anti-analysis techniques:

1. **VM Detection** - Checks for VMware, VirtualBox artifacts
2. **Debugger Detection** - \`IsDebuggerPresent\`, \`CheckRemoteDebuggerPresent\`
3. **Timing Checks** - RDTSC-based timing analysis

\`\`\`c
// Decompiled anti-VM check
BOOL CheckVM() {
    HKEY hKey;
    RegOpenKeyExA(HKEY_LOCAL_MACHINE,
        "SYSTEM\\\\CurrentControlSet\\\\Services\\\\Disk\\\\Enum",
        0, KEY_READ, &hKey);
    // Checks for "VMware", "VBOX", "QEMU" in device names
}
\`\`\`

### Extracting IOCs

Using Ghidra's script manager, we can automate IOC extraction:

\`\`\`python
# Ghidra Python script
from ghidra.app.decompiler import DecompInterface
from ghidra.util.task import ConsoleTaskMonitor

def extract_strings():
    # Extract all strings and filter for URLs, IPs, domains
    pass
\`\`\`

## Conclusion

Ghidra has become an indispensable tool for malware analysis. Its decompiler, scripting capabilities, and active community make it a viable alternative to commercial tools.`,
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&h=600&fit=crop',
    authorId: '3',
    categoryId: '4',
    tagIds: ['9', '17'],
    publishedAt: '2024-01-08T09:15:00Z',
    readingTime: 22,
    viewCount: 12100,
    featured: false,
    trending: false,
    status: 'published',
    seoTitle: 'Reverse Engineering Malware with Ghidra - HCO',
    seoDescription: 'Hands-on guide to analyzing malware samples using Ghidra, including anti-analysis techniques and IOC extraction.',
    author: getAuthor('3'),
    category: getCategory('4'),
    tags: getTags(['9', '17']),
  },
  {
    id: '4',
    slug: 'kubernetes-security-best-practices-2024',
    title: 'Kubernetes Security Best Practices for 2024',
    description: 'Essential security configurations, policies, and tools to secure your Kubernetes clusters in production.',
    content: `# Kubernetes Security Best Practices for 2024

## Cluster Hardening

### 1. Control Plane Security

\`\`\`yaml
# Audit policy
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]
  - level: RequestResponse
    resources:
      - group: ""
        resources: ["pods/exec", "pods/portforward"]
\`\`\`

### 2. Network Policies

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
\`\`\`

## Runtime Security

- **Falco** - Runtime threat detection
- **Tracee** - eBPF-based runtime security
- **KubeArmor** - Cloud-native runtime enforcement

## Supply Chain Security

- **Sigstore/Cosign** - Container signing
- **SBOM** - Software Bill of Materials with Syft
- **Admission Controllers** - Kyverno, OPA Gatekeeper

## Monitoring & Compliance

- **kube-bench** - CIS Benchmark checks
- **kube-hunter** - Penetration testing
- **Popeye** - Cluster sanitizer

Security is a journey, not a destination.`,
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c4bae02c9?w=1200&h=600&fit=crop',
    authorId: '4',
    categoryId: '6',
    tagIds: ['12', '13'],
    publishedAt: '2024-01-05T16:45:00Z',
    readingTime: 15,
    viewCount: 9870,
    featured: false,
    trending: true,
    status: 'published',
    seoTitle: 'Kubernetes Security Best Practices 2024 - HCO',
    seoDescription: 'Essential security configurations, policies, and tools to secure Kubernetes clusters in production.',
    author: getAuthor('4'),
    category: getCategory('6'),
    tags: getTags(['12', '13']),
  },
  {
    id: '5',
    slug: 'secure-coding-rust-ownership-borrowing',
    title: 'Secure Coding in Rust: Leveraging Ownership and Borrowing',
    description: 'How Rust\'s ownership model prevents common vulnerabilities like use-after-free, double-free, and data races at compile time.',
    content: `# Secure Coding in Rust

## Memory Safety Without Garbage Collection

Rust achieves memory safety through its ownership system:

1. **Each value has a single owner**
2. **Ownership can be transferred (move semantics)**
3. **References are either mutable XOR shared**

## Preventing Use-After-Free

\`\`\`rust
// This won't compile - use after move
fn main() {
    let s = String::from("hello");
    let s2 = s; // ownership moved
    println!("{}", s); // ERROR: borrow of moved value
}
\`\`\`

## Preventing Data Races

\`\`\`rust
// This won't compile - mutable and immutable references coexist
fn main() {
    let mut data = vec![1, 2, 3];
    let r1 = &data;
    let r2 = &mut data; // ERROR: cannot borrow as mutable
    println!("{:?}", r1);
}
\`\`\`

## Real-World Impact

These compile-time guarantees eliminate entire classes of vulnerabilities:
- Buffer overflows
- Use-after-free
- Double-free
- Data races
- Null pointer dereferences

## Further Reading

- [The Rust Book](https://doc.rust-lang.org/book/)
- [Rust Security Guidelines](https://anssi-fr.github.io/rust-guide/)
- [Rust Sec](https://rustsec.org/) - Security advisories`,
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=600&fit=crop',
    authorId: '1',
    categoryId: '7',
    tagIds: ['14'],
    publishedAt: '2024-01-03T11:20:00Z',
    readingTime: 10,
    viewCount: 7650,
    featured: false,
    trending: false,
    status: 'published',
    seoTitle: 'Secure Coding in Rust Ownership Borrowing - HCO',
    seoDescription: 'How Rust ownership model prevents vulnerabilities like use-after-free, double-free, and data races at compile time.',
    author: getAuthor('1'),
    category: getCategory('7'),
    tags: getTags(['14']),
  },
  {
    id: '6',
    slug: 'breaking-into-cybersecurity-career-guide',
    title: 'Breaking Into Cybersecurity: A 2024 Career Guide',
    description: 'Roadmap for transitioning into cybersecurity, including certifications, hands-on practice, networking, and landing your first role.',
    content: `# Breaking Into Cybersecurity: 2024 Career Guide

## Choose Your Path

Cybersecurity is broad. Common entry paths:

1. **Offensive Security** - Penetration testing, red teaming, bug bounty
2. **Defensive Security** - SOC analyst, incident response, threat hunting
3. **Application Security** - Code review, secure SDLC, DevSecOps
4. **Cloud Security** - AWS/Azure/GCP security, container security
5. **Governance/Risk/Compliance** - Policy, audit, compliance frameworks

## Recommended Certifications (2024)

### Entry Level
- **CompTIA Security+** - Foundation knowledge
- **eJPT** - Practical penetration testing
- **CEH Practical** - Hands-on ethical hacking

### Intermediate
- **OSCP** - Gold standard for pentesting
- **eCPPTv2** - Advanced penetration testing
- **CCNA Security** - Network security focus

### Specialized
- **OSWE** - Web application security
- **OSEP** - Evasion techniques
- **AWS/Azure Security Specialty**

## Hands-On Practice Platforms

- **Hack The Box** - Real-world scenarios
- **TryHackMe** - Guided learning paths
- **PortSwigger Web Security Academy** - Web app security
- **Pwn.college** - Binary exploitation
- **Root-Me** - Diverse challenges

## Building Your Portfolio

1. **Write writeups** - Document your learning
2. **Contribute to open source** - Security tools, CTF challenges
3. **Bug bounty** - Start with VDP programs
4. **CTF participation** - Build teamwork skills

## Networking

- **Local meetups** - OWASP, ISSA, (ISC)² chapters
- **Conferences** - DEF CON, Black Hat, BSides
- **Online communities** - Discord, Twitter, LinkedIn
- **Mentorship** - Find experienced practitioners

## Final Advice

**Start now. Learn continuously. Build publicly. Help others.**

The cybersecurity community values demonstrated skills over credentials alone.`,
    coverImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop',
    authorId: '4',
    categoryId: '8',
    tagIds: ['16', '17'],
    publishedAt: '2024-01-01T08:00:00Z',
    readingTime: 14,
    viewCount: 23400,
    featured: false,
    trending: true,
    status: 'published',
    seoTitle: 'Breaking Into Cybersecurity Career Guide 2024 - HCO',
    seoDescription: 'Roadmap for transitioning into cybersecurity including certifications, hands-on practice, and landing your first role.',
    author: getAuthor('4'),
    category: getCategory('8'),
    tags: getTags(['16', '17']),
  },
];

export function getPostBySlug(slug: string): PostWithRelations | undefined {
  return posts.find(p => p.slug === slug);
}

export function getPostsByCategory(categorySlug: string): PostWithRelations[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return posts.filter(p => p.categoryId === category.id && p.status === 'published');
}

export function getFeaturedPosts(): PostWithRelations[] {
  return posts.filter(p => p.featured && p.status === 'published');
}

export function getTrendingPosts(): PostWithRelations[] {
  return posts.filter(p => p.trending && p.status === 'published');
}

export function getLatestPosts(limit = 10): PostWithRelations[] {
  return posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getRelatedPosts(postId: string, limit = 3): PostWithRelations[] {
  const post = posts.find(p => p.id === postId);
  if (!post) return [];
  
  return posts
    .filter(p => p.id !== postId && p.status === 'published' && 
      (p.categoryId === post.categoryId || p.tagIds.some(t => post.tagIds.includes(t))))
    .slice(0, limit);
}

export function searchPosts(query: string): PostWithRelations[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(p => 
    p.status === 'published' &&
    (p.title.toLowerCase().includes(lowerQuery) ||
     p.description.toLowerCase().includes(lowerQuery) ||
     p.content.toLowerCase().includes(lowerQuery) ||
     p.tags.some(t => t.name.toLowerCase().includes(lowerQuery)) ||
     p.category.name.toLowerCase().includes(lowerQuery) ||
     p.author.name.toLowerCase().includes(lowerQuery))
  );
}