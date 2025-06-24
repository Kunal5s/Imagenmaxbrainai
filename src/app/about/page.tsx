import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Users, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">About Imagen Max BrainAi</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          We are at the forefront of generative AI, empowering creativity through powerful and intuitive image generation tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl">Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Our mission is to democratize digital art creation. We believe that everyone has a story to tell and an idea to visualize. Imagen Max BrainAi provides the canvas and the colors, powered by cutting-edge artificial intelligence, to bring those visions to life. We strive to build tools that are not only powerful but also accessible and inspiring for all.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-8 h-8 text-accent" />
              <span className="font-headline text-2xl">Our Vision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We envision a future where the line between human imagination and digital creation is seamless. A world where artists, designers, and creators are augmented by AI, allowing them to explore new frontiers of creativity. We are committed to pushing the boundaries of what's possible in generative media while fostering a community of innovation.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <span className="font-headline text-2xl">Our Team</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We are a passionate team of AI researchers, software engineers, and design enthusiasts united by a common goal: to build the most advanced and user-friendly AI image generator. Our diverse backgrounds and expertise allow us to tackle complex challenges and innovate rapidly in the fast-paced world of artificial intelligence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
