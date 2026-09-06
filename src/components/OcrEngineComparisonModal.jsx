import React from 'react';
import { X, CheckCircle2, AlertTriangle, Cpu, Database, Zap, ShieldCheck } from 'lucide-react';

export default function OcrEngineComparisonModal({ isOpen, onClose, engineResults, consensus, agreementScores }) {
  if (!isOpen) return null;

  const fields = [
    { key: 'productName', label: 'Product / Commodity Name', rule: 'Rule 6(1)(a)' },
    { key: 'brand', label: 'Brand Name', rule: 'Brand' },
    { key: 'netQuantity', label: 'Net Quantity (SI Unit)', rule: 'Rule 6(1)(c)' },
    { key: 'mrp', label: 'MRP (Inclusive of All Taxes)', rule: 'Rule 6(1)(e)' },
    { key: 'dateOfPacking', label: 'Mfg / Packaging Date', rule: 'Rule 6(1)(d)' },
    { key: 'bestBefore', label: 'Best Before / Expiry Date', rule: 'Rule 6(1)(i)' },
    { key: 'manufacturer', label: 'Manufacturer / Importer', rule: 'Rule 6(1)(b)' },
    { key: 'manufacturerAddress', label: 'Registered Office Address', rule: 'Rule 6(1)(b)' },
    { key: 'consumerCare', label: 'Consumer Helpline Details', rule: 'Rule 6(1)(g)' },
    { key: 'fssaiLicense', label: '14-Digit FSSAI License No.', rule: 'FSSAI' },
    { key: 'countryOfOrigin', label: 'Country of Origin', rule: 'Rule 6(1)(h)' },
    { key: 'unitSalePrice', label: 'Unit Sale Price (USP)', rule: 'Rule 6(1)(f)' }
  ];

  const tess = engineResults?.tesseract || {};
  const easy = engineResults?.easyOCR || {};
  const paddle = engineResults?.paddleOCR || {};
  const vision = engineResults?.googleVisionAI || {};
  const barcode = engineResults?.barcodeDatabase || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 space-y-0 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  Multi-OCR Engine Benchmarking & Comparison Matrix
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 rounded uppercase">
                  5 Engines Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cross-checking extracted Legal Metrology Rule 6 declarations across 5 distinct OCR & GTIN database engines.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Summary Engine Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Engine 1</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">Tesseract.js</span>
              <span className="text-[10px] text-blue-600 font-medium">Multi-Pass OCR</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Engine 2</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">EasyOCR</span>
              <span className="text-[10px] text-indigo-600 font-medium">Region Bounding</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Engine 3</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">PaddleOCR</span>
              <span className="text-[10px] text-purple-600 font-medium">Sauvola Binarized</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Engine 4</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">Google Vision AI</span>
              <span className="text-[10px] text-amber-600 font-medium">Gemini / Vision API</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Engine 5</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">Barcode / GTIN DB</span>
              <span className="text-[10px] text-emerald-600 font-medium">Open Food Facts</span>
            </div>
          </div>

          {/* Detailed Field Matrix */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="p-3 w-36">Declaration Field</th>
                  <th className="p-3">Tesseract</th>
                  <th className="p-3">EasyOCR</th>
                  <th className="p-3">PaddleOCR</th>
                  <th className="p-3">Google Vision</th>
                  <th className="p-3">Barcode DB</th>
                  <th className="p-3 text-right bg-blue-50/80 text-blue-900">Consensus Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {fields.map((f) => {
                  const consensusVal = consensus?.[f.key] || 'Not in image';
                  const isNotInImage = consensusVal === 'Not in image';
                  const score = agreementScores?.[f.key] || 0;

                  return (
                    <tr key={f.key} className={isNotInImage ? 'bg-slate-50/50' : 'hover:bg-blue-50/20'}>
                      <td className="p-3 font-bold text-slate-800">
                        <div>{f.label}</div>
                        <span className="text-[9px] font-mono text-slate-400 block">{f.rule}</span>
                      </td>

                      <td className="p-3 text-slate-600 max-w-[130px] truncate" title={tess[f.key]}>
                        {tess[f.key] || 'Not in image'}
                      </td>

                      <td className="p-3 text-slate-600 max-w-[130px] truncate" title={easy[f.key]}>
                        {easy[f.key] || 'Not in image'}
                      </td>

                      <td className="p-3 text-slate-600 max-w-[130px] truncate" title={paddle[f.key]}>
                        {paddle[f.key] || 'Not in image'}
                      </td>

                      <td className="p-3 text-slate-600 max-w-[130px] truncate" title={vision[f.key]}>
                        {vision[f.key] || 'Not in image'}
                      </td>

                      <td className="p-3 text-slate-600 max-w-[130px] truncate" title={barcode[f.key]}>
                        {barcode[f.key] || 'Not in image'}
                      </td>

                      <td className="p-3 text-right font-extrabold bg-blue-50/40">
                        {isNotInImage ? (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded">
                            Not in image
                          </span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-blue-900 font-bold max-w-[150px] truncate" title={consensusVal}>
                              {consensusVal}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-600 font-bold">
                              Agreement: {score}%
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Consensus engine prioritizes GTIN database & AI Vision with strict non-hallucination guarantees.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
