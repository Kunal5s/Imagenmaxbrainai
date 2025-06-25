
'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, Download, Image as ImageIcon, Sparkles, Palette, Ratio, Sun, Smile, Paintbrush, Diamond, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useUser } from '@/hooks/use-user-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { suggestPrompts } from '@/ai/flows/suggest-prompt-flow';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const styles = ["Photographic", "Digital Art", "Anime", "Cartoon", "Comic Book", "Cinematic", "3D Model", "Pixel Art", "Isometric", "Watercolor", "Impressionistic", "Surrealist", "Pop Art", "Minimalist", "Abstract", "Gouache", "Line Art", "Charcoal Sketch", "8-bit", "Woodblock Print", "Vintage Photography", "Double Exposure", "Marker Art"];
const aspectRatios = ["Square (1:1)", "Portrait (4:5)", "Tall Portrait (9:16)", "Classic Portrait (2:3)", "Landscape (5:4)", "Widescreen (16:9)", "Classic Landscape (3:2)", "Cinematic (2.39:1)", "Ultra Wide (3:1)", "Banner (4:1)"];
const moods = ["None", "Cyberpunk", "Dreamy", "Gothic", "Kawaii", "Steampunk", "Wasteland", "Whimsical", "Melancholic", "Nostalgic", "Serene", "Tense", "Utopian", "Dystopian", "Mysterious", "Energetic"];
const lightings = ["None", "Bright", "Neon", "Misty", "Ethereal", "Sunset", "Golden Hour", "Blue Hour", "Volumetric", "Soft", "Hard", "Rembrandt", "Backlight"];
const colorPalettes = ["None", "Default", "Cool Tones", "Warm Tones", "Pastel Dreams", "Indigo Night", "Infrared Vision", "Monochromatic", "Earthy Tones", "Vibrant Neon", "Vintage Sepia", "Synthwave"];
const qualities = ["Standard (1080p)", "4K Quality"];

interface GenerationSettings {
  prompt: string;
  style: string;
  aspectRatio: string;
  mood: string;
  lighting: string;
  colorPalette: string;
  quality: string;
}

const defaultSettings: GenerationSettings = {
  prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
  style: 'Photographic',
  aspectRatio: 'Square (1:1)',
  mood: 'None',
  lighting: 'None',
  colorPalette: 'None',
  quality: 'Standard (1080p)',
};

const getAspectRatioForCss = (ratioString: string | undefined): string => {
  if (!ratioString) return '1 / 1';
  const match = ratioString.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1].replace(':', ' / ');
  }
  return '1 / 1';
};

