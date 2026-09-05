import React from 'react';
import { getStatusConfig } from '../utils/status';

export default function StatusBadge({ status, showIcon = true, size = "md" }) {
  const config = getStatusConfig(status);

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs font-semibold" 
    : size === "lg" 
    ? "px-3 py-1 text-xs font-bold tracking-wide" 
    : "px-2.5 py-0.5 text-xs font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${config.bgClass} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      <span>{config.label}</span>
    </span>
  );
}
