
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import StickittyLogo from '@/components/common/stickitty-logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle } from 'lucide-react';
import type { NavItem } from '@/lib/constants';
import { NAV_LINKS } from '@/lib/constants';


const Header = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2" aria-label="StickyTech Home">
          <StickittyLogo className="h-8 w-auto" />
          <span className="font-headline text-2xl tracking-wider text-primary">StickyTech</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {NAV_LINKS.map((item: NavItem) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary bg-primary/10" : "text-foreground/80"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link href="/profile" aria-label="User Profile">
              <UserCircle className="h-6 w-6" />
            </Link>
          </Button>
          <Button asChild className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth/login">Login</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-card">
              <nav className="flex flex-col space-y-4 pt-8">
                {NAV_LINKS.map((item: NavItem) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary bg-primary/10" : "text-card-foreground/80"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="border-border" />
                <Link
                  href="/profile"
                  className={cn(
                    "px-3 py-2 rounded-md text-lg font-medium transition-colors hover:text-primary flex items-center",
                    pathname === "/profile" ? "text-primary bg-primary/10" : "text-card-foreground/80"
                  )}
                >
                  <UserCircle className="mr-2 h-5 w-5" /> Profile
                </Link>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
                  <Link href="/auth/login">Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
