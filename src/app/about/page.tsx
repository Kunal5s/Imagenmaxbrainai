
export default function AboutPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4 max-w-4xl opacity-0 animate-fadeInUp">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">About Imagen Max BrainAi</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We are at the forefront of generative AI, empowering creativity through powerful and intuitive image generation tools.
        </p>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our mission is to democratize digital art creation. We believe that everyone has a story to tell and an idea to visualize. Imagen Max BrainAi provides the canvas and the colors, powered by cutting-edge artificial intelligence, to bring those visions to life. We strive to build tools that are not only powerful but also accessible and inspiring for all.
          </p>
        </div>

        <div>
          <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">Our Vision</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We envision a future where the line between human imagination and digital creation is seamless. A world where artists, designers, and creators are augmented by AI, allowing them to explore new frontiers of creativity. We are committed to pushing the boundaries of what's possible in generative media while fostering a community of innovation.
          </p>
        </div>

        <div>
          <h2 className="font-headline text-3xl font-bold mb-4 text-foreground">Our Team</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We are a passionate team of AI researchers, software engineers, and design enthusiasts united by a common goal: to build the most advanced and user-friendly AI image generator. Our diverse backgrounds and expertise allow us to tackle complex challenges and innovate rapidly in the fast-paced world of artificial intelligence.
          </p>
        </div>
      </div>
    </div>
  );
}
