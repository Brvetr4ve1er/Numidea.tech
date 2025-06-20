'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { generateStickerTemplates, GenerateStickerTemplatesOutput } from '@/ai/flows/ai-sticker-generation-for-admin';
import { useToast } from '@/hooks/use-toast';

export default function NewAIDropPage() {
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GenerateStickerTemplatesOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setGeneratedData(null);

    const formData = new FormData(event.currentTarget);
    const theme = formData.get('theme') as string;
    const trend = formData.get('trend') as string;
    const quantity = Number(formData.get('quantity'));

    if (!theme || !trend || !quantity) {
      toast({
        title: "Missing fields",
        description: "Please fill out all fields to generate templates.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const result = await generateStickerTemplates({ theme, trend, quantity });
      setGeneratedData(result);
      toast({
        title: "Success!",
        description: `${result.stickerTemplates.length} templates generated.`,
      });
    } catch (error) {
      console.error("Error generating templates:", error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong while generating the templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <h1 className="font-headline text-4xl sm:text-5xl text-primary tracking-wider">Trigger AI Drop</h1>
        <p className="text-lg text-foreground/80">Generate a new set of sticker templates using AI based on a theme and trend.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 bg-card shadow-xl h-fit">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Wand2 className="mr-2 h-6 w-6" />
              Generation Parameters
            </CardTitle>
            <CardDescription>Define the inputs for the AI generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-base">Theme</Label>
                <Input id="theme" name="theme" placeholder="e.g., Solarpunk, Cottagecore" className="text-base" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trend" className="text-base">Trend</Label>
                <Input id="trend" name="trend" placeholder="e.g., Holographic, Claymation" className="text-base" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-base">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" defaultValue="3" min="1" max="10" className="text-base" required />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 text-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                {loading ? 'Generating...' : 'Generate Templates'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <ImageIcon className="mr-2 h-6 w-6" />
              Generated Templates
            </CardTitle>
            <CardDescription>The results of the AI generation will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              </div>
            )}
            {!loading && !generatedData && (
              <div className="text-center py-20 text-foreground/60">
                <p>Generated templates will be shown here.</p>
              </div>
            )}
            {generatedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedData.stickerTemplates.map((template, index) => (
                  <div key={index} className="border border-border rounded-lg p-2">
                    <div className="aspect-square bg-muted/50 rounded-md mb-2 relative">
                      <Image src={template.imageDataUri} alt={`Generated Sticker ${index + 1}`} layout="fill" objectFit="contain" />
                    </div>
                    <p className="text-xs text-muted-foreground truncate" title={template.prompt}>
                      <strong>Prompt:</strong> {template.prompt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
