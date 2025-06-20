
import type React from 'react';
import { cn } from '@/lib/utils';

interface StickittyCatAvatarProps extends React.SVGProps<SVGSVGElement> {
  animated?: boolean;
}

const StickittyCatAvatar: React.FC<StickittyCatAvatarProps> = ({ className, animated = false, ...props }) => {
  return (
    <div className={cn("relative", animated && "animate-float")}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={cn("w-full h-full", className)}
        aria-label="Stickitty Cat Avatar"
        data-ai-hint="cat avatar"
        {...props}
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
        {/* Simple tail */}
        <path 
          d="M75 70 Q85 60 90 50 Q85 40 75 30"
          stroke="hsl(var(--primary))"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      {animated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary text-xs font-bold animate-ping">✨</span>
        </div>
      )}
    </div>
  );
};

export default StickittyCatAvatar;
