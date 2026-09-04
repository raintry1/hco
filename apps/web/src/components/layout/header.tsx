import Link from 'next/link';
import { MainNav, AuthButtons } from '@/components/navigation/main-nav';
import { MobileMenu } from '@/components/navigation/mobile-menu';
import { siteConfig } from '@/lib/site-config';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Hackers Colony Official - Home">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">
            HCO
          </span>
          <span className="hidden sm:inline text-sm text-muted-foreground">Hackers Colony Official</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          <MainNav />
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <AuthButtons />
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}