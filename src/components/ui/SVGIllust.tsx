'use client';

interface SVGIllustProps {
  type: string;
  size?: number;
}

export default function SVGIllust({ type, size = 52 }: SVGIllustProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      {type === 'bench' && (
        <>
          <rect x="8" y="28" width="36" height="3" rx="1.5" stroke="#f97316" strokeWidth="2" />
          <rect x="14" y="18" width="24" height="10" rx="3" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="10" cy="22" r="5" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="42" cy="22" r="5" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <line x1="22" y1="32" x2="22" y2="42" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="32" x2="30" y2="42" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {type === 'incline' && (
        <>
          <rect x="10" y="16" width="32" height="8" rx="3" fill="#f97316" fillOpacity="0.2" stroke="#f97316" strokeWidth="1.5" transform="rotate(-15 26 20)" />
          <circle cx="8" cy="18" r="4" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="44" cy="14" r="4" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <rect x="18" y="28" width="16" height="16" rx="3" fill="#f97316" fillOpacity="0.1" stroke="#f97316" strokeWidth="1" />
        </>
      )}
      {type === 'dips' && (
        <>
          <rect x="8" y="14" width="4" height="28" rx="2" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <rect x="40" y="14" width="4" height="28" rx="2" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <rect x="12" y="16" width="28" height="3" rx="1.5" fill="#f97316" fillOpacity="0.5" />
          <ellipse cx="26" cy="26" rx="8" ry="10" fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeWidth="1.5" />
        </>
      )}
      {type === 'pushdown' && (
        <>
          <rect x="24" y="6" width="4" height="20" rx="2" fill="#f97316" fillOpacity="0.4" stroke="#f97316" strokeWidth="1.5" />
          <rect x="16" y="26" width="20" height="4" rx="2" fill="#f97316" fillOpacity="0.3" stroke="#f97316" strokeWidth="1.5" />
          <circle cx="26" cy="38" r="8" fill="#f97316" fillOpacity="0.15" stroke="#f97316" strokeWidth="1.5" />
          <path d="M22 36 L26 42 L30 36" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
