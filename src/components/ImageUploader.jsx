import React, { useState } from 'react';
import { Upload, Camera, ImageIcon, AlertCircle } from 'lucide-react';
import { validateImageFile } from '../utils/validators';

export default function ImageUploader({ onImagesSelected, selectedImages = [] }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFiles = (files) => {
    setUploadError(null);
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    const validFiles = [];
    for (const file of fileList) {
      const check = validateImageFile(file);
      if (!check.valid) {
        setUploadError(check.message);
        return;
      }
      validFiles.push({
        file,
        quality: check.quality,
        label: file.name.toLowerCase().includes('back') ? 'Rear Declaration Panel' : 'Front Packaging Label',
        url: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }

    onImagesSelected(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSampleUpload = (sampleType) => {
    let sampleUrl = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800";
    let sampleName = "India_Gate_Basmati_Rice_Front.jpg";
    let sampleLabel = "Front Packaging Label";

    if (sampleType === 'back') {
      sampleUrl = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800";
      sampleName = "India_Gate_Basmati_Rice_Rear.jpg";
      sampleLabel = "Rear Declaration Panel";
    }

    const mockItem = {
      file: null,
      quality: sampleType === 'back' ? 'Needs Review' : 'Good',
      label: sampleLabel,
      url: sampleUrl,
      name: sampleName,
      size: "2.4 MB"
    };

    onImagesSelected([mockItem]);
  };

  return (
    <div className="space-y-4 font-sans">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer bg-white relative ${
          dragActive ? 'border-blue-600 bg-blue-50/40' : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-blue-700 flex items-center justify-center border border-slate-200">
            <Upload className="w-6 h-6" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Drag & Drop product label photographs here
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports JPG, PNG, and WEBP images up to 10 MB. High-contrast label photos recommended.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition"
            >
              Browse Local Files
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSampleUpload('front'); }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center gap-1.5 transition"
            >
              <Camera className="w-3.5 h-3.5 text-blue-700" />
              <span>Load Front Sample</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSampleUpload('back'); }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg flex items-center gap-1.5 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
              <span>Load Rear Panel Sample</span>
            </button>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
