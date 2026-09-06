/**
 * Web Verification Service for Legal Metrology Compliance.
 *
 * Rules enforced:
 * 1. Package data is always primary evidence — never replaced.
 * 2. Fields clearly detected (high-confidence) — web is cross-check only.
 * 3. Missing / low-confidence fields → targeted web search for that product.
 * 4. Prefer manufacturer's OFFICIAL website; distrust marketplaces.
 * 5. Every web-fetched value stores: field, value, sourceUrl, sourceType, confidence, fetchedAt.
 * 6. Package field missing + official website found → status = NEEDS_REVIEW.
 * 7. Package value ≠ website value → status = CONFLICT.
 * 8. Product not reliably identified → verificationStatus = UNVERIFIED, skip web data.
 * 9. Never invent / hallucinate missing values.
 * 10. Sources are kept strictly separate: PACKAGE | OFFICIAL_WEBSITE | UNOFFICIAL | MISSING.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const WEB_VERIFICATION_VERSION = '1.0.0-LM';

/** Agreement score (%) below which a field is treated as low-confidence */
export const LOW_CONFIDENCE_THRESHOLD = 70;

/** Source type labels */
export const SOURCE_TYPE = {
  PACKAGE: 'PACKAGE',
  OFFICIAL_WEBSITE: 'OFFICIAL_WEBSITE',
  UNOFFICIAL: 'UNOFFICIAL',
  MISSING: 'MISSING',
  CONFLICT: 'CONFLICT',
};

/** Verification status labels */
export const VERIFICATION_STATUS = {
  VERIFIED: 'VERIFIED',
  PARTIAL: 'PARTIAL',
  UNVERIFIED: 'UNVERIFIED',
  FAILED: 'FAILED',
};

/** Fields subject to web verification (statutory declarations) */
const VERIFIABLE_FIELDS = [
  'productName',
  'brand',
  'manufacturer',
  'manufacturerAddress',
  'netQuantity',
  'mrp',
  'consumerCare',
  'countryOfOrigin',
  'bestBefore',
  'fssaiLicense',
];

/**
 * Known official manufacturer domains for major Indian brands.
 * Expanded at runtime from the Gemini grounding response.
 */
const OFFICIAL_DOMAIN_PATTERNS = [
  /itcportal\.com/i,
  /iimr\.res\.in/i,
  /amul\.com/i,
  /tataconsumer\.com/i,
  /adaniwilmar\.in/i,
  /hul\.co\.in/i,
  /hindustan-unilever\.com/i,
  /britannia\.co\.in/i,
  /nestleindia\.com/i,
  /dabur\.com/i,
  /marico\.com/i,
  /emamiltd\.in/i,
  /godrejcp\.com/i,
  /pepsicoindia\.com/i,
  /coca-colaindia\.com/i,
  /parleproducts\.com/i,
  /krblindia\.com/i,
  /gcmmf\.com/i,
  /patanjaliayurved\.net/i,
  /ceat\.com/i,
];

/**
 * Known marketplace / unofficial domains to explicitly distrust.
 */
const UNOFFICIAL_DOMAIN_PATTERNS = [
  /amazon\.(in|com)/i,
  /flipkart\.com/i,
  /meesho\.com/i,
  /myntra\.com/i,
  /snapdeal\.com/i,
  /nykaa\.com/i,
  /bigbasket\.com/i,
  /jiomart\.com/i,
  /reliance(retail|fresh)\.com/i,
  /grofers\.com/i,
  /blinkit\.com/i,
  /swiggy\.com/i,
  /zomato\.com/i,
  /indiamart\.com/i,
  /justdial\.com/i,
  /tradeindia\.com/i,
  /wikipedia\.org/i,
  /wikimedia\.org/i,
  /reddit\.com/i,
  /quora\.com/i,
  /shopclues\.com/i,
  /paytmmall\.com/i,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGeminiApiKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  }
  return '';
}

function isMissing(value) {
  return !value || value === 'Not in image' || String(value).trim() === '';
}

