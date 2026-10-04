# Contact form → Google Sheet (Apps Script)

The contact form on `/contact/` posts to a small Google Apps Script web app,
which appends each message to a Google Sheet and (optionally) emails you a
copy. This is the same approach used on the wedding site — free, no third
party, and you own the data.

Until you complete these steps, the form validates input and shows a friendly
"email me instead" notice, but does not send.

## One-time setup

1. **Create a Sheet.** Go to [sheets.new](https://sheets.new) and name it
   something like *Portfolio Contact*.
2. **Open the script editor.** In that Sheet: **Extensions → Apps Script**.
3. **Paste the code.** Delete whatever is in `Code.gs`, then paste the full
   contents of [`Code.gs`](./Code.gs) from this folder. Save.
   - The `NOTIFY_EMAIL` at the top is already set to `megangarcia2024@gmail.com`
     — change it or set it to `''` to turn off the email copy.
4. **Deploy as a Web app.**
   - **Deploy → New deployment**.
   - Click the gear → **Web app**.
   - **Execute as:** *Me*.
   - **Who has access:** *Anyone*.
   - **Deploy**, then **Authorize access** and approve the permissions
     (it needs to write to the Sheet and send mail as you).
5. **Copy the Web app URL.** It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
6. **Wire it up.** Open `js/contact.js` in this repo and paste the URL into:
   ```js
   var FORM_ENDPOINT = "https://script.google.com/macros/s/AKfy…/exec";
   ```
   Commit and push. The form is now live.

## Testing

- Open the Web app URL in a browser — you should see
  `{"ok":true,"status":"Contact endpoint is live."}`.
- Submit the form on the site. A new row should appear in the Sheet
  (tab **Contact Submissions**) and, if `NOTIFY_EMAIL` is set, you'll get an
  email with the sender's address as reply-to.

## Updating the script later

If you change `Code.gs`, redeploy: **Deploy → Manage deployments →** edit the
existing deployment → **New version → Deploy**. The URL stays the same, so you
don't need to touch `js/contact.js` again.
