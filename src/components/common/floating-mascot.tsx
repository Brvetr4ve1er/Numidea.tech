'use client';

import React, { useState, useEffect } from 'react';
import StickittyCatAvatar, { MascotExpression } from './stickitty-cat-avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingMascot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay appearance to avoid hydration issues and make it less intrusive on load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-500 ease-out",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    )}>
      {isOpen && (
        <div className="bg-card p-4 rounded-lg shadow-xl mb-2 w-64 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-headline text-primary text-lg flex items-center gap-2">
              <StickittyCatAvatar expression="happy" className="w-8 h-8"/>
              Stickitty
            </h4>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-7 w-7">
              <X size={18} />
            </Button>
          </div>
          <p className="text-sm text-foreground/80 mb-3">Hey there! Need help or got a cool sticker idea? Let me know!</p>
          <input 
            type="text" 
            placeholder="Chat with Stickitty..." 
            className="w-full p-2 rounded-md border border-input bg-background text-sm focus:ring-primary focus:border-primary"
          />
        </div>
      )}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
        size="lg"
        className="rounded-full p-0 w-16 h-16 bg-primary hover:bg-accent text-primary-foreground shadow-2xl flex items-center justify-center animate-float"
        aria-label={isOpen ? "Close Stickitty chat" : "Open Stickitty chat"}
      >
        {isOpen ? <X size={30} /> : <StickittyCatAvatar expression="animated" className="w-12 h-12 p-1" />}
      </Button>
    </div>
  );
};

export default FloatingMascot;
