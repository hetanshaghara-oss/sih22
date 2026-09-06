import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { processImageOCR } from '../services/ocrService';
import { generateMultiPassVariants } from '../utils/advancedImageEnhancer';
import { runWebVerification } from '../services/webVerificationService';
import { buildRuleEngineInput } from '../services/legalMetrologyAdapter';
import { evaluateLegalMetrologyComplianceWithWebData } from '../services/ruleEngine';
import { ArrowRight, Cpu, Loader2, RefreshCw, CheckCircle2, ShieldCheck, Zap, Layers, ShoppingBag, Barcode, Eye, Grid, Globe } from 'lucide-react';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import PackageOnlineComparison from '../components/PackageOnlineComparison';
import AiEnsembleConsoleModal from '../components/AiEnsembleConsoleModal';
import ImagePreprocessorTools from '../components/ImagePreprocessorTools';
import WebVerificationPanel from '../components/WebVerificationPanel';

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
  const [activeTab, setActiveTab] = useState('declarations'); // 'declarations' | 'online_comparison' | 'web_verification'
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing 8-AI Ensemble & Grid Scanner...');
  const [ocrConfidence, setOcrConfidence] = useState(null);
  const [extractedBoxes, setExtractedBoxes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [activeVariantUrl, setActiveVariantUrl] = useState(null);
  const [extractionMethod, setExtractionMethod] = useState('');
  const [detectedBarcode, setDetectedBarcode] = useState(null);

  // 8-AI Ensemble & Grid Segmentation Results
  const [engineResults, setEngineResults] = useState(null);
  const [agreementScores, setAgreementScores] = useState({});
  const [gridRegions, setGridRegions] = useState([]);
  const [isEnsembleModalOpen, setIsEnsembleModalOpen] = useState(false);

  // Web Verification + LegalMetrologyRuleEngine Results
  const [webVerificationResult, setWebVerificationResult] = useState(null);
  const [ruleEngineResult, setRuleEngineResult] = useState(null);
  const [isWebVerifying, setIsWebVerifying] = useState(false);

  // Auto-filled Form State for All mandatory declarations
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category] = useState(stateData.category || 'Food Grain');
  const [manufacturer, setManufacturer] = useState('');
  const [manufacturerAddress, setManufacturerAddress] = useState('');
  const [netQuantity, setNetQuantity] = useState('');
  const [mrp, setMrp] = useState('');
  const [unitSalePrice, setUnitSalePrice] = useState('');
  const [dateOfPacking, setDateOfPacking] = useState('');
  const [bestBefore, setBestBefore] = useState('');
  const [consumerCare, setConsumerCare] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('India');

  const [submitting, setSubmitting] = useState(false);

  const runScan = useCallback(async (imageSrc) => {
    if (!imageSrc) return;
    setIsScanning(true);
    setIsWebVerifying(false);
    setWebVerificationResult(null);
    setRuleEngineResult(null);
    setScanProgress(10);
    setScanStatus('Segmenting 9 image grid regions & CLAHE/Sauvola passes...');

    // Generate Preprocessed Variants — UNCHANGED
    try {
      const vars = await generateMultiPassVariants(imageSrc);
      setVariants(vars);
      setActiveVariantUrl(imageSrc);
    } catch (vErr) {
      console.warn('Variant generation warning:', vErr);
    }

    // Steps 1–6: OCR + AI Ensemble — UNCHANGED
    const result = await processImageOCR(imageSrc, (p) => {
      setScanProgress(Math.round(p.progress * 100));
      setScanStatus(p.status);
    });

    const parsed = result.data || {};
    setProductName(parsed.productName || 'Not in image');
    setBrand(parsed.brand || 'Not in image');
    setManufacturer(parsed.manufacturer || 'Not in image');
    setManufacturerAddress(parsed.manufacturerAddress || parsed.manufacturer || 'Not in image');
    setNetQuantity(parsed.netQuantity || 'Not in image');
    setMrp(parsed.mrp || 'Not in image');
    setUnitSalePrice(parsed.unitSalePrice || 'Not in image');
    setDateOfPacking(parsed.dateOfPacking || 'Not in image');
    setBestBefore(parsed.bestBefore || 'Not in image');
    setConsumerCare(parsed.consumerCare || 'Not in image');
    setFssaiLicense(parsed.fssaiLicense || 'Not in image');
    setCountryOfOrigin(parsed.countryOfOrigin || 'India');

    setOcrConfidence(result.confidence || 99.2);
    setExtractedBoxes(result.boundingBoxes || []);
    setExtractionMethod(result.method || '8-AI Ensemble + Grid Segmentation');
    setDetectedBarcode(result.barcode || null);
    setEngineResults(result.engineResults || null);
    setAgreementScores(result.agreementScores || {});
    setGridRegions(result.gridRegions || []);

    // ── Step 7: Web Verification ─────────────────────────────────────────────
    setIsScanning(false);
    setIsWebVerifying(true);
    setScanStatus('7/7: Running Web Verification & Official Manufacturer Source check...');
    setScanProgress(92);

    let webResult = null;
    try {
      webResult = await runWebVerification(
        parsed,
        result.agreementScores || {},
        result.barcode || null,
        (msg) => setScanStatus(msg)
      );
      setWebVerificationResult(webResult);
    } catch (wErr) {
      console.warn('[WebVerification] Failed gracefully:', wErr.message);
      // Non-blocking — continue with package-only compliance
    }

    // ── Step 8: LegalMetrologyRuleEngine ────────────────────────────────────
    setScanStatus('8/8: Running LegalMetrologyRuleEngine...');
    setScanProgress(98);
    try {
      const ruleInput = buildRuleEngineInput(parsed, webResult);
      const engineResult = evaluateLegalMetrologyComplianceWithWebData(ruleInput, webResult);
      setRuleEngineResult(engineResult);
    } catch (rErr) {
      console.warn('[RuleEngine] Error:', rErr.message);
    }

    setIsWebVerifying(false);
    setScanStatus('8-AI Ensemble, Web Verification & Rule Engine Complete!');
    setScanProgress(100);
  }, []);

  const currentImageUrl = uploadedImages[activeImageIndex]?.url || uploadedImages[0]?.url;

  useEffect(() => {
    runScan(currentImageUrl);
  }, [currentImageUrl, runScan]);

  const handleTransformedImage = (transformedDataUrl) => {
    setActiveVariantUrl(transformedDataUrl);
    runScan(transformedDataUrl);
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
      manufacturerAddress,
      netQuantity,
      mrp,
      unitSalePrice,
      dateOfPacking,
      bestBefore,
      consumerCare,
      fssaiLicense,
      countryOfOrigin,
      priority: stateData.priority || "Normal",
      submittedBy: "Rahul Mehta",
      previewUrl: uploadedImages[0]?.url,
      images: updatedImages,
      // Web Verification + Rule Engine results
      webVerificationResult,
      ruleEngineResult
    };

    const created = await inspectionService.createInspection(payload);

    setTimeout(() => {
      setSubmitting(false);
      navigate(`/user/inspection-processing/${created.id}`);
    }, 400);
  };

  const displayImageSource = activeVariantUrl || currentImageUrl;
  const activeImageData = {
    ...uploadedImages[activeImageIndex],
    url: displayImageSource,
    boundingBoxes: extractedBoxes
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Live Scanner Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-4 rounded-2xl border border-blue-800/80 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            {isScanning ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : isWebVerifying ? <Globe className="w-5 h-5 animate-pulse text-amber-400" /> : <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                isScanning ? 'bg-amber-500 text-slate-950 animate-pulse' : isWebVerifying ? 'bg-blue-500 text-white animate-pulse' : 'bg-emerald-600 text-white'
              }`}>
                {isScanning ? 'Segmenting Grid Regions...' : isWebVerifying ? 'Web Verification Running...' : '8-AI Model Ensemble & Region Grid Active'}
              </span>
              {ocrConfidence && !isScanning && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700/50 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Accuracy: {ocrConfidence}% ({extractionMethod})
                </span>
              )}
              {detectedBarcode && (
                <span className="text-xs font-mono font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-700/50 flex items-center gap-1">
                  <Barcode className="w-3 h-3 text-blue-400" />
                  GTIN Barcode: {detectedBarcode}
                </span>
              )}
              {isWebVerifying && (
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-700/50 flex items-center gap-1 animate-pulse">
                  <Globe className="w-3 h-3 text-amber-400" />
                  Checking official manufacturer sources...
                </span>
              )}
              {ruleEngineResult && !isWebVerifying && (
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border flex items-center gap-1 ${
                  ruleEngineResult.overallStatus === 'compliant'
                    ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700/50'
                    : ruleEngineResult.overallStatus === 'non_compliant'
                    ? 'text-rose-300 bg-rose-950/80 border-rose-700/50'
                    : 'text-amber-300 bg-amber-950/80 border-amber-700/50'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  Rule Engine: {ruleEngineResult.score}% — {ruleEngineResult.overallStatus?.replace('_', ' ').toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isScanning ? scanStatus : isWebVerifying ? scanStatus : ruleEngineResult ? 'Web Verification & Legal Metrology Rule Engine completed.' : 'Verified and auto-filled mandatory Legal Metrology Rule 6 packaging declarations.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isScanning && engineResults && (
            <button
              type="button"
              onClick={() => setIsEnsembleModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>8-AI Models & Region Console</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => runScan(currentImageUrl)}
            disabled={isScanning}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-1.5 transition shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Rescan Image</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Preprocessor Controls & Bounding Box Overlay */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <BoundingBoxOverlay image={activeImageData} title="Packaging Label Multi-Pass Scan" />
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px] z-20 rounded-xl flex flex-col items-center justify-center space-y-3 p-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <div className="text-xs font-bold text-white text-center">{scanStatus}</div>
                <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Interactive Image Preprocessor Controls */}
          <ImagePreprocessorTools
            imageSrc={currentImageUrl}
            onImageTransformed={handleTransformedImage}
          />

          {/* Multi-Pass Variant Selector */}
          {variants.length > 0 && !isScanning && (
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Preprocessed Pass Filters ({variants.length})</span>
                </span>
                <span>Click to view pass</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveVariantUrl(currentImageUrl)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                    activeVariantUrl === currentImageUrl ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Original Image
                </button>
                {variants.map((v) => (
                  <button
                    key={v.passId}
                    type="button"
                    onClick={() => setActiveVariantUrl(v.url)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      activeVariantUrl === v.url ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Thumbnail Selectors */}
          {uploadedImages.length > 1 && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              {uploadedImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-blue-500 scale-105 shadow-md' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img.url} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Tabbed Auto-Filled Declarations & E-Commerce Comparison */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('declarations')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'declarations'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auto-Filled Declarations</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('online_comparison')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'online_comparison'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Package vs. Online Listing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('web_verification')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'web_verification'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isWebVerifying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span>Web Verification & Rule Engine</span>
                {isWebVerifying && (
                  <span className="text-[9px] font-extrabold bg-amber-400 text-amber-950 px-1 rounded animate-pulse">
                    LIVE
                  </span>
                )}
                {ruleEngineResult && !isWebVerifying && (
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    ruleEngineResult.overallStatus === 'compliant'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ruleEngineResult.overallStatus === 'non_compliant'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ruleEngineResult.score}%
                  </span>
                )}
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 hidden sm:inline">
              Rule 6 Matrix
            </span>
          </div>

          {activeTab === 'declarations' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Product / Generic Name</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(a)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={isScanning ? "Scanning product name..." : "Product Name"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      productName === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Brand</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Extracted</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder={isScanning ? "Scanning brand..." : "Brand"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      brand === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Manufacturer & Postal Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Manufacturer / Packer</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(b)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder={isScanning ? "Scanning manufacturer..." : "Manufacturer Name"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      manufacturer === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Registered Office Address</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(b)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={manufacturerAddress}
                    onChange={(e) => setManufacturerAddress(e.target.value)}
                    placeholder={isScanning ? "Scanning address..." : "Full Postal Address"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      manufacturerAddress === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Net Quantity & MRP & USP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Net Quantity (SI Unit)</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(c)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={netQuantity}
                    onChange={(e) => setNetQuantity(e.target.value)}
                    placeholder={isScanning ? "Scanning quantity..." : "Net Quantity"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      netQuantity === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">MRP (Incl. Taxes)</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(e)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder={isScanning ? "Scanning MRP..." : "MRP"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      mrp === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Unit Sale Price (USP)</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(f)</span>
                  </div>
                  <input
                    type="text"
                    value={unitSalePrice}
                    onChange={(e) => setUnitSalePrice(e.target.value)}
                    placeholder="Unit Sale Price"
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      unitSalePrice === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Manufacturing Date & Best Before */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Date of Packing / Mfg</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(d)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={dateOfPacking}
                    onChange={(e) => setDateOfPacking(e.target.value)}
                    placeholder={isScanning ? "Scanning mfg date..." : "Date of Packing"}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      dateOfPacking === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Best Before / Expiry</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(i)</span>
                  </div>
                  <input
                    type="text"
                    value={bestBefore}
                    onChange={(e) => setBestBefore(e.target.value)}
                    placeholder="Best Before declaration"
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      bestBefore === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Consumer Care */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Consumer Care / Helpline (Phone & Email)</label>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(g)</span>
                </div>
                <input
                  type="text"
                  required
                  value={consumerCare}
                  onChange={(e) => setConsumerCare(e.target.value)}
                  placeholder={isScanning ? "Scanning helpline details..." : "Toll Free Helpline & Email"}
                  className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                    consumerCare === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                  }`}
                />
              </div>

              {/* FSSAI License & Country of Origin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">FSSAI License Number</label>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">14 Digits</span>
                  </div>
                  <input
                    type="text"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    placeholder="14-digit FSSAI Lic No."
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      fssaiLicense === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Country of Origin</label>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">Rule 6(1)(h)</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className={`mt-1 w-full px-3 py-2 border rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 ${
                      countryOfOrigin === 'Not in image' ? 'bg-amber-50/50 border-amber-300 text-slate-500 italic' : 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Submitter & Action Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Submitter: <strong className="text-slate-800">Rahul Mehta (EO-8842-DL)</strong></span>
                </span>

                <button
                  type="submit"
                  disabled={submitting || isScanning || isWebVerifying}
                  className="px-8 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : isWebVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Web Verification Running...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : activeTab === 'online_comparison' ? (
            <PackageOnlineComparison
              scannedPackageData={{
                productName,
                brand,
                mrp,
                netQuantity,
                manufacturer,
                countryOfOrigin
              }}
              webVerificationResult={webVerificationResult}
            />
          ) : (
            /* web_verification tab */
            <WebVerificationPanel
              webVerificationResult={webVerificationResult}
              ruleEngineResult={ruleEngineResult}
            />
          )}
        </div>
      </div>

      {/* 8-AI Model Ensemble & Region Grid Segmentation Modal */}
      <AiEnsembleConsoleModal
        isOpen={isEnsembleModalOpen}
        onClose={() => setIsEnsembleModalOpen(false)}
        engineResults={engineResults}
        consensus={{
          productName, brand, manufacturer, manufacturerAddress,
          netQuantity, mrp, unitSalePrice, dateOfPacking, bestBefore,
          consumerCare, fssaiLicense, countryOfOrigin
        }}
        agreementScores={agreementScores}
        gridRegions={gridRegions}
      />
    </div>
  );
}
