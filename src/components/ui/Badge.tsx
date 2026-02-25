'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'muted';
  className?: string;
}

const colors: Record<string, { bg: string; border: string; text: string }> = {
  orange: { bg: 'rgba(255,94,31,.12)', border: 'rgba(255,94,31,.3)', text: 'var(--orange)' },
  green: { bg: 'rgba(34,197,94,.12)', border: 'rgba(34,197,94,.25)', text: 'var(--green)' },
  red: { bg: 'rgba(239,68,68,.12)', border: 'rgba(239,68,68,.25)', text: 'var(--red)' },
  blue: { bg: 'rgba(59,130,246,.12)', border: 'rgba(59,130,246,.25)', text: 'var(--blue)' },
  purple: { bg: 'rgba(168,85,247,.12)', border: 'rgba(168,85,247,.25)', text: 'var(--purple)' },
  yellow: { bg: 'rgba(245,197,24,.12)', border: 'rgba(245,197,24,.25)', text: 'var(--yellow)' },
  muted: { bg: 'rgba(255,255,255,.06)', border: 'rgba(255,255,255,.1)', text: 'var(--muted2)' },
};

export default function Badge({ children, variant = 'orange', className = '' }: BadgeProps) {
  const c = colors[variant] ?? colors.orange;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-[10px] font-medium ${className}`}
      style={{
        fontFamily: 'var(--font-space)',
        letterSpacing: '0.5px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
      }}
    >
      {children}
    </span>
  );
}
