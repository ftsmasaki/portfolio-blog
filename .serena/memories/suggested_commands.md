Project root (uses Makefile):
- Install deps: `make yarn`
- Dev server: `make dev` (port 3031 per app/package.json)
- Build: `make build`
- Test (watch): `make test`
- Type-check: `make type`
- Lint: `make lint`
- Format: `cd app && yarn format` (Makefile has format target pointing to `format:fix`; use package script names below)
- Add UI component (shadcn): `make ui-add <name>`

Inside `app/`:
- Dev: `yarn dev`
- Build: `yarn build`
- Start: `yarn start`
- Lint: `yarn lint`
- Format write: `yarn format`
- Format check: `yarn format:check`
- Tests: `yarn test` / `yarn test:run`
- Type-check: `yarn type-check`