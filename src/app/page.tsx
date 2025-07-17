
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Tablet, Smartphone, ShieldCheck, Package, Rocket, Palette, Bot, Phone, Star, MessageSquare, Users, Shield, Truck, Instagram, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ContactForm from '@/components/home/contact-form';


const ProductCard = ({ name, description, price, imageUrl, aiHint }: { name: string, description: string, price: string, imageUrl: string, aiHint: string }) => (
    <Card className="bg-card rounded-lg shadow-sm overflow-hidden flex flex-col group animate-slide-up opacity-0 border hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="p-0">
            <div className="relative aspect-square overflow-hidden">
                <Image 
                    src={imageUrl} 
                    alt={name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={aiHint}
                />
            </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
            <p className="text-xl font-bold text-primary">{price}</p>
        </CardContent>
        <CardFooter className="p-4 bg-muted/30">
            <Button className="w-full mt-auto bg-primary text-primary-foreground font-semibold">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
);

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 border">
    <div className="text-primary shrink-0">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold text-foreground">{title}</h4>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, comment, imageUrl, aiHint }: { name: string, comment: string, imageUrl: string, aiHint: string }) => (
    <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center border">
        <Image src={imageUrl} alt={name} width={80} height={80} className="rounded-full mb-4 border-4 border-accent" data-ai-hint={aiHint} />
        <div className="flex mb-3 text-accent">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
        </div>
        <p className="text-muted-foreground mb-4 italic flex-grow">&quot;{comment}&quot;</p>
        <p className="font-semibold text-foreground">- {name}</p>
    </div>
);

const socialLinks = [
    {
        icon: <MessageCircle size={28} />,
        name: "WhatsApp",
        handle: "+213 123 456 789",
        url: "https://wa.me/213123456789",
        cta: "Chat with us"
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
        name: "Facebook",
        handle: "@StickyTechDZ",
        url: "#",
        cta: "Follow us"
    },
    {
        icon: <Instagram size={28} />,
        name: "Instagram",
        handle: "@StickyTechDZ",
        url: "#",
        cta: "Follow us"
    },
];

