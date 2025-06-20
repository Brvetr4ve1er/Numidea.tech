
import type React from 'react';

interface StickittyLogoProps extends React.SVGProps<SVGSVGElement> {}

const StickittyLogo: React.FC<StickittyLogoProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    aria-label="Stickitty.inc Logo"
    {...props}
  >
    <path
      d="M50 10C27.9 10 10 27.9 10 50C10 72.1 27.9 90 50 90C72.1 90 90 72.1 90 50C90 27.9 72.1 10 50 10ZM50 82C32.3 82 18 67.7 18 50C18 32.3 32.3 18 50 18C67.7 18 82 32.3 82 50C82 67.7 67.7 82 50 82Z"
      className="fill-primary"
    />
    {/* Cat-like 'S' or abstract mark */}
    <path
      d="M62.5 35C62.5 30.8579 59.1421 27.5 55 27.5C50.8579 27.5 47.5 30.8579 47.5 35V42.5H40C35.8579 42.5 32.5 45.8579 32.5 50C32.5 54.1421 35.8579 57.5 40 57.5H52.5V65C52.5 69.1421 55.8579 72.5 60 72.5C64.1421 72.5 67.5 69.1421 67.5 65V50C67.5 42.5 62.5 35 62.5 35Z"
      className="fill-current text-foreground"
      transform="rotate(10 50 50)"
    />
    {/* Whiskers or highlight elements */}
    <path d="M30 45 L20 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-primary/70" />
    <path d="M32 50 L22 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-primary/70" />
    <path d="M30 55 L20 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="stroke-primary/70" />
  </svg>
);

export default StickittyLogo;
