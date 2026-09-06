/**
 * Legal Metrology Adapter
 *
 * Bridges OCR consensus + web verification result into the normalized
 * format expected by evaluateLegalMetrologyCompliance() in ruleEngine.js.
 *
 * Source priority:
 *   PACKAGE (detected, high-confidence)  →  use as-is
 *   MISSING + OFFICIAL_WEBSITE found      →  use web value BUT mark NEEDS_REVIEW
 *   CONFLICT                              →  flag both values, force NEEDS_REVIEW
 *   MISSING + no web data                →  mark MISSING
 */

import { SOURCE_TYPE, VERIFICATION_STATUS } from './webVerificationService';

// ─── Field mappings ──────────────────────────────────────────────────────────

/**
 * Maps OCR/AI consensus field names to the canonical LM rule engine field names.
 * Allows the adapter to work with both the JS rule engine (ruleEngine.js) and
 * the Node.js engine (LegalMetrologyRuleEngine/rule-engine.js) naming conventions.
 */
const FIELD_MAP = {
  // consensus key → ruleEngine.js parameter name
  productName: 'productName',
  brand: 'brand',
  manufacturer: 'manufacturer',
  manufacturerAddress: 'manufacturerAddress',
  netQuantity: 'netQuantity',
  mrp: 'mrp',
  unitSalePrice: 'unitSalePrice',
  dateOfPacking: 'dateOfPacking',
  bestBefore: 'bestBefore',
  consumerCare: 'consumerCare',
  countryOfOrigin: 'countryOfOrigin',
  fssaiLicense: 'fssaiLicense',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isMissing(value) {
  return !value || value === 'Not in image' || String(value).trim() === '';
}

/**
 * Picks the best value for a field following the source priority rules:
 * 1. Package value (if detected and non-missing) — always preferred
 * 2. Official website value (only if package is missing)
 * 3. null (if both are missing)
 *
 * @param {string} field - Field name
 * @param {Object} consensus - OCR/AI reconciled values
 * @param {Object} webFields - Web verification resolved fields
 * @returns {{ value: string|null, source: string, meta: Object }}
 */
function resolveFieldValue(field, consensus, webFields) {
  const packageValue = isMissing(consensus[field]) ? null : consensus[field];
  const webField = webFields?.[field];
  const webValue = webField?.webValue || null;
  const webTrusted = webField?.webSource?.trusted === true;

  if (packageValue) {
    return {
      value: packageValue,
      source: SOURCE_TYPE.PACKAGE,
      meta: {
        packageValue,
        webValue: webTrusted ? webValue : null,
        status: webField?.status || 'PACKAGE',
        complianceStatus: webField?.complianceStatus || 'PASS',
        webSource: webTrusted ? webField?.webSource : null,
      },
    };
  }

  if (webValue && webTrusted) {
    return {
      value: webValue,
      source: SOURCE_TYPE.MISSING, // Source is MISSING from package — web only supplementary
      meta: {
        packageValue: null,
        webValue,
        status: 'MISSING_FROM_PACKAGE',
        complianceStatus: 'NEEDS_REVIEW',
        webSource: webField?.webSource,
      },
    };
  }

  return {
    value: null,
    source: SOURCE_TYPE.MISSING,
    meta: {
      packageValue: null,
      webValue: null,
      status: 'MISSING',
      complianceStatus: 'NEEDS_REVIEW',
      webSource: null,
    },
  };
}

// ─── Main Exports ─────────────────────────────────────────────────────────────

/**
 * Builds the normalized input object for evaluateLegalMetrologyCompliance().
 *
 * The returned object:
 * - Contains plain field values (strings) for compliance rule evaluation
 * - Contains a `_fieldMeta` map for the UI to show source badges & provenance
 * - Contains `packageVsWebConflict` flag for LM-PC-017 rule
 * - All CONFLICT fields have their package value used (not replaced by web value)
 *
 * @param {Object} consensus            - Reconciled OCR/AI field values
 * @param {Object} webVerificationResult - Full result from runWebVerification()
 * @returns {Object} Normalized input for evaluateLegalMetrologyCompliance()
 */
export function buildRuleEngineInput(consensus = {}, webVerificationResult = null) {
  const webFields = webVerificationResult?.fields || {};
  const packageVsWebConflict = webVerificationResult?.packageVsWebConflict || false;
  const verificationStatus =
    webVerificationResult?.verificationStatus || VERIFICATION_STATUS.UNVERIFIED;

  const declarations = {};
  const fieldMeta = {};

  for (const [consensusKey, engineKey] of Object.entries(FIELD_MAP)) {
    const resolution = resolveFieldValue(consensusKey, consensus, webFields);
    declarations[engineKey] = resolution.value || '';
    fieldMeta[engineKey] = {
      ...resolution.meta,
      consensusKey,
    };
  }

  return {
    // Plain field values for evaluateLegalMetrologyCompliance()
    ...declarations,
    // Structured metadata for the UI and extended rule checks
    _fieldMeta: fieldMeta,
    _webVerification: {
      status: verificationStatus,
      productIdentified: webVerificationResult?.productIdentified || false,
      officialWebsiteUrl: webVerificationResult?.officialWebsiteUrl || null,
      searchQuery: webVerificationResult?.searchQuery || null,
      lowConfidenceFields: webVerificationResult?.lowConfidenceFields || [],
      webFieldsFound: webVerificationResult?.webFieldsFound || 0,
    },
    packageVsWebConflict,
  };
}

/**
 * Produces a human-readable summary of the combined web verification +
 * rule engine results for display in the UI.
 *
 * @param {Object} webResult        - Full web verification result
 * @param {Object} ruleEngineResult - Result from evaluateLegalMetrologyCompliance()
 * @returns {Object} Summary object
 */
export function getOverallVerificationSummary(webResult, ruleEngineResult) {
  const webStatus = webResult?.verificationStatus || VERIFICATION_STATUS.UNVERIFIED;
  const engineStatus = ruleEngineResult?.overallStatus || 'non_compliant';
  const score = ruleEngineResult?.score || 0;

  // Determine combined verdict
  let combinedVerdict;
  let verdictColor;
  let verdictDescription;

  if (engineStatus === 'compliant' && webStatus === VERIFICATION_STATUS.VERIFIED) {
    combinedVerdict = 'COMPLIANT';
    verdictColor = 'emerald';
    verdictDescription = 'All mandatory declarations found on the physical package and corroborated by official sources.';
  } else if (
    engineStatus === 'non_compliant' ||
    webResult?.packageVsWebConflict
  ) {
    combinedVerdict = 'NON_COMPLIANT';
    verdictColor = 'rose';
    verdictDescription = 'Critical mandatory declarations are missing from the physical package or conflict with official sources.';
  } else {
    combinedVerdict = 'NEEDS_REVIEW';
    verdictColor = 'amber';
    verdictDescription = 'Some declarations require manual review by a Legal Metrology officer.';
  }

  // Summarise per-field statuses
  const fieldSummary = {
    packageVerified: 0,
    webCorroborated: 0,
    conflicts: 0,
    missingFromPackage: 0,
    missing: 0,
  };

  if (webResult?.fields) {
    for (const field of Object.values(webResult.fields)) {
      if (field.status === 'PACKAGE') {
        fieldSummary.packageVerified++;
        if (field.webValue) fieldSummary.webCorroborated++;
      } else if (field.status === 'CONFLICT') {
        fieldSummary.conflicts++;
      } else if (field.status === 'MISSING_FROM_PACKAGE') {
        fieldSummary.missingFromPackage++;
      } else if (field.status === 'MISSING') {
        fieldSummary.missing++;
      }
    }
  }

  return {
    combinedVerdict,
    verdictColor,
    verdictDescription,
    score,
    engineStatus,
    webStatus,
    productIdentified: webResult?.productIdentified || false,
    officialWebsiteUrl: webResult?.officialWebsiteUrl || null,
    searchQuery: webResult?.searchQuery || null,
    fieldSummary,
    violations: ruleEngineResult?.violations || [],
    declarations: ruleEngineResult?.declarations || [],
    webVerificationSkipped: webStatus === VERIFICATION_STATUS.UNVERIFIED,
    packageVsWebConflict: webResult?.packageVsWebConflict || false,
  };
}

/**
 * Returns a display label for a field source status.
 *
 * @param {string} status - Field status (PACKAGE, CONFLICT, MISSING_FROM_PACKAGE, MISSING)
 * @returns {{ label: string, color: string, description: string }}
 */
export function getFieldStatusDisplay(status) {
  switch (status) {
    case 'PACKAGE':
      return {
        label: 'Package',
        color: 'emerald',
        description: 'Detected directly from physical packaging label.',
      };
    case 'CONFLICT':
      return {
        label: 'Conflict',
        color: 'rose',
        description: 'Package value and official website value differ — requires manual review.',
      };
    case 'MISSING_FROM_PACKAGE':
      return {
        label: 'Missing from Package',
        color: 'amber',
        description:
          'Not detected on physical package. Found on official website — requires manual inspection.',
      };
    case 'MISSING':
      return {
        label: 'Missing',
        color: 'slate',
        description: 'Not detected on physical package and not found on official sources.',
      };
    default:
      return {
        label: 'Unknown',
        color: 'slate',
        description: 'Status could not be determined.',
      };
  }
}