export default function HomePage() {
  const products = [
    { name: 'Note 10', description: '10.1" Display, Stylus Pen, 128GB Storage. Your ultimate productivity partner.', price: '35,000 DZD', imageUrl: '/tablet-note-10.png', aiHint: 'tablet stylus' },
    { name: 'Kids Tablet Pro', description: '8" HD Screen, 64GB Storage, Kid-proof case included. Learning and fun, safely.', price: '24,000 DZD', imageUrl: '/kids-tablet.png', aiHint: 'kids tablet' },
    { name: 'Note 12', description: '12" Super AMOLED, 256GB, Pro-level cameras. For the professional on the move.', price: '55,000 DZD', imageUrl: '/tablet-note-12.png', aiHint: 'professional tablet' },
  ];

  const testimonials = [
      { name: 'Fatiha B.', comment: 'Excellent service and fast delivery! The tablet was exactly as described. Highly recommend.', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'happy woman' },
      { name: 'Karim L.', comment: 'They helped me set up a website for my business. Very professional and patient. Thank you StickyTech!', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'smiling man' },
      { name: 'Amina S.', comment: 'I love my new Note 10! It\'s perfect for my studies. The local warranty gives me peace of mind.', imageUrl: 'https://placehold.co/100x100.png', aiHint: 'female student' },
  ]

  const faqs = [
      { q: "How does delivery work?", a: "We offer fast delivery across all 58 wilayas. Delivery to your home or office is available. Standard delivery time is 1-3 business days." },
      { q: "What about warranty?", a: "All our smart devices come with a local warranty. We handle repairs and replacements right here, so you don't have to worry about international shipping." },
      { q: "What payment methods are accepted?", a: "We accept cash on delivery (Paiement à la livraison) for your convenience. We are also working on integrating CIB and Edahabia online payments soon." },
      { q: "Are your products original?", a: "Yes, we only sell 100% original and curated products. We test everything to ensure it meets our quality standards before offering it to you." }
  ]

  return (
    <div className="flex flex-col items-center bg-background text-foreground">
      {/* Hero Section */}
      <section className="w-full min-h-[calc(80vh)] flex flex-col items-center justify-center text-center relative overflow-hidden bg-white p-6">
        <div className="relative z-10 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-primary">Affordable Local Tech</span>
            <span className="text-foreground">, with Care and Warranty.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Welcome to StickyTech, your trusted source for curated gadgets and expert local services in Algeria.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-lg shadow-md hover:bg-primary/90 transition-shadow" asChild>
              <Link href="/store">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5 hover:text-primary font-semibold px-8 py-6 text-lg rounded-lg shadow-sm" asChild>
              <Link href="/#contact">
                Contact Us
              </Link>
            </Button>
             <Button variant="ghost" size="lg" className="text-primary hover:bg-primary/5 font-semibold px-8 py-6 text-lg rounded-lg" asChild>
              <Link href="/services">
                Explore Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Highlights Section */}
      <section id="products" className="w-full py-16 sm:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground">Our Top Gadgets</h2>
              <p className="text-center text-muted-foreground mb-12 text-lg max-w-xl mx-auto">
                  Hand-picked technology to make your life easier and more productive.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map(product => <ProductCard key={product.name} {...product} />)}
              </div>
          </div>
      </section>

      {/* Why Choose StickyTech? */}
      <section id="why-us" className="w-full py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">Why Choose StickyTech?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Warranty</h3>
              <p className="text-muted-foreground">No hassle, no international shipping. We handle all warranty claims locally for your peace of mind.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">In-Stock & Ready</h3>
              <p className="text-muted-foreground">All our products are in-stock locally in Algeria, ensuring fast delivery to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                <Rocket size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Gadgets</h3>
              <p className="text-muted-foreground">We don't sell everything. We only sell tested and approved gadgets that offer real value.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="w-full py-16 sm:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground">Our Services</h2>
              <p className="text-center text-muted-foreground mb-12 text-lg max-w-xl mx-auto">
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
      <section id="testimonials" className="w-full py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-foreground">What Our Clients Say</h2>
              <p className="text-center text-muted-foreground mb-12 text-lg max-w-xl mx-auto">
                  Real feedback from our valued customers across Algeria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {testimonials.map(t => <TestimonialCard key={t.name} {...t} />)}
              </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="w-full py-16 sm:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-foreground">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                      <AccordionItem value={`item-${index + 1}`} key={index}>
                          <AccordionTrigger className="text-lg font-semibold text-left">{faq.q}</AccordionTrigger>
                          <AccordionContent className="text-base text-muted-foreground">
                              {faq.a}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>
          </div>
      </section>

       {/* About Us Section */}
      <section id="about" className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-foreground mb-4">About StickyTech</h2>
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We're here to help! Whether you have a question about a product or a project in mind, feel free to reach out.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Info & Socials */}
                <div className="lg:col-span-1 space-y-8">
                    {socialLinks.map((link) => (
                        <Card key={link.name} className="border">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="text-primary">{link.icon}</div>
                                <div>
                                    <CardTitle className="text-lg">{link.name}</CardTitle>
                                    <CardDescription>{link.handle}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="outline" className="w-full">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer">{link.cta}</a>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                     <Card className="border">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                             <div className="text-primary"><MapPin size={28} /></div>
                             <div>
                                <CardTitle className="text-lg">Our Location</CardTitle>
                                <CardDescription>Algiers, Algeria</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="aspect-video bg-muted rounded-md overflow-hidden">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204553.79979402513!2d2.959922896561022!3d36.75841315904832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad614b533d31%3A0x33893a4e934c264!2sAlgiers!5e0!3m2!1sen!2sdz!4v1677610014001!5m2!1sen!2sdz" 
                                    width="100%" 
                                    height="100%" 
                                    style={{border:0}} 
                                    allowFullScreen={false} 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="h-full border">
                         <CardHeader>
                            <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                            <CardDescription>Fill out the form and we'll get back to you as soon as possible.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <ContactForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '0.2s' }}>
            Explore our curated products or get in touch to discuss your next project.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground font-semibold px-10 py-6 text-xl rounded-lg shadow-lg hover:bg-primary/90 transition-shadow animate-slide-up opacity-0" style={{ animationDelay: '0.3s' }} asChild>
                <Link href="/store">
                Shop Now <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 font-semibold px-10 py-6 text-xl rounded-lg shadow-sm animate-slide-up opacity-0" style={{ animationDelay: '0.4s' }} asChild>
                <Link href="/services">
                    Our Services <MessageSquare className="ml-2 h-6 w-6" />
                </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
