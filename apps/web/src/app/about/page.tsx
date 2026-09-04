import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Code, Users, BookOpen, ArrowRight, Globe, Lock, Cpu, Bug, Server, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Hackers Colony Official - our mission, values, and the community behind the platform.',
};

const values = [
  { icon: Shield, title: 'Security First', description: 'We prioritize security in everything we do, from code to community.' },
  { icon: Code, title: 'Open Knowledge', description: 'Knowledge should be accessible. We share openly and learn together.' },
  { icon: Users, title: 'Community Driven', description: 'Built by practitioners, for practitioners. No gatekeeping.' },
  { icon: BookOpen, title: 'Continuous Learning', description: 'The threat landscape evolves. So do we. Always learning, always growing.' },
];

const team = [
  { name: 'Alex Chen', role: 'Founder & Security Researcher', bio: 'Former red teamer, bug bounty hunter, and open source contributor.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
  { name: 'Maria Rodriguez', role: 'Cryptography Lead', bio: 'PhD in Cryptography. ZK-proof researcher and privacy advocate.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
  { name: 'James Park', role: 'Malware Analysis Lead', bio: 'Reverse engineer, DEF CON speaker, and CTF enthusiast.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' },
  { name: 'Sarah Kim', role: 'DevSecOps Lead', bio: 'Kubernetes security specialist, CNCF contributor, pipeline builder.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 lg:py-32 border-b" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Community-driven since 2023
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              About Hackers Colony Official
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              We&apos;re a global community of developers, security researchers, and cybersecurity enthusiasts 
              dedicated to sharing knowledge, discovering vulnerabilities, and building a more secure digital world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login?register=true">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Join the Community
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  Read Articles
                  <BookOpen className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  The cybersecurity landscape is vast and constantly evolving. New vulnerabilities emerge daily, 
                  attack techniques become more sophisticated, and the demand for skilled practitioners continues to grow.
                </p>
                <p>
                  Yet, quality educational content is often scattered, behind paywalls, or outdated. 
                  Hackers Colony Official exists to change that.
                </p>
                <p className="font-semibold text-foreground">
                  We believe that security knowledge should be accessible, practical, and community-driven.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden border bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                <div className="h-full flex items-center justify-center">
                  <Globe className="h-32 w-32 text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">
              These principles guide everything we do, from the articles we publish to the community we build.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-20 lg:py-28">
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What We Cover</h2>
            <p className="text-muted-foreground text-lg">
              From web application security to cryptography, reverse engineering to DevSecOps.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, name: 'Web Security', color: '#ef4444' },
              { icon: Globe, name: 'Network Security', color: '#f97316' },
              { icon: Lock, name: 'Cryptography', color: '#eab308' },
              { icon: Cpu, name: 'Reverse Engineering', color: '#22c55e' },
              { icon: Bug, name: 'Malware Analysis', color: '#a855f7' },
              { icon: Server, name: 'DevOps Security', color: '#06b6d4' },
              { icon: Code, name: 'Secure Programming', color: '#8b5cf6' },
              { icon: Briefcase, name: 'Security Careers', color: '#ec4899' },
            ].map((topic) => (
              <Link
                key={topic.name}
                href="/categories"
                className="p-6 rounded-xl border hover:border-primary/50 transition-colors group text-center"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${topic.color}20` }}>
                  <topic.icon className="h-7 w-7" style={{ color: topic.color }} />
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">{topic.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
        <div className="container-narrow">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Team</h2>
            <p className="text-muted-foreground text-lg">
              Meet the people behind Hackers Colony Official.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/20"
                  />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="container-narrow">
          <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Whether you&apos;re a seasoned researcher or just starting your security journey, 
                there&apos;s a place for you in our community.
              </p>
              <Link href="/login?register=true">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}