
'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, Download, Image as ImageIcon, Palette, Ratio, Sun, Smile, Paintbrush, Diamond, AlertTriangle, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useUser } from '@/hooks/use-user-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage, GenerateImageInput } from '@/ai/flows/generate-image-flow';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const styles = ["Photographic", "Digital Art", "Anime", "Cartoon", "Comic Book", "Cinematic", "3D Model", "Pixel Art", "Isometric", "Watercolor", "Impressionistic", "Surrealist", "Pop Art", "Minimalist", "Abstract", "Gouache", "Line Art", "Charcoal Sketch", "8-bit", "Woodblock Print", "Vintage Photography", "Double Exposure", "Marker Art"];
const aspectRatios = ["Square (1:1)", "Portrait (4:5)", "Tall Portrait (9:16)", "Classic Portrait (2:3)", "Landscape (5:4)", "Widescreen (16:9)", "Classic Landscape (3:2)", "Cinematic (2.39:1)", "Ultra Wide (3:1)", "Banner (4:1)"];
const moods = ["None", "Cyberpunk", "Dreamy", "Gothic", "Kawaii", "Steampunk", "Wasteland", "Whimsical", "Melancholic", "Nostalgic", "Serene", "Tense", "Utopian", "Dystopian", "Mysterious", "Energetic"];
const lightings = ["None", "Bright", "Neon", "Misty", "Ethereal", "Sunset", "Golden Hour", "Blue Hour", "Volumetric", "Soft", "Hard", "Rembrandt", "Backlight"];
const colorPalettes = ["None", "Default", "Cool Tones", "Warm Tones", "Pastel Dreams", "Indigo Night", "Infrared Vision", "Monochromatic", "Earthy Tones", "Vibrant Neon", "Vintage Sepia", "Synthwave"];
const qualities = ["Standard (1080p)", "4K Quality"];
const models = [
    { id: 'pollinations', name: 'Pollinations' },
    { id: 'googleai/gemini-2.0-flash-preview-image-generation', name: 'Google Imagen 2 (Fast)' },
    { id: 'googleai/imagen-3.0-generate-preview-0611', name: 'Google Imagen 3 (Highest Quality)' },
];

interface GenerationSettings {
  prompt: string;
  style: string;
  aspectRatio: string;
  mood: string;
  lighting: string;
  colorPalette: string;
  quality: string;
  model: string;
}

