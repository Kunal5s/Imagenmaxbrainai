'use client';

import { useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import SuggestionDialog from '@/components/suggestion-dialog';

const galleryImages = [
  {
    id: 1,
    src: 'https://placehold.co/600x800.png',
    prompt: 'A hyper-realistic portrait of a futuristic cyborg queen, intricate details, cinematic lighting.',
    hint: 'cyborg queen'
  },
  {
    id: 2,
    src: 'https://placehold.co/600x800.png',
    prompt: 'An enchanted forest at twilight, glowing mushrooms, ethereal mist, fantasy art style.',
    hint: 'enchanted forest'
  },
  {
    id: 3,
    src: 'https://placehold.co/600x800.png',
    prompt: 'A bustling cyberpunk city street at night, neon signs, flying vehicles, Blade Runner inspired.',
    hint: 'cyberpunk city'
  },
  {
    id: 4,
    src: 'https://placehold.co/600x800.png',
    prompt: 'Steampunk inventor in his workshop, surrounded by gears and gadgets, warm sepia tones.',
    hint: 'steampunk inventor'
  },
  {
    id: 5,
    src: 'https://placehold.co/600x800.png',
    prompt: 'A serene underwater world, coral reefs, exotic fish, sun rays piercing the water.',
    hint: 'underwater world'
  },
  {
    id: 6,
    src: 'https://placehold.co/600x800.png',
    prompt: 'An astronaut discovering an alien artifact on a desolate planet, cosmic background, sci-fi concept.',
    hint: 'astronaut alien'
  },
];

type GalleryImage = typeof galleryImages[0];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="py-6 px-4 md:px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground">ImagenBrain AI</h1>
          </div>
          <Button variant="outline" className="font-bold">
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="text-center py-20 px-4">
          <h2 className="text-5xl md:text-7xl font-headline font-bold text-foreground mb-4 tracking-wide">
            Visualize Your Ideas with AI
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Turn your imagination into stunning visuals. ImagenBrain AI offers a powerful toolset to generate and refine images, enhanced by intelligent suggestions to perfect your creations.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="font-bold">Start Creating</Button>
            <Button size="lg" variant="secondary" className="font-bold">Explore Gallery</Button>
          </div>
        </section>

        <section className="container mx-auto py-12 px-4">
          <h3 className="text-4xl font-headline font-bold text-center mb-12">Latest Creations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group flex flex-col bg-card shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-[3/4] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.prompt}
                      width={600}
                      height={800}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={image.hint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <p className="text-muted-foreground text-sm">{image.prompt}</p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button
                    className="w-full font-bold"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Suggestions
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 md:px-8 border-t border-border/50 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ImagenBrain AI. All Rights Reserved.</p>
        </div>
      </footer>

      {selectedImage && (
        <SuggestionDialog
          open={!!selectedImage}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedImage(null);
            }
          }}
          image={selectedImage}
        />
      )}
    </div>
  );
}
