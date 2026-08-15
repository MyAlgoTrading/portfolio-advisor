# Portfolio Advisor Workspace Rule

When contributing to or modifying the **Portfolio Advisor** codebase, adhere to the following conventions:

## 1. Indian Localization & Currency Standards
- Always format currency using `formatINR()` or the `formatConverted()` helper from `PortfolioContext`.
- Standard Indian numbers must use `en-IN` comma groupings (`12,34,567.00`).
- Compact numbers must use Indian denominations (`₹12.50 L` for Lakhs, `₹1.85 Cr` for Crores).
- Default base currency is always **INR (`₹`)**.

## 2. Broker Gateway Privacy & Security
- Never log, expose, or persist broker API secrets or TOTP tokens in plain text in git.
- Real broker API keys must be handled in `server/.env` or ephemeral session memory.
- Always maintain the **"Sandbox Mode"** mock fallback so users can test the application seamlessly without requiring live Demat API credentials.

## 3. TypeScript & Type Discipline
- All components must strictly conform to interfaces defined in `src/types/index.ts` and `server/src/types/index.ts`.
- Use explicit `import type { ... }` syntax for type-only imports (`verbatimModuleSyntax: true`).
- Keep `PortfolioMetrics` calculations synchronized across both frontend and backend.

## 4. Design & Aesthetic Principles
- Maintain the dark cyber-fintech theme using CSS variables in `src/styles/index.css`.
- Use `JetBrains Mono` font for numeric quantities, prices, and percentages (`fontFamily: 'var(--font-mono)'`).
- Ensure all interactive modal inputs, sliders, and buttons have active focus rings and smooth transitions.
