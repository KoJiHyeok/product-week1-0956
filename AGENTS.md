# Repository Guidelines

## Project Structure & Module Organization

This is a Cloudflare Pages/Functions app. The public site entry points are `index.html`, `main.js`, and `style.css` at the repository root. Static gallery and logo assets live in `assets/`. Server-side Pages Functions live under `functions/api/`, grouped by feature such as `auth`, `admin`, `submissions`, `reports`, `images`, `messages`, and `profile`. The protected admin page fallback is `functions/admin/[[path]].js`. D1 schema history is in `migrations/`, with the current full schema in `schema.sql`. Scheduled Worker code is in `workers/`, with separate config in `wrangler.daily-summary.toml`.

## Build, Test, and Development Commands

There is no `package.json`, so no npm build or test scripts are defined.

- `find . -name '*.js' -not -path './node_modules/*' -print0 | xargs -0 -n1 node --check`: syntax-check all JavaScript files.
- `git diff --check`: catch whitespace errors before committing.
- `npx wrangler d1 migrations apply product-week1-0956-auth --remote`: apply D1 migrations.
- `npx wrangler deploy -c wrangler.daily-summary.toml`: deploy the standalone daily-summary Cron Worker.

For Pages deployment, push `main` to GitHub and let the Cloudflare Pages integration deploy.

## Coding Style & Naming Conventions

Use plain JavaScript ES modules and keep code dependency-free unless there is a clear need. Prefer `const` and `let`, async/await, early returns, and small helper functions. Keep indentation at two spaces, use semicolons, and follow existing camelCase names for variables/functions. API files should export `onRequestGet`, `onRequestPost`, `onRequestPatch`, or similar Cloudflare handlers. D1 migrations use zero-padded numeric prefixes, for example `0014_admin_daily_summaries.sql`.

## Testing Guidelines

No formal test framework is configured. At minimum, run the JavaScript syntax check and `git diff --check` before committing. For API changes, use owner/admin/manual endpoints where available, such as `POST /api/admin/daily-summary/send-test` with `{ "dryRun": true }`. Verify D1 migrations are additive and avoid destructive operations such as `DROP TABLE` or data-deleting updates.

## Commit & Pull Request Guidelines

Recent commit messages use short imperative summaries, for example `Add admin moderation controls` and `Prevent duplicate title submissions`. Keep commits focused and describe the behavior changed. Pull requests should include a concise summary, affected API/UI areas, migration names, manual verification steps, and screenshots for visible admin or frontend changes.

## Security & Configuration Tips

Never expose secrets in code or API responses. Reuse existing environment variables such as `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `AUTH_FROM_EMAIL`, and `CONTACT_TO_EMAIL`; use `DAILY_ADMIN_SUMMARY_TO` when a separate summary recipient is needed. All admin APIs must enforce server-side role checks, and owner-only actions must protect `wlgur2101@gmail.com`.
