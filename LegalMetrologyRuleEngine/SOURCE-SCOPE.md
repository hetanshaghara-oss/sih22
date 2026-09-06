# Source scope

Use only the user's supplied **Legal Metrology (Packaged Commodities)** documents for statutory rule extraction. Do not silently add National Standards, Numeration, Model Approval, or unrelated Legal Metrology rules.

The rule list contains two kinds of records:
1. `LM-PC-*` package checks derived from the Packaged Commodities subject matter.
2. Application-level verification policies (`LM-PC-016` onward), which are clearly labelled as non-statutory and exist only to implement the scanner's package-vs-web evidence model.

Before production/legal deployment, reconcile every rule against the latest applicable amendment and record exact rule/sub-rule citations in the `source` field.
