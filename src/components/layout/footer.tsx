
import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import StickittyLogo from '@/components/common/stickitty-logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="StickyTech Home">
              <StickittyLogo className="h-10 w-auto text-primary" />
              <span className="font-bold text-2xl tracking-tight text-foreground">StickyTech</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Your trusted Algerian partner for smart, affordable technology and expert local services, all with care and warranty.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold text-foreground mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/store" className="text-muted-foreground hover:text-primary transition-colors text-sm">Shop</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Services</Link></li>
              <li><Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-foreground mb-3">Connect</h5>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://wa.me/213123456789" target="_blank" rel="noopener noreferrer" aria-label="StickyTech on WhatsApp" className="text-muted-foreground hover:text-primary transition-colors">
                 <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} StickyTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
