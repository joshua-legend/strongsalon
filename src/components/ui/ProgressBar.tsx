'use client';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  gradient?: string;
  height?: number;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color,
  gradient,
  height = 6,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div
      className={`progress-track ${className}`}
      style={{ height }}
    >
      <div
        className="progress-fill"
        style={{
          width: `${pct}%`,
          background: gradient || color || 'var(--orange)',
        }}
      />
    </div>
  );
}
