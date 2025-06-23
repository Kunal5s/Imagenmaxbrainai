'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Download } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  style: z.string().optional(),
  ratio: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  colors: z.string().optional(),
});

const options = {
    styles: ['Photorealistic', 'Anime', 'Cartoon', 'Pixel Art', 'Watercolor', 'Impressionism', 'Surrealism', 'Minimalist', 'Fantasy', 'Sci-Fi'],
    ratios: [
        { value: '1:1', label: '1:1 (Square)' },
        { value: '16:9', label: '16:9 (Landscape)' },
        { value: '9:16', label: '9:16 (Portrait)' },
    ],
    moods: ['Happy', 'Somber', 'Energetic', 'Calm', 'Mysterious', 'Romantic', 'Whimsical', 'Dramatic', 'Nostalgic', 'Futuristic'],
    lightings: ['Cinematic', 'Soft', 'Studio', 'Natural', 'High-key', 'Low-key', 'Backlight', 'Golden hour', 'Neon', 'Underwater'],
    colors: ['Vibrant', 'Monochromatic', 'Pastel', 'Warm Tones', 'Cool Tones', 'Earthy Tones', 'Greyscale', 'Neon', 'Sepia', 'Technicolor']
};

export default function ImageGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      style: options.styles[0],
      ratio: options.ratios[0].value,
      mood: options.moods[0],
      lighting: options.lightings[0],
      colors: options.colors[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await generateImage(values as GenerateImageInput);
      setGeneratedImage(result.imageDataUri);
    } catch (error) {
      console.error('Failed to generate image', error);
      toast({
        title: 'Image Generation Failed',
        description: 'There was an error while generating the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const ratio = form.watch('ratio');
  const aspectClass = ratio === '9:16' ? 'aspect-[9/16]' : ratio === '16:9' ? 'aspect-[16/9]' : 'aspect-square';

  return (
    <section id="create" className="container mx-auto py-12 px-4">
        <h3 className="text-4xl font-headline font-bold text-center mb-12">Create Your Vision</h3>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Card className="bg-card shadow-lg">
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Prompt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.'"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="style" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Style</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {options.styles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="ratio" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Aspect Ratio</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a ratio" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {options.ratios.map(ratio => <SelectItem key={ratio.value} value={ratio.value}>{ratio.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="mood" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Mood</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a mood" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {options.moods.map(mood => <SelectItem key={mood} value={mood}>{mood}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="lighting" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Lighting</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select lighting" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {options.lightings.map(light => <SelectItem key={light} value={light}>{light}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="colors" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Colors</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select colors" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {options.colors.map(color => <SelectItem key={color} value={color}>{color}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                            </div>

                            <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="mr-2 h-4 w-4" />
                                        Generate Image
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="flex flex-col items-center justify-center bg-card shadow-lg rounded-lg p-6 min-h-[400px] md:min-h-0">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-lg font-medium">Your vision is materializing...</p>
                        <p className="text-sm">This can take a few moments.</p>
                    </div>
                )}
                {!isLoading && generatedImage && (
                    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-lg group`}>
                        <Image src={generatedImage} alt="Generated AI Image" fill className="object-contain" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button asChild variant="secondary">
                                <a href={generatedImage} download="imagenbrain-ai-creation.png">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        </div>
                    </div>
                )}
                {!isLoading && !generatedImage && (
                    <div className="text-center text-muted-foreground">
                        <Wand2 className="mx-auto h-16 w-16 mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Your generated image will appear here.</h4>
                        <p>Fill out the form and click "Generate Image" to begin.</p>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
}
