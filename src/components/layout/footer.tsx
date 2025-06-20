
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
            <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="Stickitty.inc Home">
              <StickittyLogo className="h-10 w-auto text-primary" />
              <span className="font-headline text-3xl tracking-wider text-primary">Stickitty.inc</span>
            </Link>
            <p className="text-foreground/70 text-sm">
              Next-gen digital storefront and creative playground for stickers, patches, and customizable merchandise.
            </p>
          </div>
          
          <div>
            <h5 className="font-headline text-lg text-primary mb-3 tracking-wide">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/generator" className="text-foreground/80 hover:text-primary transition-colors text-sm">Generator</Link></li>
              <li><Link href="/store" className="text-foreground/80 hover:text-primary transition-colors text-sm">Store</Link></li>
              <li><Link href="/drops" className="text-foreground/80 hover:text-primary transition-colors text-sm">Drops</Link></li>
              <li><Link href="/profile" className="text-foreground/80 hover:text-primary transition-colors text-sm">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-headline text-lg text-primary mb-3 tracking-wide">Connect</h5>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Stickitty on Twitter" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Stickitty on Instagram" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Stickitty on Github" className="text-foreground/70 hover:text-primary transition-colors">
                <Github size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-foreground/60 text-sm">
          <p>&copy; {currentYear} Stickitty.inc. All rights reserved. Unleash your inner sticker demon.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
