'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';

interface PostViewCounterProps {
  postId: string;
  initialCount: number;
}

/**
 * Displays a post's view count and records exactly one view per page visit.
 *
 * - Fires once per mounted visit (useRef guard): React re-renders and the
 *   StrictMode double-mount can never trigger a second request.
 * - A fresh page load, refresh, or navigate-away-and-back creates a new
 *   component instance, so each of those counts as another visit.
 * - The displayed count is updated to the real value returned by the
 *   server-side increment (never faked locally).
 * - On failure the article still renders: the count simply stays at the
 *   server-rendered value and the error is logged, not thrown.
 */
export function PostViewCounter({ postId, initialCount }: PostViewCounterProps) {
  const [count, setCount] = useState(initialCount);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch(`/api/content/posts/${postId}/view`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`view endpoint responded ${res.status}`);
        }
        return res.json() as Promise<{ viewCount: number }>;
      })
      .then((data) => {
        if (typeof data.viewCount === 'number') {
          setCount(data.viewCount);
        }
      })
      .catch((err) => {
        // A view-count failure must never break the article page.
        console.warn('[views] failed to record view; article still renders.', err);
      });
  }, [postId]);

  return (
    <span className="flex items-center gap-1">
      <Eye className="h-4 w-4" aria-hidden="true" />
      {count.toLocaleString()} views
    </span>
  );
}