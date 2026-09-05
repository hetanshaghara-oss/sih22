import React from 'react';
import { Trash2, RefreshCw, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export default function ImagePreview({ images = [], onDelete, onReplace }) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Uploaded Product Label Images ({images.length})</span>
        </h4>
        <span className="text-xs text-slate-500 font-medium">Ready for OCR Extraction</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition"
          >
            {/* Thumbnail */}
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {img.label || img.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                      img.quality === 'Good'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {img.quality === 'Good' ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                    )}
                    <span>Quality: {img.quality}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{img.name}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Size: {img.size}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {onReplace && (
                  <button
                    onClick={() => onReplace(idx)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
