# Legal Metrology Rule Engine — Starter Bundle

This bundle is designed for the user's packaged-product scanner. It uses the user-supplied Legal Metrology (Packaged Commodities) documents as the legal source scope.

## Files
- `rules.json` — structured package-checkable rules.
- `rule.schema.json` — JSON Schema for rule records.
- `rule-engine.js` — small Node.js evaluator demonstrating source-aware PASS/NEEDS_REVIEW behavior.
- `example-input.json` — sample normalized scanner data.
- `SOURCE-SCOPE.md` — how to use the supplied PDFs and distinguish statutory rules from application policies.

## Important
This is an implementation starter, not legal advice. Conditional applicability, exemptions, commodity-specific provisions and amendments must be reviewed against the exact official text before production use. The engine intentionally does not let official-web data prove that a declaration is physically printed on the package.
