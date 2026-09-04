'use client';

import { cn } from '@/lib/utils';

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div className={cn('prose prose-invert prose-purple max-w-none', className)}>
      {children}
    </div>
  );
}

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4;
}

export function Heading({ level, children, className, id, ...props }: HeadingProps) {
  const sizes = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
  };

  if (level === 1) {
    return (
      <h1
        id={id}
        className={cn('font-semibold tracking-tight text-foreground', sizes[1], className)}
        {...props}
      >
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2
        id={id}
        className={cn('font-semibold tracking-tight text-foreground', sizes[2], className)}
        {...props}
      >
        {children}
      </h2>
    );
  }
  if (level === 3) {
    return (
      <h3
        id={id}
        className={cn('font-semibold tracking-tight text-foreground', sizes[3], className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
  return (
    <h4
      id={id}
      className={cn('font-semibold tracking-tight text-foreground', sizes[4], className)}
      {...props}
    >
      {children}
    </h4>
  );
}

export function Lead({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-lg text-muted-foreground font-normal', className)} {...props}>
      {children}
    </p>
  );
}

export function Muted({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('text-muted-foreground', className)} {...props}>
      {children}
    </span>
  );
}

export function Highlight({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <mark className={cn('bg-primary/20 text-primary px-1 rounded', className)} {...props}>
      {children}
    </mark>
  );
}

export function CodeInline({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code className={cn('bg-muted px-1.5 py-0.5 rounded text-sm font-mono', className)} {...props}>
      {children}
    </code>
  );
}