function classifyDomain(url) {
  if (!url) return SOURCE_TYPE.UNOFFICIAL;
  if (UNOFFICIAL_DOMAIN_PATTERNS.some((rx) => rx.test(url))) return SOURCE_TYPE.UNOFFICIAL;
  if (OFFICIAL_DOMAIN_PATTERNS.some((rx) => rx.test(url))) return SOURCE_TYPE.OFFICIAL_WEBSITE;
  // Heuristic: .com/.in domains that contain brand/manufacturer name are likely official
  return SOURCE_TYPE.OFFICIAL_WEBSITE; // default to official for non-marketplace sites
}

function valuesConflict(pkgValue, webValue) {
  if (!pkgValue || !webValue) return false;
  const normalize = (v) =>
    String(v)
      .toLowerCase()
      .replace(/[₹rs.\s,]/g, '')
      .replace(/\binclusive of all taxes\b/gi, '')
      .replace(/\bincl\.? of all taxes\b/gi, '')
      .trim();
  return normalize(pkgValue) !== normalize(webValue);
}

// ─── Core Functions ───────────────────────────────────────────────────────────

/**
 * Detects which fields need web lookup:
 * - value is "Not in image" / empty, OR
 * - agreementScore is below LOW_CONFIDENCE_THRESHOLD
 *
 * @param {Object} consensus  - Reconciled OCR/AI values
 * @param {Object} agreementScores - Per-field agreement scores (0–100)
 * @returns {string[]} Array of field names needing web verification
 */
export function detectLowConfidenceFields(consensus = {}, agreementScores = {}) {
  return VERIFIABLE_FIELDS.filter((field) => {
    const value = consensus[field];
    const score = agreementScores[field] ?? 100;
    return isMissing(value) || score < LOW_CONFIDENCE_THRESHOLD;
  });
}

/**
 * Builds a focused product identity search query.
 * Uses brand + productName + netQuantity + barcode GTIN if available.
 * Prioritises specificity to avoid unrelated results.
 *
 * @param {Object} consensus - Reconciled OCR/AI values
 * @param {string|null} barcode - Detected barcode GTIN
 * @returns {string} Search query string
 */
export function buildProductSearchQuery(consensus = {}, barcode = null) {
  const parts = [];

  if (!isMissing(consensus.brand) && !isMissing(consensus.productName)) {
    parts.push(`"${consensus.brand} ${consensus.productName}"`);
  } else if (!isMissing(consensus.brand)) {
    parts.push(`"${consensus.brand}"`);
  } else if (!isMissing(consensus.productName)) {
    parts.push(`"${consensus.productName}"`);
  }

  if (!isMissing(consensus.netQuantity)) {
    parts.push(consensus.netQuantity);
  }

  if (barcode) {
    parts.push(`GTIN ${barcode}`);
  }

  parts.push('official manufacturer India legal metrology MRP');

  return parts.join(' ');
}

/**
 * Calls Gemini API with Google Search grounding enabled.
 * Returns the raw grounding response (chunks + sourceLinks).
 *
 * @param {string} query - Product search query
 * @param {string} apiKey - Gemini API key
 * @returns {Object|null} Grounding response or null on failure
 */
