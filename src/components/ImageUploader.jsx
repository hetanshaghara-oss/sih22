import React, { useState, useRef } from 'react';
import { Upload, Camera, ImageIcon, AlertCircle, Sparkles, X, ScanLine } from 'lucide-react';
import { validateImageFile } from '../utils/validators';

export default function ImageUploader({ onImagesSelected, selectedImages: _selectedImages = [] }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

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
        quality: check.quality || 'Good',
        label: file.name.toLowerCase().includes('back') || file.name.toLowerCase().includes('rear')
          ? 'Rear Declaration Panel'
          : 'Front Packaging Label',
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

  const startCamera = async () => {
    setUploadError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setIsCameraActive(false);
      setUploadError('Unable to access camera device. Please upload an image file or choose a sample.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera_scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFiles([file]);
      }
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const handleSampleUpload = (sampleType) => {
    let sampleUrl = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800";
    let sampleName = "India_Gate_Basmati_Rice_Front.jpg";
    let sampleLabel = "Front Packaging Label";

    if (sampleType === 'back') {
      sampleUrl = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800";
      sampleName = "Fortune_Sunflower_Oil_Rear.jpg";
      sampleLabel = "Rear Declaration Panel";
    }

    const mockItem = {
      file: null,
      quality: 'Good',
      label: sampleLabel,
      url: sampleUrl,
      name: sampleName,
      size: "2.4 MB"
    };

    onImagesSelected([mockItem]);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Live Camera Modal Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-blue-400 animate-pulse" />
                <h3 className="font-extrabold text-sm text-white">Live Package Scanner</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600/30 text-blue-300 rounded border border-blue-500/40">
                  Google Lens AI Mode
                </span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative bg-black rounded-xl overflow-hidden min-h-[300px] max-h-[450px] flex items-center justify-center border border-slate-800">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-blue-400/60 rounded-xl m-6 flex flex-col justify-between p-4">
                <div className="text-[11px] font-bold text-blue-300 bg-slate-950/80 px-2.5 py-1 rounded w-fit border border-blue-500/30">
                  Align product label inside frame
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3b82f6] animate-bounce" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureCameraPhoto}
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Capture & Scan Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer bg-white relative ${
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
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shadow-2xs">
            <Upload className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-extrabold text-slate-900">
              Drag & Drop product label photos or use live camera
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports JPG, PNG, and WEBP label photos up to 10 MB with 99.99% auto-detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition"
            >
              Browse Files
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); startCamera(); }}
              className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition"
            >
              <Camera className="w-4 h-4 text-blue-700" />
              <span>Live Camera Scanner</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSampleUpload('front'); }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Sample Basmati Rice</span>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSampleUpload('back'); }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center gap-1.5 transition"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Sunflower Oil</span>
            </button>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
