'use client';

import { Button } from '@/components/ui/button';
import ImageGenerator from '@/components/image-generator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sparkles, Palette, Layers, Zap, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

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


export default function Home() {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <section className="text-center py-20 lg:py-32 px-4 container mx-auto">
        <div className="opacity-0 animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-foreground mb-6 tracking-wide [text-shadow:0_0_15px_hsl(var(--primary)/0.3)]">
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
          <Button size="lg" className="font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform" onClick={() => handleScrollTo('create')}>
            Start Creating Now
          </Button>
        </div>
      </section>

      <div className="opacity-0 animate-fadeInUp" style={{animationDelay: '400ms'}}>
        <ImageGenerator />
      </div>

      <section className="py-20 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
          <div className="text-center max-w-3xl mx-auto">
             <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Why Choose Imagen Max BrainAi?</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our platform is built to empower your creativity with speed, variety, and precision. We provide the tools you need to not just generate images, but to craft visual stories.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-6 rounded-lg hover:bg-card/50 transition-colors group">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 ring-2 ring-primary/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-5xl opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">Choose Your Perfect Plan</h2>
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
      </section>

      <section className="py-20 lg:py-24 bg-secondary/50">
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
              <AccordionItem value={`item-${index}`} key={index} className="border-border/50">
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
