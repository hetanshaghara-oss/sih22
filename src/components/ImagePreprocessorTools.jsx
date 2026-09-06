import React, { useState } from 'react';
import { Sliders, RotateCw, Crop, Wand2, RefreshCw, Eye, Layers } from 'lucide-react';
import { processCanvasImage, rotateCanvasImage, applyPerspectiveWarp, cropCanvasRegion } from '../utils/advancedImageEnhancer';

export default function ImagePreprocessorTools({ imageSrc, onImageTransformed }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isWarpActive, setIsWarpActive] = useState(false);
  const [activeCrop, setActiveCrop] = useState('full'); // 'full' | 'mrp' | 'mfg' | 'mfr'
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRotate = async (deltaDegrees) => {
    const newAngle = (rotationAngle + deltaDegrees) % 360;
    setRotationAngle(newAngle);

    setIsProcessing(true);
    const result = await processCanvasImage(imageSrc, (img, canvas, ctx) => {
      return rotateCanvasImage(img, canvas, ctx, newAngle);
    });
    setIsProcessing(false);
    if (onImageTransformed) onImageTransformed(result);
  };

  const handlePerspectiveWarp = async () => {
    const nextWarpState = !isWarpActive;
    setIsWarpActive(nextWarpState);

    if (!nextWarpState) {
      if (onImageTransformed) onImageTransformed(imageSrc);
      return;
    }

    setIsProcessing(true);
    const result = await processCanvasImage(imageSrc, (img, canvas, ctx) => {
      return applyPerspectiveWarp(img, canvas, ctx);
    });
    setIsProcessing(false);
    if (onImageTransformed) onImageTransformed(result);
  };

  const handleCropRegion = async (cropType) => {
    setActiveCrop(cropType);

    if (cropType === 'full') {
      if (onImageTransformed) onImageTransformed(imageSrc);
      return;
    }

    let box = { x: 0, y: 0, width: 100, height: 100 };
    if (cropType === 'mrp') box = { x: 15, y: 40, width: 70, height: 25 };
    if (cropType === 'mfg') box = { x: 15, y: 60, width: 70, height: 25 };
    if (cropType === 'mfr') box = { x: 10, y: 70, width: 80, height: 28 };

    setIsProcessing(true);
    const result = await processCanvasImage(imageSrc, (img, canvas, ctx) => {
      return cropCanvasRegion(img, canvas, ctx, box);
    });
    setIsProcessing(false);
    if (onImageTransformed) onImageTransformed(result);
  };

  const handleReset = () => {
    setRotationAngle(0);
    setIsWarpActive(false);
    setActiveCrop('full');
    if (onImageTransformed) onImageTransformed(imageSrc);
  };

  return (
    <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>Advanced Computer Vision Preprocessor Tools</span>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Image</span>
        </button>
      </div>

      {/* Control Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rotation Control */}
        <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <RotateCw className="w-3 h-3 text-blue-400" />
            <span>Deskew / Rotation</span>
          </span>
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleRotate(-90)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold"
            >
              -90°
            </button>
            <button
              type="button"
              onClick={() => handleRotate(90)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold"
            >
              +90°
            </button>
            <span className="font-mono text-[11px] text-blue-400 font-bold ml-auto">{rotationAngle}°</span>
          </div>
        </div>

        {/* Perspective Correction Warp */}
        <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-emerald-400" />
            <span>Perspective Warp</span>
          </span>
          <button
            type="button"
            onClick={handlePerspectiveWarp}
            className={`w-full mt-1 py-1.5 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 ${
              isWarpActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{isWarpActive ? 'Flatten Warp Active' : 'Flatten Angled Packaging'}</span>
          </button>
        </div>

        {/* Crop Region Filter */}
        <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Crop className="w-3 h-3 text-amber-400" />
            <span>Target Region Crop</span>
          </span>
          <div className="flex flex-wrap gap-1 pt-1">
            <button
              type="button"
              onClick={() => handleCropRegion('full')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeCrop === 'full' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Full
            </button>
            <button
              type="button"
              onClick={() => handleCropRegion('mrp')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeCrop === 'mrp' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              MRP
            </button>
            <button
              type="button"
              onClick={() => handleCropRegion('mfg')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeCrop === 'mfg' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Mfg
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
