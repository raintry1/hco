import { Metadata } from 'next';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the Hackers Colony Official weekly newsletter.',
};

const email = siteConfig.links.email.replace('mailto:', '');

export default function NewsletterPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const subscribedEmail =
    typeof searchParams.email === 'string' ? searchParams.email : '';

  return (
    <div className="min-h-screen py-16 lg:py-24">
      <div className="container-narrow max-w-2xl">
        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-primary/20">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Weekly Newsletter
            </div>
            {subscribedEmail ? (
              <>
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" aria-hidden="true" />
                <h1 className="text-3xl font-bold mb-4">You&apos;re on the list!</h1>
                <p className="text-muted-foreground text-lg mb-2">
                  We&apos;ll send fresh security research to{' '}
                  <span className="text-foreground font-medium">{subscribedEmail}</span> every week.
                </p>
                <p className="text-sm text-muted-foreground">
                  Full automation is coming soon — until then, you can also reach us at{' '}
                  <a className="underline hover:text-foreground" href={siteConfig.links.email}>{email}</a>.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  Stay Updated with the Latest Security Research
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  Curated articles, vulnerability writeups, and career advice — weekly, no spam.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/newsletter" method="GET">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    type="email"
                    id="newsletter-email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-md border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
