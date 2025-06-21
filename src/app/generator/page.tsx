'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Image as ImageIcon, Download, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import { generateSticker } from '@/ai/flows/generate-sticker';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function GeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedImage(null);

    const formData = new FormData(event.currentTarget);
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
      toast({
        title: "Prompt is missing",
        description: "Please enter a prompt to generate a sticker.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await generateSticker({ prompt });
      setGeneratedImage(result.stickerDataUri);
      toast({
        title: "Sticker Generated!",
        description: "Your creation is ready.",
      });
    } catch (error) {
      console.error("Error generating sticker:", error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl sm:text-6xl text-primary mb-4 tracking-wider">Sticker Generator</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Bring your imagination to life. Describe your sticker, choose a style, and let our AI do the magic.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Section */}
        <Card className="lg:col-span-1 bg-card shadow-xl h-fit">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Wand2 className="mr-2 h-6 w-6" />
              Create Your Sticker
            </CardTitle>
            <CardDescription>Enter your prompt and select options below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base">Prompt</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="e.g., A cyberpunk cat wearing sunglasses, neon lights"
                  className="min-h-[100px] text-base"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="style" className="text-base">Style</Label>
                <select
                  id="style"
                  name="style"
                  className="w-full p-2.5 rounded-md border border-input bg-background text-base focus:ring-primary focus:border-primary"
                >
                  <option>Vector Art</option>
                  <option>Pixel Art</option>
                  <option>Cartoon</option>
                  <option>3D Render</option>
                  <option>Vintage</option>
                  <option>Watercolor</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibe" className="text-base">Vibe</Label>
                <Input id="vibe" name="vibe" placeholder="e.g., Dark, Edgy, Cute, Retro" className="text-base" />
              </div>
              
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 text-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                {loading ? 'Generating...' : 'Generate Sticker'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview and Edit Section */}
        <Card className="lg:col-span-2 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <ImageIcon className="mr-2 h-6 w-6" />
              Preview & Edit
            </CardTitle>
            <CardDescription>Your generated sticker will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-border">
              {loading && <Loader2 className="h-12 w-12 text-primary animate-spin" />}
              {!loading && !generatedImage && (
                <Image 
                  src="https://placehold.co/400x400.png?text=Your+Sticker+Here" 
                  alt="Sticker Preview" 
                  width={400} 
                  height={400} 
                  className="max-w-full max-h-[400px] object-contain rounded-md"
                  data-ai-hint="sticker design" 
                />
              )}
              {generatedImage && (
                <Image 
                  src={generatedImage} 
                  alt="Generated Sticker" 
                  width={400} 
                  height={400} 
                  className="max-w-full max-h-[400px] object-contain rounded-md"
                />
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Button variant="outline" disabled={!generatedImage}>Resize</Button>
              <Button variant="outline" disabled={!generatedImage}>Effects</Button>
              <Button variant="outline" disabled={!generatedImage}>Add Text</Button>
              <Button variant="outline" disabled={!generatedImage}>Colors</Button>
            </div>
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 text-lg" disabled={!generatedImage}>
                <Download className="mr-2 h-5 w-5" /> Download
              </Button>
              <Button size="lg" className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 text-lg" disabled={!generatedImage}>
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
