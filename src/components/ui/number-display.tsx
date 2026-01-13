'use client';

import { useState } from 'react';

interface NumberDisplayProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

function formatShort(num: number): string {
  const absNum = Math.abs(num);
  
  if (absNum >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + 'T';
  }
  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  
  return num.toFixed(2);
}

function formatFull(num: number, decimals: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function NumberDisplay({
  value,
  decimals = 6,
  suffix = '',
  className = '',
}: NumberDisplayProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const shortValue = formatShort(value);
  const fullValue = formatFull(value, decimals);

  return (
    <span
      className={`relative cursor-help ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {shortValue}
      {suffix && <span className="ml-1">{suffix}</span>}
      
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-coreezy-800 border border-coreezy-600 rounded-lg shadow-lg text-sm font-mono whitespace-nowrap z-50">
          {fullValue}
          {suffix && <span className="ml-1 text-coreezy-400">{suffix}</span>}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-coreezy-600" />
        </span>
      )}
    </span>
  );
}
