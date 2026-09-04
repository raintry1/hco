'use client';

import { useState } from 'react';
import { User, Mail, Lock, Calendar, Bookmark, Settings, LogOut, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getInitials } from '@/lib/utils';

const mockUser = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  role: 'Security Researcher',
  bio: 'Senior Security Researcher specializing in web application security and bug bounty hunting.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  joinedAt: '2023-01-15T00:00:00Z',
  stats: {
    articlesRead: 47,
    bookmarks: 12,
    comments: 8,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    bio: mockUser.bio,
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      bio: mockUser.bio,
    });
    setIsEditing(false);
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
                  <AvatarImage src={mockUser.avatar} alt="" />
                  <AvatarFallback className="text-3xl">{getInitials(mockUser.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{formData.name}</h1>
                    {mockUser.role && (
                      <Badge variant="secondary">{mockUser.role}</Badge>
                    )}
                    {isEditing && (
                      <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Cancel editing">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-muted-foreground">{formData.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {new Date(mockUser.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => {}} className="gap-2">
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
                    { href: '#overview', label: 'Overview', icon: User },
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
                        <p className="text-3xl font-bold">{mockUser.stats.articlesRead}</p>
                        <p className="text-sm text-muted-foreground">Articles Read</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">{mockUser.stats.bookmarks}</p>
                        <p className="text-sm text-muted-foreground">Bookmarks</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <p className="text-3xl font-bold">{mockUser.stats.comments}</p>
                        <p className="text-sm text-muted-foreground">Comments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full min-h-[100px] p-3 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    ) : (
                      <p className="text-muted-foreground whitespace-pre-wrap">{formData.bio || 'No bio yet. Edit your profile to add one.'}</p>
                    )}
                  </CardContent>
                </Card>
              </section>

              {/* Settings */}
              <section id="settings" aria-labelledby="settings-heading">
                <h2 id="settings-heading" className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="profile-name" className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          id="profile-name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label htmlFor="profile-email" className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          id="profile-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="profile-bio" className="block text-sm font-medium mb-1">Bio</label>
                      <textarea
                        id="profile-bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full min-h-[100px] p-3 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                        disabled={!isEditing}
                      />
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
                          disabled={!isEditing}
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
                      Your password was last updated on January 15, 2024.
                    </p>
                    <Button variant="outline" className="gap-2" disabled>
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Password change will be available in Phase 2 with Supabase Auth integration.
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
                      2FA will be available in Phase 2 with Supabase Auth integration.
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
                      Account deletion will be available in Phase 2.
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