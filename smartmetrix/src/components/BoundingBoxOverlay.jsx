import React, { useState } from 'react';
import { Eye, EyeOff, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function BoundingBoxOverlay({ image, title = "Packaging Label Inspection" }) {
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);

  if (!image) return null;

  const boxes = image.boundingBoxes || [];

  const getBoxStyle = (status) => {
    switch (status) {
      case 'valid':
        return 'border-emerald-500 bg-emerald-500/10 text-emerald-700';
      case 'needs_review':
        return 'border-amber-500 bg-amber-500/10 text-amber-700';
      case 'invalid':
        return 'border-rose-500 bg-rose-500/10 text-rose-700';
      default:
        return 'border-blue-500 bg-blue-500/10 text-blue-700';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xs font-sans">
      {/* Header controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-200">{image.label || title}</span>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">
            High Resolution Scan
          </span>
        </div>
        <button
          onClick={() => setShowOverlays(!showOverlays)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition"
        >
          {showOverlays ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{showOverlays ? "Hide Region Highlights" : "Highlight Declarations"}</span>
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full overflow-hidden flex items-center justify-center bg-slate-950 min-h-[360px]">
        <img
          src={image.url}
          alt={image.label}
          className="w-full h-auto object-contain max-h-[460px]"
        />

        {/* Bounding Box Highlights */}
        {showOverlays &&
          boxes.map((box) => (
            <div
              key={box.id}
              onClick={() => setSelectedBox(box)}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.width}%`,
                height: `${box.height}%`
              }}
              className={`absolute border-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-white group ${getBoxStyle(
                box.status
              )} ${selectedBox?.id === box.id ? 'ring-2 ring-white scale-[1.01]' : ''}`}
            >
              <div className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold rounded shadow-xs bg-slate-950 text-white whitespace-nowrap opacity-90 group-hover:opacity-100 flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  box.status === 'valid' ? 'bg-emerald-400' : box.status === 'invalid' ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
                {box.label}
              </div>
            </div>
          ))}
      </div>

      {/* Legend & Info Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Compliant Field
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Needs Verification
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Non-Compliant / Unreadable
            </span>
          </div>

          <span className="text-slate-400 font-mono">
            {image.resolution || '1920x1080'} • {image.size || '2.1MB'}
          </span>
        </div>

        {selectedBox && (
          <div className="p-2 bg-slate-900 border border-slate-700/70 rounded text-xs flex items-start gap-2 text-slate-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">{selectedBox.label}:</span>{' '}
              {selectedBox.comment || `Declaration status: ${selectedBox.status.toUpperCase()}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
