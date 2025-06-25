
'use client';

import ImageGenerator from '@/components/image-generator';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
       <section className="text-center py-16 lg:py-24 px-4 container mx-auto">
        <div className="opacity-0 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground mb-6">
            Imagen Max <span className="text-primary">BrainAi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Welcome to the future of creativity. Describe your vision, and our advanced AI, powered by Google's Imagen technology, will bring it to life in stunning detail. From photorealistic images to fantastical art, your imagination is the only limit. Get started for free and see what you can create.
          </p>
        </div>
      </section>

      <div id="create" className="opacity-0 animate-fadeInUp" style={{animationDelay: '200ms'}}>
        <ImageGenerator />
      </div>
    </div>
  );
}
