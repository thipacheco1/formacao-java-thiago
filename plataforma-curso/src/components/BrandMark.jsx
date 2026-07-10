import React, { useId } from 'react';

const BrandMark = ({ size = 44, className = '', decorative = false }) => {
  const instanceId = useId().replace(/:/g, '');
  const backgroundId = `brand-background-${instanceId}`;
  const glowId = `brand-glow-${instanceId}`;
  const titleId = `brand-title-${instanceId}`;

  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? 'true' : undefined}
      aria-labelledby={decorative ? undefined : titleId}
      focusable="false"
    >
      {!decorative && <title id={titleId}>Java Backend</title>}
      <defs>
        <linearGradient id={backgroundId} x1="9" y1="5" x2="56" y2="59" gradientUnits="userSpaceOnUse">
          <stop stopColor="#527FE5" />
          <stop offset="0.52" stopColor="#2F59B7" />
          <stop offset="1" stopColor="#182B50" />
        </linearGradient>
        <radialGradient id={glowId} cx="0" cy="0" r="1" gradientTransform="translate(18 12) rotate(49) scale(42)">
          <stop stopColor="#BBD0FF" stopOpacity="0.72" />
          <stop offset="1" stopColor="#BBD0FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${backgroundId})`} />
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${glowId})`} />
      <rect x="3" y="3" width="58" height="58" rx="17" stroke="#DDE7FF" strokeOpacity="0.34" strokeWidth="1.4" />

      <path
        d="M34 14.5V36.2C34 44.4 29.2 49.5 21.8 49.5C17.4 49.5 13.9 47.8 11.5 44.5L17.4 39.6C18.7 41.4 20 42.2 22 42.2C25 42.2 26.8 40.1 26.8 36.1V14.5"
        stroke="white"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M41 20H48V42H40" stroke="#AFC7FF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 31H48" stroke="#AFC7FF" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="48" cy="20" r="3.1" fill="#E8EFFF" />
      <circle cx="48" cy="31" r="3.1" fill="#8FB4FF" stroke="#E8EFFF" strokeWidth="1.2" />
      <circle cx="40" cy="42" r="3.1" fill="#E8EFFF" />

      <path d="M14 14H20" stroke="#DCE7FF" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 18H18" stroke="#DCE7FF" strokeOpacity="0.42" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
};

export default BrandMark;
