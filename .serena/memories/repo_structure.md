Top-level:
- `app/` (workspace root for Next.js app)
- `docs/`, `change-log/`, `.cursor/`, `.vscode/`
- `Makefile`

Inside `app/` (selected):
- `presentation/` (UI/pages), `domain/`, `application/`, `infrastructure/`, `shared/`, `typings/`
- `public/`, `next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`
- `vitest.config.ts`, `tsconfig.json`, `package.json`

Alias: `@/*` resolves to `app/` root.