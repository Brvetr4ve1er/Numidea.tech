
import type React from 'react';

interface StickittyLogoProps extends React.SVGProps<SVGSVGElement> {}

const StickittyLogo: React.FC<StickittyLogoProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    aria-label="StickyTech Logo"
    {...props}
  >
    {/* A stylized 'S' for StickyTech */}
    <path
      d="M61,25 C77.5,25 75,40 60,45 C45,50 42.5,60 55,75"
      stroke="hsl(var(--primary))"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M39,75 C22.5,75 25,60 40,55 C55,50 57.5,40 45,25"
      stroke="hsl(var(--accent))"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default StickittyLogo;
