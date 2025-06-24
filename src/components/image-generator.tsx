
'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, Download, Image as ImageIcon, Sparkles, Palette, Ratio, Sun, Smile, Paintbrush } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { suggestPrompts } from '@/ai/flows/suggest-prompt-flow';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const styles = ["Photographic", "Digital Art", "Anime", "Cartoon", "Comic Book", "Cinematic", "3D Model", "Pixel Art", "Isometric", "Watercolor", "Impressionistic", "Surrealist", "Pop Art", "Minimalist", "Abstract", "Gouache", "Line Art", "Charcoal Sketch", "8-bit", "Woodblock Print", "Vintage Photography", "Double Exposure"];
const aspectRatios = ["Square (1:1)", "Portrait (4:5)", "Tall Portrait (9:16)", "Classic Portrait (2:3)", "Landscape (5:4)", "Widescreen (16:9)", "Classic Landscape (3:2)", "Cinematic (2.39:1)", "Ultra Wide (3:1)", "Banner (4:1)"];
const moods = ["Cyberpunk", "Dreamy", "Gothic", "Kawaii", "Steampunk", "Wasteland", "Whimsical", "Melancholic", "Nostalgic", "Serene", "Tense", "Utopian", "Dystopian", "Mysterious", "Energetic"];
const lightings = ["Bright", "Neon", "Misty", "Ethereal", "Sunset", "Golden Hour", "Blue Hour", "Volumetric", "Soft", "Hard", "Rembrandt", "Backlight"];
const colorPalettes = ["Default", "Cool Tones", "Warm Tones", "Pastel Dreams", "Indigo Night", "Infrared Vision", "Monochromatic", "Earthy Tones", "Vibrant Neon", "Vintage Sepia", "Synthwave"];

const aspectRatioClasses: { [key: string]: string } = {
    'Square (1:1)': 'aspect-square',
    'Portrait (4:5)': 'aspect-[4/5]',
    'Tall Portrait (9:16)': 'aspect-[9/16]',
    'Classic Portrait (2:3)': 'aspect-[2/3]',
    'Landscape (5:4)': 'aspect-[5/4]',
    'Widescreen (16:9)': 'aspect-[16/9]',
    'Classic Landscape (3:2)': 'aspect-[3/2]',
    'Cinematic (2.39:1)': 'aspect-[2.39/1]',
    'Ultra Wide (3:1)': 'aspect-[3/1]',
    'Banner (4:1)': 'aspect-[4/1]',
};


interface GenerationSettings {
  prompt: string;
  style: string;
  aspectRatio: string;
  mood: string;
  lighting: string;
  colorPalette: string;
}

const defaultSettings: GenerationSettings = {
  prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
  style: 'Photographic',
  aspectRatio: 'Square (1:1)',
  mood: 'Mysterious',
  lighting: 'Cinematic',
  colorPalette: 'Default',
};


export default function ImageGenerator() {
  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [promptSuggestions, setPromptSuggestions] = useState<string[] | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('imageGeneratorSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('imageGeneratorSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const handleSettingChange = (key: keyof GenerationSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSuggestPrompts = async () => {
    if (!settings.prompt) {
      toast({ title: 'Prompt Required', description: 'Please enter an idea to get suggestions.', variant: 'destructive' });
      return;
    }
    setIsSuggesting(true);
    setPromptSuggestions(null);
    try {
      const result = await suggestPrompts({ idea: settings.prompt });
      setPromptSuggestions(result.suggestions);
    } catch (error) {
      toast({ title: 'Suggestion Failed', description: error instanceof Error ? error.message : 'Could not fetch suggestions.', variant: 'destructive' });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings.prompt) {
      toast({ title: 'Prompt Required', description: 'Please enter a prompt to generate images.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setGeneratedImages(null);
    setPromptSuggestions(null);

    try {
      const input: GenerateImageInput = {
        prompt: settings.prompt,
        style: settings.style,
        aspectRatio: settings.aspectRatio,
        mood: settings.mood,
        lighting: settings.lighting,
        colorPalette: settings.colorPalette === 'Default' ? undefined : settings.colorPalette,
      };
      const result = await generateImage(input);
      setGeneratedImages(result.imageDataUris);
    } catch (error) {
      console.error('Failed to generate image', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({ title: 'Image Generation Failed', description: `Could not generate images. ${errorMessage}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageSrc: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `imagenmax-ai-creation-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="create" className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-lg font-bold">Enter your prompt</Label>
                <p className="text-sm text-muted-foreground mb-2">Describe the image you want to create in detail.</p>
                <Textarea
                  id="prompt"
                  value={settings.prompt}
                  onChange={(e) => handleSettingChange('prompt', e.target.value)}
                  placeholder="e.g., A majestic lion wearing a crown, sitting on a throne in a cosmic library."
                  className="min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              {promptSuggestions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {promptSuggestions.map((suggestion, i) => (
                    <Button key={i} variant="outline" size="sm" className="h-auto text-xs whitespace-normal justify-start text-left" onClick={() => handleSettingChange('prompt', suggestion)}>
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              <Accordion type="single" collapsible className="w-full" defaultValue="tools">
                <AccordionItem value="tools" className="border-b-0">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                       <Paintbrush className="w-5 h-5" />
                       <span>Creative Tools</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div className="space-y-2">
                        <Label><Paintbrush className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Artistic Style</Label>
                        <Select value={settings.style} onValueChange={(v) => handleSettingChange('style', v)} disabled={isLoading}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label><Ratio className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Aspect Ratio</Label>
                        <Select value={settings.aspectRatio} onValueChange={(v) => handleSettingChange('aspectRatio', v)} disabled={isLoading}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>{aspectRatios.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                         <Label><Smile className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Mood</Label>
                         <Select value={settings.mood} onValueChange={(v) => handleSettingChange('mood', v)} disabled={isLoading}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>{moods.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2">
                         <Label><Sun className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Lighting</Label>
                         <Select value={settings.lighting} onValueChange={(v) => handleSettingChange('lighting', v)} disabled={isLoading}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>{lightings.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                         <Label><Palette className="inline-block mr-2 h-4 w-4 text-muted-foreground" />Color Palette</Label>
                         <Select value={settings.colorPalette} onValueChange={(v) => handleSettingChange('colorPalette', v)} disabled={isLoading}>
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>{colorPalettes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                         </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto flex-grow font-bold hover:scale-105 transition-transform"
                      disabled={isLoading}
                  >
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate 4 Images</>}
                  </Button>
                  <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={handleSuggestPrompts}
                      disabled={isSuggesting || isLoading}
                  >
                      {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Suggest Prompts
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-lg font-medium">Your vision is materializing...</p>
            <p className="text-sm">This can take a few moments. Four images are being generated.</p>
          </div>
        )}
        {!isLoading && generatedImages && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generatedImages.map((imageSrc, index) => (
              <div key={index} className={cn("relative w-full overflow-hidden rounded-lg group opacity-0 animate-fadeInUp shadow-lg", aspectRatioClasses[settings.aspectRatio] || 'aspect-square')} style={{ animationDelay: `${index * 150}ms` }}>
                <Image src={imageSrc} alt={`Generated AI Image ${index + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary" size="sm" onClick={() => handleDownload(imageSrc, index)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !generatedImages && (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <ImageIcon className="mx-auto h-16 w-16 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Your generated images will appear here.</h4>
            <p>Enter a prompt above and click "Generate" to begin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
