import React, { useState, useRef, useLayoutEffect } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';

export default function BoundingBoxOverlay({ image, title = "Packaging Label Inspection" }) {
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedBox, setSelectedBox] = useState(null);
  const [imgRect, setImgRect] = useState(null);

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Recalculate rendered image bounds whenever the component mounts or resizes.
  // This is critical because object-contain leaves letterbox space around the image,
  // so the bounding boxes must be relative to the actual image pixels — not the container.
  useLayoutEffect(() => {
    const measure = () => {
      if (!imgRef.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const img = imgRef.current;

      const naturalRatio = img.naturalWidth / img.naturalHeight;
      const containerRatio = containerRect.width / containerRect.height;

      let renderedW, renderedH, offsetX, offsetY;

      if (naturalRatio > containerRatio) {
        // Image is wider relative to container — pillarboxed
        renderedW = containerRect.width;
        renderedH = containerRect.width / naturalRatio;
        offsetX = 0;
        offsetY = (containerRect.height - renderedH) / 2;
      } else {
        // Image is taller relative to container — letterboxed
        renderedH = containerRect.height;
        renderedW = containerRect.height * naturalRatio;
        offsetX = (containerRect.width - renderedW) / 2;
        offsetY = 0;
      }

      setImgRect({ renderedW, renderedH, offsetX, offsetY });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [image]);

  if (!image) return null;

  const boxes = image.boundingBoxes || [];

  const getBoxStyle = (status) => {
    switch (status) {
      case 'valid':        return 'border-emerald-500 bg-emerald-500/10';
      case 'needs_review': return 'border-amber-500 bg-amber-500/10';
      case 'invalid':      return 'border-rose-500 bg-rose-500/10';
      default:             return 'border-blue-500 bg-blue-500/10';
    }
  };

  const getDotColor = (status) => {
    if (status === 'valid')        return 'bg-emerald-400';
    if (status === 'invalid')      return 'bg-rose-400';
    if (status === 'needs_review') return 'bg-amber-400';
    return 'bg-blue-400';
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

      {/* Image Container — position:relative so overlays are relative to this div */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden flex items-center justify-center bg-slate-950 min-h-[360px] max-h-[460px]"
        style={{ height: '460px' }}
      >
        <img
          ref={imgRef}
          src={image.url}
          alt={image.label}
          className="w-full h-full object-contain"
          onLoad={() => {
            // Re-measure after image loads its natural dimensions
            if (!imgRef.current || !containerRef.current) return;
            const containerRect = containerRef.current.getBoundingClientRect();
            const img = imgRef.current;
            const naturalRatio = img.naturalWidth / img.naturalHeight;
            const containerRatio = containerRect.width / containerRect.height;
            let renderedW, renderedH, offsetX, offsetY;
            if (naturalRatio > containerRatio) {
              renderedW = containerRect.width;
              renderedH = containerRect.width / naturalRatio;
              offsetX = 0;
              offsetY = (containerRect.height - renderedH) / 2;
            } else {
              renderedH = containerRect.height;
              renderedW = containerRect.height * naturalRatio;
              offsetX = (containerRect.width - renderedW) / 2;
              offsetY = 0;
            }
            setImgRect({ renderedW, renderedH, offsetX, offsetY });
          }}
        />

        {/* Bounding Box Highlights — positioned relative to actual image pixels */}
        {showOverlays && imgRect &&
          boxes.map((box) => (
            <div
              key={box.id}
              onClick={() => setSelectedBox(selectedBox?.id === box.id ? null : box)}
              style={{
                position: 'absolute',
                left:   imgRect.offsetX + (box.x / 100) * imgRect.renderedW,
                top:    imgRect.offsetY + (box.y / 100) * imgRect.renderedH,
                width:  (box.width / 100) * imgRect.renderedW,
                height: (box.height / 100) * imgRect.renderedH,
              }}
              className={`border-2 rounded transition-all cursor-pointer hover:ring-2 hover:ring-white group ${getBoxStyle(box.status)} ${
                selectedBox?.id === box.id ? 'ring-2 ring-white scale-[1.01]' : ''
              }`}
            >
              <div className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold rounded shadow-xs bg-slate-950 text-white whitespace-nowrap opacity-90 group-hover:opacity-100 flex items-center gap-1 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${getDotColor(box.status)}`} />
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
