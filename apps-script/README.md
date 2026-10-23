# Password gate — server-side check via Google Sheets

The `/protected/` gate checks the password on **Google's servers** (a Google Apps
Script web app) against a **private** Google Sheet, so passwords are never shipped
to the browser or committed to this public repo. Supports **per-company passwords**
and logs each unlock.

## Setup

1. **Create a Google Sheet** (private — don't share it publicly). Add a tab named
   `Passwords` with a header row and one row per company:

   | Company   | Password     | Active |
   |-----------|--------------|--------|
   | Acme Corp | `acme-2026`  | TRUE   |
   | Globex    | `globex-xyz` | TRUE   |

   (A blank `Active` cell counts as active; set it to `FALSE` to disable a password
   without deleting the row.)

2. **Add the script:** in that sheet, **Extensions ▸ Apps Script**, paste
   [`Code.gs`](./Code.gs), and Save.

3. **Deploy:** **Deploy ▸ New deployment ▸ Web app**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**

   Authorize when prompted, then copy the **Web app URL** (ends in `/exec`).

4. **Wire the frontend:** paste that URL into `GATE_ENDPOINT` near the top of the
   gate script in [`../protected/index.html`](../protected/index.html). Commit & push.

That's it — unlocking now validates against your sheet. Edit passwords any time in the
sheet (no redeploy needed). The `Log` tab records `Timestamp, Company` on each unlock.

## Important limitation (assets are still public)

This makes the **password** genuinely server-checked, but the confidential **images**
still live in this public repo and are directly fetchable by URL. To fully protect the
content, the images must be served from behind the auth (and removed from the public
bundle). That's a larger follow-up — ask and we can scope it.

## Notes

- The frontend posts `{"password": "..."}` as `text/plain` (a "simple" CORS request,
  no preflight); the script returns `{"ok":true,"company":"..."}` or `{"ok":false}`.
- Until `GATE_ENDPOINT` is set, the gate falls back to a local password so the site
  keeps working. **Remove that fallback** (both `GATE_ENDPOINT`'s empty-string branch
  and `FALLBACK_PASSWORD`) once the endpoint is live.
- After editing `Code.gs`, redeploy: **Manage deployments ▸ edit ▸ New version** keeps
  the same `/exec` URL.
