import { getPricingPlans } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default async function PricingPage() {
  const plans = await getPricingPlans();
  const subscriptionPlans = plans.filter(p => p.type === 'subscription');
  const tokenPlans = plans.filter(p => p.type === 'token');

  const subscriptionFeatures = [
    "Unlimited access to subscription videos",
    "Stream on up to 4 devices",
    "HD and 4K streaming",
    "Cancel anytime",
  ];

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:py-16 lg:py-20">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Unlock the best of cinema with our flexible plans.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {/* Subscription Plans */}
        <div>
          <h2 className="text-2xl font-bold text-center font-headline sm:text-3xl">Subscriptions</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {subscriptionPlans.map(plan => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  <ul className="space-y-3 text-sm">
                    {subscriptionFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full font-bold">Choose Plan</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Token Plans */}
        <div>
          <h2 className="text-2xl font-bold text-center font-headline sm:text-3xl">Token Packs</h2>
           <p className="mt-2 text-center text-muted-foreground">
            For premium, on-demand video access.
            </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {tokenPlans.map(plan => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-headline">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-center">
                    <p className="text-5xl font-extrabold text-primary">{plan.tokenAmount}</p>
                    <p className="text-muted-foreground">Tokens</p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                  <p className="text-3xl font-bold">${plan.price}</p>
                  <Button variant="outline" className="w-full font-bold">Purchase</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
