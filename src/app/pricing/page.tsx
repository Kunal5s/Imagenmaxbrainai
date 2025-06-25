
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: '',
    description: 'For starters and hobbyists.',
    features: [
      '10 generations per day',
      'Standard Quality (1080p)',
      'Access to core models',
      'Personal use license',
    ],
    buttonText: 'Start Generating',
    buttonLink: '/#create',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$50',
    priceSuffix: '/ month',
    description: 'For professionals and creators.',
    features: [
      '3,000 credits per month',
      'Fast generation speed',
      '4K Ultra-High Quality',
      'Access to all AI models',
      'Commercial use license',
      'Priority support',
    ],
    buttonText: 'Current Plan',
    buttonLink: '#',
    highlighted: true,
  },
  {
    name: 'Mega',
    price: '$100',
    priceSuffix: '/ month',
    description: 'For power users and teams.',
    features: [
      '10,000 credits per month',
      'Lightning-fast speed',
      '4K Ultra-High Quality',
      'API access (coming soon)',
      'Team collaboration features',
      'Dedicated support',
    ],
    buttonText: 'Switch to Mega',
    buttonLink: '#',
    highlighted: false,
  },
  {
    name: 'Booster Pack',
    price: '$20',
    priceSuffix: 'one-time',
    description: 'Add-on credit top-up.',
    features: [
      '1,000 credits',
      'Immediately fast generation',
      'Credits never expire',
    ],
    buttonText: 'Purchase',
    buttonLink: '#',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4 max-w-6xl opacity-0 animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Choose Your Perfect Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Simple, transparent pricing for Imagen BrainAi. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col h-full border hover:border-primary transition-all hover:scale-105 hover:shadow-lg ${plan.highlighted ? 'border-primary shadow-md' : ''}`}
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
              {plan.highlighted ? (
                <Button className="w-full" variant="default" disabled>
                  {plan.buttonText}
                </Button>
              ) : (
                <Button asChild className="w-full" variant="outline">
                  <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
