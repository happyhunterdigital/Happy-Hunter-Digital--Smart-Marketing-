# Project-Scoped Rules

- **Never push straight to `main`.** Always create a feature branch and open a Pull Request. `main` is branch-protected: PRs require the security-audit workflow to pass. This applies doubly to `functions/`, payments, and auth code.
- **Never add a new file without checking for an existing module that does the same job.** Duplicates (`functions/index.ts` vs `functions/src/index.ts`, `ViewGuide.jsx` vs `ViewGuide/`, `ClientPortal.tsx` vs `ClientPortal/`) caused real production confusion. Reuse or migrate — don't clone.
- **Live entry points (do not duplicate):**
  - Frontend routes live in `src/pages/` subdirectories (`ViewGuide/`, `ClientPortal/`) — imported by `src/App.tsx`.
  - Cloud Functions deploy from `functions/src/index.ts` (built to `functions/lib/`). Files under `functions/src/endpoints/` are NOT wired in — edits there don't affect production until imported by `src/index.ts`.
- **Before every commit:** run `npm run lint` and `npm test` (frontend) plus `npx tsc --noEmit` (both `tsc` roots). Fix or explain failures in the PR.
- **Never commit build output or secrets:** `dist/`, `.firebase/`, `*.log`, `.env` stay untracked (see `.gitignore`). PDFs in `public/assets/` are ~50 MB — long-term they belong in Firebase Storage / GitHub Releases, not git.
- **Secrets & PII:** no hardcoded phone numbers, tokens, or keys in source. Admin alerts read `ADMIN_WHATSAPP_NUMBER` from functions secrets and fail safe when unset.
