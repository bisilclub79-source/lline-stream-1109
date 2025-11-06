'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container py-12 text-center">Loading account details...</div>;
  }

  if (!user) {
    // This should be handled by a middleware in a real app
    return <div className="container py-12 text-center">Please log in to view your account.</div>;
  }
  
  const subscriptionEndDate = user.subscription ? new Date(user.subscription.endDate).toLocaleDateString() : 'N/A';

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="mb-8 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photoURL} alt={user.displayName} />
          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" defaultValue={user.displayName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              {user.subscription ? (
                <div className="space-y-4">
                  <p><strong>Plan:</strong> {user.subscription.planId === 'sub-monthly' ? 'Monthly' : 'Yearly'}</p>
                  <p><strong>Status:</strong> <span className="capitalize text-primary font-semibold">{user.subscription.status}</span></p>
                  <p><strong>Renews/Expires on:</strong> {subscriptionEndDate}</p>
                  <div className="flex gap-4 pt-4">
                    <Button>Change Plan</Button>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>You are not currently subscribed to any plan.</p>
                  <Button className="mt-4">View Plans</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past payments and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would be a table of payments */}
              <p className="text-muted-foreground">No billing history found.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Balance & History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
                <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-4xl font-bold text-primary">{user.tokens.balance}</p>
                </div>
                <Button>Buy More Tokens</Button>
              </div>
              <Separator className="my-6" />
              <h3 className="font-semibold mb-4">Purchase History</h3>
              {user.tokens.purchaseHistory.length > 0 ? (
                 <div className="space-y-2">
                    {user.tokens.purchaseHistory.map((purchase, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <p>Purchased {purchase.amount} tokens</p>
                            <p className="text-muted-foreground">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                 </div>
              ) : (
                <p className="text-muted-foreground text-sm">No token purchases yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
