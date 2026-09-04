'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Category } from '@hco/shared';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Lock, Cpu, Bug, Server, Code, Briefcase } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'compact';
}

function getCategoryIcon(iconName: string) {
  const icons: Record<string, React.ElementType> = {
    shield: Shield,
    globe: Globe,
    lock: Lock,
    cpu: Cpu,
    bug: Bug,
    server: Server,
    code: Code,
    briefcase: Briefcase,
  };
  return icons[iconName] || Shield;
}

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const isCompact = variant === 'compact';
  const Icon = getCategoryIcon(category.icon || 'shield');

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'group',
        isCompact ? 'flex items-center gap-3 p-3' : 'block'
      )}
      aria-label={`Browse ${category.name} articles`}
    >
      <Card className={cn('h-full transition-all hover:shadow-md', isCompact ? 'flex items-center p-0' : '')}>
        <CardContent className={cn('pt-6', isCompact ? 'p-4' : 'p-6')}>
          {!isCompact && (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${category.color}20` }}
              aria-hidden="true"
            >
              <Icon className="h-6 w-6" style={{ color: category.color }} />
            </div>
          )}
          <div className={cn('flex items-center gap-3', !isCompact && 'flex-col text-center')}>
            {isCompact && (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${category.color}20` }}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" style={{ color: category.color }} />
              </div>
            )}
            <div>
              <h3 className={cn('font-semibold', !isCompact ? 'text-lg' : 'text-base')}>
                {category.name}
              </h3>
              {category.description && (
                <p className={cn('text-muted-foreground text-sm mt-1', isCompact ? 'hidden sm:block' : '')}>
                  {category.description}
                </p>
              )}
              <div className={cn('flex items-center gap-2 mt-2 text-sm text-muted-foreground', isCompact && 'mt-1')}>
                <span>{category.postCount || 0} posts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} variant="compact" />
      ))}
    </div>
  );
}