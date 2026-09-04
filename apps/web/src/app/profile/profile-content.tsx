'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@hco/shared';
import { User as UserIcon, Lock, Bookmark, Settings, LogOut, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type Notice = { kind: 'success' | 'error'; text: string } | null;

export function ProfileContent({ user, profile }: { user: User; profile: Profile | null }) {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Display data — prefer the profiles row, fall back to auth metadata.
  // ---------------------------------------------------------------------------
  const metaName = (user.user_metadata?.full_name ?? user.user_metadata?.name) as string | undefined;
  const displayName =
    profile?.display_name?.trim() || metaName || user.email?.split('@')[0] || 'HCO Member';
  const email = user.email ?? '';
  const avatarUrl =
    profile?.avatar_url ??
    ((user.user_metadata?.avatar_url ?? user.user_metadata?.picture) as string | undefined);
  const role = profile?.role ?? null;
  const username = profile?.username ?? null;
  const bio = profile?.bio || '';
  const joinedAt = profile?.created_at ?? user.created_at ?? new Date().toISOString();

  // ---------------------------------------------------------------------------
  // Edit form state
  // ---------------------------------------------------------------------------
  const [displayNameInput, setDisplayNameInput] = useState(displayName);
  const [usernameInput, setUsernameInput] = useState(username ?? '');
  const [bioInput, setBioInput] = useState(bio);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setNotice(null);

    try {
      const supabase = createClient();

      // Only editable columns are sent. id must match the session user, and
      // role/created_at are intentionally omitted so RLS keeps them intact.
      const { error } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            display_name: displayNameInput.trim(),
            username: usernameInput.trim() || null,
            bio: bioInput.trim(),
            avatar_url: avatarUrl ?? null,
          },
          { onConflict: 'id' }
        );

      if (error) {
        const text = /duplicate key/i.test(error.message)
          ? 'That username is already taken.'
          : error.message || 'Could not save your profile. Please try again.';
        setNotice({ kind: 'error', text });
        return;
      }

      setNotice({ kind: 'success', text: 'Profile saved.' });
      // Re-fetch the profiles row on the server so headers/overview update.
      router.refresh();
    } catch {
      setNotice({ kind: 'error', text: 'Something went wrong while saving. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
      <div className="container-narrow">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <Avatar className="h-24 w-24 flex-shrink-0">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
                  <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{displayName}</h1>
                    {role === 'admin' && <Badge variant="secondary">Admin</Badge>}
                  </div>
                  <p className="text-muted-foreground">{email}</p>
                  {username && (
                    <p className="text-sm font-mono text-muted-foreground">@{username}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since{' '}
                    {new Date(joinedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-center lg:justify-end">
                  <Button variant="outline" onClick={() => { void handleSignOut(); }} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar Navigation */}
            <aside className="space-y-4">
              <nav aria-label="Profile navigation">
                <ul className="space-y-1" role="list">
                  {[
                    { href: '#overview', label: 'Overview', icon: UserIcon },
                    { href: '#settings', label: 'Settings', icon: Settings },
                    { href: '#bookmarks', label: 'Bookmarks', icon: Bookmark },
                    { href: '#security', label: 'Security', icon: Lock },
                  ].map((item) => (
                    <li key={item.href}>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                        aria-label={item.label}
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Overview */}
              <section id="overview" aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-2xl font-bold mb-6">Overview</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Articles Read</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Bookmarks</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Comments</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Stats will populate once comments and bookmarks are connected to the database.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {bioInput || 'No bio yet. Add one in Settings below.'}
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Settings */}
              <section id="settings" aria-labelledby="settings-heading">
                <h2 id="settings-heading" className="text-2xl font-bold mb-6">Account Settings</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Saved to your profile — only you can change your own information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="profile-display-name" className="block text-sm font-medium mb-1">Display Name</label>
                        <Input
                          id="profile-display-name"
                          value={displayNameInput}
                          onChange={(e) => setDisplayNameInput(e.target.value)}
                          maxLength={80}
                          placeholder="Your display name"
                        />
                      </div>
                      <div>
                        <label htmlFor="profile-username" className="block text-sm font-medium mb-1">Username</label>
                        <Input
                          id="profile-username"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          maxLength={30}
                          placeholder="username (optional)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Public handle — must be unique. No spaces or special characters.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="profile-email" className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={email}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Managed by your Google account.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="profile-bio" className="block text-sm font-medium mb-1">Bio</label>
                      <textarea
                        id="profile-bio"
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        maxLength={500}
                        rows={4}
                        placeholder="Tell the community about yourself…"
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                      />
                    </div>

                    {notice && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-md text-sm ${
                          notice.kind === 'success'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                            : 'bg-destructive/10 border border-destructive/20 text-destructive'
                        }`}
                        role="alert"
                      >
                        {notice.kind === 'success' ? (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        {notice.text}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Button onClick={() => { void handleSave(); }} disabled={isSaving} className="gap-2">
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : null}
                        {isSaving ? 'Saving…' : 'Save Changes'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { id: 'email-digest', label: 'Weekly Digest', description: 'Receive a weekly summary of new articles' },
                      { id: 'email-comments', label: 'Comment Replies', description: 'Get notified when someone replies to your comments' },
                      { id: 'email-mentions', label: 'Mentions', description: 'Get notified when you are mentioned' },
                      { id: 'email-security', label: 'Security Alerts', description: 'Receive important security announcements' },
                    ].map((notification) => (
                      <label key={notification.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{notification.label}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                          disabled
                        />
                      </label>
                    ))}
                  </CardContent>
                </Card>
              </section>

              {/* Bookmarks */}
              <section id="bookmarks" aria-labelledby="bookmarks-heading">
                <h2 id="bookmarks-heading" className="text-2xl font-bold mb-6">Bookmarked Articles</h2>
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-4">Start reading articles and bookmark your favorites to see them here.</p>
                    <Button variant="outline" asChild>
                      <a href="/blog">Browse Articles</a>
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* Security */}
              <section id="security" aria-labelledby="security-heading">
                <h2 id="security-heading" className="text-2xl font-bold mb-6">Security</h2>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      You sign in with Google, so no password is stored by HCO.
                    </p>
                    <Button variant="outline" className="gap-2" disabled>
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Password management will be available in a later phase.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                    <Button variant="outline" className="gap-2" disabled>
                      <Settings className="h-4 w-4" />
                      Enable 2FA
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      2FA will be available in a later phase.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" disabled>Delete Account</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Account deletion will be available in a later phase.
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
