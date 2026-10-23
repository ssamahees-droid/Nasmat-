import React from 'react';

/**
 * High-performance, lightweight Inline SVG icons with simplified single/double paths
 * and fixed width/height attributes to eliminate Cumulative Layout Shift (CLS)
 * and prevent GPU canvas redraws/flickering on mobile devices.
 */

export interface SimpleSvgIconProps {
  size?: number;
  className?: string;
  ariaHidden?: boolean;
}

export const SimpleIconCompass: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const SimpleIconWind: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M17.7 7.7A2.5 2.5 0 1 1 15 5h-12" />
    <path d="M19.7 13.7A2.5 2.5 0 1 1 17 11h-14" />
    <path d="M14.7 19.7A2.5 2.5 0 1 1 12 17h-9" />
  </svg>
);

export const SimpleIconSparkles: React.FC<SimpleSvgIconProps> = ({
  size = 14,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

export const SimpleIconCheck: React.FC<SimpleSvgIconProps> = ({
  size = 14,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const SimpleIconZap: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const SimpleIconShieldCheck: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const SimpleIconShieldAlert: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const SimpleIconChevronLeft: React.FC<SimpleSvgIconProps> = ({
  size = 14,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const SimpleIconChevronRight: React.FC<SimpleSvgIconProps> = ({
  size = 14,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const SimpleIconMessage: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const SimpleIconBook: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const SimpleIconGamepad: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" />
    <line x1="18" y1="11" x2="18.01" y2="11" />
    <rect x="2" y="6" width="20" height="12" rx="2" />
  </svg>
);

export const SimpleIconHeart: React.FC<SimpleSvgIconProps> = ({
  size = 16,
  className = '',
  ariaHidden = true
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
