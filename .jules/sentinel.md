## 2026-03-24 - Predictable Random Number Generation in Verification Code
**Vulnerability:** Verification codes were generated using Math.random(), which is not cryptographically secure.
**Learning:** The Next.js API route generating verification codes relied on Math.random() for security tokens. An attacker could potentially predict the sequence of codes generated, bypassing email verification.
**Prevention:** Use crypto.randomInt() from node:crypto for generating verification codes or any other sensitive tokens.
