'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, Menu } from 'lucide-react';
import { MobileNav, AuthButtons } from './main-nav';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Lock background scrolling while the overlay is open.
  React.useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Auto-close if the viewport grows past the mobile breakpoint, so the menu
  // never stays open (or locks body scroll) behind the desktop navigation.
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The dialog is portaled to <body> so it is a true viewport-level overlay.
  // Rendered inside the sticky <header> — which carries `backdrop-blur` — a
  // `position: fixed` child would resolve against the header, because a
  // non-none backdrop-filter makes it a containing block, and the menu would
  // be clipped to the header's ~64px strip. Portaling keeps the overlay
  // independent of every ancestor layout/stacking/overflow constraint.
  const overlay =
    isOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="md:hidden fixed inset-0 z-[100] bg-background"
            role="dialog"
            aria-modal="true"
            id="mobile-menu"
            style={{ backgroundColor: 'hsl(var(--background))' }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b p-4">
                <span className="font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <MobileNav onNavigate={() => setIsOpen(false)} />
                <div className="mt-6 border-t pt-4">
                  <AuthButtons onNavigate={() => setIsOpen(false)} />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Button>
      {overlay}
    </>
  );
}
