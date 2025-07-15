
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Package, Shield, Truck, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">About StickyTech</h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are the smart Algerian tech shop with a soul. Our mission is to bring you curated, reliable gadgets and expert local services, all backed by a promise of care and warranty.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              StickyTech was born from a simple idea: technology in Algeria should be accessible, reliable, and supported locally. We got tired of the hassle of international returns and the uncertainty of product quality. That's why we decided to build a business that not only sells great products but also stands by them.
            </p>
            <p className="text-muted-foreground">
              We hand-pick and test every item we sell to ensure it meets our high standards. We're a small team of tech enthusiasts passionate about helping our community thrive with the right tools.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/600x400.png"
              alt="The StickyTech Team"
              width={600}
              height={400}
              className="rounded-lg shadow-md"
              data-ai-hint="team working technology"
            />
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-4">
                <Users size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer First</h3>
            <p className="text-muted-foreground">Your satisfaction is our top priority. We're here to help you before, during, and after your purchase.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-4">
                <Shield size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Local Warranty</h3>
            <p className="text-muted-foreground">We handle all warranty claims right here in Algeria. No stress, no international shipping.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-4">
                <Package size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Curated Quality</h3>
            <p className="text-muted-foreground">We only sell products we believe in. Every item is tested for performance and durability.</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 text-primary rounded-full p-4">
                <Truck size={32} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-muted-foreground">With local stock, we ensure your order gets to you quickly, anywhere in the 58 wilayas.</p>
          </div>
        </div>
      </div>

       {/* CTA Section */}
      <div className="bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're buying your first tablet or need a website for your business, we're here to support you. Explore our products and services today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
             <Button size="lg" className="bg-primary text-primary-foreground" asChild>
                <Link href="/store">Explore Products</Link>
             </Button>
             <Button size="lg" variant="outline" asChild>
                <Link href="/services">Discover Services</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
