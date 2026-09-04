'use client';

import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const share = (platform: 'twitter' | 'linkedin' | 'copy') => {
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-sm text-muted-foreground">Share:</span>
      <Button variant="outline" size="sm" onClick={() => share('twitter')}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => share('linkedin')}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      <Button variant="outline" size="sm" onClick={() => share('copy')}>
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  );
}