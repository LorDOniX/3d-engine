# 3d-engine
- own ray caster engine in TypeScript using 2d canvas

# Usage
- `npm install`
- `npm start` - webpack dev server on http://localhost:8004
- `npm run build` - type check, lint, tests + production build into `dist/`
- `npm run typecheck` - type check only (the dev server transpiles via esbuild without type checking)
- `npm run lint` - [oxlint](https://oxc.rs/docs/guide/usage/linter)
- `npm test` / `npm run test:watch` - [Vitest](https://vitest.dev/) unit tests

# Controls
- arrows / WASD - move and turn
- Space / Ctrl - shoot

# Known issues
- `npm audit` reports [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) in `braces` (via `webpack-dev-server` → `http-proxy-middleware` → `micromatch`). No patched version exists yet; it only affects the local dev server proxy patterns (not used here), so it is safe to ignore until a fix is released.
