import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { inspectionService } from '../services/inspectionService';
import { MOCK_PRODUCTS } from '../data/products';
import { FileText, Eye, CheckCircle2, Sparkles, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function InspectionPreview() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const uploadedImages = stateData.images || [
    {
      url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
      label: "Front Packaging Label",
      name: "Basmati_Rice_Front.jpg",
      quality: "Good",
      size: "2.4 MB"
    }
  ];

  // Extract OCR Data if available, fallback to empty/manual
  const ocrData = stateData.ocrData || {};

  const [productName, setProductName] = useState(ocrData.productName || "");
  const [brand, setBrand] = useState(ocrData.brand || "");
  const [category, setCategory] = useState(stateData.category || "Food Grain");
  const [manufacturer, setManufacturer] = useState(ocrData.manufacturer || "");
  const [netQuantity, setNetQuantity] = useState(ocrData.netQuantity || "");
  const [mrp, setMrp] = useState(ocrData.mrp || "");
  const [dateOfPacking, setDateOfPacking] = useState(ocrData.dateOfPacking || "");
  const [consumerCare, setConsumerCare] = useState(ocrData.consumerCare || "");
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      productName,
      brand,
      category,
      manufacturer,
      netQuantity,
      mrp,
      dateOfPacking,
      consumerCare,
      countryOfOrigin,
      priority: stateData.priority || "Normal",
      submittedBy: "Rahul Mehta",
      previewUrl: uploadedImages[0]?.url,
      images: uploadedImages
    };

    const created = await inspectionService.createInspection(payload);

    setTimeout(() => {
      setSubmitting(false);
      navigate(`/user/inspection-processing/${created.id}`);
    }, 400);
  };

  const inputCls = "mt-1.5 w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* OCR Banner */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px] -z-10" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded shadow-sm">
                AI OCR Preview
              </span>
              <span className="text-xs font-bold text-slate-200">Extracted Declarations Review</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Values extracted via Tesseract OCR. Verify and correct before submission.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-4"
        >
          <div className="glass-panel rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold">{uploadedImages[activeImageIndex]?.label || 'Packaging Image'}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
                Quality: {uploadedImages[activeImageIndex]?.quality || 'Good'}
              </span>
            </div>

            <div className="w-full bg-slate-950 rounded-xl overflow-hidden min-h-[350px] flex items-center justify-center border border-slate-800">
              <img
                src={uploadedImages[activeImageIndex]?.url}
                alt="Product Label"
                className="w-full h-auto max-h-[420px] object-contain"
              />
            </div>

            {/* Thumbnail Selectors if multiple */}
            {uploadedImages.length > 1 && (
              <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                {uploadedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-110 ${
                      activeImageIndex === idx ? 'border-blue-400 scale-105 shadow-lg shadow-blue-500/30' : 'border-slate-700 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: OCR Information Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7 glass-panel rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-white text-glow">
                Extracted Packaging Declarations
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify or edit parsed values before submitting to the Legal Metrology officer.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30">
              LM Rule 6 Matrix
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product Name</label>
                <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Brand</label>
                <input type="text" required value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Manufacturer / Packer</label>
                <input type="text" required value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Declared Net Quantity</label>
                <input type="text" required value={netQuantity} onChange={(e) => setNetQuantity(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">MRP (Incl. of all taxes)</label>
                <input type="text" required value={mrp} onChange={(e) => setMrp(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date of Packing / Mfg</label>
                <input type="text" required value={dateOfPacking} onChange={(e) => setDateOfPacking(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Consumer Care / Helpline Details</label>
              <input type="text" required value={consumerCare} onChange={(e) => setConsumerCare(e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Country of Origin</label>
              <input type="text" required value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} className={inputCls} />
            </div>

            <div className="pt-4 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                Submitter: <strong className="text-slate-300">Rahul Mehta (EO-8842-DL)</strong>
              </span>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit for Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
