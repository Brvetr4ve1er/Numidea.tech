
import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import StickittyLogo from '@/components/common/stickitty-logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="StickyTech Home">
              <StickittyLogo className="h-10 w-auto text-primary" />
              <span className="font-headline text-3xl tracking-wider text-primary">StickyTech</span>
            </Link>
            <p className="text-foreground/70 text-sm">
              Your Smart Algerian Tech Shop with a Soul. Curated Gadgets & Local Services.
            </p>
          </div>
          
          <div>
            <h5 className="font-headline text-lg text-primary mb-3 tracking-wide">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/store" className="text-foreground/80 hover:text-primary transition-colors text-sm">Store</Link></li>
              <li><Link href="#services" className="text-foreground/80 hover:text-primary transition-colors text-sm">Services</Link></li>
              <li><Link href="#faq" className="text-foreground/80 hover:text-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/profile" className="text-foreground/80 hover:text-primary transition-colors text-sm">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-headline text-lg text-primary mb-3 tracking-wide">Connect</h5>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on Facebook" className="text-foreground/70 hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on Instagram" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on WhatsApp" className="text-foreground/70 hover:text-primary transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-foreground/60 text-sm">
          <p>&copy; {currentYear} StickyTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