export default function ImageGenerator() {
  const { user, deductCredits, getPlanByName, isLoggedIn } = useUser();
  const { toast } = useToast();
  
  const currentPlan = getPlanByName(user.plan);
  const isProOrMegaPlan = user.plan === 'Pro' || user.plan === 'Mega';
  const costPerGeneration = currentPlan?.costPerGeneration ?? 1;
  const canGenerate = user.credits >= costPerGeneration;

  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [promptSuggestions, setPromptSuggestions] = useState<string[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('imageGeneratorSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (!isProOrMegaPlan && parsedSettings.quality === '4K Quality') {
          parsedSettings.quality = 'Standard (1080p)';
        }
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
  }, [isProOrMegaPlan]);

  useEffect(() => {
    try {
      localStorage.setItem('imageGeneratorSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);
  
  useEffect(() => {
    if (!isProOrMegaPlan && settings.quality === '4K Quality') {
        handleSettingChange('quality', 'Standard (1080p)');
    }
  }, [isProOrMegaPlan, settings.quality]);

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

    if (!isLoggedIn) {
        toast({
            title: "Activation Required",
            description: "Please click 'Activate Plan' in the header and enter your email to start generating.",
            variant: 'destructive',
        });
        return;
    }

    if (!canGenerate) {
        toast({
            title: 'Out of Credits',
            description: 'You do not have enough credits. Please purchase a new plan or booster pack.',
            variant: 'destructive',
        });
        return;
    }

    setIsLoading(true);
    setGeneratedImages(null);
    setPromptSuggestions(null);
    setApiError(null);

    try {
      const input: GenerateImageInput = {
        prompt: settings.prompt,
        style: settings.style === 'None' ? undefined : settings.style,
        aspectRatio: settings.aspectRatio,
        mood: settings.mood === 'None' ? undefined : settings.mood,
        lighting: settings.lighting === 'None' ? undefined : settings.lighting,
        colorPalette: settings.colorPalette === 'None' || settings.colorPalette === 'Default' ? undefined : settings.colorPalette,
        quality: settings.quality,
      };
      const result = await generateImage(input);
      setGeneratedImages(result.imageDataUris);
      deductCredits(costPerGeneration);
      
      toast({
          title: 'Success!',
          description: `${costPerGeneration} credits deducted. You have ${user.credits - costPerGeneration} credits remaining.`
      })
    } catch (error) {
      console.error('Failed to generate image', error);
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('API key') || errorMessage.includes('safety policies')) {
          setApiError(
`Image generation failed. This is likely because the GOOGLE_API_KEY is not set correctly in your live application's settings.

Please follow these steps exactly:
1.  Go to your Firebase project: App Hosting > Backend: imagenmaxbrainai.
2.  Click the Settings tab.
3.  **SCROLL DOWN** on that page until you find the section titled **"Environment variables"**.
4.  Click the **[+ Add variable]** button.
5.  For **Name**, enter: \`GOOGLE_API_KEY\`
6.  For **Value**, paste your Google AI (Gemini) API key.
7.  Click **Save**.
8.  Return to Firebase Studio and **Publish** your application again.`
          );
      }

      toast({
        title: 'Image Generation Failed',
        description: `Could not generate images. ${errorMessage}`,
        variant: 'destructive',
      });
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
        <Card className="border shadow-lg overflow-hidden bg-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 text-sm">
                <span className="font-medium bg-secondary text-secondary-foreground py-1 px-3 rounded">
                    Plan: {currentPlan?.name ?? 'Free'}
                </span>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Diamond size={16} />
                    <span>{user.credits.toLocaleString()} Credits</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="prompt" className="text-lg font-bold">Enter Your Vision</Label>
                <p className="text-sm text-muted-foreground mb-2">e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets...</p>
                <Textarea
                  id="prompt"
                  value={settings.prompt}
                  onChange={(e) => handleSettingChange('prompt', e.target.value)}
                  placeholder="e.g., A majestic lion wearing a crown, sitting on a throne in a cosmic library."
                  className="min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              {isSuggesting && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              )}
              {promptSuggestions && !isSuggesting && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {promptSuggestions.map((suggestion, i) => (
                    <Button key={i} variant="outline" size="sm" className="h-auto text-xs whitespace-normal justify-start text-left" onClick={() => handleSettingChange('prompt', suggestion)}>
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                <div className="space-y-2">
                  <Label>Artistic Style</Label>
                  <Select value={settings.style} onValueChange={(v) => handleSettingChange('style', v)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mood</Label>
                  <Select value={settings.mood} onValueChange={(v) => handleSettingChange('mood', v)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{moods.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lighting</Label>
                  <Select value={settings.lighting} onValueChange={(v) => handleSettingChange('lighting', v)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{lightings.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color Palette</Label>
                  <Select value={settings.colorPalette} onValueChange={(v) => handleSettingChange('colorPalette', v)} disabled={isLoading}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{colorPalettes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <Select value={settings.aspectRatio} onValueChange={(v) => handleSettingChange('aspectRatio', v)} disabled={isLoading}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{aspectRatios.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label>Quality</Label>
                    <Select value={settings.quality} onValueChange={(v) => handleSettingChange('quality', v)} disabled={isLoading}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                      {qualities.map(s => (
                        <SelectItem
                          key={s}
                          value={s}
                          disabled={s === '4K Quality' && !isProOrMegaPlan}
                        >
                          {s}{s === '4K Quality' && !isProOrMegaPlan && ' (Pro/Mega plan required)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto flex-grow font-bold hover:scale-105 transition-transform"
                      disabled={isLoading || !canGenerate}
                  >
                      {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Forging...</> : <><Wand2 className="mr-2 h-4 w-4" />Forge Vision</>}
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
              {!canGenerate && isLoggedIn && (
                  <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                     You're out of credits.
                     <Button variant="link" asChild className="p-1 h-auto"><Link href="/pricing">Upgrade your plan to continue.</Link></Button>
                  </div>
              )}
               {!isLoggedIn && (
                  <div className="text-center text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-md">
                     You have {user.credits} free credits. 
                     <Button variant="link" asChild className="p-1 h-auto" onClick={() => document.querySelector<HTMLButtonElement>('[data-user-menu-trigger]')?.click()}>Activate with your email</Button> to start generating.
                  </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        {apiError && (
            <Card className="mb-8 border-destructive bg-destructive/10">
                <CardContent className="p-6 text-destructive">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-2">Action Required: Set API Key</h3>
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{apiError}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
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
              <div
                key={index}
                className={cn(
                  'relative w-full overflow-hidden rounded-lg group opacity-0 animate-fadeInUp shadow-lg'
                )}
                style={{
                  animationDelay: `${index * 150}ms`,
                  aspectRatio: getAspectRatioForCss(settings.aspectRatio),
                }}
              >
                <Image
                  src={imageSrc}
                  alt={`Generated AI Image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDownload(imageSrc, index)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !generatedImages && !apiError && (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
            <ImageIcon className="mx-auto h-16 w-16 mb-4" />
            <h4 className="text-xl font-semibold mb-2">Your generated images will appear here.</h4>
            <p>Enter a prompt above and click "Forge Vision" to begin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
