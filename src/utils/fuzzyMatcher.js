/**
 * Advanced Fuzzy Matching, Typo Correction, and Standard Unit Normalizer for Legal Metrology.
 * Handles OCR character mistakes, distorted fonts, noise, and non-standard packaging text.
 */

/**
 * Levenshtein distance algorithm for calculating edit distance between strings.
 */
export function levenshteinDistance(a = '', b = '') {
  const str1 = a.toLowerCase().trim();
  const str2 = b.toLowerCase().trim();

  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
}

/**
 * Calculates similarity ratio between two strings (0.0 to 1.0)
 */
export function stringSimilarityRatio(str1 = '', str2 = '') {
  if (!str1 && !str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;

  const dist = levenshteinDistance(s1, s2);
  return (maxLength - dist) / maxLength;
}

/**
 * Common OCR Character Correction Map for Legal Metrology & Packaging Text
 */
export function fixCommonOcrTypos(text = '') {
  if (!text) return '';

  let cleaned = text;

  // Fix common OCR typos in keywords & Legal Metrology headers
  const replacements = [
    [/\bM\.?R\.?P\.?\b/gi, 'MRP'],
    [/\bM\.?R\.?R\.?\b/gi, 'MRP'],
    [/\bMax\.?\s*Retail\s*Price\b/gi, 'MRP'],
    [/\bInclusive\s*of\s*all\s*tax\b/gi, 'inclusive of all taxes'],
    [/\bIncl\.?\s*of\s*all\s*tax\b/gi, 'incl. of all taxes'],
    [/\bN3t\b/gi, 'Net'],
    [/\bNet\s*Qnty\b/gi, 'Net Quantity'],
    [/\bNet\s*Qtiy\b/gi, 'Net Quantity'],
    [/\bNet\s*Wt\.?\b/gi, 'Net Weight'],
    [/\bNet\s*Vol\.?\b/gi, 'Net Volume'],
    [/\bMfd\s*Date\b/gi, 'Mfg Date'],
    [/\bPacked\s*Dt\b/gi, 'Mfg Date'],
    [/\bPKD\.?\b/gi, 'Packed'],
    [/\bPKDG\.?\b/gi, 'Packing'],
    [/\bManufactur3r\b/gi, 'Manufacturer'],
    [/\bManfactured\b/gi, 'Manufactured'],
    [/\bCustmer\s*Care\b/gi, 'Customer Care'],
    [/\bConsumr\s*Care\b/gi, 'Consumer Care'],
    [/\bToll\s*Fr3e\b/gi, 'Toll Free'],
    [/\bFSSAI\s*Lic\b/gi, 'FSSAI License'],
    [/\bFSSA1\b/gi, 'FSSAI'],
    [/\bCntry\s*of\s*Origin\b/gi, 'Country of Origin'],
    [/\bBest\s*B4\b/gi, 'Best Before'],
    [/\bUse\s*B4\b/gi, 'Use By']
  ];

  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

/**
 * Normalizes numbers extracted from OCR (fixes O->0, l->1, S->5, Z->2, B->8)
 */
export function normalizeOcrNumberString(numStr = '') {
  if (!numStr) return '';
  return numStr
    .replace(/[O|o]/g, '0')
    .replace(/[l|I|i]/g, '1')
    .replace(/S/g, '5')
    .replace(/Z/g, '2')
    .replace(/B/g, '8');
}

/**
 * Normalizes Net Quantity to standard SI metric units per Schedule II
 */
export function normalizeNetQuantity(qtyStr = '') {
  if (!qtyStr) return '';

  let cleaned = fixCommonOcrTypos(qtyStr).trim();

  // Convert 1000g -> 1 kg, 1000ml -> 1 L
  const gMatch = cleaned.match(/^([0-9.]+)\s*(g|gm|grams|grm)$/i);
  if (gMatch) {
    const val = parseFloat(gMatch[1]);
    if (val >= 1000) return `${val / 1000} kg`;
    return `${val} g`;
  }

  const mlMatch = cleaned.match(/^([0-9.]+)\s*(ml|millilitres|milliliters)$/i);
  if (mlMatch) {
    const val = parseFloat(mlMatch[1]);
    if (val >= 1000) return `${val / 1000} L`;
    return `${val} ml`;
  }

  return cleaned;
}

/**
 * Finds best match from a target dictionary of known brands/commodities
 */
export function findBestDictionaryMatch(query = '', candidates = []) {
  if (!query || candidates.length === 0) return { bestMatch: query, similarity: 0 };

  let bestMatch = query;
  let maxSim = -1;

  for (const candidate of candidates) {
    const sim = stringSimilarityRatio(query, candidate);
    if (sim > maxSim) {
      maxSim = sim;
      bestMatch = candidate;
    }
  }

  return { bestMatch, similarity: maxSim };
}
