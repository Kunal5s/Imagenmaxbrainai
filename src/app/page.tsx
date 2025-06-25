
'use client';

import { Button } from '@/components/ui/button';
import ImageGenerator from '@/components/image-generator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, Palette, Layers, Zap, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const faqItems = [
    {
        question: "What is Imagen Max BrainAi?",
        answer: "Imagen Max BrainAi is an advanced AI-powered platform that transforms your written text descriptions into stunning, unique, high-quality images. It's a tool for creators, designers, marketers, and anyone with an imagination."
    },
    {
        question: "How does the image generation process work?",
        answer: "Simply type a detailed description (a 'prompt') of the image you envision. Then, use our powerful tools to select an artistic style, aspect ratio, mood, lighting, and color palette. Click 'Generate', and our AI will produce four distinct image variations based on your input."
    },
    {
        question: "Is this service free to use?",
        answer: "Currently, Imagen Max BrainAi offers a generous free tier for all users to explore the core functionalities. We believe in making creativity accessible. In the future, we may introduce premium plans for advanced features and higher usage."
    },
    {
        question: "Who owns the images I create?",
        answer: "You do. As per our Terms of Service, you retain full ownership rights to the images you generate using your own prompts. You are free to use them for personal or commercial purposes."
    },
    {
        question: "What makes Imagen Max BrainAi different from other AI generators?",
        answer: "Our key differentiator is the combination of batch generation and deep customization. We generate four image options at once to give you more creative choice, and our detailed controls for mood, lighting, and color allow for unparalleled artistic direction."
    },
    {
        question: "Why do I get four images for every prompt?",
        answer: "AI interpretation can be nuanced. By providing four variations, we increase the probability that you will get an image that perfectly matches your vision on the first try. This saves you time and provides diverse creative avenues to explore."
    },
    {
        question: "Can I control the dimensions of the generated images?",
        answer: "Absolutely. We provide ten different aspect ratios, ranging from square (1:1) and portrait (9:16) to cinematic widescreen (2.39:1). This ensures your creations are perfectly sized for social media, blogs, presentations, or print."
    },
    {
        question: "What are some tips for getting the best results?",
        answer: "The key is a descriptive prompt. Instead of 'a cat,' try 'a fluffy, majestic Persian cat with bright green eyes, sleeping on a velvet cushion in a sunlit library.' The more detail you provide, the more accurately our AI can bring your idea to life."
    },
    {
        question: "Is my data and are my prompts kept private?",
        answer: "We take your privacy very seriously. Your prompts are processed to generate images and to improve our service, but they are handled securely. For complete details, please read our Privacy Policy."
    },
    {
        question: "I have a question or need help. How can I get support?",
        answer: "We're here to assist you! Please navigate to our 'Contact Us' page and send us a message. Our support team will get back to you as soon as possible."
    }
];

const features = [
  {
    icon: Zap,
    title: "Instant Creativity",
    description: "Go from a simple idea to four stunning visual concepts in seconds. Our high-speed generation process means less waiting and more creating."
  },
  {
    icon: Layers,
    title: "Quad-Image Generation",
    description: "Why settle for one? Get four unique interpretations of your prompt simultaneously. Compare, combine, or simply choose the best fit for your needs."
  },
  {
    icon: Palette,
    title: "Deep Customization",
    description: "Become the art director. Fine-tune every aspect of your creation, from the overall artistic style and mood to the specific lighting and color palette."
  }
];

const initialPlans = [
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
    polarLink: null,
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
    buttonText: 'Switch to Pro',
    polarLink: 'https://buy.polar.sh/polar_cl_iQpYIoo3qkW310DMOKN5lXhQo70OHOiLLU5Fp0eZ49f',
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
    polarLink: 'https://buy.polar.sh/polar_cl_uXQb5IyDgK3uZfxBDLb8EWbNFHBfBG2JzuiDs4QCkYi',
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
    polarLink: 'https://buy.polar.sh/polar_cl_uXQb5IyDgK3uZfxBDLb8EWbNFHBfBG2JzuiDs4QCkYi',
  },
];


export default function Home() {
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState('Free');

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handlePlanChange = (planName: string) => {
    if (planName === 'Booster Pack') {
        toast({ title: "Booster Pack Purchased!", description: "1,000 credits have been added to your account." });
        // In a real app, you would handle the purchase via the polarLink and a webhook
    } else {
        setActivePlan(planName);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <section className="text-center py-24 lg:py-32 px-4 container mx-auto">
        <div className="opacity-0 animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-foreground mb-6">
            Imagen Max <span className="text-primary">BrainAi</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Welcome to the future of digital artistry. Imagen Max BrainAi is a state-of-the-art platform that transforms your text prompts into breathtaking, high-quality images in seconds.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Our advanced AI understands a vast range of styles, moods, and compositions, giving you unparalleled control to bring your imagination to life. Whether you're a professional designer, a creative hobbyist, or just curious, our tools are designed for you.
          </p>
        </div>
        <div className="flex justify-center gap-4 opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
          <Button size="lg" className="font-bold hover:scale-105 transition-transform" onClick={() => handleScrollTo('create')}>
            Start Creating Now
          </Button>
        </div>
      </section>

      <div className="opacity-0 animate-fadeInUp" style={{animationDelay: '400ms'}}>
        <ImageGenerator isProPlan={activePlan === 'Pro' || activePlan === 'Mega'} />
      </div>

      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Why Choose Imagen Max BrainAi?</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our platform is built to empower your creativity with speed, variety, and precision. We provide the tools you need to not just generate images, but to craft visual stories.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 border hover:shadow-xl hover:border-border transition-all duration-300 transform hover:-translate-y-2 bg-card">
                <CardHeader className="p-0 items-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 border-2 border-primary/20">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pt-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 max-w-6xl opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Choose Your Perfect Plan</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Simple, transparent pricing for Imagen BrainAi. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {initialPlans.map((plan) => {
              const isCurrentPlan = activePlan === plan.name;
              return (
              <Card
                key={plan.name}
                className={`flex flex-col h-full border hover:border-primary transition-all hover:scale-105 hover:shadow-lg ${isCurrentPlan ? 'border-primary border-2 shadow-lg' : ''}`}
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
                    ) : plan.polarLink ? (
                      <Button asChild className="w-full" variant="outline">
                        <Link href={plan.polarLink} target="_blank" rel="noopener noreferrer" onClick={() => handlePlanChange(plan.name)}>
                          {plan.buttonText}
                        </Link>
                      </Button>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleScrollTo('create')}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )})}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
           <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions? We've got answers. Here are some of the most common queries we receive about our platform.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-bold text-left hover:no-underline hover:text-primary transition-colors">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
