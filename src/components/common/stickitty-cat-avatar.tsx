
'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type MascotExpression = 'default' | 'animated' | 'happy' | 'thinking';

// This interface now extends HTMLDivElement attributes
interface StickittyCatAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  expression?: MascotExpression;
}

const expressionsMap: Record<MascotExpression, string | string[]> = {
  default: '/circle kitty dark.jpg',
  animated: [
    '/circle kitty dark.jpg',
    '/circle kitty yellow.jpg',
    '/musikitty.jpg' ,
    '/6kitties.jpg',
    '/disobey snorkitty .jpg',
    '/starkitty.jpg',
    '/wizzard kitty.jpg',
  ],
  happy: '/circle kitty yellow.jpg',
  thinking: '/wizzard kitty.jpg',
};

const StickittyCatAvatar: React.FC<StickittyCatAvatarProps> = ({ className, expression = 'default', ...props }) => {
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const imageSource = expressionsMap[expression];
    
    // This effect handles the animation logic
    if (expression === 'animated' && Array.isArray(imageSource)) {
      setCurrentImage(imageSource[0]); // Set initial image for animation
      const intervalId = setInterval(() => {
        setCurrentImage(prevImage => {
          const currentIndex = imageSource.indexOf(prevImage);
          const nextIndex = (currentIndex + 1) % imageSource.length;
          return imageSource[nextIndex];
        });
      }, 1000); // Change image every 1 second

      return () => clearInterval(intervalId);
    } else if (!Array.isArray(imageSource)) {
      // Handle static image changes
      setCurrentImage(imageSource);
    }
  }, [expression]);

  if (!currentImage) {
    // Fallback to the SVG avatar if no image is ready
    return (
      <div className={cn("relative w-full h-full", className)} {...props}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-full h-full"
          aria-label="Stickitty Cat Avatar"
          data-ai-hint="cat avatar"
        >
          <circle cx="50" cy="50" r="40" className="fill-gray-900" />
          <path
            d="M35 30 Q50 20 65 30"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M30 35 L25 20 M70 35 L75 20" // Ears
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="50" r="5" className="fill-primary" />
          <circle cx="60" cy="50" r="5" className="fill-primary" />
          <path
            d="M45 65 Q50 70 55 65" // Mouth
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M75 70 Q85 60 90 50 Q85 40 75 30"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  
  return (
    <div className={cn("relative w-full h-full rounded-full overflow-hidden", className)} {...props}>
      <Image
        key={currentImage} // Key helps React re-render when image source changes
        src={currentImage}
        alt={`Stickitty mascot - ${expression} expression`}
        layout="fill"
        objectFit="cover"
        data-ai-hint="cat mascot"
        unoptimized={true}
      />
    </div>
  );
};

export default StickittyCatAvatar;
