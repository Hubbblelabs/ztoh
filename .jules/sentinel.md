## 2024-05-24 - [Missing Authentication on Admin Routes]

**Vulnerability:** Several API routes under `/api/admin/*` were completely missing authentication checks (`verifyAuth()`), allowing any unauthenticated user to access or modify data (e.g., creating admin users, changing passwords, viewing PII on contact requests).
**Learning:** In Next.js App Router API routes, every endpoint must explicitly check for authentication via the auth utilities (`verifyAuth()`). The absence of middleware or wrapper means routes default to being unauthenticated.
**Prevention:** Always verify that `verifyAuth()` or equivalent (like `getServerSession` checks) are present at the beginning of each route handler function under protected paths like `/api/admin/*`. Consider adding a middleware to protect paths based on request paths instead of having to rely on individual route handler checks.
