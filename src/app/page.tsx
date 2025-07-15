
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Tablet, Smartphone, ShieldCheck, Package, Rocket, Palette, Bot, Phone, Star, MessageSquare } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-xl hover:shadow-primary/20 transition-shadow duration-300 flex flex-col items-center text-center animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="font-headline text-2xl text-primary mb-2 tracking-wide">{title}</h3>
    <p className="text-foreground/80 text-sm flex-grow">{description}</p>
  </div>
);

const ProductCard = ({ name, description, price, imageUrl, aiHint }: { name: string, description: string, price: string, imageUrl: string, aiHint: string }) => (
    <div className="bg-card rounded-lg shadow-xl overflow-hidden flex flex-col group animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div className="relative aspect-square overflow-hidden">
            <Image 
                src={imageUrl} 
                alt={name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={aiHint}
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-headline text-2xl text-primary tracking-wide mb-2">{name}</h3>
            <p className="text-foreground/80 text-sm mb-4 flex-grow">{description}</p>
            <p className="text-2xl font-semibold text-accent mb-4">{price}</p>
            <Button className="w-full mt-auto bg-primary hover:bg-accent text-primary-foreground font-semibold">
                View Product <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    </div>
);

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-primary/10 transition-shadow flex items-center gap-4">
    <div className="text-primary shrink-0">{icon}</div>
    <div>
      <h4 className="font-headline text-xl text-primary tracking-wide">{title}</h4>
      <p className="text-foreground/70 text-sm">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, comment, imageUrl, aiHint }: { name: string, comment: string, imageUrl: string, aiHint: string }) => (
    <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
        <Image src={imageUrl} alt={name} width={80} height={80} className="rounded-full mb-4 border-4 border-primary/50" data-ai-hint={aiHint} />
        <div className="flex mb-3 text-primary">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
        </div>
        <p className="text-foreground/80 mb-4 italic flex-grow">&quot;{comment}&quot;</p>
        <p className="font-semibold text-primary/90">- {name}</p>
    </div>
);

