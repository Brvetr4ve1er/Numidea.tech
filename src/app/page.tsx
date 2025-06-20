
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import StickittyCatAvatar from '@/components/common/stickitty-cat-avatar';
import { ArrowRight, Sparkles, Wand2, ShoppingBag, Edit3, Search } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link, linkText }: { icon: React.ReactNode, title: string, description: string, link?: string, linkText?: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-xl hover:shadow-primary/20 transition-shadow duration-300 flex flex-col animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="font-headline text-2xl text-primary mb-2 tracking-wide">{title}</h3>
    <p className="text-foreground/80 text-sm mb-4 flex-grow">{description}</p>
    {link && linkText && (
      <Button variant="link" asChild className="text-primary hover:text-accent p-0 justify-start">
        <Link href={link}>
          {linkText} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    )}
  </div>
);

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-background to-card p-6">
        <div className="absolute inset-0 opacity-10">
          {/* Subtle background pattern or animation placeholder */}
        </div>
        <div className="relative z-10 animate-fade-in">
          <div className="mb-8 w-48 h-48 mx-auto">
            <StickittyCatAvatar animated={true} />
          </div>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-wider">
            <span className="text-primary">Stickitty</span><span className="text-foreground">.inc</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            Unleash your creativity. Generate, customize, and own unique AI-powered stickers.
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/generator">
                Create Stickers <Wand2 className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-accent font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-shadow" asChild>
              <Link href="/store">
                Shop Drops <ShoppingBag className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Placeholder for scroll-driven animation cue */}
        <div className="absolute bottom-8 text-xs text-foreground/50 animate-pulse">
          Scroll to explore
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-4xl sm:text-5xl text-center mb-4 text-primary tracking-wide">Why Stickitty?</h2>
          <p className="text-center text-foreground/70 mb-12 text-lg max-w-xl mx-auto">
            Dive into a world where art meets AI, and your imagination is the only limit.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wand2 size={36} />}
              title="AI Sticker Generator"
              description="Craft unique stickers from text prompts or vibes. Our AI brings your wildest ideas to life."
              link="/generator"
              linkText="Try Generator"
            />
            <FeatureCard
              icon={<Edit3 size={36} />}
              title="Powerful Editor"
              description="Fine-tune your creations. Resize, drag, add effects, text, and more with our intuitive editor."
              link="/generator"
              linkText="Learn More"
            />
            <FeatureCard
              icon={<Sparkles size={36} />}
              title="AI Companion"
              description="Meet Stickitty, your animated AI guide. Get suggestions, chat, and navigate with ease."
            />
            <FeatureCard
              icon={<ShoppingBag size={36} />}
              title="Exclusive Drops"
              description="Discover limited-edition stickers and merchandise curated by artists and our AI."
              link="/drops"
              linkText="View Drops"
            />
            <FeatureCard
              icon={<Search size={36} />}
              title="Visual Search"
              description="Find stickers by vibe or aesthetic. Our AI-powered search understands your style."
              link="/store"
              linkText="Search Store"
            />
             <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              }
              title="Web3 Ready"
              description="Future-proof your creations. Optional wallet connection for mintable NFTs (coming soon!)."
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-4xl sm:text-5xl text-primary mb-6 tracking-wide animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
            Ready to Get Sticky?
          </h2>
          <p className="text-foreground/80 text-lg mb-8 max-w-xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Join the Stickitty community and start creating today. Your next masterpiece awaits.
          </p>
          <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-primary/50 transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }} asChild>
            <Link href="/auth/signup">
              Sign Up Now <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
