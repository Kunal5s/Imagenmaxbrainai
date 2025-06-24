'use client';

import { Button } from '@/components/ui/button';
import ImageGenerator from '@/components/image-generator';

export default function Home() {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <section className="text-center py-20 lg:py-32 px-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6 tracking-wide animate-pulse">
          Imagen Max BrainAi
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
          Welcome to the future of digital artistry. Imagen Max BrainAi is a state-of-the-art platform that transforms your text prompts into breathtaking, high-quality images in seconds.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Our advanced AI understands a vast range of styles, moods, and compositions, giving you unparalleled control to bring your imagination to life. Whether you're a professional designer, a creative hobbyist, or just curious, our tools are designed for you.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="font-bold" onClick={() => handleScrollTo('create')}>
            Start Creating Now
          </Button>
        </div>
      </section>

      <ImageGenerator />
    </div>
  );
}
