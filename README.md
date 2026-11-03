# loopback-demo-target

Minimal token formatting library serving as the downstream demonstration target for the **Loopback** AI-assisted bug maintenance workflow (`puneetnith28/Loopback`).

## Overview

This repository is maintained autonomously by Loopback's agents (fixer and verifier) under strict human maintainer gatekeeping:
1. Bug reports are ingested via Switch chat.
2. An autonomous fixer agent writes a regression test, fixes the code, and opens a pull request.
3. An independent verifier agent verifies the fix diff and CI test results.
4. A human maintainer approves the pull request bound to its exact 40-character commit SHA.
5. Loopback's gatekeeper GitHub App executes the merge against a protected demo branch.

## Seeded Defect: Issue #1

To provide a reproducible, honest demonstration, this repository is initialized with a deliberately seeded defect:

- **Issue Title**: `formatToken throws TypeError when custom replace mapping contains null`
- **Description**: When callers pass a custom replace mapping where a value is `null` (e.g. `{ replace: { '%': null } }` to strip special characters), `src/index.js` invokes `.toString()` directly on the `null` value.
- **Observed Behavior**:
  ```text
  TypeError: Cannot read properties of null (reading 'toString')
  ```
- **Expected Behavior**:
  When a replacement value is `null` or `undefined`, the matched character should be removed (replaced with an empty string `""`), returning the clean sanitized token.

## Testing

Run tests using the Node.js native test runner:

```bash
npm test
```

### Pre-Fix Status
The initial baseline fails with 1 test failure:
```text
✖ formatToken - Issue #1: handles null replacement without throwing TypeError
  TypeError: Cannot read properties of null (reading 'toString')
```

### Proposed Fix
In `src/index.js`, replace:
```javascript
text = text.replaceAll(key, value.toString());
```
with:
```javascript
const replacement = value == null ? '' : value.toString();
text = text.replaceAll(key, replacement);
```

After applying this fix, all tests pass.

## Branch & Reset Strategy

- Baseline commit is tagged with immutable tag `demo-reset` (`DEMO_RESET_SHA`).
- Live rehearsals and demonstration recordings execute on disposable per-run branches `demo/<run-id>` created by `scripts/reset-demo.sh` in the Loopback repository.
- Merges land on `demo/<run-id>`, leaving `main` and `demo-reset` clean and reproducible.

## License

Apache-2.0
