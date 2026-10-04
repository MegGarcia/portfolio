# Deploying the portfolio

The site is static, so hosting it is just serving these files. These steps
use **GitHub Pages** (free), the same setup as the wedding site.

## 1. Turn on GitHub Pages

1. Push this repo to GitHub (branch `claude/optimistic-hawking-b3kq0t`, or
   merge it into `main` first).
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, pick **Deploy from a branch**.
4. Choose the branch you pushed and the **/ (root)** folder, then **Save**.
5. Wait a minute, then visit the URL GitHub shows (e.g.
   `https://meggarcia.github.io/portfolio/`).

> A `.nojekyll` file is included so GitHub Pages serves every file as-is.

## 2. Wire up the contact form

The form won't send until you deploy the small Google Apps Script and paste its
URL into `js/contact.js`. Full walkthrough:
[`google-apps-script/README.md`](./google-apps-script/README.md). Until then
the form shows an "email me instead" notice.

## 3. Point your custom domain (when ready)

To serve the site at your own domain instead of `github.io`:

1. Add a file named **`CNAME`** at the repo root containing just your domain,
   e.g. `megangarcia.com` (one line, no `https://`). Commit and push.
2. At your DNS provider, point the domain at GitHub Pages:
   - **Apex domain** (`example.com`): four `A` records to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     (and the matching `AAAA` records if you want IPv6).
   - **`www` subdomain:** a `CNAME` record pointing to
     `meggarcia.github.io`.
3. Back in **Settings → Pages**, enter the domain under **Custom domain** and
   tick **Enforce HTTPS** once the certificate is issued.

> Tell me the domain and I'll add the `CNAME` file for you.

## 4. Leave Webflow

Once the site looks right at your domain and the form works, you can cancel
Webflow. Nothing here depends on it.

## Updating the site later

Edit the files and push — GitHub Pages redeploys automatically within a minute.
No build step.
