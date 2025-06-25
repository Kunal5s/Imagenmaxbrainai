
'use client';

import ImageGenerator from '@/components/image-generator';
import { Button } from '@/components/ui/button';
import { Layers, Palette, Zap, Check } from 'lucide-react';
import type { Plan } from '@/contexts/user-context';
import { useUser } from '@/hooks/use-user-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/utils";
import FAQ from '@/components/faq';

export default function Home() {
  const { toast } = useToast();
  const { user, plans, isLoggedIn, activatePlan, setPlanToPurchase } = useUser();
  
  const handleScrollToCreate = () => {
    const createSection = document.getElementById('create');
    if (createSection) {
        createSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePurchase = (plan: Plan) => {
    if (isLoggedIn) {
      activatePlan(plan.name);
      toast({
          title: `${plan.name} Activated!`,
          description: `Your new credits have been added to your account.`,
      });
      if (plan.polarLink) {
        window.open(plan.polarLink, '_blank');
      }
    } else {
      // Not logged in. Set the plan to purchase and redirect.
      setPlanToPurchase(plan.name);
      if (plan.polarLink) {
        window.open(plan.polarLink, '_blank');
      }
      // Give the user instructions.
      toast({
        title: 'Complete Your Purchase',
        description: "After payment, click 'Activate Plan' in the header and use your email to receive your credits.",
        duration: 9000,
      });
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
       <section className="text-center py-16 lg:py-24 px-4 container mx-auto">
        <div className="opacity-0 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground mb-6">
            Imagen Max BrainAi
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Welcome to the future of digital artistry. Imagen Max BrainAi is a state-of-the-art platform that transforms your text prompts into breathtaking, high-quality images in seconds.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Our advanced AI understands a vast range of styles, moods, and compositions, giving you unparalleled control to bring your imagination to life. Whether you're a professional designer, a creative hobbyist, or just curious, our tools are designed for you.
          </p>
          <Button size="lg" onClick={handleScrollToCreate}>Start Creating Now</Button>
        </div>
      </section>

      <div id="create" className="w-full opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
        <ImageGenerator />
      </div>

       <section className="bg-secondary/30 text-center py-16 lg:py-24 px-4">
         <div className="container mx-auto opacity-0 animate-fadeInUp" style={{animationDelay: '400ms'}}>
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Why Choose Imagen Max BrainAi?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              Our platform is built to empower your creativity with speed, variety, and precision. We provide the tools you need to not just generate Images, but to craft visual stories.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-card p-8 rounded-lg shadow-sm text-center">
                <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Instant Creativity</h3>
                <p className="text-muted-foreground">Go from a simple idea to four stunning visual concepts in seconds. Our high-speed generation process means less waiting and more creating.</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm text-center">
                <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <Layers className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quad-Image Generation</h3>
                <p className="text-muted-foreground">Why settle for one? Get four unique interpretations of your prompt simultaneously. Compare, combine, or simply choose the best fit for your needs.</p>
              </div>
              <div className="bg-card p-8 rounded-lg shadow-sm text-center">
                <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Deep Customization</h3>
                <p className="text-muted-foreground">Become the art director. Fine-tune every aspect of your creation, from the overall artistic style and mood to the specific lighting and color palette.</p>
              </div>
            </div>
         </div>
       </section>

       <section className="text-center py-16 lg:py-24 px-4 container mx-auto">
        <div className="opacity-0 animate-fadeInUp" style={{animationDelay: '600ms'}}>
          <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Choose Your Perfect Plan</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            Simple, transparent pricing for Imagen BrainAi. No hidden fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = user.plan === plan.name;
              return (
                <Card
                  key={plan.name}
                  className={cn(
                    'flex flex-col h-full text-left border hover:border-primary transition-all hover:scale-105 hover:shadow-lg',
                    isLoggedIn && isCurrentPlan && plan.name !== 'Free' ? 'border-primary shadow-lg ring-2 ring-primary' : ''
                  )}
                >
                  <CardHeader>
                    <CardTitle className="font-headline text-3xl text-foreground">{plan.name}</CardTitle>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.priceSuffix && <span className="text-muted-foreground">{plan.priceSuffix}</span>}
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
                    {isLoggedIn && isCurrentPlan && plan.name !== 'Free' ? (
                      <Button className="w-full" disabled variant={plan.name === 'Pro' ? 'default' : 'outline'}>Current Plan</Button>
                    ) : plan.name === 'Free' ? (
                      <Button className="w-full" variant="outline" onClick={handleScrollToCreate}>
                        {plan.buttonText}
                      </Button>
                    ) : (
                      <Button className="w-full" variant={plan.name === 'Pro' ? 'default' : 'outline'} onClick={() => handlePurchase(plan)}>
                        {plan.buttonText}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <FAQ />
    </div>
  );
}
