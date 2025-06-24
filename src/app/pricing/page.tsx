import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For starters and hobbyists.',
    features: [
      '10 credits per month (10 generations)',
      'Standard speed & quality (1080p)',
      'Access to core models',
      'Personal use license',
    ],
    buttonText: 'Start Generating',
    buttonLink: '/#create',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$25',
    description: 'For professionals and creators.',
    features: [
      '1,000 credits per month (~50 generations)',
      'Fast generation speed',
      'Premium quality (up to 8K)',
      'Access to all AI models',
      'Commercial use license',
      'Priority support',
    ],
    buttonText: 'Upgrade to Pro',
    buttonLink: '#',
    highlighted: true,
  },
  {
    name: 'Mega',
    price: '$50',
    description: 'For power users and teams.',
    features: [
      '3,000 credits per month (~200 generations)',
      'Lightning-fast speed',
      'Premium quality (up to 8K)',
      'API access (coming soon)',
      'Team collaboration features',
      'Dedicated support',
    ],
    buttonText: 'Upgrade to Mega',
    buttonLink: '#',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl opacity-0 animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">Choose Your Perfect Plan</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Simple, transparent pricing for Imagen BrainAi. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all hover:scale-105 ${plan.highlighted ? 'border-primary ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`}
          >
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/ month</span>
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
              <Button asChild className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                <Link href={plan.buttonLink}>{plan.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
