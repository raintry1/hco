import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect('/login');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
      {children}
    </div>
  );
}
