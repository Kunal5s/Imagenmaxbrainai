
'use client';

import ImageGenerator from '@/components/image-generator';
import { Button } from '@/components/ui/button';

export default function Home() {
  const handleScrollToCreate = () => {
    const createSection = document.getElementById('create');
    if (createSection) {
        createSection.scrollIntoView({ behavior: 'smooth' });
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

       <section className="text-center py-16 lg:py-24 px-4 container mx-auto">
         <div className="opacity-0 animate-fadeInUp" style={{animationDelay: '400ms'}}>
            <h2 className="text-4xl font-headline font-bold text-foreground mb-6">Why Choose Imagen Max BrainAi?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Unmatched Quality</h3>
                  <p className="text-muted-foreground">Generate stunning, high-resolution images that are ready for professional use.</p>
              </div>
              <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Creative Control</h3>
                  <p className="text-muted-foreground">Fine-tune every aspect of your creation with a vast range of artistic controls.</p>
              </div>
               <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Speed & Efficiency</h3>
                  <p className="text-muted-foreground">Bring your ideas to life in seconds, not hours. Our platform is optimized for speed.</p>
              </div>
            </div>
         </div>
       </section>
    </div>
  );
}
