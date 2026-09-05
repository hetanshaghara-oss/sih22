import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { processImageOCR } from '../services/ocrService';
import { FileText, Eye, CheckCircle2, Sparkles, ArrowRight, ShieldAlert, Cpu, Loader2, RefreshCw } from 'lucide-react';

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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing OCR Engine...');
  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [extractedBoxes, setExtractedBoxes] = useState([]);

  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(stateData.category || 'Food Grain');
  const [manufacturer, setManufacturer] = useState('');
  const [netQuantity, setNetQuantity] = useState('');
  const [mrp, setMrp] = useState('');
  const [dateOfPacking, setDateOfPacking] = useState('');
  const [consumerCare, setConsumerCare] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('India');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    runScan(uploadedImages[activeImageIndex]?.url || uploadedImages[0]?.url);
  }, [activeImageIndex]);

  const runScan = async (imageSrc) => {
    if (!imageSrc) return;
    setIsScanning(true);
    setScanProgress(15);
    setScanStatus('Analyzing label image with OCR engine...');

    const result = await processImageOCR(imageSrc, (p) => {
      setScanProgress(Math.round(p.progress * 100));
      setScanStatus(p.status);
    });

    const parsed = result.data;
    setProductName(parsed.productName);
    setBrand(parsed.brand);
    setManufacturer(parsed.manufacturer);
    setNetQuantity(parsed.netQuantity);
    setMrp(parsed.mrp);
    setDateOfPacking(parsed.dateOfPacking);
    setConsumerCare(parsed.consumerCare);
    setCountryOfOrigin(parsed.countryOfOrigin);
    setOcrConfidence(result.confidence);
    setExtractedBoxes(result.boundingBoxes);

    setIsScanning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedImages = uploadedImages.map((img, idx) => {
      if (idx === activeImageIndex) {
        return {
          ...img,
          boundingBoxes: extractedBoxes
        };
      }
      return img;
    });

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
      images: updatedImages
    };

    // Save to service & localStorage
    const created = await inspectionService.createInspection(payload);

    setTimeout(() => {
      setSubmitting(false);
      navigate(`/user/inspection-processing/${created.id}`);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Live OCR Scanner Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 rounded-xl border border-blue-800/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <Cpu className="w-5 h-5 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                isScanning ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                {isScanning ? 'Scanning Label Image...' : 'Live OCR Scan Active'}
              </span>
              {ocrConfidence && !isScanning && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                  Confidence: {ocrConfidence}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isScanning ? scanStatus : 'Extracted Legal Metrology Rule 6 packaging declarations directly from uploaded label photo.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => runScan(uploadedImages[activeImageIndex]?.url)}
          disabled={isScanning}
          className="px-3.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1.5 transition shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>Rescan Image</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Viewer with scanning animation overlay */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg p-4 space-y-3 relative">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-bold">{uploadedImages[activeImageIndex]?.label || 'Packaging Image'}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-emerald-400 rounded border border-slate-700">
                Quality: {uploadedImages[activeImageIndex]?.quality || 'Good'}
              </span>
            </div>

            <div className="relative w-full bg-slate-950 rounded-xl overflow-hidden min-h-[350px] flex items-center justify-center border border-slate-800">
              <img
                src={uploadedImages[activeImageIndex]?.url}
                alt="Product Label"
                className="w-full h-auto max-h-[420px] object-contain"
              />

              {/* Laser Scanning Beam Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-3">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#3b82f6] animate-bounce" />
                  <div className="px-4 py-2 bg-slate-900/90 rounded-xl border border-blue-500/40 text-center space-y-1 shadow-2xl">
                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                    <div className="text-xs font-bold text-white">{scanStatus}</div>
                    <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
                      <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Selectors if multiple */}
            {uploadedImages.length > 1 && (
              <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                {uploadedImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: OCR Extracted Declarations Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Extracted Packaging Declarations
              </h3>
              <p className="text-xs text-slate-500">
                OCR results automatically populated from scanned label. Verify or edit before submitting.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              LM Rule 6 Matrix
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={isScanning ? "Scanning product name..." : "E.g. PREMIUM RICE"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Brand</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={isScanning ? "Scanning brand..." : "E.g. FoodCorp"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Manufacturer / Packer</label>
                <input
                  type="text"
                  required
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder={isScanning ? "Scanning manufacturer..." : "E.g. FoodCorp Ltd"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Declared Net Quantity</label>
                <input
                  type="text"
                  required
                  value={netQuantity}
                  onChange={(e) => setNetQuantity(e.target.value)}
                  placeholder={isScanning ? "Scanning net quantity..." : "E.g. 5 kg"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">MRP (Incl. of all taxes)</label>
                <input
                  type="text"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder={isScanning ? "Scanning MRP..." : "E.g. Rs. 500"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase">Date of Packing / Mfg</label>
                <input
                  type="text"
                  required
                  value={dateOfPacking}
                  onChange={(e) => setDateOfPacking(e.target.value)}
                  placeholder={isScanning ? "Scanning manufacturing date..." : "E.g. 12/2025"}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Consumer Care / Helpline Details</label>
              <input
                type="text"
                required
                value={consumerCare}
                onChange={(e) => setConsumerCare(e.target.value)}
                placeholder={isScanning ? "Scanning helpline details..." : "Helpline contact"}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase">Country of Origin</label>
              <input
                type="text"
                required
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Submitter: <strong className="text-slate-800">Rahul Mehta (EO-8842-DL)</strong>
              </span>

              <button
                type="submit"
                disabled={submitting || isScanning}
                className="px-8 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit for Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