async function runGeminiWebGrounding(query, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `You are a Legal Metrology compliance verification assistant for the Indian government.

Search the web specifically for this product: ${query}

IMPORTANT INSTRUCTIONS:
1. Only use information from the manufacturer's OFFICIAL website or government databases.
2. Do NOT use Amazon, Flipkart, Meesho, BigBasket, or any e-commerce marketplaces.
3. Do NOT hallucinate or guess any values. If you cannot find reliable data, say "NOT_FOUND".
4. Return a valid JSON object only, no prose, no markdown code blocks.

Return ONLY this JSON structure:
{
  "productIdentified": true/false,
  "officialWebsiteUrl": "URL or null",
  "brand": "value or NOT_FOUND",
  "productName": "value or NOT_FOUND",
  "manufacturer": "value or NOT_FOUND",
  "manufacturerAddress": "value or NOT_FOUND",
  "netQuantity": "value or NOT_FOUND",
  "mrp": "value or NOT_FOUND",
  "consumerCare": "value or NOT_FOUND",
  "countryOfOrigin": "value or NOT_FOUND",
  "bestBefore": "value or NOT_FOUND",
  "fssaiLicense": "value or NOT_FOUND",
  "sourceUrls": ["url1", "url2"],
  "confidence": 0.0
}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ googleSearch: {} }],
    generationConfig: {
      temperature: 0.0,
      response_mime_type: 'application/json',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini grounding API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  if (!cleanText) return null;

  try {
    return JSON.parse(cleanText);
  } catch {
    // Try to extract JSON from text
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Parses the Gemini grounding response and returns per-field web data
 * with full provenance metadata.
 *
 * @param {Object} groundingData - Parsed JSON from Gemini grounding
 * @param {string[]} targetFields - Fields we actually need from the web
 * @returns {Object} Per-field web source data
 */
function extractOfficialWebsiteData(groundingData, targetFields) {
  if (!groundingData || !groundingData.productIdentified) {
    return { productIdentified: false, fields: {} };
  }

  const officialUrl = groundingData.officialWebsiteUrl || null;
  const sourceUrls = groundingData.sourceUrls || (officialUrl ? [officialUrl] : []);
  const primaryUrl = sourceUrls[0] || officialUrl || '';
  const sourceType = classifyDomain(primaryUrl);
  const baseConfidence = groundingData.confidence || 0.75;
  const fetchedAt = new Date().toISOString();

  const fields = {};

  for (const field of targetFields) {
    const webValue = groundingData[field];
    if (!webValue || webValue === 'NOT_FOUND' || webValue === 'null') continue;

    fields[field] = {
      value: webValue,
      sourceUrl: primaryUrl,
      sourceType,
      confidence: sourceType === SOURCE_TYPE.OFFICIAL_WEBSITE ? baseConfidence : baseConfidence * 0.5,
      fetchedAt,
      trusted: sourceType === SOURCE_TYPE.OFFICIAL_WEBSITE,
    };
  }

  return {
    productIdentified: true,
    officialWebsiteUrl: officialUrl,
    primarySourceType: sourceType,
    fields,
  };
}

/**
 * Determines the verification status for a single field given package + web data.
 *
 * @param {string} field - Field name
 * @param {*} packageValue - Value extracted from package (OCR/AI)
 * @param {Object|undefined} webData - Web source data for this field
 * @param {boolean} webTrusted - Whether the web source is an official website
 * @returns {Object} Field verification result
 */
function resolveFieldStatus(field, packageValue, webData, webTrusted) {
  const pkgMissing = isMissing(packageValue);
  const webMissing = !webData || isMissing(webData?.value);

  if (!pkgMissing && webMissing) {
    // Package has value, no web data — PACKAGE source, no action needed
    return {
      source: SOURCE_TYPE.PACKAGE,
      packageValue,
      webValue: null,
      webSource: null,
      status: 'PACKAGE',
      complianceStatus: 'PASS',
    };
  }

  if (!pkgMissing && !webMissing && webTrusted) {
    // Both package and web have values — check for conflict
    if (valuesConflict(packageValue, webData.value)) {
      return {
        source: SOURCE_TYPE.CONFLICT,
        packageValue,
        webValue: webData.value,
        webSource: webData,
        status: 'CONFLICT',
        complianceStatus: 'NEEDS_REVIEW',
        reason: `Package: "${packageValue}" vs Official Website: "${webData.value}"`,
      };
    }
    // Values agree — PACKAGE is primary, web corroborates
    return {
      source: SOURCE_TYPE.PACKAGE,
      packageValue,
      webValue: webData.value,
      webSource: webData,
      status: 'PACKAGE',
      complianceStatus: 'PASS',
    };
  }

  if (!pkgMissing && !webMissing && !webTrusted) {
    // Web source is unofficial — ignore web value, trust package
    return {
      source: SOURCE_TYPE.PACKAGE,
      packageValue,
      webValue: null,
      webSource: { ...webData, ignored: true, ignoreReason: 'Unofficial source' },
      status: 'PACKAGE',
      complianceStatus: 'PASS',
    };
  }

  if (pkgMissing && !webMissing && webTrusted) {
    // Package is missing but official website has data → NEEDS_REVIEW
    // Do NOT mark as compliant — cannot prove printed on physical package
    return {
      source: SOURCE_TYPE.MISSING,
      packageValue: null,
      webValue: webData.value,
      webSource: webData,
      status: 'MISSING_FROM_PACKAGE',
      complianceStatus: 'NEEDS_REVIEW',
      reason: `Field not detected on physical package. Found on official website: "${webData.value}"`,
    };
  }

  if (pkgMissing && !webMissing && !webTrusted) {
    // Package missing and web source is unofficial — no reliable data
    return {
      source: SOURCE_TYPE.MISSING,
      packageValue: null,
      webValue: null,
      webSource: null,
      status: 'MISSING',
      complianceStatus: 'NEEDS_REVIEW',
      reason: 'Field not detected on physical package. Unofficial web source discarded.',
    };
  }

  // Both missing
  return {
    source: SOURCE_TYPE.MISSING,
    packageValue: null,
    webValue: null,
    webSource: null,
    status: 'MISSING',
    complianceStatus: 'NEEDS_REVIEW',
    reason: 'Field not detected on physical package and not found on official website.',
  };
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

/**
 * Runs the full web verification pipeline after OCR + AI extraction.
 *
 * Pipeline:
 * 1. Detect missing / low-confidence fields
 * 2. If product is identifiable, build search query
 * 3. Call Gemini with Google Search grounding
 * 4. Prefer official manufacturer website; discard marketplaces
 * 5. Resolve per-field status (PACKAGE / CONFLICT / MISSING_FROM_PACKAGE / MISSING)
 * 6. Return complete verification result with full provenance
 *
 * @param {Object} consensus        - Reconciled OCR/AI consensus values
 * @param {Object} agreementScores  - Per-field agreement scores (0–100)
 * @param {string|null} barcode     - Detected barcode GTIN (optional)
 * @param {Function} [onStatus]     - Optional progress callback (message: string)
 * @returns {Object} Web verification result
 */
export async function runWebVerification(
  consensus = {},
  agreementScores = {},
  barcode = null,
  onStatus = null
) {
  const startedAt = new Date().toISOString();

  // Step 1: Detect which fields need web lookup
  const lowConfFields = detectLowConfidenceFields(consensus, agreementScores);

  // Check if we can even identify the product
  const canIdentify =
    !isMissing(consensus.brand) ||
    !isMissing(consensus.productName) ||
    !isMissing(barcode);

  if (!canIdentify) {
    return {
      version: WEB_VERIFICATION_VERSION,
      productIdentified: false,
      verificationStatus: VERIFICATION_STATUS.UNVERIFIED,
      reason: 'Product could not be reliably identified (no brand, product name, or barcode).',
      searchQuery: null,
      officialWebsiteUrl: null,
      lowConfidenceFields: lowConfFields,
      fields: buildFieldsFromPackageOnly(consensus, agreementScores),
      packageVsWebConflict: false,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }

  const searchQuery = buildProductSearchQuery(consensus, barcode);
  if (onStatus) onStatus(`Web Verification: Searching for "${searchQuery}"...`);

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    // No API key — skip web verification, run on package data only
    return {
      version: WEB_VERIFICATION_VERSION,
      productIdentified: canIdentify,
      verificationStatus: VERIFICATION_STATUS.UNVERIFIED,
      reason: 'Web verification skipped: No Gemini API key configured.',
      searchQuery,
      officialWebsiteUrl: null,
      lowConfidenceFields: lowConfFields,
      fields: buildFieldsFromPackageOnly(consensus, agreementScores),
      packageVsWebConflict: false,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }

  // Step 2: Run Gemini web grounding
  let groundingData = null;
  try {
    if (onStatus) onStatus('Web Verification: Querying official manufacturer sources...');
    groundingData = await runGeminiWebGrounding(searchQuery, apiKey);
  } catch (err) {
    console.warn('[WebVerification] Grounding call failed:', err.message);
    return {
      version: WEB_VERIFICATION_VERSION,
      productIdentified: canIdentify,
      verificationStatus: VERIFICATION_STATUS.FAILED,
      reason: `Web grounding failed: ${err.message}`,
      searchQuery,
      officialWebsiteUrl: null,
      lowConfidenceFields: lowConfFields,
      fields: buildFieldsFromPackageOnly(consensus, agreementScores),
      packageVsWebConflict: false,
      startedAt,
      completedAt: new Date().toISOString(),
      error: err.message,
    };
  }

  if (!groundingData || !groundingData.productIdentified) {
    // Product not found or unrelated results
    return {
      version: WEB_VERIFICATION_VERSION,
      productIdentified: false,
      verificationStatus: VERIFICATION_STATUS.UNVERIFIED,
      reason: 'Product could not be reliably identified from web search. Unrelated results discarded.',
      searchQuery,
      officialWebsiteUrl: null,
      lowConfidenceFields: lowConfFields,
      fields: buildFieldsFromPackageOnly(consensus, agreementScores),
      packageVsWebConflict: false,
      startedAt,
      completedAt: new Date().toISOString(),
    };
  }

  // Step 3: Extract and classify web data
  const { fields: webFields, officialWebsiteUrl, primarySourceType } = extractOfficialWebsiteData(
    groundingData,
    VERIFIABLE_FIELDS
  );

  // Step 4: Resolve per-field status
  const resolvedFields = {};
  let hasConflict = false;
  let foundOnWeb = 0;

  for (const field of VERIFIABLE_FIELDS) {
    const packageValue = isMissing(consensus[field]) ? null : consensus[field];
    const webData = webFields[field] || null;
    const webTrusted = webData?.trusted === true;

    const resolution = resolveFieldStatus(field, packageValue, webData, webTrusted);
    resolvedFields[field] = resolution;

    if (resolution.status === 'CONFLICT') hasConflict = true;
    if (resolution.webValue && !isMissing(resolution.webValue)) foundOnWeb++;
  }

  const verificationStatus =
    foundOnWeb > 0
      ? hasConflict
        ? VERIFICATION_STATUS.PARTIAL
        : VERIFICATION_STATUS.VERIFIED
      : VERIFICATION_STATUS.UNVERIFIED;

  if (onStatus) onStatus('Web Verification: Complete.');

  return {
    version: WEB_VERIFICATION_VERSION,
    productIdentified: true,
    verificationStatus,
    searchQuery,
    officialWebsiteUrl,
    primarySourceType,
    lowConfidenceFields: lowConfFields,
    fields: resolvedFields,
    packageVsWebConflict: hasConflict,
    webFieldsFound: foundOnWeb,
    startedAt,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Builds a fields object from package data only (no web data).
 * Used when web verification is skipped or failed.
 *
 * @param {Object} consensus - Reconciled OCR/AI values
 * @param {Object} agreementScores - Per-field agreement scores
 * @returns {Object} Per-field package-only results
 */
function buildFieldsFromPackageOnly(consensus = {}, agreementScores = {}) {
  const fields = {};
  for (const field of VERIFIABLE_FIELDS) {
    const packageValue = isMissing(consensus[field]) ? null : consensus[field];
    const score = agreementScores[field] ?? 0;

    fields[field] = {
      source: packageValue ? SOURCE_TYPE.PACKAGE : SOURCE_TYPE.MISSING,
      packageValue,
      webValue: null,
      webSource: null,
      status: packageValue ? 'PACKAGE' : 'MISSING',
      complianceStatus: packageValue && score >= LOW_CONFIDENCE_THRESHOLD ? 'PASS' : 'NEEDS_REVIEW',
    };
  }
  return fields;
}
