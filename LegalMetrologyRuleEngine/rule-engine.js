const fs = require('fs');
const rules = JSON.parse(fs.readFileSync('./rules.json', 'utf8')).rules;

function hasValue(v) { return v !== undefined && v !== null && String(v).trim() !== ''; }
function sourceOf(field) { return field?.source || 'MISSING'; }

function evaluateRule(rule, data) {
  const f = data[rule.field] || {};
  const value = f.value;
  const source = sourceOf(f);

  if (rule.check === 'physical_evidence_priority') return { status: 'PASS', source };
  if (rule.check === 'conflict_requires_review') return { status: data.packageVsWebConflict ? 'NEEDS_REVIEW' : 'PASS', source };
  if (rule.check === 'official_web_found_but_package_missing') {
    return { status: (!hasValue(value) && hasValue(f.webValue)) ? 'NEEDS_REVIEW' : 'PASS', source };
  }

  if (f.applicable === false) return { status: 'PASS', reason: 'Not applicable' };
  if (!hasValue(value)) return { status: 'NEEDS_REVIEW', reason: 'Value not verified', source };

  if (f.packageValue !== undefined && f.webValue !== undefined && String(f.packageValue) !== String(f.webValue)) {
    return { status: 'NEEDS_REVIEW', reason: 'Package/web conflict', source };
  }

  if (source === 'OFFICIAL_WEBSITE') return { status: 'NEEDS_REVIEW', reason: 'Found online but not physically verified', source };
  return { status: 'PASS', source };
}

function runCompliance(data) {
  const results = rules.map(rule => ({ ruleId: rule.ruleId, field: rule.field, severity: rule.severity, message: rule.message, ...evaluateRule(rule, data) }));
  const failed = results.filter(r => r.status === 'FAIL').length;
  const review = results.filter(r => r.status === 'NEEDS_REVIEW').length;
  return { overallStatus: failed ? 'NON_COMPLIANT' : review ? 'NEEDS_REVIEW' : 'COMPLIANT', summary: { total: results.length, passed: results.filter(r=>r.status==='PASS').length, failed, needsReview: review }, results };
}

module.exports = { runCompliance };
