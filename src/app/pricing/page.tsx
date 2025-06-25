
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user-context';

export default function PricingPage() {
  const { toast } = useToast();
  const { user, plans, isLoggedIn } = useUser();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on the home page, navigate and then scroll.
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="container mx-auto py-16 md:py-24 px-4 max-w-6xl opacity-0 animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Choose Your Perfect Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Simple, transparent pricing for Imagen BrainAi. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
        {plans.map((plan) => {
          const isCurrentPlan = user.plan === plan.name;
          return (
          <Card
            key={plan.name}
            className={`flex flex-col h-full border hover:border-primary transition-all hover:scale-105 hover:shadow-lg ${isCurrentPlan && plan.name !== 'Free' ? 'border-primary border-2 shadow-lg' : ''}`}
          >
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.priceSuffix && (
                    <span className="text-muted-foreground">{plan.priceSuffix}</span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
               {isCurrentPlan && plan.name !== 'Free' ? (
                  <Button className="w-full" disabled variant="default">Current Plan</Button>
                ) : plan.name === 'Free' ? (
                 <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleScrollTo('create')}
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                <Button asChild className="w-full" variant={'outline'}>
                  <Link href={plan.polarLink!} target="_blank" rel="noopener noreferrer" onClick={() => {
                        if (!isLoggedIn) {
                          toast({ title: "Email Activation Required", description: "Please activate with your email first before purchasing.", variant: 'destructive'});
                        }
                      }}>
                    {plan.buttonText}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        )})}
      </div>
    </div>
  );
}
