
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Image as ImageIcon, Download, Share2 } from "lucide-react";
import Image from "next/image";

export default function GeneratorPage() {
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
        <Card className="lg:col-span-1 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Wand2 className="mr-2 h-6 w-6" />
              Create Your Sticker
            </CardTitle>
            <CardDescription>Enter your prompt and select options below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-base">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., A cyberpunk cat wearing sunglasses, neon lights"
                className="min-h-[100px] text-base"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style" className="text-base">Style</Label>
              <select
                id="style"
                className="w-full p-2.5 rounded-md border border-input bg-background text-base focus:ring-primary focus:border-primary"
              >
                <option>Pixel Art</option>
                <option>Cartoon</option>
                <option>3D Render</option>
                <option>Vintage</option>
                <option>Watercolor</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vibe" className="text-base">Vibe</Label>
              <Input id="vibe" placeholder="e.g., Dark, Edgy, Cute, Retro" className="text-base" />
            </div>
            
            <Button size="lg" className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 text-lg">
              Generate Sticker <Wand2 className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Preview and Edit Section */}
        <Card className="lg:col-span-2 bg-card shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <ImageIcon className="mr-2 h-6 w-6" />
              Preview & Edit
            </CardTitle>
            <CardDescription>Your generated sticker will appear here. Edit as needed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-border">
              {/* Placeholder for Fabric.js or Konva.js canvas */}
              <Image 
                src="https://placehold.co/400x400.png?text=Your+Sticker+Here" 
                alt="Sticker Preview" 
                width={400} 
                height={400} 
                className="max-w-full max-h-[400px] object-contain rounded-md"
                data-ai-hint="sticker design" 
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Button variant="outline">Resize</Button>
              <Button variant="outline">Effects</Button>
              <Button variant="outline">Add Text</Button>
              <Button variant="outline">Colors</Button>
            </div>
            <div className="flex space-x-4">
              <Button size="lg" className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 text-lg">
                <Download className="mr-2 h-5 w-5" /> Download
              </Button>
              <Button size="lg" className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 text-lg">
                <Share2 className="mr-2 h-5 w-5" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
