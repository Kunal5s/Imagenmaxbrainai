'use client';

import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { suggestModifications } from '@/ai/flows/suggest-modifications';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';

interface SuggestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: {
    id: number;
    src: string;
    prompt: string;
    hint: string;
  };
}

// Helper to fetch image and convert to data URI
async function toDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const SuggestionDialog: FC<SuggestionDialogProps> = ({ open, onOpenChange, image }) => {
  const [userPreferences, setUserPreferences] = useState('');
  const [industryBestPractices, setIndustryBestPractices] = useState('');
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (image?.src && open) {
      setIsPreparing(true);
      setSuggestion(null);
      setUserPreferences('');
      setIndustryBestPractices('');
      toDataURL(image.src)
        .then(setImageDataUri)
        .catch(err => {
          console.error('Failed to convert image to data URI', err);
          toast({
            title: 'Error',
            description: 'Could not load image data for analysis.',
            variant: 'destructive',
          });
        })
        .finally(() => setIsPreparing(false));
    }
  }, [image, open, toast]);

  const handleSubmit = async () => {
    if (!imageDataUri) {
      toast({
        title: 'Error',
        description: 'Image data is not available for analysis.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestion(null);

    try {
      const result = await suggestModifications({
        imageDataUri,
        userPreferences,
        industryBestPractices,
      });
      setSuggestion(result.suggestedModifications);
    } catch (error) {
      console.error('Failed to get suggestions', error);
      toast({
        title: 'AI Suggestion Failed',
        description: 'There was an error while generating suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="flex flex-col gap-4">
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline">AI Content Suggestions</DialogTitle>
                <DialogDescription>
                    Analyze your image with our AI to get suggestions for improvement.
                </DialogDescription>
            </DialogHeader>
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
            <Image
              src={image.src}
              alt={image.prompt}
              width={600}
              height={800}
              className="object-cover w-full h-full"
              data-ai-hint={image.hint}
            />
          </div>
          <p className="text-sm text-muted-foreground italic">"{image.prompt}"</p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="user-preferences" className="font-bold">Your Preferences</Label>
            <Textarea
              id="user-preferences"
              placeholder="e.g., 'I prefer a more vibrant and fantasy-like style.'"
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="industry-best-practices" className="font-bold">Industry / Goal</Label>
            <Textarea
              id="industry-best-practices"
              placeholder="e.g., 'This is for a book cover, it needs to be eye-catching.'"
              value={industryBestPractices}
              onChange={(e) => setIndustryBestPractices(e.target.value)}
                className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-col-reverse sm:space-x-0 gap-2">
            {suggestion && (
                <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-4">
                        <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" />AI Suggestions:</h4>
                        <p className="text-sm">{suggestion}</p>
                    </CardContent>
                </Card>
            )}
            <Button onClick={handleSubmit} disabled={isLoading || isPreparing} className="w-full">
              {isLoading || isPreparing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPreparing ? 'Preparing Image...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionDialog;
