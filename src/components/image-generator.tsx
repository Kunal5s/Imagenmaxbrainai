
'use client';

import { useState } from 'react';
import { Wand2, Loader2, Download, Image as ImageIcon, Terminal } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt) {
      toast({
        title: 'Prompt Required',
        description: 'Please enter a prompt to generate images.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImages(null);
    setApiKeyError(false);

    try {
      const result = await generateImage({ prompt });
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
        <div className="max-w-2xl mx-auto">
            <Card className="border">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="prompt" className="text-lg font-bold">Enter your prompt</Label>
                            <p className="text-sm text-muted-foreground mb-2">Describe the image you want to create in detail.</p>
                            <Textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A majestic lion wearing a crown, sitting on a throne in a cosmic library."
                                className="min-h-[120px]"
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full font-bold hover:scale-105 transition-transform" disabled={isLoading}>
                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : <><Wand2 className="mr-2 h-4 w-4" />Generate 4 Images</>}
                        </Button>
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
                         <div key={index} className="relative aspect-square w-full overflow-hidden rounded-lg group opacity-0 animate-fadeInUp shadow-lg" style={{ animationDelay: `${index * 150}ms`}}>
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
