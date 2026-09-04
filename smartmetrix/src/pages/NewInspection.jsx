import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import PremiumCard from '../components/PremiumCard';
import { ArrowRight, Info, Sparkles, Package } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function NewInspection() {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('Food Grain');
  const [priority, setPriority] = useState('Normal');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const handleImagesSelected = (newFiles) => {
    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceed = async () => {
    if (images.length === 0) {
      alert('Please upload or select at least one product label image before proceeding.');
      return;
    }

    let processedImages = [...images];
    let ocrData = null;

    const realFiles = processedImages.filter(img => img.file).map(img => img.file);

    if (realFiles.length > 0) {
      try {
        setUploading(true);

        const inspectionService = (await import('../services/inspectionService')).inspectionService;

        const uploadResult = await inspectionService.uploadImages(realFiles);
        const permanentUrls = uploadResult.urls;

        let urlIndex = 0;
        processedImages = processedImages.map(img => {
          if (img.file) {
            const updated = { ...img, url: permanentUrls[urlIndex] };
            urlIndex++;
            return updated;
          }
          return img;
        });

        if (processedImages[0].file) {
          const ocrResult = await inspectionService.analyzeImage(processedImages[0].file);
          ocrData = ocrResult.parsed;
        }

      } catch (err) {
        console.error(err);
        alert('Processing failed. Falling back to manual entry.');
      } finally {
        setUploading(false);
      }
    }

    navigate('/user/inspection-preview', {
      state: {
        images: processedImages,
        category,
        priority,
        notes,
        ocrData
      }
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <PremiumCard tiltIntensity={5} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-[60px] -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1 of 3 — Packaging Capture</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight text-glow">
            New Product Inspection
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Upload clear images of the product packaging label for automated Legal Metrology compliance verification.
          </p>
        </PremiumCard>
      </motion.div>

      {/* Upload Component */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-6">
        <ImageUploader onImagesSelected={handleImagesSelected} selectedImages={images} />
        <ImagePreview images={images} onDelete={handleDeleteImage} />
      </motion.div>

      {/* Additional Metadata Form */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-400" />
          <span>Inspection Metadata & Category</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Commodity Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Enforcement Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="Normal">Normal Enforcement Inspection</option>
              <option value="High">High Priority — Consumer Complaint</option>
              <option value="Urgent">Urgent — Market Surveillance Drive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            Officer Field Observations / Remarks (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Sample purchased from Supermarket Store #4, pre-packaged batch."
            className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </motion.div>

      {/* Action Footer */}
      <motion.div variants={itemVariants} className="flex items-center justify-between p-5 glass-panel rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Image quality will be validated before automated OCR parsing.</span>
        </div>

        <motion.button
          id="continue-btn"
          onClick={handleProceed}
          disabled={uploading}
          whileHover={{ scale: uploading ? 1 : 1.05 }}
          whileTap={{ scale: uploading ? 1 : 0.95 }}
          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-xl shadow-blue-900/50 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{uploading ? 'Uploading & Processing...' : 'Continue to Review'}</span>
          {!uploading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