const defaultSettings: GenerationSettings = {
  prompt: 'A majestic lion wearing a crown, sitting on a throne in a cosmic library.',
  style: 'Photographic',
  aspectRatio: 'Square (1:1)',
  mood: 'None',
  lighting: 'None',
  colorPalette: 'Default',
  quality: 'Standard (1080p)',
  model: 'pollinations',
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
  const { user, deductCredits, getPlanByName } = useUser();
  const { toast } = useToast();
  
  const currentPlan = getPlanByName(user.plan);
  const costPerGeneration = currentPlan?.costPerGeneration ?? 2;
  const canGenerate = user.credits >= costPerGeneration;

  const [settings, setSettings] = useState<GenerationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const activeModel = models.find(m => m.id === settings.model);

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

  useEffect(() => {
    let modelId = 'pollinations';
    if (user.plan === 'Pro') {
      modelId = 'googleai/gemini-2.0-flash-preview-image-generation';
    } else if (user.plan === 'Mega') {
      modelId = 'googleai/imagen-3.0-generate-preview-0611';
    }

    let newQuality = settings.quality;
    if (user.plan !== 'Pro' && user.plan !== 'Mega' && settings.quality === '4K Quality') {
      newQuality = 'Standard (1080p)';
    }

    if (settings.model !== modelId || settings.quality !== newQuality) {
      setSettings(prev => ({ ...prev, model: modelId, quality: newQuality }));
    }
  }, [user.plan, settings.model, settings.quality]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settings.prompt) {
      toast({ title: 'Prompt Required', description: 'Please enter a prompt to generate images.', variant: 'destructive' });
      return;
    }
    
    if (!canGenerate) {
        toast({
            title: 'Out of Credits',
            description: 'You do not have enough credits. Please purchase a new plan or booster pack to continue.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setGeneratedImages(null);
    setApiError(null);

    const creditsBeforeGeneration = user.credits;
    try {
        let imageDataUris: string[] = [];
        let error: string | undefined = undefined;

        if (settings.model === 'pollinations') {
            const ratioMatch = settings.aspectRatio.match(/\((.*?)\)/);
            const aspectRatioParam = ratioMatch ? ratioMatch[1] : '1:1';

            const promptParts = [
                settings.prompt,
                settings.style,
                settings.mood,
                settings.lighting,
                settings.colorPalette,
                `ar ${aspectRatioParam}`,
                settings.quality === '4K Quality' ? '4K, ultra high resolution, photorealistic, masterpiece, sharp focus' : 'high quality, detailed, clear image, sharp focus',
                'undesired content: watermark, logo, text, signature, branding'
            ];
            const finalPrompt = promptParts.filter(p => p && p !== 'None' && p !== 'Default').join(', ');

            const generationPromises = Array(4).fill(null).map(() => {
                const seed = Math.floor(Math.random() * 10000000);
                const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?seed=${seed}&nologo=true`;
                return fetch(url)
                    .then(res => {
                        if (!res.ok) throw new Error(`Pollinations API returned status ${res.status}`);
                        return res.url;
                    })
            });
            
            const results = await Promise.allSettled(generationPromises);
            
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    imageDataUris.push(result.value);
                } else {
                    console.error("Pollinations generation failed:", result.reason);
                }
            });

            if(imageDataUris.length === 0) {
                error = "Image generation failed with Pollinations model. Please try again.";
            }

        } else {
            const input: GenerateImageInput = {
                prompt: settings.prompt,
                style: settings.style === 'None' ? undefined : settings.style,
                aspectRatio: settings.aspectRatio,
                mood: settings.mood === 'None' ? undefined : settings.mood,
                lighting: settings.lighting === 'None' ? undefined : settings.lighting,
                colorPalette: settings.colorPalette === 'None' || settings.colorPalette === 'Default' ? undefined : settings.colorPalette,
                quality: settings.quality,
                model: settings.model,
            };
            const result = await generateImage(input);
            imageDataUris = result.imageDataUris;
            error = result.error;
        }

        if (error || imageDataUris.length === 0) {
            const errorMessage = error || 'An unknown error occurred and no images were generated.';
            toast({
                title: 'Image Generation Failed',
                description: `Could not generate images. Credits have not been deducted. ${errorMessage}`,
                variant: 'destructive',
                duration: 9000,
            });
            if (/API key|permission|denied|billing|quota|safety/i.test(errorMessage)) {
                setApiError('Image generation failed. This is likely due to an issue with the backend API configuration. Please check your API key, billing status, or safety settings.');
            }
        } else {
            deductCredits();
            setGeneratedImages(imageDataUris);
            toast({
                title: 'Success!',
                description: `${costPerGeneration} credits deducted. You have ${creditsBeforeGeneration - costPerGeneration} credits remaining.`
            });
        }
    } catch (error) {
        console.error('Failed to generate image', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({
            title: 'Image Generation Failed',
            description: `Could not generate images. Credits have not been deducted. ${errorMessage}`,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleDownload = async (imageSrc: string, index: number) => {
    const fileName = `imagenmax-ai-creation-${index + 1}.png`;
    try {
        const response = await fetch(imageSrc, { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok.');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed due to network or CORS issues:", error);
        toast({
            title: "Download Failed",
            description: "Could not download the image directly. Please try saving it from the new tab.",
            variant: "destructive",
        });
        window.open(imageSrc, '_blank');
    }
  };

  return (
    <section id="generator" className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border shadow-lg overflow-hidden">
          <CardContent className="p-6">
            
            <div className="flex justify-between items-center mb-4 text-sm bg-primary/10 p-3 rounded-lg">
                <span className="font-medium text-foreground">
                    Plan: <span className="font-bold">{currentPlan?.name ?? 'Free'}</span>
                </span>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Diamond size={16} />
                    <span>{user.credits.toLocaleString()} Credits</span>
                </div>
            </div>

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
                
              <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      <span className="font-bold text-lg">Creative Tools</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-2 mb-6">
                      <Label className="flex items-center gap-2 text-sm"><BrainCircuit size={14} /> AI Model</Label>
                      <Input
                        value={`${activeModel?.name || 'Default'} (Active for ${user.plan} plan)`}
                        disabled
                        className="text-muted-foreground font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm"><Paintbrush size={14} /> Artistic Style</Label>
                        <Select value={settings.style} onValueChange={(v) => handleSettingChange('style', v)} disabled={isLoading}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm"><Ratio size={14} /> Aspect Ratio</Label>
                        <Select value={settings.aspectRatio} onValueChange={(v) => handleSettingChange('aspectRatio', v)} disabled={isLoading}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{aspectRatios.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm"><Smile size={14} /> Mood</Label>
                        <Select value={settings.mood} onValueChange={(v) => handleSettingChange('mood', v)} disabled={isLoading}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{moods.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm"><Sun size={14} /> Lighting</Label>
                        <Select value={settings.lighting} onValueChange={(v) => handleSettingChange('lighting', v)} disabled={isLoading}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{lightings.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm"><Palette size={14} /> Color Palette</Label>
                        <Select value={settings.colorPalette} onValueChange={(v) => handleSettingChange('colorPalette', v)} disabled={isLoading}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{colorPalettes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-sm"><Diamond size={14} /> Quality</Label>
                          <Select value={settings.quality} onValueChange={(v) => handleSettingChange('quality', v)} disabled={isLoading || settings.model === 'pollinations'}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            {qualities.map(s => (
                              <SelectItem
                                key={s}
                                value={s}
                                disabled={s === '4K Quality' && user.plan !== 'Pro' && user.plan !== 'Mega'}
                              >
                                {s}{s === '4K Quality' && user.plan !== 'Pro' && user.plan !== 'Mega' && ' (Pro/Mega plan required)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
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
                      disabled={isLoading || !canGenerate}
                  >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                      ) : (
                        <><Wand2 className="mr-2 h-4 w-4" />Generate 4 Images ({costPerGeneration} credits)</>
                      )}
                  </Button>
              </div>
              {!canGenerate && (
                  <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                     You're out of credits.
                     <Button variant="link" asChild className="p-1 h-auto"><Link href="/pricing">Purchase a plan</Link></Button> to continue generating.
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
                            <h3 className="font-bold text-lg mb-2">Image Generation Error</h3>
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
            <p className="text-sm">
                This can take a few moments. Four images are being generated.
            </p>
          </div>
        )}
        {!isLoading && generatedImages && (
          <div className={cn(
              "grid gap-4 grid-cols-1 sm:grid-cols-2"
            )}
          >
            {generatedImages.map((imageSrc, index) => (
              <div
                key={index}
                className={cn(
                  'relative w-full overflow-hidden rounded-lg group opacity-0 animate-fadeInUp shadow-lg border'
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
            <p>Enter a prompt above and click "Generate" to begin.</p>
          </div>
        )}
      </div>
    </section>
  );
}
