
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Zap, Clock } from "lucide-react";

const DropItem = ({ title, description, imageUrl, releaseDate, remaining, aiHint }: { title: string, description: string, imageUrl: string, releaseDate?: string, remaining?: string, aiHint: string }) => (
  <Card className="bg-card shadow-xl hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden flex flex-col animate-slide-up opacity-0" style={{animationDelay: '0.1s'}}>
    <CardHeader className="p-0">
      <div className="aspect-video relative">
        <Image 
          src={imageUrl} 
          alt={title} 
          layout="fill" 
          objectFit="cover" 
          data-ai-hint={aiHint}
        />
      </div>
    </CardHeader>
    <CardContent className="p-6 flex-grow">
      <CardTitle className="font-headline text-2xl text-primary mb-2 tracking-wide">{title}</CardTitle>
      <CardDescription className="text-foreground/80 text-sm mb-4">{description}</CardDescription>
    </CardContent>
    <CardFooter className="p-6 border-t border-border/40">
      <div className="flex justify-between items-center w-full text-xs text-foreground/70">
        {releaseDate && (
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-primary" /> Release: {releaseDate}
          </div>
        )}
        {remaining && (
          <div className="flex items-center font-semibold text-primary">
            <Zap size={14} className="mr-1" /> {remaining}
          </div>
        )}
      </div>
      <Button className="w-full mt-4 bg-primary hover:bg-accent text-primary-foreground font-semibold">View Drop</Button>
    </CardFooter>
  </Card>
);

export default function DropsPage() {
  const drops = [
    {
      title: "Neon City Pack",
      description: "A collection of vibrant cyberpunk-themed stickers. Limited to 100 editions.",
      imageUrl: "https://placehold.co/600x400.png",
      releaseDate: "Oct 26, 2023",
      remaining: "34 Left",
      aiHint: "cyberpunk neon"
    },
    {
      title: "Mystic Creatures Vol. 1",
      description: "Enchanting fantasy creatures, beautifully illustrated. Get them before they vanish!",
      imageUrl: "https://placehold.co/600x400.png",
      releaseDate: "Nov 02, 2023",
      remaining: "Sold Out",
      aiHint: "fantasy creatures"
    },
    {
      title: "Retro Arcade Flashback",
      description: "Pixelated nostalgia from the golden age of gaming. Perfect for your laptop or console.",
      imageUrl: "https://placehold.co/600x400.png",
      releaseDate: "Upcoming",
      aiHint: "retro arcade"
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="text-center mb-12">
        <h1 className="font-headline text-5xl sm:text-6xl text-primary mb-4 tracking-wider">Exclusive Drops</h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Discover limited-edition sticker packs and unique designs. Don't miss out!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {drops.map((drop, index) => (
          <DropItem key={index} {...drop} />
        ))}
      </div>
    </div>
  );
}
