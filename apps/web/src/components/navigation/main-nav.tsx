'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';
import { Button } from '@/components/ui/button';

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
      {siteConfig.navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            pathname === item.href
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2" role="navigation" aria-label="Mobile navigation">
      {siteConfig.navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'px-3 py-2 rounded-md text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            pathname === item.href
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">Sign In</Button>
      </Link>
      <Link href="/login?register=true">
        <Button size="sm">Join</Button>
      </Link>
    </div>
  );
}