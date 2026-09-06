import React, { useState } from 'react';
import {
  Globe,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getFieldStatusDisplay, getOverallVerificationSummary } from '../services/legalMetrologyAdapter';
import { VERIFICATION_STATUS } from '../services/webVerificationService';

// ─── Sub-components ──────────────────────────────────────────────────────────

function SourceBadge({ status }) {
  const display = getFieldStatusDisplay(status);
  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    slate: 'bg-slate-100 text-slate-600 border-slate-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        colorMap[display.color] || colorMap.slate
      }`}
    >
      {display.label}
    </span>
  );
}

function VerdictBanner({ summary }) {
  if (!summary) return null;

  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />,
      badge: 'bg-emerald-600 text-white',
    },
    rose: {
      bg: 'bg-rose-50 border-rose-200 text-rose-950',
      icon: <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />,
      badge: 'bg-rose-600 text-white',
    },
    amber: {
      bg: 'bg-amber-50 border-amber-200 text-amber-950',
      icon: <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />,
      badge: 'bg-amber-500 text-white',
    },
  };

  const style = colorMap[summary.verdictColor] || colorMap.amber;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${style.bg}`}>
      {style.icon}
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-extrabold text-sm">{summary.verdictDescription}</span>
          <span className={`px-3 py-0.5 text-xs font-extrabold rounded-full ${style.badge}`}>
            {summary.combinedVerdict}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium opacity-80">
          <span>Compliance Score: <strong>{summary.score}%</strong></span>
          <span>|</span>
          <span>
            Web Status:{' '}
            <strong>
              {summary.webVerificationSkipped ? 'Skipped (No API Key)' : summary.webStatus}
            </strong>
          </span>
          {summary.productIdentified && (
            <>
              <span>|</span>
              <span>Product: <strong>Identified ✓</strong></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WebVerificationStatusCard({ webResult }) {
  if (!webResult) return null;

  const isVerified = webResult.verificationStatus === VERIFICATION_STATUS.VERIFIED ||
    webResult.verificationStatus === VERIFICATION_STATUS.PARTIAL;
  const isFailed = webResult.verificationStatus === VERIFICATION_STATUS.FAILED;
  const isUnverified = webResult.verificationStatus === VERIFICATION_STATUS.UNVERIFIED;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
        <Globe className="w-4 h-4 text-blue-600" />
        <span>Web Verification — Official Manufacturer Source</span>
      </div>

      {/* Search Query */}
      {webResult.searchQuery && (
        <div className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Search Query</span>
            <span className="font-mono text-slate-700">{webResult.searchQuery}</span>
          </div>
        </div>
      )}

      {/* Official Website URL */}
      {webResult.officialWebsiteUrl ? (
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600 font-medium">Official website found:</span>
          <a
            href={webResult.officialWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-mono flex items-center gap-1 truncate"
          >
            {webResult.officialWebsiteUrl}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {isFailed ? (
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span>
            {isFailed
              ? `Web verification failed: ${webResult.reason}`
              : isUnverified
              ? webResult.reason || 'Web verification skipped or product not identified.'
              : 'No official manufacturer website URL extracted.'}
          </span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Status</div>
          <div className={`font-bold mt-0.5 ${
            isVerified ? 'text-emerald-700' : isFailed ? 'text-rose-700' : 'text-amber-700'
          }`}>
            {webResult.verificationStatus}
          </div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Fields Found</div>
          <div className="font-bold text-slate-800 mt-0.5">{webResult.webFieldsFound || 0}</div>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Conflicts</div>
          <div className={`font-bold mt-0.5 ${webResult.packageVsWebConflict ? 'text-rose-600' : 'text-emerald-600'}`}>
            {webResult.packageVsWebConflict ? 'YES' : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldComparisonRow({ fieldName, fieldData, isLast }) {
  const [expanded, setExpanded] = useState(false);
  if (!fieldData) return null;

  const { packageValue, webValue, webSource, status, complianceStatus } = fieldData;

  const rowBg =
    status === 'CONFLICT'
      ? 'bg-rose-50/60'
      : status === 'MISSING_FROM_PACKAGE'
      ? 'bg-amber-50/50'
      : status === 'MISSING'
      ? 'bg-slate-50/50'
      : 'hover:bg-slate-50/70';

  const fieldLabel = fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());

  return (
    <div className={`border-b border-slate-100 last:border-b-0 ${isLast ? '' : ''}`}>
      <div
        className={`flex items-center gap-3 p-3 cursor-pointer transition ${rowBg}`}
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Status Icon */}
        <div className="shrink-0">
          {status === 'CONFLICT' ? (
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          ) : status === 'MISSING_FROM_PACKAGE' ? (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          ) : status === 'MISSING' ? (
            <XCircle className="w-4 h-4 text-slate-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
        </div>

        {/* Field Name */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs text-slate-900">{fieldLabel}</div>
          <div className="text-[11px] text-slate-500 font-mono truncate">
            {packageValue || <span className="italic text-slate-400">Not detected on package</span>}
          </div>
        </div>

        {/* Source Badge */}
        <SourceBadge status={status} />

        {/* Expand arrow */}
        {(webValue || webSource) && (
          <div className="shrink-0 text-slate-400">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (webValue || webSource) && (
        <div className="px-10 pb-3 pt-1 space-y-2 text-xs bg-white/80">
          {webValue && (
            <div className="flex items-start gap-2">
              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700">Web Value: </span>
                <span className={`font-mono ${status === 'CONFLICT' ? 'text-rose-700 font-bold' : 'text-slate-700'}`}>
                  {webValue}
                </span>
                {status === 'CONFLICT' && (
                  <span className="ml-2 px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">
                    CONFLICT with Package
                  </span>
                )}
              </div>
            </div>
          )}

          {webSource && (
            <>
              <div className="flex items-center gap-2 text-slate-500">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="font-bold">Source:</span>
                {webSource.sourceUrl ? (
                  <a
                    href={webSource.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {webSource.sourceUrl}
                  </a>
                ) : (
                  <span className="text-slate-400">URL not available</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <span>
                  <span className="font-bold">Type:</span>{' '}
                  <span className={webSource.sourceType === 'OFFICIAL_WEBSITE' ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                    {webSource.sourceType}
                  </span>
                </span>
                <span>
                  <span className="font-bold">Confidence:</span>{' '}
                  {Math.round((webSource.confidence || 0) * 100)}%
                </span>
                {webSource.fetchedAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(webSource.fetchedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </>
          )}

          {status === 'MISSING_FROM_PACKAGE' && (
            <div className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-800">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                This field was found on the official website but <strong>not detected on the physical package</strong>.
                Package cannot be marked compliant based solely on web data.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * WebVerificationPanel
 *
 * Shows the complete web verification + LegalMetrologyRuleEngine result:
 * - Overall verdict banner (COMPLIANT / NEEDS_REVIEW / NON_COMPLIANT)
 * - Web verification status card (search query, official URL, stats)
 * - Per-field comparison table (Package vs Web source)
 * - Rule engine violations summary
 *
 * @param {Object} webVerificationResult - From runWebVerification()
 * @param {Object} ruleEngineResult      - From evaluateLegalMetrologyComplianceWithWebData()
 */
export default function WebVerificationPanel({ webVerificationResult, ruleEngineResult }) {
  const summary = webVerificationResult || ruleEngineResult
    ? getOverallVerificationSummary(webVerificationResult, ruleEngineResult)
    : null;

  // Show a helpful placeholder if the scan isn't done yet
  if (!webVerificationResult && !ruleEngineResult) {
    return (
      <div className="p-8 text-center space-y-3">
        <Globe className="w-10 h-10 text-blue-200 mx-auto" />
        <p className="text-sm font-bold text-slate-400">
          Web verification will run after OCR + AI extraction completes.
        </p>
        <p className="text-xs text-slate-400">
          Upload and scan a product image to see results here.
        </p>
      </div>
    );
  }

  const webFields = webVerificationResult?.fields || {};

  return (
    <div className="space-y-5 font-sans">

      {/* ── Overall Verdict ─────────────────────────────────────────────── */}
      {summary && <VerdictBanner summary={summary} />}

      {/* ── Web Verification Status ──────────────────────────────────────── */}
      <WebVerificationStatusCard webResult={webVerificationResult} />

      {/* ── Field-by-Field Comparison ────────────────────────────────────── */}
      {Object.keys(webFields).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Package vs Official Website — Per-Field Comparison</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Package
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" /> Missing/Conflict
              </span>
            </div>
          </div>

          <div>
            {Object.entries(webFields).map(([field, data], i, arr) => (
              <FieldComparisonRow
                key={field}
                fieldName={field}
                fieldData={data}
                isLast={i === arr.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── LegalMetrologyRuleEngine Violations ──────────────────────────── */}
      {ruleEngineResult && ruleEngineResult.violations && ruleEngineResult.violations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 space-y-3 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-700">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Rule Engine Violations ({ruleEngineResult.violations.length})</span>
          </div>

          <div className="space-y-2">
            {ruleEngineResult.violations.map((v, i) => (
              <div
                key={v.id || i}
                className={`p-3 rounded-xl border text-xs space-y-1 ${
                  v.severity === 'Critical'
                    ? 'bg-rose-50 border-rose-200'
                    : v.severity === 'High'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">{v.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    v.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : v.severity === 'High'
                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {v.severity}
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-[10px]">{v.ruleId} — {v.ruleNumber}</div>
                <p className="text-slate-600 leading-relaxed">{v.remarks}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Rule Engine: Declarations Grid ───────────────────────────────── */}
      {ruleEngineResult && ruleEngineResult.declarations && ruleEngineResult.declarations.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Rule Engine — Declaration Matrix</span>
            <span className="ml-auto text-xs text-slate-400 font-normal">
              Score: <strong className="text-slate-800">{ruleEngineResult.score}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ruleEngineResult.declarations.map((d, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                  d.status === 'valid'
                    ? 'bg-emerald-50 border-emerald-200'
                    : d.status === 'needs_review'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-slate-400">{d.rule}</div>
                  <div className="font-bold text-slate-900">{d.label}</div>
                  <div className="font-mono text-slate-600 truncate">{d.value || 'Not Specified'}</div>
                  {d.webStatus === 'CONFLICT' && (
                    <div className="text-rose-700 font-bold text-[10px] mt-0.5">
                      ⚠ Conflicts with web: "{d.webValue}"
                    </div>
                  )}
                  {d.webStatus === 'CORROBORATED' && (
                    <div className="text-emerald-700 font-bold text-[10px] mt-0.5">
                      ✓ Corroborated by official website
                    </div>
                  )}
                  {d.webStatus === 'MISSING_FROM_PACKAGE' && (
                    <div className="text-amber-700 font-bold text-[10px] mt-0.5">
                      ⚠ Only on website, not on package
                    </div>
                  )}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  d.status === 'valid'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : d.status === 'needs_review'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}>
                  {d.status === 'valid' ? 'PASS' : d.status === 'needs_review' ? 'REVIEW' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Data Source Legend ───────────────────────────────────────────── */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex flex-wrap gap-4">
        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Source Legend:</span>
        {[
          { label: 'Package', color: 'emerald', desc: 'Detected from physical label' },
          { label: 'Official Website', color: 'blue', desc: "Manufacturer's official site" },
          { label: 'Conflict', color: 'rose', desc: 'Package ≠ Website — needs review' },
          { label: 'Missing', color: 'slate', desc: 'Not detected anywhere' },
        ].map(({ label, color, desc }) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
            <strong>{label}</strong> — {desc}
          </span>
        ))}
      </div>
    </div>
  );
}
