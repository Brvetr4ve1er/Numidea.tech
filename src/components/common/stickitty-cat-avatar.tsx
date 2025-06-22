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
  default: '/circle-kitty-dark.jpg',
  animated: [
    '/circle-kitty-dark.jpg',
    '/circle-kitty-yellow.jpg',
    '/musikitty.jpg',
    '/6kitties.jpg',
    '/disobey-snorkitty.jpg',
    '/starkitty.jpg',
    '/wizzard-kitty.jpg',
  ],
  happy: '/circle-kitty-yellow.jpg',
  thinking: '/wizzard-kitty.jpg',
};

const StickittyCatAvatar: React.FC<StickittyCatAvatarProps> = ({ className, expression = 'default', ...props }) => {
  const getInitialImage = () => {
    const imageSource = expressionsMap[expression];
    return Array.isArray(imageSource) ? imageSource[0] : imageSource;
  };
  
  const [currentImage, setCurrentImage] = useState<string>(getInitialImage());

  useEffect(() => {
    const imageSource = expressionsMap[expression];
    
    // This effect handles the animation logic
    if (expression === 'animated' && Array.isArray(imageSource)) {
      setCurrentImage(imageSource[0]);
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