export default function HomePage() {
  const products = [
    { name: 'Kids Tablet Pro', description: '8" HD Screen, 64GB Storage, Kid-proof case included. Learning and fun, safely.', price: '24,000 DZD', imageUrl: 'https://placehold.co/400x400.png', aiHint: 'kids tablet' },
    { name: 'StickyNote 10', description: '10.1" Display, Stylus Pen, 128GB Storage. Your ultimate productivity partner.', price: '35,000 DZD', imageUrl: 'https://placehold.co/400x400.png', aiHint: 'tablet stylus' },
    { name: 'PowerBank Ultra', description: '20,000mAh capacity, fast charging. Never run out of power on the go.', price: '6,500 DZD', imageUrl: 'https://placehold.co/400x400.png', aiHint: 'power bank' },
  ];

  const testimonials = [
      { name: 'Fatiha B.', comment: 'Excellent service and fast delivery! The tablet was exactly as described. Highly recommend.', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'happy woman' },
      { name: 'Karim L.', comment: 'They helped me set up a website for my business. Very professional and patient. Thank you StickyTech!', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'smiling man' },
      { name: 'Amina S.', comment: 'I love my new StickyNote! It\'s perfect for my studies. The local warranty gives me peace of mind.', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'female student' },
  ]

  const faqs = [
      { q: "How does delivery work?", a: "We offer fast delivery across all 58 wilayas. Delivery to your home or office is available. Standard delivery time is 1-3 business days." },
      { q: "What about warranty?", a: "All our smart devices come with a local warranty. We handle repairs and replacements right here, so you don't have to worry about international shipping." },
      { q: "What payment methods are accepted?", a: "We accept cash on delivery (Paiement à la livraison) for your convenience. We are also working on integrating CIB and Edahabia online payments soon." },
      { q: "Are your products original?", a: "Yes, we only sell 100% original and curated products. We test everything to ensure it meets our quality standards before offering it to you." }
  ]

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(80vh)] flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-background to-card p-6">
        <div className="relative z-10 animate-fade-in">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-wider">
            <span className="text-primary">StickyTech</span><span className="text-foreground">.dz</span>
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 mb-10 max-w-2xl mx-auto">
            The Smart Algerian Tech Shop with a Soul. Curated Gadgets & Local Services.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/40 transition-shadow" asChild>
              <Link href="/store">
                Shop Gadgets <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 hover:text-accent font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/20 transition-shadow" asChild>
              <a href="https://wa.me/YOUR_NUMBER_HERE" target="_blank" rel="noopener noreferrer">
                Contact via WhatsApp <Phone className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Highlights Section */}
      <section id="products" className="w-full py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-headline text-4xl sm:text-5xl text-center mb-4 text-primary tracking-wide">Our Top Gadgets</h2>
              <p className="text-center text-foreground/70 mb-12 text-lg max-w-xl mx-auto">
                  Hand-picked technology to make your life easier and more productive.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => <ProductCard key={product.name} {...product} />)}
              </div>
          </div>
      </section>

      {/* Why Choose StickyTech? */}
      <section id="why-us" className="w-full py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-4xl sm:text-5xl text-center mb-4 text-primary tracking-wide">Why Choose StickyTech?</h2>
          <p className="text-center text-foreground/70 mb-12 text-lg max-w-xl mx-auto">
            We're more than just a store. We're your local tech partner.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck size={48} />}
              title="Local Warranty"
              description="No hassle, no international shipping. We handle all warranty claims locally for your peace of mind."
            />
            <FeatureCard
              icon={<Package size={48} />}
              title="In-Stock & Ready"
              description="All our products are in-stock locally in Algeria, ensuring fast delivery to your doorstep."
            />
            <FeatureCard
              icon={<Rocket size={48} />}
              title="Curated Gadgets"
              description="We don't sell everything. We only sell tested and approved gadgets that offer real value."
            />
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="w-full py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-headline text-4xl sm:text-5xl text-center mb-4 text-primary tracking-wide">Our Services</h2>
              <p className="text-center text-foreground/70 mb-12 text-lg max-w-xl mx-auto">
                  Leverage our expertise to boost your personal or business projects.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCard icon={<Rocket size={32}/>} title="Websites & Apps" description="Professional websites and applications for your business." />
                <ServiceCard icon={<Palette size={32}/>} title="Branding & Logo Kits" description="Get a complete visual identity that stands out." />
                <ServiceCard icon={<Bot size={32}/>} title="WhatsApp Auto-Repliers" description="Automate your customer communication with smart bots." />
                <ServiceCard icon={<Phone size={32}/>} title="Flexy & Recharge Help" description="We assist with mobile credit and bill payments." />
              </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-16 sm:py-24 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-headline text-4xl sm:text-5xl text-center mb-4 text-primary tracking-wide">What Our Clients Say</h2>
              <p className="text-center text-foreground/70 mb-12 text-lg max-w-xl mx-auto">
                  Real feedback from our valued customers across Algeria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map(t => <TestimonialCard key={t.name} {...t} />)}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
              <h2 className="font-headline text-4xl sm:text-5xl text-center mb-12 text-primary tracking-wide">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                      <AccordionItem value={`item-${index + 1}`} key={index}>
                          <AccordionTrigger className="text-lg font-semibold text-left">{faq.q}</AccordionTrigger>
                          <AccordionContent className="text-base text-foreground/80">
                              {faq.a}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 sm:py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-4xl sm:text-5xl text-primary mb-6 tracking-wide animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-foreground/80 text-lg mb-8 max-w-xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Explore our curated products or get in touch to discuss your next project.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-accent text-primary-foreground font-semibold px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-primary/50 transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }} asChild>
                <Link href="/store">
                Shop Now <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-accent font-semibold px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-primary/20 transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }} asChild>
                <Link href="#services">
                    Our Services <MessageSquare className="ml-2 h-6 w-6" />
                </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
