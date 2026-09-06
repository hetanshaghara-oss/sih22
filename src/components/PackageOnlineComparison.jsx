import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { ShoppingBag, AlertTriangle, CheckCircle2, Globe, ExternalLink, Info } from 'lucide-react';

/**
 * PackageOnlineComparison
 *
 * When `webVerificationResult` is provided (real data from runWebVerification()),
 * displays the live comparison between package values and official website values.
 *
 * Falls back to the original MOCK_PRODUCTS comparison when no real web data is available
 * (maintains backward compatibility with all existing usages).
 *
 * @param {Object} scannedPackageData     - Extracted package field values
 * @param {Object} [webVerificationResult] - Optional real web verification result
 */
export default function PackageOnlineComparison({ scannedPackageData, webVerificationResult }) {
  // ── Real web data mode ────────────────────────────────────────────────────
  if (webVerificationResult && webVerificationResult.fields) {
    return (
      <RealWebComparison
        scannedPackageData={scannedPackageData}
        webVerificationResult={webVerificationResult}
      />
    );
  }

  // ── Fallback: mock product comparison (original behaviour) ────────────────
  return <MockProductComparison scannedPackageData={scannedPackageData} />;
}

// ─── Real web data comparison ─────────────────────────────────────────────────

function RealWebComparison({ scannedPackageData, webVerificationResult }) {
  const fields = webVerificationResult.fields || {};

  // Count discrepancy types
  const conflicts = Object.values(fields).filter((f) => f.status === 'CONFLICT').length;
  const missingFromPkg = Object.values(fields).filter(
    (f) => f.status === 'MISSING_FROM_PACKAGE'
  ).length;
  const totalIssues = conflicts + missingFromPkg;

  const fieldLabels = {
    productName: 'Generic / Product Name',
    brand: 'Brand',
    manufacturer: 'Manufacturer / Packer',
    manufacturerAddress: 'Registered Address',
    netQuantity: 'Net Quantity Statement',
    mrp: 'Maximum Retail Price (MRP)',
    consumerCare: 'Consumer Care Helpline',
    countryOfOrigin: 'Country of Origin',
    bestBefore: 'Best Before / Expiry',
    fssaiLicense: 'FSSAI License Number',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Physical Package vs. Official Manufacturer Website
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology verification using the manufacturer's official website as the reference source.
          </p>
        </div>

        {webVerificationResult.officialWebsiteUrl && (
          <a
            href={webVerificationResult.officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Official Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Discrepancy Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        totalIssues > 0
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        {totalIssues > 0 ? (
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="font-extrabold flex items-center justify-between flex-wrap gap-2">
            <span>
              {totalIssues > 0
                ? `${conflicts} conflict(s), ${missingFromPkg} field(s) missing from physical package`
                : 'Physical package declarations align with official manufacturer website.'}
            </span>
            <span className="font-mono text-[10px] uppercase font-bold">
              {totalIssues > 0 ? 'Needs Review' : 'Verified Match'}
            </span>
          </div>
          {conflicts > 0 && (
            <p className="mt-0.5 text-[11px] opacity-90">
              Package values conflict with the manufacturer's official website. Manual officer review required under LM-PC-017.
            </p>
          )}
          {missingFromPkg > 0 && (
            <p className="mt-0.5 text-[11px] opacity-90">
              Fields found on the official website but not detected on the physical package. Cannot be marked compliant (LM-PC-018).
            </p>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3">Declaration Field</th>
              <th className="p-3 bg-slate-800">Physical Package</th>
              <th className="p-3 bg-blue-950">Official Website</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {Object.entries(fieldLabels).map(([field, label]) => {
              const fd = fields[field];
              if (!fd) return null;

              const { packageValue, webValue, status } = fd;
              const hasConflict = status === 'CONFLICT';
              const isMissingFromPkg = status === 'MISSING_FROM_PACKAGE';
              const isMissing = status === 'MISSING';

              return (
                <tr
                  key={field}
                  className={`transition ${
                    hasConflict
                      ? 'bg-rose-50/60'
                      : isMissingFromPkg
                      ? 'bg-amber-50/40'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="p-3 font-bold text-slate-800">{label}</td>
                  <td className="p-3 bg-slate-50/50 font-mono text-slate-900">
                    {packageValue || (
                      <span className="italic text-slate-400">Not detected</span>
                    )}
                  </td>
                  <td className="p-3 bg-blue-50/30 font-mono text-blue-950">
                    {webValue || (
                      <span className="italic text-slate-400">Not found</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {hasConflict ? (
                      <StatusPill color="rose" icon="conflict" label="Conflict" />
                    ) : isMissingFromPkg ? (
                      <StatusPill color="amber" icon="warning" label="Missing from Package" />
                    ) : isMissing ? (
                      <StatusPill color="slate" icon="missing" label="Missing" />
                    ) : (
                      <StatusPill color="emerald" icon="match" label="Match" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Source note */}
      <div className="flex items-start gap-2 p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p>
          <strong>Source priority:</strong> Physical package data is always the primary evidence.
          Website data from the manufacturer's official domain is used for cross-verification only.
          Marketplace and unofficial sources are excluded from this comparison.
        </p>
      </div>
    </div>
  );
}

// ─── Fallback: original mock product comparison ────────────────────────────────

function MockProductComparison({ scannedPackageData }) {
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0]?.id || '');
  const onlineProduct = MOCK_PRODUCTS.find((p) => p.id === selectedProductId) || MOCK_PRODUCTS[0];

  const pkgName = scannedPackageData?.productName || scannedPackageData?.brand || 'Scanned Packaged Item';
  const pkgMrp = scannedPackageData?.mrp || 'Rs. 875.00';
  const pkgNetQty = scannedPackageData?.netQuantity || '5 kg';
  const pkgMfg = scannedPackageData?.manufacturer || 'KRBL Limited';
  const pkgOrigin = scannedPackageData?.countryOfOrigin || 'India';

  // Discrepancy checks
  const mrpDiff = onlineProduct?.mrp && !onlineProduct.mrp.toLowerCase().includes(pkgMrp.toLowerCase().replace(/[^0-9.]/g, ''));
  const qtyDiff = onlineProduct?.netQuantity && !onlineProduct.netQuantity.toLowerCase().includes(pkgNetQty.toLowerCase());
  const originDiff = onlineProduct?.countryOfOrigin && onlineProduct.countryOfOrigin.toLowerCase() !== pkgOrigin.toLowerCase();

  const totalDiscrepancies = (mrpDiff ? 1 : 0) + (qtyDiff ? 1 : 0) + (originDiff ? 1 : 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 font-sans">
      {/* Component Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Physical Package vs. Online E-Commerce Listing Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology (E-Commerce Rules 2017) mandates strict 100% declaration alignment between physical packaging and online listings.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-slate-700 uppercase">Compare With:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
          >
            {MOCK_PRODUCTS.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} ({prod.netQuantity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discrepancy Alert Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
        totalDiscrepancies > 0
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        {totalDiscrepancies > 0 ? (
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="font-extrabold flex items-center justify-between">
            <span>
              {totalDiscrepancies > 0
                ? `Flagged ${totalDiscrepancies} E-Commerce Metrology Mismatch Discrepancies!`
                : '100% Compliant — Physical package and online listing match perfectly.'}
            </span>
            <span className="font-mono text-[10px] uppercase font-bold">
              {totalDiscrepancies > 0 ? 'Violation Risk' : 'Verified Pair'}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] opacity-90">
            {totalDiscrepancies > 0
              ? 'E-Commerce sellers must not state higher MRP or altered net quantity on digital marketplaces than printed on physical package labels.'
              : 'Declarations on physical container and digital product display card are fully aligned.'}
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 text-slate-200 font-mono uppercase text-[10px]">
            <tr>
              <th className="p-3">Mandatory Declaration Parameter</th>
              <th className="p-3 bg-slate-800">Scanned Physical Package</th>
              <th className="p-3 bg-blue-950">Online Marketplace Listing</th>
              <th className="p-3 text-center">Compliance Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {/* Product Name */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="p-3 font-bold text-slate-800">Generic / Product Name</td>
              <td className="p-3 bg-slate-50/50 font-mono text-slate-900">{pkgName}</td>
              <td className="p-3 bg-blue-50/30 font-mono text-blue-950">{onlineProduct.name}</td>
              <td className="p-3 text-center">
                <StatusPill color="emerald" icon="match" label="Match" />
              </td>
            </tr>

            {/* MRP */}
            <tr className={`hover:bg-slate-50/80 transition ${mrpDiff ? 'bg-rose-50/50' : ''}`}>
              <td className="p-3 font-bold text-slate-800">Maximum Retail Price (MRP)</td>
              <td className="p-3 bg-slate-50/50 font-mono text-slate-900">{pkgMrp}</td>
              <td className="p-3 bg-blue-50/30 font-mono text-blue-950">{onlineProduct.mrp}</td>
              <td className="p-3 text-center">
                {mrpDiff ? (
                  <StatusPill color="rose" icon="conflict" label="Discrepancy" />
                ) : (
                  <StatusPill color="emerald" icon="match" label="Match" />
                )}
              </td>
            </tr>

            {/* Net Quantity */}
            <tr className={`hover:bg-slate-50/80 transition ${qtyDiff ? 'bg-rose-50/50' : ''}`}>
              <td className="p-3 font-bold text-slate-800">Net Quantity Statement</td>
              <td className="p-3 bg-slate-50/50 font-mono text-slate-900">{pkgNetQty}</td>
              <td className="p-3 bg-blue-50/30 font-mono text-blue-950">{onlineProduct.netQuantity}</td>
              <td className="p-3 text-center">
                {qtyDiff ? (
                  <StatusPill color="rose" icon="conflict" label="Discrepancy" />
                ) : (
                  <StatusPill color="emerald" icon="match" label="Match" />
                )}
              </td>
            </tr>

            {/* Manufacturer */}
            <tr className="hover:bg-slate-50/80 transition">
              <td className="p-3 font-bold text-slate-800">Manufacturer / Packer</td>
              <td className="p-3 bg-slate-50/50 font-mono text-slate-900">{pkgMfg}</td>
              <td className="p-3 bg-blue-50/30 font-mono text-blue-950">{onlineProduct.manufacturer}</td>
              <td className="p-3 text-center">
                <StatusPill color="emerald" icon="match" label="Match" />
              </td>
            </tr>

            {/* Country of Origin */}
            <tr className={`hover:bg-slate-50/80 transition ${originDiff ? 'bg-rose-50/50' : ''}`}>
              <td className="p-3 font-bold text-slate-800">Country of Origin</td>
              <td className="p-3 bg-slate-50/50 font-mono text-slate-900">{pkgOrigin}</td>
              <td className="p-3 bg-blue-50/30 font-mono text-blue-950">{onlineProduct.countryOfOrigin}</td>
              <td className="p-3 text-center">
                {originDiff ? (
                  <StatusPill color="rose" icon="conflict" label="Mismatch" />
                ) : (
                  <StatusPill color="emerald" icon="match" label="Match" />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Shared helper ─────────────────────────────────────────────────────────────

function StatusPill({ color, icon, label }) {
  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    slate: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  const icons = {
    match: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    conflict: <AlertTriangle className="w-3 h-3 text-rose-600" />,
    warning: <AlertTriangle className="w-3 h-3 text-amber-600" />,
    missing: null,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorMap[color] || colorMap.slate}`}>
      {icons[icon]}
      {label}
    </span>
  );
}
