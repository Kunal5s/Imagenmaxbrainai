'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Download, Image as ImageIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { suggestPrompts } from '@/ai/flows/suggest-prompt-flow';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required.'),
  style: z.string().optional(),
  ratio: z.string().optional(),
  mood: z.string().optional(),
  lighting: z.string().optional(),
  colors: z.string().optional(),
});

const options = {
    styles: ['3D Model', '8-bit', 'Abstract', 'Anime', 'Art Deco', 'Cartoon', 'Concept Art', 'Graffiti', 'Impressionism', 'Marker Art', 'Minimalist', 'Fantasy', 'Photorealistic', 'Pixel Art', 'Pop Art', 'Realistic', 'Sci-Fi', 'Sketch', 'Steampunk', 'Surrealism', 'Watercolor', 'Woodblock Print'],
    ratios: [
        { value: '1:1', label: '1:1 (Square)' },
        { value: '16:9', label: '16:9 (Widescreen)' },
        { value: '9:16', label: '9:16 (Portrait)' },
        { value: '4:3', label: '4:3 (Standard)' },
        { value: '3:4', label: '3:4 (Portrait Standard)' },
        { value: '3:2', label: '3:2 (Classic Photo)' },
        { value: '2:3', label: '2:3 (Portrait Photo)' },
        { value: '5:4', label: '5:4 (Landscape Photo)' },
        { value: '4:5', label: '4:5 (Portrait Photo)' },
        { value: '2.39:1', label: '2.39:1 (Cinematic)' },
    ],
    moods: ['Calm', 'Cyberpunk', 'Dramatic', 'Dreamy', 'Energetic', 'Futuristic', 'Gothic', 'Happy', 'Kawaii', 'Mysterious', 'Nostalgic', 'Romantic', 'Somber', 'Utopian', 'Wasteland', 'Whimsical'],
    lightings: ['Backlight', 'Bright', 'Cinematic', 'Ethereal', 'Golden Hour', 'High-key', 'Low-key', 'Misty', 'Natural', 'Neon', 'Studio', 'Sunset', 'Underwater'],
    colors: ['Cool Tones', 'Earthy Tones', 'Greyscale', 'Indigo', 'Infrared', 'Monochromatic', 'Neon', 'Pastel', 'Sepia', 'Technicolor', 'Vibrant', 'Warm Tones']
};

export default function ImageGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionIdea, setSuggestionIdea] = useState('');
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
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

  const handleSuggestPrompts = async () => {
    if (!suggestionIdea) {
      toast({
        title: 'Idea Required',
        description: 'Please enter an idea to get suggestions.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggesting(true);
    setPromptSuggestions([]);
    try {
      const result = await suggestPrompts({ idea: suggestionIdea });
      setPromptSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to suggest prompts', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Suggestion Failed',
        description: `Could not generate prompt suggestions. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    form.setValue('prompt', suggestion);
    setPromptSuggestions([]);
    setSuggestionIdea('');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setGeneratedImages(null);

    try {
      const result = await generateImage(values as GenerateImageInput);
      setGeneratedImages(result.imageDataUris);
    } catch (error) {
      console.error('Failed to generate image', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        title: 'Image Generation Failed',
        description: `Could not generate images. ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAspectRatioValue = (ratio: string) => {
    if (ratio.includes(':')) {
        const [width, height] = ratio.split(':').map(Number);
        return width / height;
    }
    return 1;
  }
  
  const ratio = form.watch('ratio');
  const aspectRatio = getAspectRatioValue(ratio || '1:1');

  return (
    <section id="create" className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
                Create Your Vision
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
                Fine-tune every detail of your creation. Our generator gives you control over style, dimensions, mood, lighting, and color palette to produce a batch of four unique images at once.
            </p>
        </div>
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-2 flex flex-col gap-8">
                <Card className="border">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Prompt Suggester
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Label htmlFor="suggestion-idea" className="font-bold">Enter a simple idea</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="suggestion-idea"
                                    placeholder="e.g., 'a cat in space'"
                                    value={suggestionIdea}
                                    onChange={(e) => setSuggestionIdea(e.target.value)}
                                    disabled={isSuggesting}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSuggestPrompts}
                                    disabled={isSuggesting}
                                    className="whitespace-nowrap"
                                >
                                    {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Suggest'}
                                </Button>
                            </div>
                            {promptSuggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {promptSuggestions.map((suggestion, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-left h-auto"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Generation Tools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Primary Prompt</FormLabel>
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
                                            <FormLabel className="font-bold">Artistic Style</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger></FormControl>
                                                <SelectContent>{options.styles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="ratio" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Aspect Ratio</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a ratio" /></SelectTrigger></FormControl>
                                                <SelectContent>{options.ratios.map(ratio => <SelectItem key={ratio.value} value={ratio.value}>{ratio.label}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="mood" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Mood</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a mood" /></SelectTrigger></FormControl>
                                                <SelectContent>{options.moods.map(mood => <SelectItem key={mood} value={mood}>{mood}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="lighting" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Lighting</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select lighting" /></SelectTrigger></FormControl>
                                                <SelectContent>{options.lightings.map(light => <SelectItem key={light} value={light}>{light}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="colors" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Color Palette</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select colors" /></SelectTrigger></FormControl>
                                                <SelectContent>{options.colors.map(color => <SelectItem key={color} value={color}>{color}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />
                                </div>

                                <Button type="submit" size="lg" className="w-full font-bold hover:scale-105 transition-transform" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate 4 Images</>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-3 flex flex-col items-center justify-center bg-slate-50 rounded-lg p-6 min-h-[400px] border">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-lg font-medium">Your vision is materializing...</p>
                        <p className="text-sm">This can take a few moments. Four images are being generated.</p>
                    </div>
                )}
                {!isLoading && generatedImages && (
                    <div className="w-full grid grid-cols-2 gap-4" style={{ aspectRatio: `${aspectRatio}` }}>
                        {generatedImages.map((imageSrc, index) => (
                             <div key={index} className="relative w-full h-full overflow-hidden rounded-lg group opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 150}ms`}}>
                                <Image src={imageSrc} alt={`Generated AI Image ${index + 1}`} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button asChild variant="secondary" size="sm">
                                        <a href={imageSrc} download={`imagenmax-ai-creation-${index + 1}.png`}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!isLoading && !generatedImages && (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-16 w-16 mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Your image quad will appear here.</h4>
                        <p>Fill out the form and click "Generate" to begin.</p>
                    </div>
                )}
            </div>
        </div>
    </section>
  );
}
