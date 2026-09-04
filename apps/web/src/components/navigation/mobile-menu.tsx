'use client';

import * as React from 'react';
import { X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MainNav, AuthButtons } from './main-nav';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

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

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background" role="dialog" aria-modal="true" id="mobile-menu" style={{ backgroundColor: 'hsl(var(--background))' }}>
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
              <MainNav />
              <div className="mt-6 border-t pt-4">
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}