
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShoppingCart } from "lucide-react";

const ProductCard = ({ name, price, imageUrl, aiHint }: { name: string, price: string, imageUrl: string, aiHint: string }) => (
  <Card className="bg-card shadow-xl hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden flex flex-col animate-slide-up opacity-0" style={{animationDelay: '0.1s'}}>
    <CardHeader className="p-0">
      <div className="aspect-square relative">
        <Image 
          src={imageUrl} 
          alt={name} 
          layout="fill" 
          objectFit="cover"
          data-ai-hint={aiHint}
        />
      </div>
    </CardHeader>
    <CardContent className="p-6 flex-grow">
      <CardTitle className="font-headline text-xl text-primary mb-1 tracking-wide">{name}</CardTitle>
      <CardDescription className="text-lg font-semibold text-foreground/90">{price}</CardDescription>
    </CardContent>
    <CardFooter className="p-6 border-t border-border/40">
      <Button className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold">
        <ShoppingCart size={18} className="mr-2" /> Add to Cart
      </Button>
    </CardFooter>
  </Card>
);

export default function StorePage() {
  const products = [
    { name: "Stickitty Classic Logo Sticker", price: "$3.99", imageUrl: "https://placehold.co/400x400.png", aiHint: "logo sticker" },
    { name: "AI Glitch Cat Sticker", price: "$4.50", imageUrl: "https://placehold.co/400x400.png", aiHint: "glitch art" },
    { name: "Cosmic Wanderer Patch", price: "$7.99", imageUrl: "https://placehold.co/400x400.png", aiHint: "space patch" },
    { name: "Rebel Tech Sticker Sheet", price: "$9.99", imageUrl: "https://placehold.co/400x400.png", aiHint: "tech pattern" },
    { name: "Pixel Heart Sticker", price: "$3.00", imageUrl: "https://placehold.co/400x400.png", aiHint: "pixel art" },
    { name: "Golden Ratio Sticker", price: "$4.00", imageUrl: "https://placehold.co/400x400.png", aiHint: "geometric design" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl sm:text-6xl text-primary mb-4 tracking-wider">Stickitty Store</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Browse our collection of unique stickers, patches, and more. Find your next favorite.
        </p>
      </header>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Input 
            type="search" 
            placeholder="Search stickers by vibe or keyword..." 
            className="pl-10 text-base py-3" 
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Button variant="outline" className="text-base py-3">
          <Filter size={18} className="mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
