import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import { ArrowRight, Info, Sparkles, Package, Layers } from 'lucide-react';

export default function NewInspection() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('Food Grain');
  const [priority, setPriority] = useState('Normal');
  const [notes, setNotes] = useState('');

  const navigate = useNavigate();

  const handleImagesSelected = (newFiles) => {
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (images.length === 0) {
      alert('Please upload or select at least one product label image before proceeding.');
      return;
    }

    // Pass data to Preview screen
    navigate('/user/inspection-preview', {
      state: {
        images,
        category,
        priority,
        notes
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1 of 3 — Packaging Capture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          New Product Inspection
        </h1>
        <p className="text-xs text-slate-600">
          Upload clear images of the product packaging label for automated Legal Metrology compliance verification.
        </p>
      </div>

      {/* Upload Component */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <ImageUploader onImagesSelected={handleImagesSelected} selectedImages={images} />

        <ImagePreview images={images} onDelete={handleDeleteImage} />
      </div>

      {/* Additional Metadata Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <span>Inspection Metadata & Category</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Commodity Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="Food Grain">Food Grain (Basmati Rice, Pulses, Wheat)</option>
              <option value="Edible Oil">Edible Oil & Ghee</option>
              <option value="Packaged Snacks">Packaged Snacks & Biscuits</option>
              <option value="Personal Care">Personal Care & Toiletries</option>
              <option value="Beverages">Beverages & Tea/Coffee</option>
              <option value="Dairy Products">Dairy Products & Butter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enforcement Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal Enforcement Inspection</option>
              <option value="High">High Priority — Consumer Complaint</option>
              <option value="Urgent">Urgent — Market Surveillance Drive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Officer Field Observations / Remarks (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Sample purchased from Supermarket Store #4, pre-packaged batch."
            className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Image quality will be validated before automated OCR parsing.</span>
        </div>

        <button
          onClick={handleProceed}
          className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg flex items-center gap-2 transition"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
